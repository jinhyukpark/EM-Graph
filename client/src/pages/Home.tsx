import { useState } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  Activity, ArrowRight, ArrowUpRight, ArrowDownRight,
  BarChart3, Bell, BellOff, Calendar, ChevronDown,
  Clock, Database, FileText, Newspaper, Building2,
  Plus, ShieldAlert, Zap, Bot, Users, X,
  TrendingUp, AlertTriangle, CheckCircle2, XCircle, Sparkles
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
  type: "issue" | "news" | "performance";
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
  source: "news" | "disclosure" | "internal";
  title: string;
  titleKo: string;
  aiSummary: string;
  aiSummaryKo: string;
  time: string;
  timeKo: string;
  subscribed: boolean;
};

const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: "t1", date: "2024-03-28", type: "issue", title: "Steel Raw Material Supply Disruption", titleKo: "철강 원자재 수급 차질", summary: "POSCO Gwangyang plant utilization rate dropped to 80%. Impact on HRC delivery expected for 2-3 weeks.", summaryKo: "포스코 광양 공장 가동률 80%로 하락. HRC 납품 2~3주 영향 예상.", severity: "high", relatedEntity: "Steel/HRC", businessUnit: "steel", material: "hrc" },
  { id: "t2", date: "2024-03-25", type: "news", title: "Semiconductor Production Expansion Plan", titleKo: "반도체 생산 확대 계획 발표", summary: "Samsung Electronics announced a $10B investment in Pyeongtaek P4 fab expansion, targeting Q3 2025 completion.", summaryKo: "삼성전자 평택 P4 팹 확장에 100억 달러 투자 발표. 2025년 3분기 완공 목표.", severity: "medium", relatedEntity: "Electronics/DRAM", businessUnit: "electronics", material: "dram" },
  { id: "t3", date: "2024-03-22", type: "performance", title: "Q1 Chemical Division Results Preview", titleKo: "1분기 화학 사업부 실적 프리뷰", summary: "Chemical division expected to report 15% YoY revenue growth driven by ethylene price recovery.", summaryKo: "에틸렌 가격 회복에 힘입어 화학 사업부 전년 대비 15% 매출 성장 전망.", severity: "low", relatedEntity: "Chemicals/Ethylene", businessUnit: "chemicals", material: "ethylene" },
  { id: "t4", date: "2024-03-18", type: "issue", title: "Battery Material Price Surge Alert", titleKo: "배터리 소재 가격 급등 경보", summary: "Lithium carbonate prices surged 12% in one week. Multiple EV manufacturers pausing procurement.", summaryKo: "탄산리튬 가격 1주일 만에 12% 급등. 다수 EV 제조사 조달 중단.", severity: "high", relatedEntity: "Energy/Lithium", businessUnit: "energy", material: "lithium" },
  { id: "t5", date: "2024-03-15", type: "news", title: "New Trade Agreement Impact Assessment", titleKo: "신규 무역 협정 영향 평가", summary: "Korea-Indonesia CEPA ratified. Expected tariff reduction on automotive parts and steel imports.", summaryKo: "한-인도네시아 CEPA 비준. 자동차 부품 및 철강 수입 관세 인하 예상.", severity: "medium", relatedEntity: "Automotive/Parts", businessUnit: "automotive", material: "parts" },
  { id: "t6", date: "2024-03-10", type: "performance", title: "Energy Division Monthly KPI Report", titleKo: "에너지 사업부 월간 KPI 보고", summary: "Renewable energy portfolio reached 32% of total capacity. Solar panel efficiency up 2.1% MoM.", summaryKo: "재생에너지 포트폴리오 전체 용량의 32% 달성. 태양광 패널 효율 전월 대비 2.1% 상승.", severity: "low", relatedEntity: "Energy/Solar", businessUnit: "energy", material: "solar" },
];

