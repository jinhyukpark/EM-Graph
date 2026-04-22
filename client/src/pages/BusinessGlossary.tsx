import { useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Plus, Search, Download, Filter, Info, ArrowRight, CheckCircle2, Clock, XCircle, Shield, AlertTriangle, ChevronRight, Lightbulb, Link2, FileText } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const GLOSSARY_DATA = [
  { id: 1, term: "수주", termEn: "Order Received", category: "company", bu: "", definition: "고객으로부터 제품 또는 서비스의 공급을 정식으로 요청받아 계약이 성립된 상태", context: "영업·수주 관리 프로세스에서 매출 인식의 기준점", example: "이번 분기 PET필름 수주량이 전년 대비 15% 증가했습니다.", owner: "김영수", date: "2024-08-15", status: "approved", security: "public" },
  { id: 2, term: "납기", termEn: "Delivery Date", category: "company", bu: "", definition: "제품을 고객에게 인도해야 하는 약속된 기한", context: "생산 계획 및 물류 관리에서 핵심 관리 지표", example: "납기 준수율 98% 달성을 위한 생산 일정 조정이 필요합니다.", owner: "이정민", date: "2024-07-20", status: "approved", security: "public" },
  { id: 3, term: "공급망", termEn: "Supply Chain", category: "company", bu: "", definition: "원재료 조달부터 최종 고객 납품까지의 전체 가치 사슬", context: "SCM 전략 수립 및 공급 리스크 관리", example: "글로벌 공급망 다변화를 통해 원재료 조달 리스크를 최소화합니다.", owner: "박성호", date: "2024-06-10", status: "approved", security: "public" },
  { id: 4, term: "PET필름", termEn: "PET Film", category: "bu", bu: "산업자재", definition: "폴리에틸렌 테레프탈레이트(PET) 수지를 이축 연신하여 제조한 고기능성 필름", context: "산업자재 사업부 핵심 제품군, 디스플레이·전자·포장 소재로 활용", example: "광학용 PET필름의 시장 점유율이 국내 1위를 기록했습니다.", owner: "최혜진", date: "2024-09-01", status: "approved", security: "internal" },
  { id: 5, term: "편광필름", termEn: "Polarizing Film", category: "bu", bu: "산업자재", definition: "LCD 디스플레이에서 빛의 편광 특성을 제어하는 핵심 광학 부품", context: "디스플레이 소재 사업, LCD/OLED 패널 제조 공정", example: "차세대 편광필름 개발로 대형 TV 패널 시장 진입을 추진합니다.", owner: "정우성", date: "2024-08-25", status: "approved", security: "internal" },
  { id: 6, term: "아라미드", termEn: "Aramid Fiber", category: "bu", bu: "산업자재", definition: "고강도·고내열성 방향족 폴리아미드 섬유로, 방탄복·산업용 보강재 등에 사용", context: "방탄소재·타이어 코드·광케이블 보강재 등 특수 용도", example: "아라미드 섬유 생산능력 증설로 방산 소재 시장 대응력을 강화합니다.", owner: "한서윤", date: "2024-10-05", status: "approved", security: "confidential" },
  { id: 7, term: "MOQ", termEn: "Minimum Order Quantity", category: "bu", bu: "구매", definition: "공급사가 요구하는 최소 주문 수량 기준", context: "구매·조달 협상 시 단가 결정의 핵심 변수", example: "원재료 MOQ 조정 협상을 통해 재고 부담을 줄였습니다.", owner: "김태호", date: "2024-07-15", status: "approved", security: "public" },
  { id: 8, term: "열연코일", termEn: "Hot Rolled Coil", category: "bu", bu: "철강", definition: "슬래브를 고온에서 압연하여 코일 형태로 감은 반제품 철강재", context: "철강 유통·가공 사업에서의 기본 소재 단위", example: "열연코일 가격이 톤당 85만원으로 전월 대비 상승했습니다.", owner: "오준혁", date: "2024-05-20", status: "approved", security: "public" },
  { id: 9, term: "BOM", termEn: "Bill of Materials", category: "company", bu: "", definition: "제품 생산에 필요한 모든 원자재·부품·부자재의 목록과 수량 명세", context: "생산 계획·원가 산정·구매 발주의 기초 데이터", example: "신규 제품 BOM 등록을 완료하고 원가 시뮬레이션을 진행합니다.", owner: "이정민", date: "2024-09-10", status: "approved", security: "internal" },
  { id: 10, term: "EM-Data", termEn: "EM-Data", category: "project", bu: "", definition: "코오롱그룹 전사 데이터 통합 분석 플랫폼 프로젝트명", context: "BI/분석 시스템 고도화 프로젝트에서 사용되는 시스템명", example: "EM-Data 2.0 업그레이드로 실시간 대시보드 기능이 추가되었습니다.", owner: "박성호", date: "2024-10-15", status: "review", security: "internal" },
  { id: 11, term: "TC", termEn: "Technical Certification", category: "bu", bu: "산업자재", definition: "고객사 인증 과정을 통과하여 공급 자격을 획득한 기술 인증 상태", context: "디스플레이·반도체 소재 납품을 위한 품질 인증 절차", example: "삼성SDI향 PET필름 TC 통과로 양산 공급이 확정되었습니다.", owner: "최혜진", date: "2024-11-01", status: "review", security: "confidential" },
  { id: 12, term: "CAPA", termEn: "Corrective and Preventive Action", category: "company", bu: "", definition: "품질 문제의 근본 원인을 분석하고 시정·예방 조치를 수행하는 품질 관리 프로세스", context: "ISO 품질 경영 체계에서의 필수 관리 절차", example: "고객 클레임 발생 건에 대한 CAPA 보고서를 제출했습니다.", owner: "한서윤", date: "2024-06-25", status: "approved", security: "public" },
  { id: 13, term: "StockLink", termEn: "StockLink", category: "project", bu: "", definition: "코오롱인더스트리 재고·물류 통합 관리 시스템 프로젝트명", context: "물류 최적화 프로젝트에서 사용되는 시스템 코드명", example: "StockLink 시스템 연동으로 실시간 재고 현황 조회가 가능해졌습니다.", owner: "오준혁", date: "2024-08-30", status: "deprecated", security: "internal" },
];

