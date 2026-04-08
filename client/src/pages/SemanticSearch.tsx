import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useLanguage } from "@/lib/i18n";
import {
  Search, FileText, Shield, Lock, Clock, Building2,
  Sparkles, Brain, Zap, ThumbsUp, BookOpen, AlertTriangle
} from "lucide-react";

type SearchMode = "fullText" | "semantic" | "hybrid";

type SearchResult = {
  id: string;
  title: string;
  titleKo: string;
  snippet: string;
  snippetKo: string;
  similarity: number;
  reason: string;
  reasonKo: string;
  department: string;
  departmentKo: string;
  date: string;
  securityLevel: "confidential" | "internal" | "public" | "restricted";
  source: string;
  docType: string;
  docTypeKo: string;
  drmProtected: boolean;
};

const mockResults: SearchResult[] = [
  {
    id: "ss-1",
    title: "Q3 Cost Reduction Strategy Report",
    titleKo: "3분기 원가절감 전략 보고서",
    snippet: "Through process optimization and raw material sourcing diversification, a 12% cost reduction was achieved compared to Q2. Steel Division's hot-rolling process improvement was the primary contributor...",
    snippetKo: "공정 최적화 및 원자재 조달 다각화를 통해 2분기 대비 12% 원가 절감을 달성하였습니다. 철강 사업부의 열간압연 공정 개선이 주요 기여 요인으로...",
    similarity: 96.2,
    reason: "Directly addresses cost reduction strategies with quantitative results matching the query intent.",
    reasonKo: "질의 의도에 부합하는 정량적 결과와 함께 원가 절감 전략을 직접적으로 다루고 있습니다.",
    department: "Steel Division",
    departmentKo: "철강 사업부",
    date: "2024-09-15",
    securityLevel: "internal",
    source: "ERP",
    docType: "Report",
    docTypeKo: "보고서",
    drmProtected: false
  },
  {
    id: "ss-2",
    title: "Supply Chain Optimization Analysis",
    titleKo: "공급망 최적화 분석",
    snippet: "Analysis of logistics cost reduction through supply chain restructuring. Key findings indicate 8.5% savings potential in raw material transportation by consolidating regional distribution centers...",
    snippetKo: "공급망 구조 개편을 통한 물류비 절감 분석. 주요 결과로 지역 물류센터 통합을 통해 원자재 운송에서 8.5%의 절감 잠재력이 확인되었습니다...",
    similarity: 91.8,
    reason: "Closely related to cost reduction through supply chain improvements, with specific savings metrics.",
    reasonKo: "공급망 개선을 통한 원가 절감과 밀접하게 관련되며, 구체적인 절감 수치가 포함되어 있습니다.",
    department: "Logistics",
    departmentKo: "물류팀",
    date: "2024-08-22",
    securityLevel: "confidential",
    source: "SharePoint",
    docType: "Analysis",
    docTypeKo: "분석",
    drmProtected: true
  },
  {
    id: "ss-3",
    title: "Energy Efficiency Improvement Proposal",
    titleKo: "에너지 효율 개선 제안서",
    snippet: "Proposal for installing high-efficiency electric furnaces to reduce energy consumption by 15%. Expected annual savings of ₩2.3B through peak-hour load management and waste heat recovery systems...",
    snippetKo: "고효율 전기로 도입을 통한 에너지 소비 15% 절감 제안. 피크시간 부하 관리 및 폐열 회수 시스템을 통해 연간 23억원의 비용 절감이 예상됩니다...",
    similarity: 87.5,
    reason: "Energy cost reduction is a subset of overall cost reduction, semantically relevant to the query.",
    reasonKo: "에너지 비용 절감은 전체 원가 절감의 하위 범주로, 질의와 의미적으로 관련성이 높습니다.",
    department: "Energy Division",
    departmentKo: "에너지 사업부",
    date: "2024-10-03",
    securityLevel: "public",
    source: "Internal Portal",
    docType: "Proposal",
    docTypeKo: "제안서",
    drmProtected: false
  },
  {
    id: "ss-4",
    title: "Raw Material Procurement Cost Trend",
    titleKo: "원자재 조달 비용 동향",
    snippet: "Monthly raw material price trend analysis for key inputs including iron ore, coking coal, and scrap metal. Price volatility index shows stabilization in Q3 with 4.2% decrease in average procurement cost...",
    snippetKo: "철광석, 코크스탄, 고철 등 주요 투입물에 대한 월별 원자재 가격 동향 분석. 가격 변동성 지수는 3분기에 안정화 추세를 보이며 평균 조달 비용이 4.2% 감소...",
    similarity: 84.3,
    reason: "Raw material costs are a major component of manufacturing cost, providing contextual relevance.",
    reasonKo: "원자재 비용은 제조 원가의 주요 구성 요소로, 맥락적 관련성을 제공합니다.",
    department: "Procurement",
    departmentKo: "구매팀",
    date: "2024-09-28",
    securityLevel: "internal",
    source: "ERP",
    docType: "Report",
    docTypeKo: "보고서",
    drmProtected: false
  },
  {
    id: "ss-5",
    title: "Automation Investment ROI Assessment",
    titleKo: "자동화 투자 ROI 평가",
    snippet: "Assessment of return on investment for manufacturing automation initiatives across three plants. Initial investment of ₩15B projected to yield 22% labor cost reduction over 3-year period...",
    snippetKo: "3개 공장에 걸친 제조 자동화 이니셔티브의 투자 수익률 평가. 초기 투자 150억원으로 3년간 인건비 22% 절감 효과가 전망됩니다...",
    similarity: 79.1,
    reason: "Automation ROI connects to long-term cost reduction through labor efficiency improvements.",
    reasonKo: "자동화 ROI는 인력 효율성 개선을 통한 장기적 원가 절감과 연관됩니다.",
    department: "Manufacturing",
    departmentKo: "제조팀",
    date: "2024-07-14",
    securityLevel: "restricted",
    source: "SharePoint",
    docType: "Analysis",
    docTypeKo: "분석",
    drmProtected: true
  },
  {
    id: "ss-6",
    title: "Quality Control Process Improvement Guidelines",
    titleKo: "품질관리 공정 개선 가이드라인",
    snippet: "Guidelines for reducing defect rates through statistical process control implementation. Defect rate reduction from 2.1% to 0.8% resulted in ₩890M annual savings in rework and scrap costs...",
    snippetKo: "통계적 공정 관리 도입을 통한 불량률 감소 가이드라인. 불량률을 2.1%에서 0.8%로 줄여 재작업 및 스크랩 비용에서 연간 8.9억원의 절감 효과를 달성...",
    similarity: 75.6,
    reason: "Quality improvements indirectly reduce costs by minimizing waste and rework expenses.",
    reasonKo: "품질 개선은 폐기물 및 재작업 비용을 최소화하여 간접적으로 원가를 절감합니다.",
    department: "Quality Assurance",
    departmentKo: "품질관리팀",
    date: "2024-08-05",
    securityLevel: "public",
    source: "Internal Portal",
    docType: "Guideline",
    docTypeKo: "가이드라인",
    drmProtected: false
  },
  {
    id: "ss-7",
    title: "Digital Transformation Roadmap Memo",
    titleKo: "디지털 전환 로드맵 메모",
    snippet: "Internal memo outlining the 2025 digital transformation roadmap. Key initiatives include AI-based predictive maintenance, digital twin deployment, and smart factory integration for operational efficiency...",
    snippetKo: "2025년 디지털 전환 로드맵을 정리한 내부 메모. 주요 이니셔티브에는 AI 기반 예측 정비, 디지털 트윈 구축, 운영 효율성을 위한 스마트 팩토리 통합이 포함...",
    similarity: 68.4,
    reason: "Digital transformation initiatives often target operational cost reduction as a key objective.",
    reasonKo: "디지털 전환 이니셔티브는 운영 비용 절감을 핵심 목표로 삼는 경우가 많습니다.",
    department: "IT Strategy",
    departmentKo: "IT전략팀",
    date: "2024-10-12",
    securityLevel: "internal",
    source: "Email",
    docType: "Memo",
    docTypeKo: "메모",
    drmProtected: false
  }
];

