import { useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import { useLanguage } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Search, Filter, FileText, Shield, ChevronDown, Clock, Building2, Lock, Eye, CalendarDays, Tag
} from "lucide-react";
import type { TranslationKey } from "@/lib/i18n";

type DocumentResult = {
  id: string;
  title: string;
  titleKo: string;
  snippet: string;
  snippetKo: string;
  department: string;
  departmentKey: TranslationKey;
  documentType: TranslationKey;
  securityLevel: TranslationKey;
  source: string;
  date: string;
  drmProtected: boolean;
  matchCount: number;
};

const MOCK_RESULTS: DocumentResult[] = [
  {
    id: "doc-1",
    title: "Q3 Steel Manufacturing Cost Reduction Report",
    titleKo: "3분기 철강 제조 원가절감 보고서",
    snippet: "...the implementation of automated quality inspection systems resulted in a 12.3% reduction in defect rates across the Gwangyang plant production lines...",
    snippetKo: "...자동화 품질 검사 시스템 도입으로 광양 공장 생산라인 전체에서 불량률 12.3% 감소 달성...",
    department: "Steel Division",
    departmentKey: "steelDivision",
    documentType: "report",
    securityLevel: "internal",
    source: "ERP",
    date: "2024-03-15",
    drmProtected: false,
    matchCount: 23,
  },
  {
    id: "doc-2",
    title: "Supply Chain Risk Assessment - Raw Materials",
    titleKo: "공급망 리스크 평가 - 원자재",
    snippet: "...critical dependency on Australian iron ore suppliers identified. Diversification strategy recommends establishing contracts with Brazilian and Indian suppliers...",
    snippetKo: "...호주 철광석 공급사 의존도 심각. 다각화 전략으로 브라질 및 인도 공급사 계약 체결 권고...",
    department: "Procurement",
    departmentKey: "salesDept",
    documentType: "analysis",
    securityLevel: "confidential",
    source: "SharePoint",
    date: "2024-03-10",
    drmProtected: true,
    matchCount: 18,
  },
  {
    id: "doc-3",
    title: "Employee Safety Guidelines - Hot Rolling Process",
    titleKo: "직원 안전 가이드라인 - 열간압연 공정",
    snippet: "...mandatory PPE requirements for all personnel entering Zone A include heat-resistant gloves rated to 500°C, face shields, and steel-toed safety boots...",
    snippetKo: "...A 구역 진입 전 직원 필수 보호장비: 500°C 내열장갑, 안면보호대, 안전화 착용 의무...",
    department: "HR",
    departmentKey: "hrDept",
    documentType: "guideline",
    securityLevel: "public",
    source: "Intranet",
    date: "2024-02-28",
    drmProtected: false,
    matchCount: 15,
  },
  {
    id: "doc-4",
    title: "Board Meeting Minutes - Capital Investment Proposal",
    titleKo: "이사회 회의록 - 자본 투자 제안",
    snippet: "...the board approved a ₩450B investment plan for the new EAF (Electric Arc Furnace) facility in Dangjin, targeting carbon-neutral steel production by 2030...",
    snippetKo: "...이사회, 당진 신규 EAF(전기로) 시설 4,500억원 투자 계획 승인. 2030년 탄소중립 철강 생산 목표...",
    department: "Finance",
    departmentKey: "financeDept",
    documentType: "memo",
    securityLevel: "confidential",
    source: "Document Server",
    date: "2024-03-01",
    drmProtected: true,
    matchCount: 31,
  },
  {
    id: "doc-5",
    title: "Quarterly Supplier Performance Evaluation",
    titleKo: "분기별 공급사 성과 평가",
    snippet: "...Tier 1 supplier KS Materials achieved 98.2% on-time delivery rate. Recommended for contract renewal with 5% volume increase for next fiscal year...",
    snippetKo: "...Tier 1 공급사 KS소재, 98.2% 정시 납품률 달성. 차기 회계연도 5% 물량 증가 계약 갱신 권고...",
    department: "Procurement",
    departmentKey: "salesDept",
    documentType: "report",
    securityLevel: "internal",
    source: "ERP",
    date: "2024-02-20",
    drmProtected: false,
    matchCount: 12,
  },
  {
    id: "doc-6",
    title: "New Product Development Proposal - High-Strength Steel",
    titleKo: "신제품 개발 제안서 - 초고강도 강판",
    snippet: "...proposed development of 1.5 GPa class AHSS (Advanced High-Strength Steel) for automotive applications. Expected market share capture of 15% in EV structural components...",
    snippetKo: "...자동차용 1.5GPa급 AHSS(초고강도 강판) 개발 제안. EV 구조재 시장 15% 점유율 확보 전망...",
    department: "R&D",
    departmentKey: "devDept",
    documentType: "proposal",
    securityLevel: "restricted",
    source: "R&D Portal",
    date: "2024-03-05",
    drmProtected: true,
    matchCount: 27,
  },
  {
    id: "doc-7",
    title: "Environmental Compliance Manual - Emissions Control",
    titleKo: "환경 규정 준수 매뉴얼 - 배출 관리",
    snippet: "...SOx emissions monitoring must be conducted every 4 hours at Stacks 3, 7, and 12. Any readings exceeding 35 ppm must be reported to the Environmental Safety team within 30 minutes...",
    snippetKo: "...SOx 배출 모니터링은 3, 7, 12번 굴뚝에서 4시간마다 실시. 35ppm 초과 시 30분 이내 환경안전팀 보고 필수...",
    department: "Legal",
    departmentKey: "legalDept",
    documentType: "manual",
    securityLevel: "public",
    source: "Compliance DB",
    date: "2024-01-15",
    drmProtected: false,
    matchCount: 9,
  },
  {
    id: "doc-8",
    title: "Marketing Strategy Analysis - Southeast Asia Expansion",
    titleKo: "마케팅 전략 분석 - 동남아 시장 확장",
    snippet: "...Vietnam and Indonesia identified as priority markets with projected steel demand growth of 8.5% and 6.2% respectively through 2026...",
    snippetKo: "...베트남과 인도네시아를 우선 시장으로 선정. 2026년까지 철강 수요 성장률 각각 8.5%, 6.2% 전망...",
    department: "Marketing",
    departmentKey: "marketingDept",
    documentType: "analysis",
    securityLevel: "internal",
    source: "SharePoint",
    date: "2024-02-10",
    drmProtected: false,
    matchCount: 19,
  },
  {
    id: "doc-9",
    title: "IT System Migration Plan - SAP S/4HANA",
    titleKo: "IT 시스템 마이그레이션 계획 - SAP S/4HANA",
    snippet: "...Phase 2 migration of financial modules scheduled for Q2 2024. Expected downtime of 72 hours during cutover weekend. All business units must complete UAT by April 15...",
    snippetKo: "...2024년 2분기 재무 모듈 2단계 마이그레이션 예정. 전환 주말 72시간 다운타임 예상. 전 사업부 4월 15일까지 UAT 완료 필수...",
    department: "IT",
    departmentKey: "devDept",
    documentType: "memo",
    securityLevel: "restricted",
    source: "Confluence",
    date: "2024-03-18",
    drmProtected: false,
    matchCount: 14,
  },
  {
    id: "doc-10",
    title: "Energy Cost Optimization Report - Plant Operations",
    titleKo: "에너지 비용 최적화 보고서 - 공장 운영",
    snippet: "...installation of regenerative heat exchangers in Blast Furnace #3 reduced energy consumption by 8.7%. Annual savings estimated at ₩12.4B based on current energy prices...",
    snippetKo: "...3고로 축열식 열교환기 설치로 에너지 소비 8.7% 절감. 현 에너지 가격 기준 연간 124억원 절감 전망...",
    department: "Operations",
    departmentKey: "energyDivision",
    documentType: "report",
    securityLevel: "internal",
    source: "ERP",
    date: "2024-03-12",
    drmProtected: false,
    matchCount: 21,
  },
];

