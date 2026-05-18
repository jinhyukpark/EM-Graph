import { useState, useEffect } from "react";
import { Reorder } from "framer-motion";
import { useLocation } from "wouter";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import avatarPark from "@assets/avatars/avatar_park.png";
import avatarKim from "@assets/avatars/avatar_kim.png";
import avatarChoi from "@assets/avatars/avatar_choi.png";
import avatarJung from "@assets/avatars/avatar_jung.png";
import avatarLee from "@assets/avatars/avatar_lee.png";
import {
  Activity, ArrowRight, ArrowUpRight, ArrowDownRight,
  BarChart3, Bell, Calendar, ChevronDown,
  Clock, Database, FileText, Newspaper, Building2,
  ShieldAlert, Zap, Bot, Users, X,
  TrendingUp, AlertTriangle, CheckCircle2, XCircle, Sparkles,
  StickyNote, MessageSquare, AtSign, Share2, Image as ImageIcon,
  Film, FileBox, HardDrive, Link2, Check, CheckCheck, LayoutGrid, Plus,
  LayoutTemplate, Eye, EyeOff, GripVertical, RotateCcw, Save, Sparkle,
  Settings2, Pencil, Columns2, Columns4, Rows3, PieChart as PieIcon, LineChart as LineIcon, BarChart2
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
  authorImage?: string;
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
  { id: "f1", source: "comment", authorName: "박지훈", authorInitial: "박", authorColor: "bg-violet-500", authorImage: avatarPark, title: "박지훈 매니저가 내 노트에 댓글을 남겼습니다", titleKo: "박지훈 매니저가 내 노트에 댓글을 남겼습니다", aiSummary: "'아라미드 단가 협상 전략 Q3' 노트: \"Q3 목표 단가 산정 근거를 한 번 더 검토해 주세요. 공급사별 원가 변동성이 큽니다.\"", aiSummaryKo: "'아라미드 단가 협상 전략 Q3' 노트: \"Q3 목표 단가 산정 근거를 한 번 더 검토해 주세요. 공급사별 원가 변동성이 큽니다.\"", time: "15m ago", timeKo: "15분 전", subscribed: true },
  { id: "f2", source: "mention", authorName: "김민서", authorInitial: "김", authorColor: "bg-blue-500", authorImage: avatarKim, title: "김민서 책임이 회의록에서 나를 멘션했습니다", titleKo: "김민서 책임이 회의록에서 나를 멘션했습니다", aiSummary: "'PET필름 주간 운영회의 W20' 노트에서 @나 가 언급되었습니다. PET필름 #3 라인 가동률 개선 보고 요청.", aiSummaryKo: "'PET필름 주간 운영회의 W20' 노트에서 @나 가 언급되었습니다. PET필름 #3 라인 가동률 개선 보고 요청.", time: "1h ago", timeKo: "1시간 전", subscribed: true },
  { id: "f3", source: "share", authorName: "최수정", authorInitial: "최", authorColor: "bg-emerald-500", authorImage: avatarChoi, title: "최수정 책임이 지식정원을 공유했습니다", titleKo: "최수정 책임이 지식정원을 공유했습니다", aiSummary: "'편광필름 품질 분석 정원' 지식정원이 공유되었습니다. 노드 142개, 엣지 318개. 편집 권한이 부여되었습니다.", aiSummaryKo: "'편광필름 품질 분석 정원' 지식정원이 공유되었습니다. 노드 142개, 엣지 318개. 편집 권한이 부여되었습니다.", time: "2h ago", timeKo: "2시간 전", subscribed: false },
  { id: "f4", source: "system", authorName: "EM-Graph", authorInitial: "EM", authorColor: "bg-slate-500", title: "AI 토큰 사용량 80% 도달", titleKo: "AI 토큰 사용량 80% 도달", aiSummary: "이번 달 AI 토큰 사용량이 한도의 80%(40만 / 50만 토큰)에 도달했습니다. 다음 결제 주기는 6월 1일입니다.", aiSummaryKo: "이번 달 AI 토큰 사용량이 한도의 80%(40만 / 50만 토큰)에 도달했습니다. 다음 결제 주기는 6월 1일입니다.", time: "3h ago", timeKo: "3시간 전", subscribed: false },
  { id: "f5", source: "share", authorName: "정해린", authorInitial: "정", authorColor: "bg-amber-500", authorImage: avatarJung, title: "브레인마켓에서 새 온톨로지가 공개되었습니다", titleKo: "브레인마켓에서 새 온톨로지가 공개되었습니다", aiSummary: "'Global Semiconductor Supply Chain v2' 온톨로지가 업데이트되었습니다. 구독 중인 항목으로 자동 동기화 예정.", aiSummaryKo: "'Global Semiconductor Supply Chain v2' 온톨로지가 업데이트되었습니다. 구독 중인 항목으로 자동 동기화 예정.", time: "5h ago", timeKo: "5시간 전", subscribed: true },
  { id: "f6", source: "comment", authorName: "이도현", authorInitial: "이", authorColor: "bg-rose-500", authorImage: avatarLee, title: "이도현 차장이 '열연코일 BOM' 노트에 답글을 남겼습니다", titleKo: "이도현 차장이 '열연코일 BOM' 노트에 답글을 남겼습니다", aiSummary: "\"4단 구조 좋습니다. 다만 자재 코드 매핑이 빠진 항목 4건 별도 정리 부탁드립니다.\"", aiSummaryKo: "\"4단 구조 좋습니다. 다만 자재 코드 매핑이 빠진 항목 4건 별도 정리 부탁드립니다.\"", time: "6h ago", timeKo: "6시간 전", subscribed: false },
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

type BlockKey = "notes" | "links" | "dbUsage" | "resource" | "timeline" | "feed" | "monitoring";

const KPI_KEYS: BlockKey[] = ["notes", "links", "dbUsage", "resource"];
const isKpiKey = (k: BlockKey) => KPI_KEYS.includes(k);

type DashboardTemplate = {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  descriptionKo: string;
  blocks: BlockKey[];
  accent: string;
  icon: typeof BarChart3;
};

const DASHBOARD_TEMPLATES: DashboardTemplate[] = [
  {
    id: "default",
    name: "Full Overview",
    nameKo: "기본 (전체 보기)",
    description: "All blocks: KPI cards, timeline, activity feed, monitoring charts",
    descriptionKo: "KPI 카드, 타임라인, 활동 피드, 모니터링 차트 모두 표시",
    blocks: ["notes", "links", "dbUsage", "resource", "timeline", "feed", "monitoring"],
    accent: "from-blue-500/15 to-indigo-500/15 border-indigo-200 dark:border-indigo-900",
    icon: LayoutGrid,
  },
  {
    id: "activity",
    name: "Activity-focused",
    nameKo: "활동 중심",
    description: "KPI + Timeline + Activity Feed (no charts)",
    descriptionKo: "KPI 카드, 타임라인, 활동 피드 (차트 제외)",
    blocks: ["notes", "links", "dbUsage", "resource", "timeline", "feed"],
    accent: "from-emerald-500/15 to-teal-500/15 border-emerald-200 dark:border-emerald-900",
    icon: Bell,
  },
  {
    id: "analytics",
    name: "Analytics",
    nameKo: "분석 중심",
    description: "KPI cards and monitoring charts only",
    descriptionKo: "KPI 카드와 모니터링 차트만 표시",
    blocks: ["notes", "links", "dbUsage", "resource", "monitoring"],
    accent: "from-violet-500/15 to-purple-500/15 border-violet-200 dark:border-violet-900",
    icon: BarChart3,
  },
  {
    id: "compact",
    name: "Compact",
    nameKo: "컴팩트",
    description: "KPI and activity feed only",
    descriptionKo: "KPI 카드와 활동 피드만",
    blocks: ["notes", "links", "dbUsage", "resource", "feed"],
    accent: "from-amber-500/15 to-orange-500/15 border-amber-200 dark:border-amber-900",
    icon: Newspaper,
  },
  {
    id: "minimal",
    name: "Minimal",
    nameKo: "미니멀",
    description: "KPI cards only",
    descriptionKo: "KPI 카드만 표시",
    blocks: ["notes", "links", "dbUsage", "resource"],
    accent: "from-slate-500/15 to-slate-400/15 border-slate-200 dark:border-slate-800",
    icon: Zap,
  },
];

const BLOCK_META: Record<BlockKey, { labelKo: string; label: string; descKo: string; desc: string; icon: typeof BarChart3 }> = {
  notes: { labelKo: "노트", label: "Notes", descKo: "총 노트 수 및 전일 대비 변화", desc: "Total notes count", icon: StickyNote },
  links: { labelKo: "링크", label: "Links", descKo: "노트 간 연결 수", desc: "Note-to-note connections", icon: Link2 },
  dbUsage: { labelKo: "DB 사용량", label: "Database Usage", descKo: "데이터베이스 저장 공간 사용량", desc: "Database storage usage", icon: Database },
  resource: { labelKo: "리소스 사용량", label: "Resource Usage", descKo: "파일/리소스 저장 공간 사용량", desc: "File & resource storage", icon: HardDrive },
  timeline: { labelKo: "최근 노트 타임라인", label: "Recent Notes Timeline", descKo: "최근 생성된 노트와 변경 사항", desc: "Recent notes and changes", icon: Calendar },
  feed: { labelKo: "활동 피드", label: "Activity Feed", descKo: "댓글, 멘션, 공유, 시스템 알림", desc: "Comments, mentions, shares", icon: Bell },
  monitoring: { labelKo: "KPI 모니터링 차트", label: "KPI Monitoring", descKo: "리소스 구성, AI 토큰, 노트 성장 차트", desc: "Resource, AI tokens, growth charts", icon: BarChart3 },
};

type BlockOptions = {
  timeline: { height: "compact" | "default" | "expanded" };
  feed: { height: "compact" | "default" | "expanded" };
  monitoring: { charts: Array<"pie" | "line" | "bar"> };
};

const DEFAULT_BLOCK_OPTIONS: BlockOptions = {
  timeline: { height: "default" },
  feed: { height: "default" },
  monitoring: { charts: ["pie", "line", "bar"] },
};

const HEIGHT_MAP = { compact: 260, default: 380, expanded: 520 } as const;

function BlockPreview({ type, className = "" }: { type: BlockKey; className?: string }) {
  const common = "text-foreground/60";
  switch (type) {
    case "notes":
    case "links":
    case "dbUsage":
    case "resource":
      return (
        <svg viewBox="0 0 80 28" className={`${common} ${className}`} aria-hidden="true">
          <rect x={2} y={2} width={76} height={24} rx={3} fill="currentColor" fillOpacity={0.08} stroke="currentColor" strokeOpacity={0.35} strokeWidth={0.7} />
          <rect x={6} y={6} width={7} height={7} rx={1.5} fill="currentColor" fillOpacity={0.4} />
          <rect x={56} y={6.5} width={18} height={4} rx={1.5} fill="currentColor" fillOpacity={0.25} stroke="currentColor" strokeOpacity={0.35} strokeWidth={0.4} />
          <rect x={6} y={16} width={36} height={3.2} rx={1.4} fill="currentColor" fillOpacity={0.75} />
          <rect x={6} y={21} width={22} height={2} rx={1} fill="currentColor" fillOpacity={0.35} />
        </svg>
      );
    case "timeline":
      return (
        <svg viewBox="0 0 80 28" className={`${common} ${className}`} aria-hidden="true">
          <line x1={5} y1={3} x2={5} y2={25} stroke="currentColor" strokeOpacity={0.3} strokeWidth={0.8} />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <circle cx={5} cy={6 + i * 8} r={1.6} fill="currentColor" fillOpacity={0.85} />
              <rect x={10} y={4.5 + i * 8} width={66} height={4.5} rx={1.2} fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeOpacity={0.25} strokeWidth={0.4} />
              <rect x={12} y={6 + i * 8} width={28} height={1.4} rx={0.7} fill="currentColor" fillOpacity={0.6} />
            </g>
          ))}
        </svg>
      );
    case "feed":
      return (
        <svg viewBox="0 0 80 28" className={`${common} ${className}`} aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={2} y={2 + i * 8} width={76} height={6.5} rx={1.5} fill="currentColor" fillOpacity={0.08} stroke="currentColor" strokeOpacity={0.25} strokeWidth={0.4} />
              <circle cx={6} cy={5.3 + i * 8} r={1.8} fill="currentColor" fillOpacity={0.5} />
              <rect x={10.5} y={3.6 + i * 8} width={36} height={1.5} rx={0.7} fill="currentColor" fillOpacity={0.7} />
              <rect x={10.5} y={6 + i * 8} width={56} height={1.2} rx={0.6} fill="currentColor" fillOpacity={0.35} />
            </g>
          ))}
        </svg>
      );
    case "monitoring":
      return (
        <svg viewBox="0 0 80 28" className={`${common} ${className}`} aria-hidden="true">
          <rect x={1.5} y={2} width={23} height={24} rx={2} fill="currentColor" fillOpacity={0.08} stroke="currentColor" strokeOpacity={0.25} strokeWidth={0.4} />
          <circle cx={13} cy={14} r={6.5} fill="none" stroke="currentColor" strokeOpacity={0.65} strokeWidth={2.4} strokeDasharray="22 12" />
          <rect x={28} y={2} width={23} height={24} rx={2} fill="currentColor" fillOpacity={0.08} stroke="currentColor" strokeOpacity={0.25} strokeWidth={0.4} />
          <polyline points="30,22 34,17 38,19 42,12 46,15 50,8" fill="none" stroke="currentColor" strokeOpacity={0.7} strokeWidth={1.2} />
          <rect x={54.5} y={2} width={24} height={24} rx={2} fill="currentColor" fillOpacity={0.08} stroke="currentColor" strokeOpacity={0.25} strokeWidth={0.4} />
          {[16, 11, 18, 8, 14].map((h, i) => (
            <rect key={i} x={57 + i * 4} y={24 - h} width={2.6} height={h} rx={0.6} fill="currentColor" fillOpacity={0.55} />
          ))}
        </svg>
      );
  }
}

