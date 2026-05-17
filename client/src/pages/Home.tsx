import { useState } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Activity, ArrowRight, ArrowUpRight, ArrowDownRight,
  BarChart3, Bell, BellOff, Calendar, ChevronDown,
  Clock, Database, FileText, Newspaper, Building2,
  Plus, ShieldAlert, Zap, Bot, Users, X,
  TrendingUp, AlertTriangle, CheckCircle2, XCircle, Sparkles,
  StickyNote, MessageSquare, AtSign, Share2, Image as ImageIcon,
  Film, FileBox, HardDrive, Link2
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, Cell, Line, LineChart,
  PieChart, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import { useLanguage } from "@/lib/i18n";
import type { TranslationKey } from "@/lib/i18n";

type Role = "admin" | "manager" | "viewer";

type TimelineEvent = {
  id: string;
  date: string;
  type: "note" | "garden" | "comment";
  title: string;
  titleKo: string;
  summary: string;
  summaryKo: string;
  severity: "high" | "medium" | "low";
  relatedEntity: string;
  businessUnit: string;
  material: string;
};

type IssueFeedItem = {
  id: string;
  source: "comment" | "mention" | "share" | "system";
  authorName: string;
  authorInitial: string;
  authorColor: string;
  title: string;
  titleKo: string;
  aiSummary: string;
  aiSummaryKo: string;
  time: string;
  timeKo: string;
  subscribed: boolean;
};

const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: "t1", date: "2026-05-17", type: "note", title: "PET필름 라인 생산성 분석 노트", titleKo: "PET필름 라인 생산성 분석 노트", summary: "구미공장 PET필름 #3 라인 가동률 92% 도달. 전월 대비 4.2%p 개선, 주요 원인은 압출 온도 최적화.", summaryKo: "구미공장 PET필름 #3 라인 가동률 92% 도달. 전월 대비 4.2%p 개선, 주요 원인은 압출 온도 최적화.", severity: "low", relatedEntity: "필름사업본부", businessUnit: "steel", material: "hrc" },
  { id: "t2", date: "2026-05-17", type: "comment", title: "아라미드 단가 협상 노트에 댓글 3건", titleKo: "아라미드 단가 협상 노트에 댓글 3건", summary: "박지훈 매니저 외 2명이 '아라미드 단가 협상 전략 Q3' 노트에 코멘트 추가. 검토 요청 항목 포함.", summaryKo: "박지훈 매니저 외 2명이 '아라미드 단가 협상 전략 Q3' 노트에 코멘트 추가. 검토 요청 항목 포함.", severity: "medium", relatedEntity: "산업자재", businessUnit: "electronics", material: "dram" },
  { id: "t3", date: "2026-05-16", type: "note", title: "MOQ 정책 개정 초안", titleKo: "MOQ 정책 개정 초안", summary: "PET필름 MOQ 기존 5톤에서 3톤으로 인하 검토. 중소형 고객사 매출 확대 전략 일환.", summaryKo: "PET필름 MOQ 기존 5톤에서 3톤으로 인하 검토. 중소형 고객사 매출 확대 전략 일환.", severity: "low", relatedEntity: "영업본부", businessUnit: "chemicals", material: "ethylene" },
  { id: "t4", date: "2026-05-15", type: "garden", title: "공급망 지식정원 신규 노드 18개 추가", titleKo: "공급망 지식정원 신규 노드 18개 추가", summary: "코오롱인더 글로벌 공급망 지식정원에 1차 협력사 노드 12개, 자재 노드 6개가 추가되었습니다.", summaryKo: "코오롱인더 글로벌 공급망 지식정원에 1차 협력사 노드 12개, 자재 노드 6개가 추가되었습니다.", severity: "high", relatedEntity: "공급망 지식정원", businessUnit: "energy", material: "lithium" },
  { id: "t5", date: "2026-05-14", type: "note", title: "열연코일 BOM 구조 정리", titleKo: "열연코일 BOM 구조 정리", summary: "열연코일 제품군 BOM 트리 4단 구조로 재정의. 자재 코드 매핑 96% 완료.", summaryKo: "열연코일 제품군 BOM 트리 4단 구조로 재정의. 자재 코드 매핑 96% 완료.", severity: "medium", relatedEntity: "철강사업본부", businessUnit: "automotive", material: "parts" },
  { id: "t6", date: "2026-05-12", type: "comment", title: "편광필름 품질 이슈 노트 토론", titleKo: "편광필름 품질 이슈 노트 토론", summary: "최수정 책임 외 4명, 편광필름 #2호기 황변 이슈 노트에서 원인 분석 토론 진행 중.", summaryKo: "최수정 책임 외 4명, 편광필름 #2호기 황변 이슈 노트에서 원인 분석 토론 진행 중.", severity: "low", relatedEntity: "필름사업본부", businessUnit: "energy", material: "solar" },
];