const METADATA_DATA = [
  { id: 1, term: "수주", domain: "영업", sourceSystem: "SAP", dataType: "indicator", security: "public", relatedKPI: ["수주달성률", "수주잔고"], linkedEntity: ["고객사", "제품코드"], regulation: "내부감사기준", ownerDept: "영업관리팀" },
  { id: 2, term: "납기", domain: "생산/물류", sourceSystem: "SAP", dataType: "indicator", security: "public", relatedKPI: ["납기준수율", "리드타임"], linkedEntity: ["공급사", "자재코드", "생산오더"], regulation: "ISO 9001", ownerDept: "공급망관리팀" },
  { id: 3, term: "PET필름", domain: "산업자재", sourceSystem: "EM-Data", dataType: "entity", security: "internal", relatedKPI: ["생산수율", "시장점유율"], linkedEntity: ["제품코드", "생산라인", "고객사"], regulation: "", ownerDept: "필름사업팀" },
  { id: 4, term: "편광필름", domain: "산업자재", sourceSystem: "EM-Data", dataType: "entity", security: "internal", relatedKPI: ["광학특성", "불량률"], linkedEntity: ["디스플레이패널", "LCD모듈", "제품코드"], regulation: "", ownerDept: "광학소재팀" },
  { id: 5, term: "아라미드", domain: "산업자재", sourceSystem: "ERP", dataType: "entity", security: "confidential", relatedKPI: ["인장강도", "생산CAPA"], linkedEntity: ["방산소재", "타이어코드", "제품코드"], regulation: "방위산업법", ownerDept: "특수소재팀" },
  { id: 6, term: "열연코일", domain: "철강", sourceSystem: "SAP", dataType: "entity", security: "public", relatedKPI: ["재고회전율", "매입단가"], linkedEntity: ["공급사", "자재코드", "물류창고"], regulation: "", ownerDept: "철강유통팀" },
  { id: 7, term: "MOQ", domain: "구매", sourceSystem: "SAP", dataType: "code", security: "public", relatedKPI: ["구매단가", "재고일수"], linkedEntity: ["공급사", "자재코드"], regulation: "구매관리규정", ownerDept: "구매팀" },
  { id: 8, term: "BOM", domain: "생산", sourceSystem: "SAP", dataType: "entity", security: "internal", relatedKPI: ["원가율", "자재소요량"], linkedEntity: ["제품코드", "자재코드", "공정"], regulation: "원가관리기준", ownerDept: "생산기술팀" },
];