function DeleteBlockButton({
  blockKey,
  onDelete,
  language,
  position = "outside",
}: {
  blockKey: BlockKey;
  onDelete: () => void;
  language: "ko" | "en";
  position?: "outside" | "inside";
}) {
  const posClass = position === "inside" ? "top-2 right-2" : "-top-2.5 -right-2.5";
  return (
    <button
      type="button"
      onClick={onDelete}
      className={`absolute ${posClass} z-30 inline-flex items-center justify-center w-7 h-7 rounded-full border border-destructive/40 bg-background hover:bg-destructive hover:text-destructive-foreground text-destructive shadow-md transition-colors`}
      data-testid={`button-delete-block-${blockKey}`}
      aria-label={language === "ko" ? "삭제" : "Remove"}
      title={language === "ko" ? "이 컴포넌트 삭제" : "Remove this component"}
    >
      <X className="w-3.5 h-3.5" />
    </button>
  );
}

function DragHandleHint({ language, position = "outside" }: { language: "ko" | "en"; position?: "outside" | "inside" }) {
  const posClass = position === "inside" ? "top-2 left-2" : "-top-2.5 -left-2.5";
  return (
    <div
      className={`absolute ${posClass} z-30 inline-flex items-center justify-center w-7 h-7 rounded-full border border-primary/40 bg-background text-primary shadow-md cursor-grab active:cursor-grabbing`}
      title={language === "ko" ? "드래그하여 순서 변경" : "Drag to reorder"}
    >
      <GripVertical className="w-3.5 h-3.5" />
    </div>
  );
}