const ISSUE_FEED_DATA: IssueFeedItem[] = [
  { id: "f1", source: "comment", authorName: "박지훈", authorInitial: "박", authorColor: "bg-violet-500", title: "박지훈 매니저가 내 노트에 댓글을 남겼습니다", titleKo: "박지훈 매니저가 내 노트에 댓글을 남겼습니다", aiSummary: "'아라미드 단가 협상 전략 Q3' 노트: \"Q3 목표 단가 산정 근거를 한 번 더 검토해 주세요. 공급사별 원가 변동성이 큽니다.\"", aiSummaryKo: "'아라미드 단가 협상 전략 Q3' 노트: \"Q3 목표 단가 산정 근거를 한 번 더 검토해 주세요. 공급사별 원가 변동성이 큽니다.\"", time: "15m ago", timeKo: "15분 전", subscribed: true },
  { id: "f2", source: "mention", authorName: "김민서", authorInitial: "김", authorColor: "bg-blue-500", title: "김민서 책임이 회의록에서 나를 멘션했습니다", titleKo: "김민서 책임이 회의록에서 나를 멘션했습니다", aiSummary: "'PET필름 주간 운영회의 W20' 노트에서 @나 가 언급되었습니다. PET필름 #3 라인 가동률 개선 보고 요청.", aiSummaryKo: "'PET필름 주간 운영회의 W20' 노트에서 @나 가 언급되었습니다. PET필름 #3 라인 가동률 개선 보고 요청.", time: "1h ago", timeKo: "1시간 전", subscribed: true },
  { id: "f3", source: "share", authorName: "최수정", authorInitial: "최", authorColor: "bg-emerald-500", title: "최수정 책임이 지식정원을 공유했습니다", titleKo: "최수정 책임이 지식정원을 공유했습니다", aiSummary: "'편광필름 품질 분석 정원' 지식정원이 공유되었습니다. 노드 142개, 엣지 318개. 편집 권한이 부여되었습니다.", aiSummaryKo: "'편광필름 품질 분석 정원' 지식정원이 공유되었습니다. 노드 142개, 엣지 318개. 편집 권한이 부여되었습니다.", time: "2h ago", timeKo: "2시간 전", subscribed: false },
  { id: "f4", source: "system", authorName: "EM-Graph", authorInitial: "EM", authorColor: "bg-slate-500", title: "AI 토큰 사용량 80% 도달", titleKo: "AI 토큰 사용량 80% 도달", aiSummary: "이번 달 AI 토큰 사용량이 한도의 80%(40만 / 50만 토큰)에 도달했습니다. 다음 결제 주기는 6월 1일입니다.", aiSummaryKo: "이번 달 AI 토큰 사용량이 한도의 80%(40만 / 50만 토큰)에 도달했습니다. 다음 결제 주기는 6월 1일입니다.", time: "3h ago", timeKo: "3시간 전", subscribed: false },
  { id: "f5", source: "share", authorName: "정해린", authorInitial: "정", authorColor: "bg-amber-500", title: "브레인마켓에서 새 온톨로지가 공개되었습니다", titleKo: "브레인마켓에서 새 온톨로지가 공개되었습니다", aiSummary: "'Global Semiconductor Supply Chain v2' 온톨로지가 업데이트되었습니다. 구독 중인 항목으로 자동 동기화 예정.", aiSummaryKo: "'Global Semiconductor Supply Chain v2' 온톨로지가 업데이트되었습니다. 구독 중인 항목으로 자동 동기화 예정.", time: "5h ago", timeKo: "5시간 전", subscribed: true },
  { id: "f6", source: "comment", authorName: "이도현", authorInitial: "이", authorColor: "bg-rose-500", title: "이도현 차장이 '열연코일 BOM' 노트에 답글을 남겼습니다", titleKo: "이도현 차장이 '열연코일 BOM' 노트에 답글을 남겼습니다", aiSummary: "\"4단 구조 좋습니다. 다만 자재 코드 매핑이 빠진 항목 4건 별도 정리 부탁드립니다.\"", aiSummaryKo: "\"4단 구조 좋습니다. 다만 자재 코드 매핑이 빠진 항목 4건 별도 정리 부탁드립니다.\"", time: "6h ago", timeKo: "6시간 전", subscribed: false },
];