const ISSUE_FEED_DATA: IssueFeedItem[] = [
  { id: "f1", source: "news", title: "POSCO HRC Price Increase 5.2% This Week", titleKo: "포스코 HRC 가격 금주 5.2% 인상", aiSummary: "POSCO raised HRC base price by 5.2% effective this week due to rising iron ore costs and increased demand from automotive sector. Export prices also adjusted upward by 3.8%.", aiSummaryKo: "포스코가 철광석 원가 상승과 자동차 부문 수요 증가로 금주부터 HRC 기준가를 5.2% 인상. 수출 가격도 3.8% 상향 조정됨.", time: "15m ago", timeKo: "15분 전", subscribed: false },
  { id: "f2", source: "disclosure", title: "Samsung Electronics Q4 Earnings Announcement", titleKo: "삼성전자 4분기 실적 발표", aiSummary: "Samsung Electronics reported Q4 operating profit of ₩6.5T, up 35% YoY. Memory division led recovery with DRAM prices stabilizing above $3.20 per unit.", aiSummaryKo: "삼성전자 4분기 영업이익 6.5조원, 전년 대비 35% 증가. DRAM 가격 개당 3.20달러 이상 안정화로 메모리 사업부 회복 주도.", time: "1h ago", timeKo: "1시간 전", subscribed: true },
  { id: "f3", source: "internal", title: "Supply Chain Alert - Tier 2 Supplier Delay", titleKo: "공급망 경보 - Tier 2 공급사 지연", aiSummary: "Tier 2 supplier KChem reported 7-day delivery delay on specialty chemicals. Affects 3 downstream production lines. Contingency procurement initiated.", aiSummaryKo: "Tier 2 공급사 KChem, 특수화학물질 7일 납품 지연 보고. 3개 하류 생산라인 영향. 비상 조달 개시됨.", time: "2h ago", timeKo: "2시간 전", subscribed: false },
  { id: "f4", source: "news", title: "Global Copper Demand Forecast Upgraded", titleKo: "글로벌 구리 수요 전망 상향", aiSummary: "Goldman Sachs upgraded global copper demand forecast by 8% for 2024, citing accelerating EV adoption and grid infrastructure investments across Asia.", aiSummaryKo: "골드만삭스, EV 보급 가속화와 아시아 전력망 인프라 투자 확대를 이유로 2024년 글로벌 구리 수요 전망 8% 상향.", time: "3h ago", timeKo: "3시간 전", subscribed: false },
  { id: "f5", source: "disclosure", title: "LG Energy Solution ESS Patent Filing", titleKo: "LG에너지솔루션 ESS 특허 출원", aiSummary: "LG Energy Solution filed 12 new patents for next-gen solid-state ESS technology. Expected commercial deployment by 2026 with 40% higher energy density.", aiSummaryKo: "LG에너지솔루션, 차세대 전고체 ESS 기술 관련 12건 신규 특허 출원. 2026년 상용화 목표, 에너지 밀도 40% 향상 전망.", time: "5h ago", timeKo: "5시간 전", subscribed: true },
  { id: "f6", source: "internal", title: "Monthly Data Quality Audit Complete", titleKo: "월간 데이터 품질 감사 완료", aiSummary: "March data quality audit scored 94.2%, up from 91.8% last month. 3 data sources flagged for schema drift requiring manual review.", aiSummaryKo: "3월 데이터 품질 감사 점수 94.2%, 지난달 91.8%에서 상승. 3개 데이터 소스 스키마 드리프트 발생으로 수동 검토 필요.", time: "6h ago", timeKo: "6시간 전", subscribed: false },
];

const DOC_REGISTRATION_DATA = [
  { dept: "hrDept" as TranslationKey, count: 142 },
  { dept: "devDept" as TranslationKey, count: 287 },
  { dept: "salesDept" as TranslationKey, count: 198 },
  { dept: "marketingDept" as TranslationKey, count: 156 },
  { dept: "financeDept" as TranslationKey, count: 213 },
  { dept: "legalDept" as TranslationKey, count: 94 },
];

const CHATBOT_USAGE_DATA = [
  { date: "03/01", sessions: 120 },
  { date: "03/05", sessions: 185 },
  { date: "03/10", sessions: 210 },
  { date: "03/15", sessions: 168 },
  { date: "03/20", sessions: 245 },
  { date: "03/25", sessions: 312 },
  { date: "03/28", sessions: 289 },
];

