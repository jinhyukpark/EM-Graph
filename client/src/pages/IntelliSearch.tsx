import { useState, useCallback, useMemo } from "react";
import { useLanguage } from "@/lib/i18n";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FileText, Lock, ChevronDown, ChevronUp, Sparkles, Filter, X, Network, ExternalLink, Calendar, Building2, ShieldCheck, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface FullTextResult {
  id: string;
  title: string;
  department: string;
  date: string;
  snippet: string;
  matchCount: number;
  isDrm: boolean;
  fileType: string;
  securityLevel: string;
}

interface SemanticResult {
  id: string;
  title: string;
  department: string;
  date: string;
  similarity: number;
  reason: string;
  fileType: string;
}

const FULLTEXT_RESULTS: FullTextResult[] = [
  {
    id: "ft-1",
    title: "2024년 산업자재 원가분석 보고서",
    department: "산업자재사업부",
    date: "2024-11-15",
    snippet: "...철강 <mark>원자재</mark> 가격이 전년 대비 12.3% 상승하였으며, 주요 공급처인 POSCO, 현대제철의 <mark>납품단가</mark> 조정이 예상됩니다...",
    matchCount: 24,
    isDrm: false,
    fileType: "PDF",
    securityLevel: "일반",
  },
  {
    id: "ft-2",
    title: "PET 필름 제조공정 품질관리 매뉴얼 v3.2",
    department: "필름/전자재료사업부",
    date: "2024-10-28",
    snippet: "...광학용 PET 필름의 <mark>두께 편차</mark> 허용 범위는 ±1.5μm이며, <mark>표면 결함</mark> 검출 시 즉시 라인을 중단하고...",
    matchCount: 18,
    isDrm: true,
    fileType: "DOCX",
    securityLevel: "대외비",
  },
  {
    id: "ft-3",
    title: "화학사업부 Q3 실적 리뷰 및 Q4 전망",
    department: "화학사업부",
    date: "2024-10-05",
    snippet: "...에틸렌 <mark>스프레드</mark>가 배럴당 $320으로 회복세를 보이며, ABS 수지 <mark>수출물량</mark>이 전분기 대비 8.7% 증가...",
    matchCount: 31,
    isDrm: false,
    fileType: "PPTX",
    securityLevel: "일반",
  },
  {
    id: "ft-4",
    title: "2025 S/S 컬렉션 소재 기획안",
    department: "패션사업부",
    date: "2024-09-20",
    snippet: "...리사이클 폴리에스터 <mark>혼방 원단</mark>을 주력 소재로 선정하였으며, 지속가능성 인증(GRS) 획득을 위한 <mark>공급망</mark> 재편이...",
    matchCount: 15,
    isDrm: true,
    fileType: "PDF",
    securityLevel: "기밀",
  },
  {
    id: "ft-5",
    title: "글로벌 공급망 리스크 평가 보고서",
    department: "경영기획실",
    date: "2024-11-01",
    snippet: "...중동 지역 <mark>물류 리스크</mark>로 인한 화학제품 운송 지연이 예상되며, 대체 <mark>해운 경로</mark> 검토가 필요합니다...",
    matchCount: 22,
    isDrm: false,
    fileType: "PDF",
    securityLevel: "일반",
  },
];

const SEMANTIC_RESULTS: SemanticResult[] = [
  {
    id: "sm-1",
    title: "배터리 소재용 동박 품질 기준서",
    department: "산업자재사업부",
    date: "2024-08-12",
    similarity: 94,
    reason: "원자재 품질 관리 및 납품 기준 관련 문서로, 검색어와 높은 의미적 유사도를 보입니다.",
    fileType: "PDF",
  },
  {
    id: "sm-2",
    title: "편광필름 원가구조 분석",
    department: "필름/전자재료사업부",
    date: "2024-07-30",
    similarity: 89,
    reason: "전자재료 원가 분석 및 공급처 비교 내용이 검색 맥락과 일치합니다.",
    fileType: "XLSX",
  },
  {
    id: "sm-3",
    title: "ABS/PC 컴파운드 시장 동향",
    department: "화학사업부",
    date: "2024-09-15",
    similarity: 86,
    reason: "화학 원료 시장 트렌드와 가격 전망이 검색 의도와 관련됩니다.",
    fileType: "PDF",
  },
  {
    id: "sm-4",
    title: "패션 원단 수급 계획 2025",
    department: "패션사업부",
    date: "2024-10-10",
    similarity: 82,
    reason: "원단 공급처 관리 및 수급 전략이 공급망 검색어와 연관됩니다.",
    fileType: "PPTX",
  },
];