const NOTE_GROWTH_BY_PROJECT = [
  { proj: "ovProjFilm" as TranslationKey, count: 142 },
  { proj: "ovProjIndustrial" as TranslationKey, count: 287 },
  { proj: "ovProjSteel" as TranslationKey, count: 198 },
  { proj: "ovProjChem" as TranslationKey, count: 156 },
  { proj: "ovProjEnergy" as TranslationKey, count: 213 },
  { proj: "ovProjESG" as TranslationKey, count: 94 },
];

const AI_TOKEN_USAGE_DATA = [
  { date: "05/01", tokens: 22000 },
  { date: "05/05", tokens: 38500 },
  { date: "05/10", tokens: 61200 },
  { date: "05/15", tokens: 84300 },
  { date: "05/20", tokens: 142000 },
  { date: "05/25", tokens: 268000 },
  { date: "05/28", tokens: 401000 },
];

const RESOURCE_COMPOSITION_DATA = [
  { name: "ovResNotes" as TranslationKey, value: 1247, color: "hsl(217, 91%, 60%)" },
  { name: "ovResImages" as TranslationKey, value: 532, color: "hsl(142, 71%, 45%)" },
  { name: "ovResDocs" as TranslationKey, value: 318, color: "hsl(38, 92%, 50%)" },
  { name: "ovResVideos" as TranslationKey, value: 47, color: "hsl(280, 65%, 60%)" },
];

const BUSINESS_UNITS: { value: string; labelKey: TranslationKey }[] = [
  { value: "steel", labelKey: "steelDivision" },
  { value: "electronics", labelKey: "electronicsDivision" },
  { value: "chemicals", labelKey: "chemicalsDivision" },
  { value: "automotive", labelKey: "automotiveDivision" },
  { value: "energy", labelKey: "energyDivision" },
];

function RoleBasedWrapper({ role, allowedRoles, children, masked = false }: {
  role: Role;
  allowedRoles: Role[];
  children: React.ReactNode;
  masked?: boolean;
}) {
  if (!allowedRoles.includes(role)) return null;
  if (masked && role === "viewer") {
    return <div className="relative">{children}<div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg"><span className="text-muted-foreground text-sm font-medium">Restricted</span></div></div>;
  }
  return <>{children}</>;
}