const securityLevelColors: Record<string, string> = {
  confidential: "bg-red-100 text-red-800 border-red-200",
  internal: "bg-yellow-100 text-yellow-800 border-yellow-200",
  public: "bg-green-100 text-green-800 border-green-200",
  restricted: "bg-orange-100 text-orange-800 border-orange-200"
};

function getSimilarityColor(score: number): string {
  if (score >= 90) return "text-emerald-600";
  if (score >= 80) return "text-blue-600";
  if (score >= 70) return "text-amber-600";
  return "text-gray-500";
}

function getSimilarityBg(score: number): string {
  if (score >= 90) return "bg-emerald-50 border-emerald-200";
  if (score >= 80) return "bg-blue-50 border-blue-200";
  if (score >= 70) return "bg-amber-50 border-amber-200";
  return "bg-gray-50 border-gray-200";
}

export default function SemanticSearch() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>("semantic");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [securityFilter, setSecurityFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [hasSearched, setHasSearched] = useState(true);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setHasSearched(true);
    }
  };

  const filteredResults = mockResults.filter(result => {
    if (securityFilter !== "all" && result.securityLevel !== securityFilter) return false;
    if (sourceFilter !== "all" && result.source !== sourceFilter) return false;
    return true;
  });

  return (
    <Layout>
      <div className="flex-1 overflow-auto bg-background">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2" data-testid="text-page-title">{t("semanticSearch")}</h1>
            <p className="text-muted-foreground text-sm" data-testid="text-page-description">
              {language === "ko"
                ? "자연어로 질의하여 의미적으로 유사한 문서를 검색합니다."
                : "Search for semantically similar documents using natural language queries."}
            </p>
          </div>

          <div className="mb-6 space-y-4">
            <div className="flex gap-2" data-testid="search-bar-container">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  data-testid="input-semantic-search"
                  className="pl-10 h-11"
                  placeholder={t("semanticSearchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button data-testid="button-search" onClick={handleSearch} className="h-11 px-6">
                <Search className="w-4 h-4 mr-2" />
                {t("search")}
              </Button>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">{t("searchMode")}:</span>
                <ToggleGroup
                  type="single"
                  value={searchMode}
                  onValueChange={(val) => val && setSearchMode(val as SearchMode)}
                  data-testid="toggle-search-mode"
                >
                  <ToggleGroupItem value="fullText" data-testid="toggle-fulltext" className="text-xs px-3 h-8 gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    {t("fullText")}
                  </ToggleGroupItem>
                  <ToggleGroupItem value="semantic" data-testid="toggle-semantic" className="text-xs px-3 h-8 gap-1.5">
                    <Brain className="w-3.5 h-3.5" />
                    {t("semantic")}
                  </ToggleGroupItem>
                  <ToggleGroupItem value="hybrid" data-testid="toggle-hybrid" className="text-xs px-3 h-8 gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    {t("hybrid")}
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap" data-testid="filter-panel">
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-[150px] h-9 text-xs" data-testid="select-period">
                  <SelectValue placeholder={t("period")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allPeriods")}</SelectItem>
                  <SelectItem value="7d">{t("last7Days")}</SelectItem>
                  <SelectItem value="30d">{t("last30Days")}</SelectItem>
                  <SelectItem value="90d">{t("last90Days")}</SelectItem>
                  <SelectItem value="1y">{t("lastYear")}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[150px] h-9 text-xs" data-testid="select-department">
                  <SelectValue placeholder={t("department")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allDepartments")}</SelectItem>
                  <SelectItem value="steel">{t("steelDivision")}</SelectItem>
                  <SelectItem value="electronics">{t("electronicsDivision")}</SelectItem>
                  <SelectItem value="chemicals">{t("chemicalsDivision")}</SelectItem>
                  <SelectItem value="energy">{t("energyDivision")}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={securityFilter} onValueChange={setSecurityFilter}>
                <SelectTrigger className="w-[150px] h-9 text-xs" data-testid="select-security">
                  <SelectValue placeholder={t("securityLevel")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allLevels")}</SelectItem>
                  <SelectItem value="confidential">{t("confidential")}</SelectItem>
                  <SelectItem value="internal">{t("internal")}</SelectItem>
                  <SelectItem value="public">{t("public")}</SelectItem>
                  <SelectItem value="restricted">{t("restricted")}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[150px] h-9 text-xs" data-testid="select-source">
                  <SelectValue placeholder={t("source")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allSources")}</SelectItem>
                  <SelectItem value="ERP">ERP</SelectItem>
                  <SelectItem value="SharePoint">SharePoint</SelectItem>
                  <SelectItem value="Internal Portal">Internal Portal</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasSearched && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground" data-testid="text-results-count">
                  <span className="font-semibold text-foreground">{filteredResults.length}</span> {t("resultsFound")}
                </p>
                <Badge variant="outline" className="text-xs gap-1">
                  <Sparkles className="w-3 h-3" />
                  {searchMode === "fullText" ? t("fullText") : searchMode === "semantic" ? t("semantic") : t("hybrid")}
                </Badge>
              </div>

              <div className="space-y-4">
                {filteredResults.map((result) => (
                  <Card key={result.id} className="hover:shadow-md transition-shadow" data-testid={`card-result-${result.id}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge variant="secondary" className="text-[10px]" data-testid={`badge-doctype-${result.id}`}>
                              {language === "ko" ? result.docTypeKo : result.docType}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${securityLevelColors[result.securityLevel]}`}
                              data-testid={`badge-security-${result.id}`}
                            >
                              {result.securityLevel === "confidential" && <Lock className="w-2.5 h-2.5 mr-1" />}
                              {result.securityLevel === "restricted" && <AlertTriangle className="w-2.5 h-2.5 mr-1" />}
                              {t(result.securityLevel as "confidential" | "internal" | "public" | "restricted")}
                            </Badge>
                            {result.drmProtected && (
                              <Badge variant="destructive" className="text-[10px] gap-1" data-testid={`badge-drm-${result.id}`}>
                                <Shield className="w-2.5 h-2.5" />
                                {t("drmProtected")}
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-base font-semibold" data-testid={`text-title-${result.id}`}>
                            {language === "ko" ? result.titleKo : result.title}
                          </CardTitle>
                        </div>
                        <div className={`flex flex-col items-center px-3 py-2 rounded-lg border ${getSimilarityBg(result.similarity)}`} data-testid={`badge-similarity-${result.id}`}>
                          <span className={`text-lg font-bold ${getSimilarityColor(result.similarity)}`}>
                            {result.similarity}%
                          </span>
                          <span className="text-[10px] text-muted-foreground">{t("similarityScore")}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`text-snippet-${result.id}`}>
                        {language === "ko" ? result.snippetKo : result.snippet}
                      </p>

                      <div className="flex items-start gap-2 bg-primary/5 rounded-lg p-3 border border-primary/10">
                        <ThumbsUp className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <div>
                          <span className="text-xs font-semibold text-primary">{t("recommendReason")}</span>
                          <p className="text-xs text-muted-foreground mt-0.5" data-testid={`text-reason-${result.id}`}>
                            {language === "ko" ? result.reasonKo : result.reason}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {language === "ko" ? result.departmentKo : result.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {result.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {result.source}
                        </span>
                        {result.drmProtected && (
                          <Button variant="outline" size="sm" className="h-6 text-[10px] ml-auto" data-testid={`button-request-access-${result.id}`}>
                            {t("requestAccess")}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