const GRAPH_NODES: Node[] = [
  { id: "n1", position: { x: 450, y: 30 }, data: { label: "원자재 가격", type: "keyword" }, type: "entityNode" },
  { id: "n2", position: { x: 80, y: 160 }, data: { label: "POSCO", type: "company" }, type: "entityNode" },
  { id: "n3", position: { x: 320, y: 170 }, data: { label: "산업자재사업부", type: "department" }, type: "entityNode" },
  { id: "n4", position: { x: 620, y: 150 }, data: { label: "화학사업부", type: "department" }, type: "entityNode" },
  { id: "n5", position: { x: 100, y: 320 }, data: { label: "철강 코일", type: "material" }, type: "entityNode" },
  { id: "n6", position: { x: 350, y: 330 }, data: { label: "PET 필름", type: "material" }, type: "entityNode" },
  { id: "n7", position: { x: 620, y: 320 }, data: { label: "에틸렌", type: "material" }, type: "entityNode" },
  { id: "n8", position: { x: 220, y: 460 }, data: { label: "동박", type: "material" }, type: "entityNode" },
  { id: "n9", position: { x: 500, y: 460 }, data: { label: "ABS 수지", type: "material" }, type: "entityNode" },
  { id: "n10", position: { x: 50, y: 460 }, data: { label: "현대제철", type: "company" }, type: "entityNode" },
  { id: "n11", position: { x: 900, y: 170 }, data: { label: "패션사업부", type: "department" }, type: "entityNode" },
  { id: "n12", position: { x: 830, y: 320 }, data: { label: "리사이클 폴리에스터", type: "material" }, type: "entityNode" },
  { id: "n13", position: { x: 900, y: 30 }, data: { label: "공급망 리스크", type: "keyword" }, type: "entityNode" },
  { id: "n14", position: { x: 1100, y: 150 }, data: { label: "필름/전자재료사업부", type: "department" }, type: "entityNode" },
  { id: "n15", position: { x: 1050, y: 320 }, data: { label: "편광필름", type: "material" }, type: "entityNode" },
  { id: "n16", position: { x: 1150, y: 460 }, data: { label: "디스플레이 패널", type: "material" }, type: "entityNode" },
  { id: "n17", position: { x: 750, y: 460 }, data: { label: "GRS 인증", type: "keyword" }, type: "entityNode" },
  { id: "n18", position: { x: 350, y: 460 }, data: { label: "LG화학", type: "company" }, type: "entityNode" },
  { id: "n19", position: { x: 950, y: 460 }, data: { label: "나일론 원사", type: "material" }, type: "entityNode" },
];