const SECURITY_COLORS: Record<string, string> = {
  confidential: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  internal: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  public: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  restricted: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
};

const DOC_TYPE_ICONS: Record<string, string> = {
  report: "📊",
  memo: "📝",
  proposal: "📋",
  analysis: "📈",
  guideline: "📌",
  manual: "📘",
};

export default function FullTextSearch() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [securityFilter, setSecurityFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<DocumentResult | null>(null);

  const filteredResults = useMemo(() => {
    let results = MOCK_RESULTS;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (doc) =>
          doc.title.toLowerCase().includes(q) ||
          doc.titleKo.includes(q) ||
          doc.snippet.toLowerCase().includes(q) ||
          doc.snippetKo.includes(q)
      );
    }

    if (departmentFilter !== "all") {
      results = results.filter((doc) => doc.departmentKey === departmentFilter);
    }

    if (securityFilter !== "all") {
      results = results.filter((doc) => doc.securityLevel === securityFilter);
    }

    if (sourceFilter !== "all") {
      results = results.filter((doc) => doc.source === sourceFilter);
    }

    if (periodFilter !== "all") {
      const now = new Date("2024-03-28");
      const dayMap: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90, "1y": 365 };
      const days = dayMap[periodFilter];
      if (days) {
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        results = results.filter((doc) => new Date(doc.date) >= cutoff);
      }
    }

    return results;
  }, [searchQuery, periodFilter, departmentFilter, securityFilter, sourceFilter]);

  const uniqueSources = Array.from(new Set(MOCK_RESULTS.map((d) => d.source)));

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 data-testid="text-fulltext-title" className="text-3xl font-bold tracking-tight mb-1">
            {t("fullTextSearch")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {filteredResults.length} {t("resultsFound")}
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-testid="input-search"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          <Button
            data-testid="button-search"
            className="h-11 px-6 gap-2"
          >
            <Search className="w-4 h-4" />
            {t("search")}
          </Button>
        </div>

        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-xs"
              data-testid="button-toggle-filters"
            >
              <Filter className="w-3.5 h-3.5" />
              {t("searchFilters")}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-lg border border-border bg-card/50">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {t("period")}
                </label>
                <Select value={periodFilter} onValueChange={setPeriodFilter}>
                  <SelectTrigger className="h-9 text-xs" data-testid="select-period">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allPeriods")}</SelectItem>
                    <SelectItem value="7d">{t("last7Days")}</SelectItem>
                    <SelectItem value="30d">{t("last30Days")}</SelectItem>
                    <SelectItem value="90d">{t("last90Days")}</SelectItem>
                    <SelectItem value="1y">{t("lastYear")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {t("department")}
                </label>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="h-9 text-xs" data-testid="select-department">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allDepartments")}</SelectItem>
                    <SelectItem value="steelDivision">{t("steelDivision")}</SelectItem>
                    <SelectItem value="hrDept">{t("hrDept")}</SelectItem>
                    <SelectItem value="devDept">{t("devDept")}</SelectItem>
                    <SelectItem value="salesDept">{t("salesDept")}</SelectItem>
                    <SelectItem value="marketingDept">{t("marketingDept")}</SelectItem>
                    <SelectItem value="financeDept">{t("financeDept")}</SelectItem>
                    <SelectItem value="legalDept">{t("legalDept")}</SelectItem>
                    <SelectItem value="energyDivision">{t("energyDivision")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  {t("securityLevel")}
                </label>
                <Select value={securityFilter} onValueChange={setSecurityFilter}>
                  <SelectTrigger className="h-9 text-xs" data-testid="select-security">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allLevels")}</SelectItem>
                    <SelectItem value="public">{t("public")}</SelectItem>
                    <SelectItem value="internal">{t("internal")}</SelectItem>
                    <SelectItem value="restricted">{t("restricted")}</SelectItem>
                    <SelectItem value="confidential">{t("confidential")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  {t("source")}
                </label>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="h-9 text-xs" data-testid="select-source">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allSources")}</SelectItem>
                    {uniqueSources.map((src) => (
                      <SelectItem key={src} value={src}>
                        {src}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="space-y-3">
          {filteredResults.map((doc) => (
            <Card
              key={doc.id}
              className="bg-card/80 backdrop-blur border-border shadow-sm hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setSelectedDoc(doc)}
              data-testid={`card-result-${doc.id}`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="outline" className="text-[10px] gap-1 font-medium">
                        <FileText className="w-3 h-3" />
                        {t(doc.documentType)}
                      </Badge>
                      <Badge className={`text-[10px] ${SECURITY_COLORS[doc.securityLevel]}`}>
                        {doc.securityLevel === "confidential" || doc.securityLevel === "restricted" ? (
                          <Lock className="w-3 h-3 mr-1" />
                        ) : (
                          <Eye className="w-3 h-3 mr-1" />
                        )}
                        {t(doc.securityLevel as TranslationKey)}
                      </Badge>
                      {doc.drmProtected && (
                        <Badge
                          variant="destructive"
                          className="text-[10px] gap-1"
                          data-testid={`badge-drm-${doc.id}`}
                        >
                          <Shield className="w-3 h-3" />
                          {t("drmProtected")}
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-sm font-semibold mb-1.5 group-hover:text-primary transition-colors">
                      <span className="mr-2">{DOC_TYPE_ICONS[doc.documentType]}</span>
                      {language === "ko" ? doc.titleKo : doc.title}
                    </h3>

                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                      <span className="font-medium text-primary/70">{t("matchingSnippet")}:</span>{" "}
                      {language === "ko" ? doc.snippetKo : doc.snippet}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {language === "ko" ? t(doc.departmentKey) : doc.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {doc.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {doc.source}
                      </span>
                      <span className="text-primary font-medium">
                        {doc.matchCount} matches
                      </span>
                    </div>
                  </div>

                  {doc.drmProtected && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 text-xs gap-1.5"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      data-testid={`button-request-access-${doc.id}`}
                    >
                      <Lock className="w-3 h-3" />
                      {t("requestAccess")}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredResults.length === 0 && (
            <div className="text-center py-16 text-muted-foreground" data-testid="text-no-results">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-sm">{t("noData")}</p>
            </div>
          )}
        </div>
      </div>

      <Sheet open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
        <SheetContent className="w-[450px] sm:w-[540px]">
          {selectedDoc && (
            <>
              <SheetHeader>
                <SheetTitle className="text-base pr-4">
                  {language === "ko" ? selectedDoc.titleKo : selectedDoc.title}
                </SheetTitle>
                <SheetDescription className="space-y-3 mt-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-[10px] gap-1">
                      <FileText className="w-3 h-3" />
                      {t(selectedDoc.documentType)}
                    </Badge>
                    <Badge className={`text-[10px] ${SECURITY_COLORS[selectedDoc.securityLevel]}`}>
                      {t(selectedDoc.securityLevel as TranslationKey)}
                    </Badge>
                    {selectedDoc.drmProtected && (
                      <Badge variant="destructive" className="text-[10px] gap-1">
                        <Shield className="w-3 h-3" />
                        {t("drmProtected")}
                      </Badge>
                    )}
                  </div>
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium block mb-1">
                      {t("department")}
                    </span>
                    <span className="text-sm font-medium">
                      {language === "ko" ? t(selectedDoc.departmentKey) : selectedDoc.department}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium block mb-1">
                      {t("source")}
                    </span>
                    <span className="text-sm font-medium">{selectedDoc.source}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium block mb-1">
                      {t("period")}
                    </span>
                    <span className="text-sm font-medium">{selectedDoc.date}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium block mb-1">
                      {t("documentType")}
                    </span>
                    <span className="text-sm font-medium">
                      {DOC_TYPE_ICONS[selectedDoc.documentType]} {t(selectedDoc.documentType)}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                  <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
                    {t("matchingSnippet")}
                  </h4>
                  <p className="text-sm leading-relaxed">
                    {language === "ko" ? selectedDoc.snippetKo : selectedDoc.snippet}
                  </p>
                </div>

                {selectedDoc.drmProtected && (
                  <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-destructive mb-1">
                          {t("drmProtected")}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-3">
                          {t("drmNotice")}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10"
                          data-testid="button-request-access-detail"
                        >
                          <Lock className="w-3 h-3" />
                          {t("requestAccess")}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </Layout>
  );
}