function EventTypeTag({ type, t }: { type: "note" | "garden" | "comment"; t: (key: TranslationKey) => string }) {
  const config = {
    note: { label: t("ovTypeNote"), className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400" },
    garden: { label: t("ovTypeGarden"), className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" },
    comment: { label: t("ovTypeComment"), className: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400" },
  };
  const c = config[type];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.className}`}>{c.label}</span>;
}

function FeedBadge({ source, t }: { source: "comment" | "mention" | "share" | "system"; t: (key: TranslationKey) => string }) {
  const config = {
    comment: { label: t("ovSrcComment"), className: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400", icon: MessageSquare },
    mention: { label: t("ovSrcMention"), className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400", icon: AtSign },
    share: { label: t("ovSrcShare"), className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400", icon: Share2 },
    system: { label: t("ovSrcSystem"), className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400", icon: Bell },
  };
  const c = config[source];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.className}`}>
      <c.icon className="w-3 h-3" />
      {c.label}
    </span>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { t, language } = useLanguage();
  const [role, setRole] = useState<Role>("admin");
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [feedFilter, setFeedFilter] = useState<"all" | "comment" | "mention" | "share" | "system">("all");
  const [feedItems, setFeedItems] = useState(ISSUE_FEED_DATA);
  const [chartPeriod, setChartPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [timelineBusinessUnit, setTimelineBusinessUnit] = useState<string>("all");
  const [visibleFeedCount, setVisibleFeedCount] = useState(4);

  const filteredFeed = feedItems.filter(item => feedFilter === "all" || item.source === feedFilter);
  const displayedFeed = filteredFeed.slice(0, visibleFeedCount);

  const filteredTimeline = TIMELINE_EVENTS.filter(e =>
    timelineBusinessUnit === "all" || e.businessUnit === timelineBusinessUnit
  );

  const toggleSubscribe = (id: string) => {
    setFeedItems(prev => prev.map(item =>
      item.id === id ? { ...item, subscribed: !item.subscribed } : item
    ));
  };

  const kpiCards = [
    { labelKey: "ovKpiNotes" as TranslationKey, value: "1,247", change: "+24", changeDir: "up" as const, icon: StickyNote, color: "text-primary" },
    { labelKey: "ovKpiLinks" as TranslationKey, value: "8,432", change: "+156", changeDir: "up" as const, icon: Link2, color: "text-accent" },
    { labelKey: "ovKpiDbUsage" as TranslationKey, value: "2.4 / 5 GB", change: "48%", changeDir: "neutral" as const, icon: Database, color: "text-emerald-500" },
    { labelKey: "ovKpiResourceUsage" as TranslationKey, value: "3.2 / 5 GB", change: "64%", changeDir: "neutral" as const, icon: HardDrive, color: "text-muted-foreground" },
  ];

  return (
    <Layout>
      <div className="relative z-10 container mx-auto px-6 py-8 space-y-6">

        {/* ===== 2-1: MAIN PORTAL HEADER ===== */}
        <div className="flex items-center justify-between">
          <div>
            <h1 data-testid="text-overview-title" className="text-3xl font-bold tracking-tight mb-1 text-foreground">{t("overview")}</h1>
            <p className="text-muted-foreground text-sm">{t("systemStatusDesc")}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-2">
              <span className="text-xs text-muted-foreground">{t("currentRole")}:</span>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger className="h-8 w-[120px] text-xs" data-testid="select-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">{t("admin")}</SelectItem>
                  <SelectItem value="manager">{t("manager")}</SelectItem>
                  <SelectItem value="viewer">{t("viewer")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="gap-2 h-9 text-sm" onClick={() => setLocation("/database")} data-testid="button-data-sources">
              <Database className="w-4 h-4" />
              {t("dataSources")}
            </Button>
            <Button className="gap-2 h-9 text-sm shadow-lg shadow-primary/20" onClick={() => setLocation("/create")} data-testid="button-new-analysis">
              <Plus className="w-4 h-4" />
              {t("newAnalysis")}
            </Button>
          </div>
        </div>

        <RoleBasedWrapper role={role} allowedRoles={["admin", "manager", "viewer"]} masked={role === "viewer"}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((stat, i) => (
              <Card key={i} className="bg-card/80 backdrop-blur border-border shadow-sm hover:shadow-md transition-shadow" data-testid={`card-kpi-${i}`}>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className={`p-2 rounded-lg bg-background border border-border ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <Badge
                      variant={stat.changeDir === "up" ? "default" : "secondary"}
                      className={`font-mono text-xs px-2 py-0.5 gap-1 ${
                        stat.changeDir === "up"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : ""
                      }`}
                    >
                      {stat.changeDir === "up" && <ArrowUpRight className="w-3.5 h-3.5" />}
                      {stat.change} {stat.changeDir === "up" ? t("vsYesterday") : t("ovOfQuota")}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t(stat.labelKey)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </RoleBasedWrapper>

        {/* ===== 2-2 & 2-3: TIMELINE + ISSUE FEED (side by side) ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* 2-2: TIMELINE VIEW */}
          <RoleBasedWrapper role={role} allowedRoles={["admin", "manager"]}>
            <Card className="lg:col-span-3 bg-card/80 backdrop-blur border-border shadow-sm" data-testid="card-timeline">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      {t("ovTimelineTitle")}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">{t("ovTimelineDesc")}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Select value={timelineBusinessUnit} onValueChange={setTimelineBusinessUnit}>
                    <SelectTrigger className="h-8 w-[160px] text-xs" data-testid="select-business-unit">
                      <SelectValue placeholder={t("businessUnit")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("allBusinessUnits")}</SelectItem>
                      {BUSINESS_UNITS.map(bu => (
                        <SelectItem key={bu.value} value={bu.value}>{t(bu.labelKey)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[380px] pr-4">
                  <div className="relative pl-6">
                    <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
                    <div className="space-y-5">
                      {filteredTimeline.map((event) => (
                        <div
                          key={event.id}
                          className="relative cursor-pointer group"
                          onClick={() => setSelectedEvent(event)}
                          data-testid={`timeline-event-${event.id}`}
                        >
                          <div className={`absolute -left-6 top-1.5 w-[10px] h-[10px] rounded-full ring-2 ring-background z-10 ${
                            event.type === "note" ? "bg-blue-500" :
                            event.type === "comment" ? "bg-violet-500" : "bg-emerald-500"
                          }`} />
                          <div className="p-3 rounded-lg border border-border bg-background/50 hover:bg-secondary/50 transition-colors">
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <EventTypeTag type={event.type} t={t} />
                                {event.severity === "high" && (
                                  <Badge variant="destructive" className="text-[9px] h-4 px-1.5">{t("highSeverity")}</Badge>
                                )}
                              </div>
                              <span className="text-[10px] text-muted-foreground font-mono">{event.date}</span>
                            </div>
                            <h4 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors">
                              {language === "ko" ? event.titleKo : event.title}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {language === "ko" ? event.summaryKo : event.summary}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">{event.relatedEntity}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </RoleBasedWrapper>

          {/* 2-3: ISSUE FEED */}
          <Card className={`${role === "viewer" ? "lg:col-span-5" : "lg:col-span-2"} bg-card/80 backdrop-blur border-border shadow-sm`} data-testid="card-issue-feed">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                {t("ovActivityFeed")}
              </CardTitle>
              <CardDescription className="text-xs">{t("ovActivityFeedDesc")}</CardDescription>
              <div className="flex gap-1 mt-2 flex-wrap">
                {(["all", "comment", "mention", "share", "system"] as const).map(filter => {
                  const filterLabelMap: Record<string, TranslationKey> = {
                    all: "allSources",
                    comment: "ovSrcComment",
                    mention: "ovSrcMention",
                    share: "ovSrcShare",
                    system: "ovSrcSystem",
                  };
                  return (
                    <Button
                      key={filter}
                      variant={feedFilter === filter ? "default" : "outline"}
                      size="sm"
                      className="h-7 text-[11px] px-2.5"
                      onClick={() => { setFeedFilter(filter); setVisibleFeedCount(4); }}
                      data-testid={`button-feed-filter-${filter}`}
                    >
                      {t(filterLabelMap[filter])}
                    </Button>
                  );
                })}
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[380px] pr-2">
                <div className="space-y-3">
                  {displayedFeed.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg border border-border bg-background/50 hover:bg-secondary/30 transition-colors" data-testid={`feed-item-${item.id}`}>
                      <div className="flex items-center justify-between mb-2">
                        <FeedBadge source={item.source} t={t} />
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground">{language === "ko" ? item.timeKo : item.time}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleSubscribe(item.id); }}
                            className={`p-1 rounded-md transition-colors ${item.subscribed ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}
                            data-testid={`button-subscribe-${item.id}`}
                          >
                            {item.subscribed ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Avatar className="w-8 h-8 rounded-full shrink-0">
                          <AvatarFallback className={`text-[11px] font-semibold text-white rounded-full ${item.authorColor}`}>
                            {item.authorInitial}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-semibold mb-1">{language === "ko" ? item.titleKo : item.title}</h4>
                          <div className="flex items-start gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              {language === "ko" ? item.aiSummaryKo : item.aiSummary}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            {filteredFeed.length > visibleFeedCount && (
              <CardFooter className="pt-0">
                <Button
                  variant="ghost"
                  className="w-full text-xs text-muted-foreground hover:text-primary"
                  onClick={() => setVisibleFeedCount(prev => prev + 4)}
                  data-testid="button-load-more"
                >
                  {t("loadMore")} <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        {/* ===== 2-4: KPI / STATS MONITORING ===== */}
        <RoleBasedWrapper role={role} allowedRoles={["admin", "manager"]}>
          <Card className="bg-card/80 backdrop-blur border-border shadow-sm" data-testid="card-kpi-monitoring">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    {t("kpiMonitoring")}
                  </CardTitle>
                </div>
                <div className="flex gap-1">
                  {(["daily", "weekly", "monthly"] as const).map(period => (
                    <Button
                      key={period}
                      variant={chartPeriod === period ? "default" : "outline"}
                      size="sm"
                      className="h-7 text-[11px] px-3"
                      onClick={() => setChartPeriod(period)}
                      data-testid={`button-period-${period}`}
                    >
                      {t(period)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                {[
                  { labelKey: "ovStatAiTokens" as TranslationKey, value: "401K / 500K", icon: Sparkles, color: "text-primary" },
                  { labelKey: "ovStatNewNotes" as TranslationKey, value: "+24", icon: StickyNote, color: "text-accent" },
                  { labelKey: "ovStatActiveUsers" as TranslationKey, value: "12", icon: Users, color: "text-emerald-500" },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border" data-testid={`stat-summary-${i}`}>
                    <div className={`p-2 rounded-lg bg-background border border-border ${stat.color}`}>
                      <stat.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg font-bold">{stat.value}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{t(stat.labelKey)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-semibold mb-3">{t("ovChartResourceComposition")}</h3>
                  <div className="h-[220px] flex items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={RESOURCE_COMPOSITION_DATA.map(d => ({ ...d, name: t(d.name) }))}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {RESOURCE_COMPOSITION_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          formatter={(value) => <span className="text-[11px] text-foreground">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-3">{t("ovChartAiTokenTrend")}</h3>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={AI_TOKEN_USAGE_DATA}>
                        <defs>
                          <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                        <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                          itemStyle={{ color: 'hsl(var(--foreground))' }}
                          formatter={(value: number) => [`${value.toLocaleString()} ${t("ovTokens")}`, t("ovTokens")]}
                        />
                        <Line type="monotone" dataKey="tokens" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ fill: 'hsl(var(--accent))', strokeWidth: 0, r: 3 }} name={t("ovTokens")} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-3">{t("ovChartNoteGrowth")}</h3>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={NOTE_GROWTH_BY_PROJECT.map(d => ({ proj: t(d.proj), count: d.count }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="proj" fontSize={10} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                        <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                          itemStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]} name={t("ovStatNewNotes")}>
                          {NOTE_GROWTH_BY_PROJECT.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(var(--primary) / ${0.4 + (index * 0.1)})`} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </RoleBasedWrapper>
      </div>

      {/* EVENT DETAIL DRAWER */}
      <Sheet open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          {selectedEvent && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2 mb-2">
                  <EventTypeTag type={selectedEvent.type} t={t} />
                  {selectedEvent.severity === "high" && (
                    <Badge variant="destructive" className="text-[10px]">{t("highSeverity")}</Badge>
                  )}
                  {selectedEvent.severity === "medium" && (
                    <Badge variant="secondary" className="text-[10px]">{t("mediumSeverity")}</Badge>
                  )}
                </div>
                <SheetTitle className="text-left">
                  {language === "ko" ? selectedEvent.titleKo : selectedEvent.title}
                </SheetTitle>
                <SheetDescription className="text-left">
                  {selectedEvent.date}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm leading-relaxed text-foreground">
                    {language === "ko" ? selectedEvent.summaryKo : selectedEvent.summary}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <span className="text-xs text-muted-foreground font-medium">{t("relatedEntity")}</span>
                  <div className="mt-1">
                    <Badge variant="outline" className="text-xs">{selectedEvent.relatedEntity}</Badge>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <span className="text-xs text-muted-foreground font-medium">{t("businessUnit")}</span>
                  <div className="mt-1">
                    <Badge variant="outline" className="text-xs">
                      {t(BUSINESS_UNITS.find(bu => bu.value === selectedEvent.businessUnit)?.labelKey || "allBusinessUnits")}
                    </Badge>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </Layout>
  );
}