const GRAPH_EDGES: Edge[] = [
  { id: "e1", source: "n1", target: "n2", label: "공급", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#6366f1" } },
  { id: "e2", source: "n1", target: "n3", label: "영향", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#6366f1" } },
  { id: "e3", source: "n1", target: "n4", label: "영향", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#6366f1" } },
  { id: "e4", source: "n2", target: "n5", label: "생산", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#8b5cf6" } },
  { id: "e5", source: "n3", target: "n5", label: "조달", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#10b981" } },
  { id: "e6", source: "n3", target: "n6", label: "관리", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#10b981" } },
  { id: "e7", source: "n4", target: "n7", label: "생산", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#f59e0b" } },
  { id: "e8", source: "n4", target: "n9", label: "생산", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#f59e0b" } },
  { id: "e9", source: "n10", target: "n5", label: "공급", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#8b5cf6" } },
  { id: "e10", source: "n3", target: "n8", label: "조달", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#10b981" } },
  { id: "e11", source: "n7", target: "n12", label: "원료", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#f59e0b" } },
  { id: "e12", source: "n11", target: "n12", label: "사용", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#ec4899" } },
  { id: "e13", source: "n13", target: "n11", label: "영향", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#6366f1" } },
  { id: "e14", source: "n13", target: "n14", label: "영향", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#6366f1" } },
  { id: "e15", source: "n14", target: "n15", label: "생산", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#10b981" } },
  { id: "e16", source: "n14", target: "n6", label: "관리", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#10b981" } },
  { id: "e17", source: "n15", target: "n16", label: "부품", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#f59e0b" } },
  { id: "e18", source: "n11", target: "n17", label: "인증", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#ec4899" } },
  { id: "e19", source: "n12", target: "n17", label: "적용", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#f59e0b" } },
  { id: "e20", source: "n18", target: "n9", label: "공급", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#8b5cf6" } },
  { id: "e21", source: "n18", target: "n7", label: "공급", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#8b5cf6" } },
  { id: "e22", source: "n11", target: "n19", label: "조달", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#ec4899" } },
  { id: "e23", source: "n1", target: "n13", label: "연관", markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#6366f1" } },
];

const NODE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  keyword: { bg: "bg-indigo-50 dark:bg-indigo-950/40", border: "border-indigo-300 dark:border-indigo-700", text: "text-indigo-700 dark:text-indigo-300" },
  company: { bg: "bg-violet-50 dark:bg-violet-950/40", border: "border-violet-300 dark:border-violet-700", text: "text-violet-700 dark:text-violet-300" },
  department: { bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-300 dark:border-emerald-700", text: "text-emerald-700 dark:text-emerald-300" },
  material: { bg: "bg-amber-50 dark:bg-amber-950/40", border: "border-amber-300 dark:border-amber-700", text: "text-amber-700 dark:text-amber-300" },
};

const LEGEND_ITEMS = [
  { type: "keyword", labelEn: "Keyword", labelKo: "키워드", color: "bg-indigo-500" },
  { type: "company", labelEn: "Company", labelKo: "기업", color: "bg-violet-500" },
  { type: "department", labelEn: "Department", labelKo: "사업부", color: "bg-emerald-500" },
  { type: "material", labelEn: "Material", labelKo: "소재/원자재", color: "bg-amber-500" },
];

function EntityNode({ data }: { data: { label: string; type: string } }) {
  const colors = NODE_COLORS[data.type] || NODE_COLORS.keyword;
  return (
    <div className={cn("px-4 py-2.5 rounded-lg border-2 shadow-sm min-w-[100px] text-center", colors.bg, colors.border)}>
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground/50 !w-2 !h-2" />
      <span className={cn("text-sm font-semibold", colors.text)}>{data.label}</span>
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground/50 !w-2 !h-2" />
    </div>
  );
}

const nodeTypes = { entityNode: EntityNode };

function DrmModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, language } = useLanguage();
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Lock className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold">{t("drmProtectedDoc")}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{t("drmNoticeDesc")}</p>
        <div className="bg-muted/50 rounded-lg p-3 mb-5 text-sm">
          <p className="font-medium mb-1">{t("drmRequestProcess")}</p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-1 text-xs">
            <li>{language === "ko" ? "문서 관리자에게 DRM 해제 요청" : "Request DRM unlock from document admin"}</li>
            <li>{language === "ko" ? "보안 등급 확인 후 승인 처리" : "Security level verified and approval processed"}</li>
            <li>{language === "ko" ? "승인 후 문서 열람 가능 (24시간 유효)" : "Document accessible after approval (valid 24h)"}</li>
          </ol>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>{t("cancel")}</Button>
          <Button size="sm">{t("drmRequestAccess")}</Button>
        </div>
      </div>
    </div>
  );
}

export default function IntelliSearch() {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showDrmModal, setShowDrmModal] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [filterDept, setFilterDept] = useState("all");
  const [filterSecurity, setFilterSecurity] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("all");

  const [nodes, setNodes, onNodesChange] = useNodesState(GRAPH_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(GRAPH_EDGES);

  const handleSearch = useCallback(() => {
    if (!query.trim()) return;
    setIsSearching(true);
    setHasSearched(false);
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
    }, 800);
  }, [query]);

  const filteredSemantic = useMemo(() => {
    return SEMANTIC_RESULTS.filter((r) => {
      if (filterDept !== "all" && r.department !== filterDept) return false;
      return true;
    });
  }, [filterDept]);

  const handleNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node);
  }, []);

  return (
    <Layout>
      <div className="h-full overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1" data-testid="text-intelli-search-title">{t("intelliSearch")}</h1>
            <p className="text-sm text-muted-foreground">{t("intelliSearchDesc")}</p>
          </div>

          <div className="relative mb-8" data-testid="intelli-search-bar">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  className="pl-10 h-12 text-base bg-card border-border shadow-sm"
                  placeholder={t("intelliSearchPlaceholder")}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  data-testid="input-intelli-search"
                />
              </div>
              <Button className="h-12 px-6" onClick={handleSearch} data-testid="button-intelli-search">
                <Search className="w-4 h-4 mr-2" />
                {t("searchAction")}
              </Button>
            </div>
          </div>

          {isSearching && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">{t("searching")}</span>
              </div>
            </div>
          )}

          {hasSearched && !isSearching && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold">{t("fullTextResults")}</h2>
                  <Badge variant="secondary" className="ml-2">{FULLTEXT_RESULTS.length} {t("resultsFound")}</Badge>
                </div>
                <div className="space-y-3">
                  {FULLTEXT_RESULTS.map((result) => (
                    <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer group" data-testid={`card-fulltext-${result.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{result.title}</h3>
                              {result.isDrm && (
                                <Badge
                                  variant="outline"
                                  className="text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/30 cursor-pointer gap-1 text-[10px]"
                                  onClick={(e) => { e.stopPropagation(); setShowDrmModal(true); }}
                                  data-testid={`badge-drm-${result.id}`}
                                >
                                  <Lock className="w-3 h-3" /> DRM
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-[10px]">{result.fileType}</Badge>
                              {result.securityLevel !== "일반" && (
                                <Badge variant="outline" className="text-[10px] text-red-500 border-red-200">
                                  <ShieldCheck className="w-3 h-3 mr-0.5" />{result.securityLevel}
                                </Badge>
                              )}
                            </div>
                            <p
                              className="text-xs text-muted-foreground leading-relaxed mb-2 [&_mark]:bg-yellow-200 [&_mark]:dark:bg-yellow-800/60 [&_mark]:px-0.5 [&_mark]:rounded"
                              dangerouslySetInnerHTML={{ __html: result.snippet }}
                            />
                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{result.department}</span>
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{result.date}</span>
                              <span>{result.matchCount} {t("matches")}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-violet-500" />
                    <h2 className="text-lg font-bold">{t("semanticRecommendations")}</h2>
                    <Badge variant="secondary" className="ml-2">{filteredSemantic.length} {t("resultsFound")}</Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="gap-1.5"
                    data-testid="button-cross-filter"
                  >
                    <Filter className="w-3.5 h-3.5" />
                    {t("crossFilter")}
                    {filterOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </Button>
                </div>

                <Collapsible open={filterOpen} onOpenChange={setFilterOpen}>
                  <CollapsibleContent>
                    <Card className="mb-4 border-dashed">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("filterByDept")}</label>
                            <Select value={filterDept} onValueChange={setFilterDept}>
                              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">{t("allDepartments")}</SelectItem>
                                <SelectItem value="산업자재사업부">{language === "ko" ? "산업자재사업부" : "Industrial Materials"}</SelectItem>
                                <SelectItem value="필름/전자재료사업부">{language === "ko" ? "필름/전자재료사업부" : "Film/Electronic Materials"}</SelectItem>
                                <SelectItem value="화학사업부">{language === "ko" ? "화학사업부" : "Chemicals"}</SelectItem>
                                <SelectItem value="패션사업부">{language === "ko" ? "패션사업부" : "Fashion"}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("filterBySecurity")}</label>
                            <Select value={filterSecurity} onValueChange={setFilterSecurity}>
                              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">{t("allLevels")}</SelectItem>
                                <SelectItem value="general">{language === "ko" ? "일반" : "General"}</SelectItem>
                                <SelectItem value="confidential">{language === "ko" ? "대외비" : "Confidential"}</SelectItem>
                                <SelectItem value="secret">{language === "ko" ? "기밀" : "Secret"}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("filterByPeriod")}</label>
                            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">{t("allPeriods")}</SelectItem>
                                <SelectItem value="1m">{language === "ko" ? "최근 1개월" : "Last 1 Month"}</SelectItem>
                                <SelectItem value="3m">{language === "ko" ? "최근 3개월" : "Last 3 Months"}</SelectItem>
                                <SelectItem value="6m">{language === "ko" ? "최근 6개월" : "Last 6 Months"}</SelectItem>
                                <SelectItem value="1y">{language === "ko" ? "최근 1년" : "Last 1 Year"}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CollapsibleContent>
                </Collapsible>

                <div className="space-y-3">
                  {filteredSemantic.map((result) => (
                    <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer group" data-testid={`card-semantic-${result.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-200 dark:border-violet-800 flex flex-col items-center justify-center">
                            <span className="text-lg font-bold text-violet-600 dark:text-violet-400 leading-none">{result.similarity}%</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{result.title}</h3>
                            <p className="text-xs text-violet-600 dark:text-violet-400 mb-2 italic">{result.reason}</p>
                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{result.department}</span>
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{result.date}</span>
                              <Badge variant="outline" className="text-[10px]">{result.fileType}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Network className="w-5 h-5 text-emerald-500" />
                  <h2 className="text-lg font-bold">{t("relationGraphMap")}</h2>
                </div>
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-muted/30">
                      {LEGEND_ITEMS.map((item) => (
                        <div key={item.type} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <div className={cn("w-2.5 h-2.5 rounded-full", item.color)} />
                          <span>{language === "ko" ? item.labelKo : item.labelEn}</span>
                        </div>
                      ))}
                    </div>
                    <div className="h-[450px]" data-testid="relation-graph-canvas">
                      <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onNodeClick={handleNodeClick}
                        nodeTypes={nodeTypes}
                        fitView
                        proOptions={{ hideAttribution: true }}
                      >
                        <Background gap={20} size={1} />
                        <Controls />
                        <MiniMap
                          nodeStrokeWidth={3}
                          className="!bg-background !border-border"
                        />
                      </ReactFlow>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          )}

          {!hasSearched && !isSearching && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <Search className="w-10 h-10 text-primary/60" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t("intelliSearchEmpty")}</h3>
              <p className="text-sm text-muted-foreground max-w-md">{t("intelliSearchEmptyDesc")}</p>
            </div>
          )}
        </div>
      </div>

      <Sheet open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedNode?.data?.label as string}</SheetTitle>
            <SheetDescription>
              {language === "ko" ? "노드 상세 정보" : "Node Details"}
            </SheetDescription>
          </SheetHeader>
          {selectedNode && (
            <div className="mt-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("nodeType")}</span>
                  <Badge variant="secondary">
                    {LEGEND_ITEMS.find(l => l.type === (selectedNode.data?.type as string))
                      ?.[language === "ko" ? "labelKo" : "labelEn"] || (selectedNode.data?.type as string)}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{language === "ko" ? "연결 수" : "Connections"}</span>
                  <span className="font-medium">
                    {GRAPH_EDGES.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).length}
                  </span>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold mb-2">{language === "ko" ? "연결된 엔티티" : "Connected Entities"}</h4>
                <div className="space-y-2">
                  {GRAPH_EDGES
                    .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map(e => {
                      const targetId = e.source === selectedNode.id ? e.target : e.source;
                      const targetNode = GRAPH_NODES.find(n => n.id === targetId);
                      return (
                        <div key={e.id} className="flex items-center justify-between text-sm bg-muted/50 rounded-lg px-3 py-2">
                          <span>{targetNode?.data?.label as string}</span>
                          <Badge variant="outline" className="text-[10px]">{e.label}</Badge>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <DrmModal open={showDrmModal} onClose={() => setShowDrmModal(false)} />
    </Layout>
  );
}