const PARTNER_STATUS_DATA = [
  { name: "normalStatus" as TranslationKey, value: 18, color: "hsl(142, 71%, 45%)" },
  { name: "delayedStatus" as TranslationKey, value: 4, color: "hsl(45, 93%, 47%)" },
  { name: "errorStatus" as TranslationKey, value: 2, color: "hsl(0, 84%, 60%)" },
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

function EventTypeTag({ type, t }: { type: "issue" | "news" | "performance"; t: (key: TranslationKey) => string }) {
  const config = {
    issue: { label: t("issueType"), className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400" },
    news: { label: t("newsType"), className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400" },
    performance: { label: t("performanceType"), className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" },
  };
  const c = config[type];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.className}`}>{c.label}</span>;
}

function FeedBadge({ source, t }: { source: "news" | "disclosure" | "internal"; t: (key: TranslationKey) => string }) {
  const config = {
    news: { label: t("newsSource"), className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400", icon: Newspaper },
    disclosure: { label: t("disclosureSource"), className: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400", icon: FileText },
    internal: { label: t("internalSource"), className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400", icon: Building2 },
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
  const [feedFilter, setFeedFilter] = useState<"all" | "news" | "disclosure" | "internal">("all");
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
    { labelKey: "totalActiveNodes" as TranslationKey, value: "3,420", change: "+12%", changeDir: "up" as const, icon: Activity, color: "text-primary" },
    { labelKey: "relationshipsMapped" as TranslationKey, value: "12,850", change: "+8%", changeDir: "up" as const, icon: Zap, color: "text-accent" },
    { labelKey: "resourceUsage" as TranslationKey, value: "3.2 GB", change: "64%", changeDir: "neutral" as const, icon: Database, color: "text-muted-foreground" },
    { labelKey: "anomaliesDetected" as TranslationKey, value: "24", change: "+2", changeDir: "up" as const, icon: ShieldAlert, color: "text-destructive" },
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
                      className={`font-mono text-[10px] gap-1 ${
                        stat.labelKey === "anomaliesDetected"
                          ? "bg-destructive/10 text-destructive border-destructive/20"
                          : stat.changeDir === "up"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : ""
                      }`}
                    >
                      {stat.changeDir === "up" && stat.labelKey !== "anomaliesDetected" && <ArrowUpRight className="w-3 h-3" />}
                      {stat.labelKey === "anomaliesDetected" && <AlertTriangle className="w-3 h-3" />}
                      {stat.change} {t("vsYesterday")}
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
                      {t("timelineView")}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">{t("timelineViewDesc")}</CardDescription>
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
                            event.type === "issue" ? "bg-red-500" :
                            event.type === "news" ? "bg-yellow-500" : "bg-emerald-500"
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
                <Newspaper className="w-5 h-5 text-primary" />
                {t("latestIssueFeed")}
              </CardTitle>
              <CardDescription className="text-xs">{t("latestIssueFeedDesc")}</CardDescription>
              <div className="flex gap-1 mt-2">
                {(["all", "news", "disclosure", "internal"] as const).map(filter => {
                  const filterLabelMap: Record<string, TranslationKey> = {
                    all: "allSources",
                    news: "newsSource",
                    disclosure: "disclosureSource",
                    internal: "internalSource",
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
                      <div className="flex items-center justify-between mb-1.5">
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
                      <h4 className="text-sm font-semibold mb-1.5">{language === "ko" ? item.titleKo : item.title}</h4>
                      <div className="flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {language === "ko" ? item.aiSummaryKo : item.aiSummary}
                        </p>
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
                  { labelKey: "totalDocs" as TranslationKey, value: "1,090", icon: FileText, color: "text-primary" },
                  { labelKey: "monthlyChatbotSessions" as TranslationKey, value: "1,529", icon: Bot, color: "text-accent" },
                  { labelKey: "connectedPartners" as TranslationKey, value: "24", icon: Users, color: "text-emerald-500" },
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
                  <h3 className="text-sm font-semibold mb-3">{t("docRegistrationByDept")}</h3>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={DOC_REGISTRATION_DATA.map(d => ({ dept: t(d.dept), count: d.count }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="dept" fontSize={10} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                        <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                          itemStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]} name={t("registrations")}>
                          {DOC_REGISTRATION_DATA.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(var(--primary) / ${0.4 + (index * 0.1)})`} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-3">{t("chatbotUsageTrend")}</h3>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={CHATBOT_USAGE_DATA}>
                        <defs>
                          <linearGradient id="chatbotGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                        <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                          itemStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Line type="monotone" dataKey="sessions" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ fill: 'hsl(var(--accent))', strokeWidth: 0, r: 3 }} name={t("sessions")} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <RoleBasedWrapper role={role} allowedRoles={["admin"]}>
                  <div>
                    <h3 className="text-sm font-semibold mb-3">{t("partnerDataStatus")}</h3>
                    <div className="h-[220px] flex items-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={PARTNER_STATUS_DATA.map(d => ({ ...d, name: t(d.name) }))}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {PARTNER_STATUS_DATA.map((entry, index) => (
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
                </RoleBasedWrapper>
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