function BlockEditLabel({ blockKey, language }: { blockKey: BlockKey; language: "ko" | "en" }) {
  const meta = BLOCK_META[blockKey];
  const Icon = meta.icon;
  return (
    <div className="absolute -top-2.5 left-3 z-20 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-background border border-primary/30 text-primary shadow-sm">
      <Icon className="w-3 h-3" />
      {language === "ko" ? meta.labelKo : meta.label}
    </div>
  );
}

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
  const [role] = useState<Role>("admin");
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [feedFilter, setFeedFilter] = useState<"all" | "comment" | "mention" | "share" | "system">("all");
  const [feedItems, setFeedItems] = useState(ISSUE_FEED_DATA);
  const [chartPeriod, setChartPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [timelineBusinessUnit, setTimelineBusinessUnit] = useState<string>("all");
  const [visibleFeedCount, setVisibleFeedCount] = useState(4);
  const [templatePanelOpen, setTemplatePanelOpen] = useState(false);
  const [activeTemplateId, setActiveTemplateId] = useState<string>("default");
  const [visibleBlocks, setVisibleBlocks] = useState<BlockKey[]>(DASHBOARD_TEMPLATES[0].blocks);
  const [blockOptions, setBlockOptions] = useState<BlockOptions>(DEFAULT_BLOCK_OPTIONS);

  const editMode = templatePanelOpen;

  useEffect(() => {
    if (!templatePanelOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTemplatePanelOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [templatePanelOpen]);

  const applyTemplate = (id: string) => {
    const tpl = DASHBOARD_TEMPLATES.find(t => t.id === id);
    if (!tpl) return;
    setActiveTemplateId(id);
    setVisibleBlocks(tpl.blocks);
  };

  const matchTemplateForOrder = (blocks: BlockKey[]): string => {
    const sig = blocks.join("|");
    const matched = DASHBOARD_TEMPLATES.find(t => t.blocks.join("|") === sig);
    return matched ? matched.id : "custom";
  };

  const toggleBlock = (key: BlockKey) => {
    setVisibleBlocks(prev => {
      const next = prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key];
      setActiveTemplateId(matchTemplateForOrder(next));
      return next;
    });
  };

  const visibleKpiKeys = visibleBlocks.filter(isKpiKey);
  const showKpi = visibleKpiKeys.length > 0;
  const showTimeline = visibleBlocks.includes("timeline");
  const showFeed = visibleBlocks.includes("feed");
  const showMonitoring = visibleBlocks.includes("monitoring");

  const removeBlock = (key: BlockKey) => {
    setVisibleBlocks(prev => {
      const next = prev.filter(k => k !== key);
      setActiveTemplateId(matchTemplateForOrder(next));
      return next;
    });
  };

  const addBlock = (key: BlockKey) => {
    setVisibleBlocks(prev => {
      if (prev.includes(key)) return prev;
      let next: BlockKey[];
      if (isKpiKey(key)) {
        const lastKpiIdx = prev.map(isKpiKey).lastIndexOf(true);
        const insertAt = lastKpiIdx === -1 ? 0 : lastKpiIdx + 1;
        next = [...prev.slice(0, insertAt), key, ...prev.slice(insertAt)];
      } else {
        next = [...prev, key];
      }
      setActiveTemplateId(matchTemplateForOrder(next));
      return next;
    });
  };

  const handleKpiReorder = (newKpiOrder: BlockKey[]) => {
    setVisibleBlocks(prev => {
      const next = [...newKpiOrder, ...prev.filter(k => !isKpiKey(k))];
      setActiveTemplateId(matchTemplateForOrder(next));
      return next;
    });
  };

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

  const kpiCardsData: Record<"notes" | "links" | "dbUsage" | "resource", { labelKey: TranslationKey; value: string; change: string; changeDir: "up" | "neutral"; icon: typeof StickyNote; color: string }> = {
    notes: { labelKey: "ovKpiNotes", value: "1,247", change: "+24", changeDir: "up", icon: StickyNote, color: "text-primary" },
    links: { labelKey: "ovKpiLinks", value: "8,432", change: "+156", changeDir: "up", icon: Link2, color: "text-accent" },
    dbUsage: { labelKey: "ovKpiDbUsage", value: "2.4 / 5 GB", change: "48%", changeDir: "neutral", icon: Database, color: "text-emerald-500" },
    resource: { labelKey: "ovKpiResourceUsage", value: "3.2 / 5 GB", change: "64%", changeDir: "neutral", icon: HardDrive, color: "text-muted-foreground" },
  };

  return (
    <Layout>
      <div className={`relative z-10 container mx-auto px-6 py-8 space-y-6 transition-[padding] duration-300 ${templatePanelOpen ? "lg:pr-[440px] xl:pr-[480px]" : ""}`}>

        {/* ===== 2-1: MAIN PORTAL HEADER ===== */}
        <div className="flex items-center justify-between">
          <div>
            <h1 data-testid="text-overview-title" className="text-3xl font-bold tracking-tight mb-1 text-foreground">{t("overview")}</h1>
            <p className="text-muted-foreground text-sm">{t("systemStatusDesc")}</p>
          </div>
          <div className="flex items-center gap-3">
            {activeTemplateId !== "default" && (
              <Badge variant="outline" className="gap-1 text-[10px] h-6 px-2 border-indigo-200 text-indigo-700 bg-indigo-50/60 dark:bg-indigo-950/30 dark:border-indigo-900 dark:text-indigo-300" data-testid="badge-active-template">
                <LayoutTemplate className="w-3 h-3" />
                {language === "ko"
                  ? (DASHBOARD_TEMPLATES.find(t => t.id === activeTemplateId)?.nameKo ?? "사용자 지정")
                  : (DASHBOARD_TEMPLATES.find(t => t.id === activeTemplateId)?.name ?? "Custom")}
              </Badge>
            )}
            <Button className="gap-2 h-9 text-sm shadow-lg shadow-primary/20" onClick={() => setTemplatePanelOpen(true)} data-testid="button-edit-template">
              <LayoutTemplate className="w-4 h-4" />
              {t("ovEditTemplate")}
            </Button>
          </div>
        </div>

        {showKpi && (
        <RoleBasedWrapper role={role} allowedRoles={["admin", "manager", "viewer"]} masked={role === "viewer"}>
          <Reorder.Group
            axis="x"
            values={visibleKpiKeys}
            onReorder={handleKpiReorder}
            as="div"
            className={`grid grid-cols-1 md:grid-cols-2 ${
              ({ 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" } as Record<number, string>)[Math.min(Math.max(visibleKpiKeys.length, 1), 4)]
            } gap-4 list-none ${editMode ? "p-3 -m-3 rounded-xl ring-2 ring-primary/20 bg-primary/[0.02]" : ""}`}
            data-testid="group-kpi-cards"
          >
            {visibleKpiKeys.map((key) => {
              const stat = kpiCardsData[key as "notes" | "links" | "dbUsage" | "resource"];
              return (
                <Reorder.Item
                  key={key}
                  value={key}
                  as="div"
                  className="relative"
                  dragListener={editMode}
                  whileDrag={{ scale: 1.03, zIndex: 40 }}
                  data-testid={`kpi-item-${key}`}
                >
                  {editMode && (
                    <>
                      <DragHandleHint language={language as "ko" | "en"} />
                      <DeleteBlockButton blockKey={key} onDelete={() => removeBlock(key)} language={language as "ko" | "en"} />
                    </>
                  )}
                  <Card className={`bg-card/80 backdrop-blur border-border shadow-sm hover:shadow-md transition-shadow h-full ${editMode ? "ring-1 ring-primary/20" : ""}`} data-testid={`card-kpi-${key}`}>
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
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </RoleBasedWrapper>
        )}

        {/* ===== 2-2 & 2-3: TIMELINE + ISSUE FEED (side by side) ===== */}
        {(showTimeline || showFeed) && (
        <div className={`grid grid-cols-1 ${showTimeline && showFeed ? "md:grid-cols-2" : "md:grid-cols-1"} gap-6`}>

          {/* 2-2: TIMELINE VIEW */}
          {showTimeline && (
          <RoleBasedWrapper role={role} allowedRoles={["admin", "manager"]}>
            <div className={`relative ${editMode ? "ring-2 ring-primary/20 ring-offset-2 ring-offset-background rounded-xl" : ""}`}>
            {editMode && (
              <>
                <BlockEditLabel blockKey="timeline" language={language as "ko" | "en"} />
                <DeleteBlockButton blockKey="timeline" onDelete={() => removeBlock("timeline")} language={language as "ko" | "en"} />
              </>
            )}
            <Card className="bg-card/80 backdrop-blur border-border shadow-sm" data-testid="card-timeline">
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
                <ScrollArea className="pr-4" style={{ height: HEIGHT_MAP[blockOptions.timeline.height] }}>
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
            </div>
          </RoleBasedWrapper>
          )}

          {/* 2-3: ISSUE FEED */}
          {showFeed && (
          <div className={`relative ${editMode ? "ring-2 ring-primary/20 ring-offset-2 ring-offset-background rounded-xl" : ""}`}>
          {editMode && (
            <>
              <BlockEditLabel blockKey="feed" language={language as "ko" | "en"} />
              <DeleteBlockButton blockKey="feed" onDelete={() => removeBlock("feed")} language={language as "ko" | "en"} />
            </>
          )}
          <Card className="bg-card/80 backdrop-blur border-border shadow-sm" data-testid="card-issue-feed">
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
              <ScrollArea className="pr-2" style={{ height: HEIGHT_MAP[blockOptions.feed.height] }}>
                <div className="space-y-3">
                  {displayedFeed.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg border border-border bg-background/50 hover:bg-secondary/30 transition-colors" data-testid={`feed-item-${item.id}`}>
                      <div className="flex items-center justify-between mb-2">
                        <FeedBadge source={item.source} t={t} />
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground">{language === "ko" ? item.timeKo : item.time}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleSubscribe(item.id); }}
                            className={`p-1 rounded-md transition-colors ${item.subscribed ? "text-emerald-600 bg-emerald-500/10" : "text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/5"}`}
                            data-testid={`button-mark-read-${item.id}`}
                            title={item.subscribed ? t("ovMarkUnread") : t("ovMarkRead")}
                          >
                            {item.subscribed ? <CheckCheck className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Avatar className="w-8 h-8 rounded-full shrink-0">
                          {item.authorImage && (
                            <AvatarImage src={item.authorImage} alt={item.authorName} className="object-cover" />
                          )}
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
          )}
        </div>
        )}

        {/* ===== 2-4: KPI / STATS MONITORING ===== */}
        {showMonitoring && (
        <RoleBasedWrapper role={role} allowedRoles={["admin", "manager"]}>
          <div className={`relative ${editMode ? "ring-2 ring-primary/20 ring-offset-2 ring-offset-background rounded-xl" : ""}`}>
          {editMode && (
            <>
              <BlockEditLabel blockKey="monitoring" language={language as "ko" | "en"} />
              <DeleteBlockButton blockKey="monitoring" onDelete={() => removeBlock("monitoring")} language={language as "ko" | "en"} />
            </>
          )}
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
              <div className={`grid grid-cols-1 gap-6 ${
                blockOptions.monitoring.charts.length === 3 ? "lg:grid-cols-3" :
                blockOptions.monitoring.charts.length === 2 ? "lg:grid-cols-2" :
                "lg:grid-cols-1"
              }`}>
                {blockOptions.monitoring.charts.includes("pie") && (
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
                )}

                {blockOptions.monitoring.charts.includes("line") && (
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
                )}

                {blockOptions.monitoring.charts.includes("bar") && (
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
                )}
              </div>
            </CardContent>
          </Card>
          </div>
        </RoleBasedWrapper>
        )}

        {!showKpi && !showTimeline && !showFeed && !showMonitoring && (
          <Card className="bg-card/60 border-dashed border-border" data-testid="card-empty-template">
            <CardContent className="py-16 flex flex-col items-center justify-center gap-3 text-center">
              <div className="p-3 rounded-full bg-muted/50 text-muted-foreground">
                <LayoutTemplate className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold mb-1">
                  {language === "ko" ? "표시할 블록이 없습니다" : "No blocks to display"}
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm">
                  {language === "ko"
                    ? "오른쪽 상단의 Edit Template 버튼을 눌러 표시할 블록을 선택하세요."
                    : "Click Edit Template at the top right to choose blocks to display."}
                </p>
              </div>
              <Button size="sm" className="mt-2 gap-1.5" onClick={() => setTemplatePanelOpen(true)} data-testid="button-empty-open-template">
                <LayoutTemplate className="w-3.5 h-3.5" />
                {t("ovEditTemplate")}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* TEMPLATE EDIT PANEL (non-modal side panel, no backdrop) */}
      {templatePanelOpen && (
        <div
          className="fixed right-0 top-0 bottom-0 w-[420px] sm:w-[460px] bg-background border-l border-border shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-300"
          data-testid="panel-template"
        >
          <div className="px-6 pt-6 pb-4 border-b border-border">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                    <LayoutTemplate className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-semibold">
                    {language === "ko" ? "대시보드 템플릿" : "Dashboard Template"}
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === "ko"
                    ? "프리셋을 선택하거나, 메인 영역에서 컴포넌트의 X 버튼으로 삭제하고 KPI 카드는 드래그로 순서를 바꿀 수 있습니다. 아래 팔레트에서 컴포넌트를 다시 추가하세요."
                    : "Pick a preset, or remove components with X in the main area and drag KPI cards to reorder. Add components back from the palette below."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTemplatePanelOpen(false)}
                className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-close-template-panel"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="px-6 py-5 space-y-6">
              {/* PRESET TEMPLATES */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    {language === "ko" ? "프리셋 템플릿" : "Preset Templates"}
                  </h3>
                  <span className="text-[10px] text-muted-foreground">
                    {DASHBOARD_TEMPLATES.length} {language === "ko" ? "개" : "presets"}
                  </span>
                </div>
                <div className="space-y-2">
                  {DASHBOARD_TEMPLATES.map((tpl) => {
                    const Icon = tpl.icon;
                    const isActive = activeTemplateId === tpl.id;
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => applyTemplate(tpl.id)}
                        data-testid={`template-${tpl.id}`}
                        className={`w-full text-left rounded-lg border transition-all p-3 group ${
                          isActive
                            ? `bg-gradient-to-br ${tpl.accent} border-2 shadow-sm`
                            : "border-border bg-background hover:bg-muted/40 hover:border-foreground/20"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`p-1.5 rounded-md ${isActive ? "bg-background/80" : "bg-muted/60"} text-foreground shrink-0`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-sm font-semibold">
                                {language === "ko" ? tpl.nameKo : tpl.name}
                              </h4>
                              {isActive && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 dark:text-indigo-300">
                                  <Check className="w-3 h-3" />
                                  {language === "ko" ? "사용 중" : "Active"}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                              {language === "ko" ? tpl.descriptionKo : tpl.description}
                            </p>
                            {/* Mini stacked previews */}
                            <div className="mt-2.5 space-y-1 p-2 rounded-md bg-background/60 border border-border/60">
                              {tpl.blocks.length === 0 && (
                                <div className="text-[10px] text-muted-foreground/60 italic text-center py-1.5">
                                  {language === "ko" ? "표시 없음" : "Nothing"}
                                </div>
                              )}
                              {(() => {
                                const kpis = tpl.blocks.filter(isKpiKey);
                                const others = tpl.blocks.filter(b => !isKpiKey(b));
                                const rows: Array<{ key: string; label: string; preview: BlockKey }> = [];
                                if (kpis.length > 0) {
                                  rows.push({
                                    key: "kpi-group",
                                    label: language === "ko" ? `KPI 카드 (${kpis.length})` : `KPI Cards (${kpis.length})`,
                                    preview: kpis[0],
                                  });
                                }
                                others.forEach(b => rows.push({
                                  key: b,
                                  label: language === "ko" ? BLOCK_META[b].labelKo : BLOCK_META[b].label,
                                  preview: b,
                                }));
                                return rows.map(r => (
                                  <div key={r.key} className="flex items-center gap-2">
                                    <BlockPreview type={r.preview} className="w-14 h-5 shrink-0" />
                                    <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">
                                      {r.label}
                                    </span>
                                  </div>
                                ));
                              })()}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AVAILABLE COMPONENTS PALETTE */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    {language === "ko" ? "사용 가능한 컴포넌트" : "Available Components"}
                  </h3>
                  {activeTemplateId === "custom" && (
                    <Badge variant="outline" className="text-[9px] h-4 px-1.5 gap-1 border-amber-200 text-amber-700 bg-amber-50/60 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-300">
                      <Sparkle className="w-2.5 h-2.5" />
                      {language === "ko" ? "사용자 지정" : "Custom"}
                    </Badge>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed mb-2.5">
                  {language === "ko"
                    ? "추가하려면 컴포넌트를 클릭하세요. 삭제는 메인 영역에서 각 컴포넌트의 X 버튼을 누르면 됩니다. KPI 카드는 드래그로 순서를 바꿀 수 있습니다."
                    : "Click a component to add it. To remove, press X on the component in the main area. KPI cards can be reordered by dragging."}
                </p>
                {(() => {
                  const allKeys = (["notes", "links", "dbUsage", "resource", "timeline", "feed", "monitoring"] as BlockKey[]);
                  const hidden = allKeys.filter(k => !visibleBlocks.includes(k));
                  const visible = allKeys.filter(k => visibleBlocks.includes(k));
                  return (
                    <div className="space-y-3">
                      {hidden.length > 0 && (
                        <div>
                          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <Plus className="w-3 h-3" />
                            {language === "ko" ? "추가할 수 있는 컴포넌트" : "Available to add"}
                          </div>
                          <div className="space-y-1.5">
                            {hidden.map((b) => {
                              const meta = BLOCK_META[b];
                              const Icon = meta.icon;
                              return (
                                <button
                                  key={b}
                                  type="button"
                                  onClick={() => addBlock(b)}
                                  className="w-full rounded-lg border border-dashed border-border bg-muted/10 hover:border-primary/50 hover:bg-primary/5 transition-colors overflow-hidden text-left group"
                                  data-testid={`button-add-component-${b}`}
                                >
                                  <div className="flex items-stretch">
                                    <div className="shrink-0 w-20 flex items-center justify-center px-2 border-r border-dashed border-border bg-muted/10 opacity-70 group-hover:opacity-100">
                                      <BlockPreview type={b} className="w-16 h-7" />
                                    </div>
                                    <div className="flex-1 flex items-center gap-2 p-3 min-w-0">
                                      <div className="p-1.5 rounded-md shrink-0 bg-muted/40 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary">
                                        <Icon className="w-3.5 h-3.5" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold flex items-center gap-1.5 text-muted-foreground group-hover:text-foreground">
                                          {language === "ko" ? meta.labelKo : meta.label}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground leading-snug truncate">
                                          {language === "ko" ? meta.descKo : meta.desc}
                                        </p>
                                      </div>
                                      <div className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full border border-primary/30 bg-background text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <Plus className="w-3.5 h-3.5" />
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {visible.length > 0 && (
                        <div>
                          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-emerald-600" />
                            {language === "ko" ? "현재 레이아웃에 있음" : "In current layout"}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {visible.map((b) => {
                              const meta = BLOCK_META[b];
                              const Icon = meta.icon;
                              return (
                                <span
                                  key={b}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-border bg-background text-[11px] font-medium"
                                  data-testid={`badge-active-${b}`}
                                >
                                  <Icon className="w-3 h-3 text-primary" />
                                  {language === "ko" ? meta.labelKo : meta.label}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {hidden.length === 0 && (
                        <div className="text-[11px] text-muted-foreground text-center py-3 border border-dashed border-border rounded-md bg-muted/10">
                          {language === "ko"
                            ? "모든 컴포넌트가 이미 레이아웃에 있습니다."
                            : "All components are already in the layout."}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </ScrollArea>

          <div className="px-6 py-3 border-t border-border bg-muted/20 flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => { applyTemplate("default"); setBlockOptions(DEFAULT_BLOCK_OPTIONS); }}
              data-testid="button-template-reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {language === "ko" ? "기본값" : "Reset"}
            </Button>
            <Button
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => setTemplatePanelOpen(false)}
              data-testid="button-template-apply"
            >
              <Check className="w-3.5 h-3.5" />
              {language === "ko" ? "완료" : "Done"}
            </Button>
          </div>
        </div>
      )}

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