const SYNONYM_DATA = [
  { id: 1, standardTerm: "납기일", synonyms: "납품일, 납기 기한, 딜리버리 데이트, D/D", similarTerms: "출하 예정일, 선적일", scope: "company", reason: "영업·물류·생산 부서 간 동일 개념에 대한 표현 통일 필요" },
  { id: 2, standardTerm: "수주", synonyms: "오더, 주문접수, Order", similarTerms: "견적, 계약, 발주", scope: "company", reason: "영업 현장에서 영어·한국어 혼용 빈번" },
  { id: 3, standardTerm: "공급망", synonyms: "서플라이체인, SCM, 밸류체인", similarTerms: "물류망, 유통망", scope: "company", reason: "전략 회의 및 보고서에서 영문·한문 표현 혼용" },
  { id: 4, standardTerm: "PET필름", synonyms: "폴리에스터필름, BOPET, 이축연신필름", similarTerms: "BOPP필름, 나일론필름", scope: "bu", reason: "기술 용어와 상용 명칭 간 혼용, 유사 제품과 구분 필요" },
  { id: 5, standardTerm: "열연코일", synonyms: "HRC, Hot Rolled Coil, HR코일", similarTerms: "냉연코일, 후판", scope: "bu", reason: "철강 현업에서 영문 약어 빈번 사용" },
  { id: 6, standardTerm: "MOQ", synonyms: "최소주문수량, 최소발주량, Min Order Qty", similarTerms: "EOQ, 적정발주량", scope: "company", reason: "구매 부서 외 타 부서에서 약어 의미 혼동 방지" },
  { id: 7, standardTerm: "BOM", synonyms: "자재명세서, 부품표, Bill of Materials", similarTerms: "BOP, 공정표", scope: "company", reason: "생산·구매·설계 부서 간 동일 문서에 대한 호칭 통일" },
  { id: 8, standardTerm: "CAPA", synonyms: "시정예방조치, 시정조치, Corrective Action", similarTerms: "NCR, 부적합보고서", scope: "company", reason: "품질 관리 용어의 영문 약어와 한국어 풀이 통일" },
];

const PROHIBITED_DATA = [
  { id: 1, term: "Project-X", type: "security", scope: "all", alternative: "차세대소재개발PJ", reason: "미공개 프로젝트 코드명, 외부 유출 시 경쟁사 대응 리스크", expiry: "" },
  { id: 2, term: "Delta-7", type: "security", scope: "all", alternative: "생산공정최적화PJ", reason: "비공개 내부 프로젝트명, 보안 등급 기밀", expiry: "" },
  { id: 3, term: "불량품", type: "quality", scope: "chatbot", alternative: "부적합품", reason: "ISO 품질 경영 표준 용어 '부적합품'으로 통일", expiry: "" },
  { id: 4, term: "짝퉁", type: "legal", scope: "all", alternative: "비정품, 모조품", reason: "법적 차별적 표현 해당, 공식 문서 사용 부적절", expiry: "" },
  { id: 5, term: "KIS-Legacy", type: "deprecated", scope: "search", alternative: "EM-Data", reason: "시스템 교체 완료(2024.06), 구 시스템명 사용 중단", expiry: "2025-12-31" },
  { id: 6, term: "수동검사", type: "quality", scope: "document", alternative: "육안검사, 관능검사", reason: "검사 방법 표준 용어로 통일, 비표준 표현 지양", expiry: "" },
  { id: 7, term: "매출이익", type: "quality", scope: "chatbot", alternative: "매출총이익, 영업이익", reason: "재무 용어 정확성 확보를 위해 구체적 용어 사용 권장", expiry: "" },
];

export default function BusinessGlossary() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("glossary");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [buFilter, setBuFilter] = useState("all");

  const filteredGlossary = useMemo(() => {
    return GLOSSARY_DATA.filter(item => {
      const matchesSearch = searchQuery === "" || item.term.toLowerCase().includes(searchQuery.toLowerCase()) || item.termEn.toLowerCase().includes(searchQuery.toLowerCase()) || item.definition.includes(searchQuery);
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesBu = buFilter === "all" || item.bu === buFilter || (buFilter === "" && item.bu === "");
      return matchesSearch && matchesCategory && matchesStatus && matchesBu;
    });
  }, [searchQuery, categoryFilter, statusFilter, buFilter]);

  const filteredSynonyms = useMemo(() => {
    return SYNONYM_DATA.filter(item =>
      searchQuery === "" || item.standardTerm.includes(searchQuery) || item.synonyms.includes(searchQuery)
    );
  }, [searchQuery]);

  const filteredProhibited = useMemo(() => {
    return PROHIBITED_DATA.filter(item =>
      searchQuery === "" || item.term.includes(searchQuery) || item.alternative.includes(searchQuery)
    );
  }, [searchQuery]);

  const filteredMetadata = useMemo(() => {
    return METADATA_DATA.filter(item =>
      searchQuery === "" || item.term.includes(searchQuery) || item.domain.includes(searchQuery)
    );
  }, [searchQuery]);

  const statusBadge = (status: string) => {
    switch (status) {
      case "approved": return <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 gap-1" data-testid={`badge-status-${status}`}><CheckCircle2 className="w-3 h-3" />{t("bgStatusApproved")}</Badge>;
      case "review": return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800 gap-1" data-testid={`badge-status-${status}`}><Clock className="w-3 h-3" />{t("bgStatusReview")}</Badge>;
      case "deprecated": return <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 gap-1" data-testid={`badge-status-${status}`}><XCircle className="w-3 h-3" />{t("bgStatusDeprecated")}</Badge>;
      default: return null;
    }
  };

  const categoryBadge = (cat: string) => {
    switch (cat) {
      case "company": return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-100">{t("bgCategoryCompany")}</Badge>;
      case "bu": return <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 hover:bg-purple-100">{t("bgCategoryBU")}</Badge>;
      case "project": return <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 hover:bg-orange-100">{t("bgCategoryProject")}</Badge>;
      default: return null;
    }
  };

  const securityBadge = (level: string) => {
    switch (level) {
      case "public": return <Badge variant="outline" className="text-emerald-600 border-emerald-200 gap-1"><Shield className="w-3 h-3" />{t("bgPublic")}</Badge>;
      case "internal": return <Badge variant="outline" className="text-amber-600 border-amber-200 gap-1"><Shield className="w-3 h-3" />{t("bgInternal")}</Badge>;
      case "confidential": return <Badge variant="outline" className="text-red-600 border-red-200 gap-1"><Shield className="w-3 h-3" />{t("bgConfidential")}</Badge>;
      default: return null;
    }
  };

  const prohibitedTypeBadge = (type: string) => {
    switch (type) {
      case "security": return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 hover:bg-red-100 gap-1"><Shield className="w-3 h-3" />{t("bgTypeSecurity")}</Badge>;
      case "legal": return <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 hover:bg-indigo-100 gap-1"><AlertTriangle className="w-3 h-3" />{t("bgTypeLegal")}</Badge>;
      case "quality": return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 hover:bg-amber-100 gap-1"><CheckCircle2 className="w-3 h-3" />{t("bgTypeQuality")}</Badge>;
      case "deprecated": return <Badge className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-100 gap-1"><XCircle className="w-3 h-3" />{t("bgTypeDeprecated")}</Badge>;
      default: return null;
    }
  };

  const scopeBadge = (scope: string) => {
    switch (scope) {
      case "all": return <Badge variant="secondary">{t("bgScopeAll")}</Badge>;
      case "search": return <Badge variant="secondary">{t("bgScopeSearch")}</Badge>;
      case "chatbot": return <Badge variant="secondary">{t("bgScopeChatbot")}</Badge>;
      case "document": return <Badge variant="secondary">{t("bgScopeDocument")}</Badge>;
      default: return <Badge variant="secondary">{scope}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground" data-testid="text-page-title">{t("bgTitle")}</h1>
              <p className="text-muted-foreground mt-1" data-testid="text-page-desc">{t("bgDesc")}</p>
            </div>
          </div>
        </div>

        <Card className="mb-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-blue-100 dark:from-blue-950/20 dark:to-indigo-950/20 dark:border-blue-900">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-900 dark:text-blue-200">{t("bgOverviewTitle")}</h3>
                <p className="text-sm text-blue-800/80 dark:text-blue-300/80 leading-relaxed">{t("bgOverviewDesc")}</p>
                <div className="mt-3 pt-3 border-t border-blue-200/50 dark:border-blue-800/50">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">{t("bgApprovalWorkflow")}</h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
                    <span className="flex items-center gap-1 bg-blue-100/80 dark:bg-blue-900/40 px-2.5 py-1 rounded-full"><FileText className="w-3 h-3" />{t("bgApprovalStep1")}</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="flex items-center gap-1 bg-blue-100/80 dark:bg-blue-900/40 px-2.5 py-1 rounded-full"><Search className="w-3 h-3" />{t("bgApprovalStep2")}</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="flex items-center gap-1 bg-emerald-100/80 dark:bg-emerald-900/40 px-2.5 py-1 rounded-full text-emerald-700 dark:text-emerald-300"><CheckCircle2 className="w-3 h-3" />{t("bgApprovalStep3")}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <TabsList className="grid grid-cols-4 w-full max-w-[600px]">
              <TabsTrigger value="glossary" data-testid="tab-glossary">{t("bgTabGlossary")}</TabsTrigger>
              <TabsTrigger value="metadata" data-testid="tab-metadata">{t("bgTabMetadata")}</TabsTrigger>
              <TabsTrigger value="synonyms" data-testid="tab-synonyms">{t("bgTabSynonyms")}</TabsTrigger>
              <TabsTrigger value="prohibited" data-testid="tab-prohibited">{t("bgTabProhibited")}</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5" data-testid="button-export">
                <Download className="w-4 h-4" />{t("bgExportCSV")}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1.5" data-testid="button-new-term">
                    <Plus className="w-4 h-4" />{t("bgNewTerm")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>{t("bgNewTerm")}</DialogTitle>
                    <DialogDescription>{t("bgDesc")}</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">{t("bgTerm")}</Label>
                      <Input className="col-span-3" placeholder="ex) 수주, PET필름..." />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">{t("bgCategory")}</Label>
                      <Select>
                        <SelectTrigger className="col-span-3"><SelectValue placeholder={t("bgCategoryAll")} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="company">{t("bgCategoryCompany")}</SelectItem>
                          <SelectItem value="bu">{t("bgCategoryBU")}</SelectItem>
                          <SelectItem value="project">{t("bgCategoryProject")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label className="text-right pt-2">{t("bgDefinition")}</Label>
                      <Textarea className="col-span-3" rows={3} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">{t("bgOwner")}</Label>
                      <Input className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">{t("bgNewTerm")}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("bgSearchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search"
              />
            </div>
            {activeTab === "glossary" && (
              <>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px]" data-testid="select-category">
                    <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("bgCategoryAll")}</SelectItem>
                    <SelectItem value="company">{t("bgCategoryCompany")}</SelectItem>
                    <SelectItem value="bu">{t("bgCategoryBU")}</SelectItem>
                    <SelectItem value="project">{t("bgCategoryProject")}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]" data-testid="select-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("bgStatusAll")}</SelectItem>
                    <SelectItem value="approved">{t("bgStatusApproved")}</SelectItem>
                    <SelectItem value="review">{t("bgStatusReview")}</SelectItem>
                    <SelectItem value="deprecated">{t("bgStatusDeprecated")}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={buFilter} onValueChange={setBuFilter}>
                  <SelectTrigger className="w-[150px]" data-testid="select-bu">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("bgBusinessUnitAll")}</SelectItem>
                    <SelectItem value="산업자재">산업자재</SelectItem>
                    <SelectItem value="철강">철강</SelectItem>
                    <SelectItem value="구매">구매</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
            <span className="text-sm text-muted-foreground ml-auto">
              {activeTab === "glossary" && `${filteredGlossary.length} ${t("bgItems")}`}
              {activeTab === "metadata" && `${filteredMetadata.length} ${t("bgItems")}`}
              {activeTab === "synonyms" && `${filteredSynonyms.length} ${t("bgItems")}`}
              {activeTab === "prohibited" && `${filteredProhibited.length} ${t("bgItems")}`}
            </span>
          </div>

          <TabsContent value="glossary" className="space-y-4 mt-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[160px]">{t("bgTerm")}</TableHead>
                      <TableHead className="w-[100px]">{t("bgCategory")}</TableHead>
                      <TableHead className="min-w-[280px]">{t("bgDefinition")}</TableHead>
                      <TableHead className="w-[90px]">{t("bgSecurityLevel")}</TableHead>
                      <TableHead className="w-[90px]">{t("bgStatus")}</TableHead>
                      <TableHead className="w-[80px]">{t("bgOwner")}</TableHead>
                      <TableHead className="w-[100px]">{t("bgRegistered")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGlossary.map((item) => (
                      <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50" data-testid={`row-term-${item.id}`}>
                        <TableCell>
                          <div>
                            <div className="font-semibold text-foreground">{item.term}</div>
                            <div className="text-xs text-muted-foreground">{item.termEn}</div>
                          </div>
                        </TableCell>
                        <TableCell>{categoryBadge(item.category)}</TableCell>
                        <TableCell>
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.definition}</p>
                        </TableCell>
                        <TableCell>{securityBadge(item.security)}</TableCell>
                        <TableCell>{statusBadge(item.status)}</TableCell>
                        <TableCell className="text-sm">{item.owner}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-4 mt-0">
            <Card className="mb-4 bg-gradient-to-r from-violet-50/60 to-fuchsia-50/60 border-violet-100 dark:from-violet-950/20 dark:to-fuchsia-950/20 dark:border-violet-900">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-violet-600 dark:text-violet-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-violet-900 dark:text-violet-200 mb-1.5">{t("bgMetaUsage")}</h4>
                    <ul className="text-xs text-violet-700/80 dark:text-violet-300/80 space-y-1">
                      <li className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 shrink-0" />{t("bgMetaUsageSearch")}</li>
                      <li className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 shrink-0" />{t("bgMetaUsageSemantic")}</li>
                      <li className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 shrink-0" />{t("bgMetaUsageChatbot")}</li>
                      <li className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 shrink-0" />{t("bgMetaUsageGraph")}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">{t("bgTerm")}</TableHead>
                      <TableHead className="w-[90px]">{t("bgDomain")}</TableHead>
                      <TableHead className="w-[90px]">{t("bgSourceSystem")}</TableHead>
                      <TableHead className="w-[80px]">{t("bgDataType")}</TableHead>
                      <TableHead className="w-[80px]">{t("bgSecurityLevel")}</TableHead>
                      <TableHead>{t("bgRelatedKPI")}</TableHead>
                      <TableHead>{t("bgLinkedEntity")}</TableHead>
                      <TableHead className="w-[100px]">{t("bgOwnerDept")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMetadata.map((item) => (
                      <TableRow key={item.id} data-testid={`row-meta-${item.id}`}>
                        <TableCell className="font-semibold">{item.term}</TableCell>
                        <TableCell><Badge variant="secondary">{item.domain}</Badge></TableCell>
                        <TableCell><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{item.sourceSystem}</code></TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {item.dataType === "indicator" ? t("bgIndicator") : item.dataType === "code" ? t("bgCodeValue") : t("bgEntity")}
                          </Badge>
                        </TableCell>
                        <TableCell>{securityBadge(item.security)}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedKPI.map((kpi, i) => (
                              <Badge key={i} variant="secondary" className="text-[10px] font-normal">{kpi}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {item.linkedEntity.map((entity, i) => (
                              <Badge key={i} variant="outline" className="text-[10px] font-normal gap-0.5"><Link2 className="w-2.5 h-2.5" />{entity}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.ownerDept}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="synonyms" className="space-y-4 mt-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[130px]">{t("bgStandardTerm")}</TableHead>
                      <TableHead>{t("bgSynonymList")}</TableHead>
                      <TableHead>{t("bgSimilarTerms")}</TableHead>
                      <TableHead className="w-[90px]">{t("bgScope")}</TableHead>
                      <TableHead className="w-[250px]">{t("bgReason")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSynonyms.map((item) => (
                      <TableRow key={item.id} data-testid={`row-synonym-${item.id}`}>
                        <TableCell>
                          <div className="font-semibold text-primary">{item.standardTerm}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {item.synonyms.split(", ").map((s, i) => (
                              <Badge key={i} className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-100 text-xs font-normal">{s}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {item.similarTerms.split(", ").map((s, i) => (
                              <Badge key={i} variant="outline" className="text-xs font-normal text-muted-foreground">{s}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{item.scope === "company" ? t("bgCompanyWide") : t("bgCategoryBU")}</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{item.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prohibited" className="space-y-4 mt-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[140px]">{t("bgProhibitedTerm")}</TableHead>
                      <TableHead className="w-[90px]">{t("bgProhibitedType")}</TableHead>
                      <TableHead className="w-[90px]">{t("bgAppliedScope")}</TableHead>
                      <TableHead className="w-[160px]">{t("bgAlternative")}</TableHead>
                      <TableHead>{t("bgReason")}</TableHead>
                      <TableHead className="w-[100px]">{t("bgExpiry")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProhibited.map((item) => (
                      <TableRow key={item.id} data-testid={`row-prohibited-${item.id}`}>
                        <TableCell>
                          <div className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {item.term}
                          </div>
                        </TableCell>
                        <TableCell>{prohibitedTypeBadge(item.type)}</TableCell>
                        <TableCell>{scopeBadge(item.scope)}</TableCell>
                        <TableCell>
                          {item.alternative && (
                            <div className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
                              <ArrowRight className="w-3 h-3" />
                              {item.alternative}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{item.reason}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.expiry || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
