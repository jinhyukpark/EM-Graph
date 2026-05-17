import { useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
  DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent,
  DropdownMenuRadioGroup, DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Sparkles, Filter, Search, Circle, CheckCircle2,
  FileText, Flag, ChevronDown, Pencil, CalendarDays, Bell, UserRound,
  AlertTriangle, Flag as FlagIcon, RotateCcw, ListTodo,
  ChevronUp, ChevronsUpDown, MoreHorizontal, Trash2, CalendarRange, X,
} from "lucide-react";

type Priority = "high" | "medium" | "low" | null;

type Task = {
  id: string;
  title: string;
  due: string | null;
  start: string | null;
  note: string | null;
  assignee: string | null;
  assignees: string[];
  priority: Priority;
  done: boolean;
};

const SEED: Task[] = [
  { id: "t1", title: "장외거래 중개업 신청", due: "2026-05-19", start: "2026-05-15", note: "테크스톰 - STO 사업 검토", assignee: "박지훈", assignees: ["박지훈", "김민서", "최수정", "이도현"], priority: "high", done: false },
  { id: "t2", title: "특허 mcp 홍보", due: null, start: null, note: "해야 할 일 모음", assignee: null, assignees: ["박지훈"], priority: "medium", done: false },
  { id: "t3", title: "스톡 게임 적용", due: null, start: null, note: "해야 할 일 모음", assignee: null, assignees: ["김민서", "최수정"], priority: "medium", done: false },
  { id: "t4", title: "스톡 마케팅", due: null, start: null, note: "해야 할 일 모음", assignee: null, assignees: [], priority: "low", done: false },
  { id: "t5", title: "홈페이지 개편 em 솔루션 기반", due: "2026-05-30", start: "2026-05-17", note: "해야 할 일 모음", assignee: "김민서", assignees: ["김민서", "정해린", "박지훈", "이도현", "최수정"], priority: "high", done: false },
  { id: "t6", title: "회사소개서 포맷", due: null, start: null, note: "해야 할 일 모음", assignee: null, assignees: ["정해린"], priority: "low", done: false },
  { id: "t7", title: "반도체 fdc 사업 진행", due: "2026-06-10", start: "2026-05-20", note: "해야 할 일 모음", assignee: "최수정", assignees: ["최수정", "김민서", "박지훈"], priority: "high", done: false },
  { id: "t8", title: "제품소개서 (data, graph, gpt)", due: null, start: null, note: "해야 할 일 모음", assignee: null, assignees: ["박지훈", "이도현"], priority: "medium", done: false },
  { id: "t9", title: "자외거래 중개업", due: null, start: null, note: "해야 할 일 모음", assignee: null, assignees: [], priority: "low", done: false },
  { id: "t10", title: "재호님 작업 관련 내용 확인", due: "2026-05-10", start: "2026-05-08", note: "260510-내부 프로젝트 검수 노트", assignee: "이도현", assignees: ["이도현"], priority: "medium", done: true },
  { id: "t11", title: "PET필름 #3 라인 가동률 보고서", due: "2026-05-22", start: "2026-05-18", note: "PET필름 주간 운영회의 W20", assignee: "김민서", assignees: ["김민서", "박지훈", "최수정", "정해린"], priority: "high", done: false },
  { id: "t12", title: "아라미드 단가 협상 회신", due: "2026-05-18", start: "2026-05-14", note: "아라미드 단가 협상 전략 Q3", assignee: "박지훈", assignees: ["박지훈", "정해린"], priority: "high", done: false },
  { id: "t13", title: "MOQ 정책 개정 초안 사내 공유", due: "2026-05-25", start: "2026-05-20", note: "MOQ 정책 개정 초안", assignee: "정해린", assignees: ["정해린", "이도현", "김민서"], priority: "medium", done: false },
];

const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

function colorFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function avatarUrl(name: string) {
  const seed = encodeURIComponent(name);
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&backgroundColor=c0aede,b6e3f4,ffd5dc,d1d4f9,ffdfbf,c1f0c6&radius=50`;
}

function ProfileAvatar({ name, size = 28, ring = false }: { name: string; size?: number; ring?: boolean }) {
  return (
    <img
      src={avatarUrl(name)}
      alt={name}
      title={name}
      width={size}
      height={size}
      className={`rounded-full bg-muted object-cover ${ring ? "ring-2 ring-card" : ""}`}
      style={{ width: size, height: size }}
      data-testid={`avatar-${name}`}
    />
  );
}

function AvatarStack({ names, max = 3 }: { names: string[]; max?: number }) {
  if (names.length === 0) return <span className="text-muted-foreground/60">-</span>;
  const shown = names.slice(0, max);
  const overflow = names.length - shown.length;
  return (
    <div className="flex items-center">
      {shown.map((n, i) => (
        <span
          key={`${n}-${i}`}
          className="inline-block"
          style={{ marginLeft: i === 0 ? 0 : -8 }}
        >
          <ProfileAvatar name={n} size={28} ring />
        </span>
      ))}
      {overflow > 0 && (
        <span
          className="w-7 h-7 rounded-full inline-flex items-center justify-center text-[11px] font-semibold bg-muted text-foreground/70 ring-2 ring-card"
          style={{ marginLeft: -8 }}
          title={names.slice(max).join(", ")}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}

const TABS = ["My Tasks", "By Notebook", "Notes", "Today", "Assigned", "Overdue"] as const;
type Tab = (typeof TABS)[number];

const PRIORITY_STYLE: Record<NonNullable<Priority>, { dot: string; label: string; text: string }> = {
  high: { dot: "bg-rose-500", label: "High", text: "text-rose-600" },
  medium: { dot: "bg-amber-500", label: "Medium", text: "text-amber-600" },
  low: { dot: "bg-slate-400", label: "Low", text: "text-slate-500" },
};

function formatDate(d: string | null, overdue = false) {
  if (!d) return <span className="text-muted-foreground/60">-</span>;
  const date = new Date(d);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const day = date.getDate();
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const label = `${MONTHS[m - 1]} ${day}, ${y}`;
  return <span className={overdue ? "text-rose-500" : "text-foreground/90"}>{label}</span>;
}

const GRID_COLS = "grid-cols-[36px_1.7fr_0.95fr_0.95fr_1.2fr_0.85fr_0.95fr_0.7fr_36px]";

type SortKey = "title" | "due" | "start" | "note" | "assignee" | "assignees" | "priority";
type SortDir = "asc" | "desc";
const PRIORITY_RANK: Record<NonNullable<Priority>, number> = { high: 3, medium: 2, low: 1 };

type RangeShortcut = { key: string; label: string; days: number };
const RANGE_SHORTCUTS: RangeShortcut[] = [
  { key: "today", label: "Today", days: 0 },
  { key: "7d", label: "7d", days: 7 },
  { key: "2w", label: "2w", days: 14 },
  { key: "1m", label: "1m", days: 30 },
  { key: "6m", label: "6m", days: 180 },
];

function fmtDateShort(d: Date) {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function localYmd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>(SEED);
  const [tab, setTab] = useState<Tab>("My Tasks");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [createOpen, setCreateOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [activeShortcut, setActiveShortcut] = useState<string | null>(null);
  const [rangeOpen, setRangeOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterRepeat, setFilterRepeat] = useState(false);
  const [filterFlag, setFilterFlag] = useState(false);
  const [filterDone, setFilterDone] = useState(false);
  const [filterDue, setFilterDue] = useState<"all" | "today" | "week" | "overdue">("all");
  const [filterPriority, setFilterPriority] = useState<"all" | "high" | "medium" | "low">("all");
  const [includeShared, setIncludeShared] = useState(true);
  const [includeDone, setIncludeDone] = useState(true);

  const filterActiveCount =
    (filterRepeat ? 1 : 0) +
    (filterFlag ? 1 : 0) +
    (filterDone ? 1 : 0) +
    (filterDue !== "all" ? 1 : 0) +
    (filterPriority !== "all" ? 1 : 0);

  const applyShortcut = (s: RangeShortcut) => {
    const today = startOfDay(new Date());
    if (s.days === 0) {
      setRange({ from: today, to: today });
    } else {
      const to = new Date(today);
      to.setDate(to.getDate() + s.days);
      setRange({ from: today, to });
    }
    setActiveShortcut(s.key);
  };
  const clearRange = () => {
    setRange(undefined);
    setActiveShortcut(null);
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const clearSelection = () => setSelectedIds(new Set());
  const bulkDelete = () => {
    setTasks((prev) => prev.filter((t) => !selectedIds.has(t.id)));
    clearSelection();
  };

  const addTask = (t: Omit<Task, "id" | "done">) => {
    setTasks((prev) => [
      { ...t, id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, done: false },
      ...prev,
    ]);
  };
  const today = new Date();
  const selected = tasks.find((t) => t.id === selectedId) ?? null;

  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
      setSortDir("asc");
    }
  };

  const updateTask = (id: string, patch: Partial<Task>) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setSelectedId((cur) => (cur === id ? null : cur));
    setSelectedIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    let list = tasks;
    if (tab === "Today") {
      const k = localYmd(today);
      list = list.filter((t) => t.due === k || t.start === k);
    } else if (tab === "Assigned") {
      list = list.filter((t) => !!t.assignee);
    } else if (tab === "Notes") {
      list = list.filter((t) => !!t.note);
    } else if (tab === "Overdue") {
      const k = localYmd(today);
      list = list.filter((t) => !!t.due && t.due < k && !t.done);
    }
    if (range?.from) {
      const fromKey = localYmd(range.from);
      const toKey = localYmd(range.to ?? range.from);
      list = list.filter((t) => {
        if (!t.due) return false;
        return t.due >= fromKey && t.due <= toKey;
      });
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.note ?? "").toLowerCase().includes(q) ||
          (t.assignee ?? "").toLowerCase().includes(q)
      );
    }
    if (sortKey) {
      const dir = sortDir === "asc" ? 1 : -1;
      const cmp = (a: Task, b: Task): number => {
        const empty = (v: unknown) => v === null || v === undefined || v === "";
        const get = (t: Task): string | number | null => {
          switch (sortKey) {
            case "title": return t.title;
            case "due": return t.due ?? null;
            case "start": return t.start ?? null;
            case "note": return t.note ?? null;
            case "assignee": return t.assignee ?? null;
            case "assignees": return t.assignees.length === 0 ? null : t.assignees.length;
            case "priority": return t.priority ? PRIORITY_RANK[t.priority] : null;
          }
        };
        const va = get(a);
        const vb = get(b);
        if (empty(va) && !empty(vb)) return 1;
        if (!empty(va) && empty(vb)) return -1;
        if (typeof va === "number" && typeof vb === "number") return (va - vb) * dir;
        return String(va).localeCompare(String(vb), "ko") * dir;
      };
      list = [...list].sort(cmp);
    }
    return list;
  }, [tasks, tab, search, sortKey, sortDir, range]);

  const visibleIds = filtered.map((t) => t.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));
  const someVisibleSelected = visibleIds.some((id) => selectedIds.has(id));
  const toggleSelectAllVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        visibleIds.forEach((id) => next.delete(id));
      } else {
        visibleIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const toggle = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const openCount = tasks.filter((x) => !x.done).length;
  const doneCount = tasks.length - openCount;
  const todayKey = localYmd(today);
  const overdueCount = tasks.filter((t) => !!t.due && t.due < todayKey && !t.done).length;
  const progressPct = tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100);

  return (
    <Layout>
      <div className="h-full flex flex-col bg-background">
        {/* Page Header (Brain Market style) */}
        <div className="border-b border-border bg-card/50 px-8 py-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3" data-testid="text-todo-title">
                <ListTodo className="w-8 h-8 text-violet-600" />
                To-Do List
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl text-base">
                Track all your team's tasks in one place. See due dates, assignees, and priorities at a glance,
                and quickly handle tasks linked to notes.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-4 px-4 py-2.5 rounded-xl border border-border/60 bg-card shadow-sm"
                data-testid="status-summary"
              >
                <div className="flex items-center gap-2" data-testid="status-overdue">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-xs text-muted-foreground">Overdue</span>
                  <span className="text-sm font-semibold text-rose-600 tabular-nums">{overdueCount}</span>
                </div>
                <div className="h-6 w-px bg-border/70" />
                <div className="flex items-center gap-2" data-testid="status-done">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs text-muted-foreground">Done</span>
                  <span className="text-sm font-semibold text-emerald-600 tabular-nums">
                    {doneCount}<span className="text-muted-foreground/70 font-normal">/{tasks.length}</span>
                  </span>
                </div>
                <div className="h-6 w-px bg-border/70" />
                <div className="flex items-center gap-2 min-w-[140px]" data-testid="status-progress">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-violet-500 transition-all"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-foreground tabular-nums w-9 text-right">{progressPct}%</span>
                </div>
              </div>
              <Button
                size="lg"
                onClick={() => setCreateOpen(true)}
                className="gap-2 shadow-lg bg-violet-600 hover:bg-violet-700 text-white"
                data-testid="button-new-task"
              >
                <Sparkles className="w-5 h-5" />
                New Task
              </Button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex items-center gap-4 mt-2">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-10 h-11 bg-background shadow-sm border-muted-foreground/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search-task"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`h-11 gap-2 px-4 ${filterActiveCount > 0 ? "border-violet-400 text-violet-700 bg-violet-50/50" : ""}`}
                  data-testid="button-filter"
                >
                  <Filter className="w-4 h-4" />
                  Filter
                  {filterActiveCount > 0 && (
                    <span className="ml-0.5 h-5 min-w-5 px-1.5 rounded-full bg-violet-600 text-white text-[10px] font-semibold inline-flex items-center justify-center">
                      {filterActiveCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 p-2">
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground px-2 pt-1 pb-2">
                  Filter by
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onSelect={(e) => { e.preventDefault(); setFilterRepeat((v) => !v); }}
                  className={`gap-2.5 py-2 px-2 rounded-md ${filterRepeat ? "bg-violet-50 text-violet-700" : ""}`}
                  data-testid="filter-repeat"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="flex-1">Repeat</span>
                  {filterRepeat && <CheckCircle2 className="w-4 h-4 text-violet-600" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => { e.preventDefault(); setFilterFlag((v) => !v); }}
                  className={`gap-2.5 py-2 px-2 rounded-md ${filterFlag ? "bg-violet-50 text-violet-700" : ""}`}
                  data-testid="filter-flag"
                >
                  <Flag className="w-4 h-4" />
                  <span className="flex-1">Flag</span>
                  {filterFlag && <CheckCircle2 className="w-4 h-4 text-violet-600" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => { e.preventDefault(); setFilterDone((v) => !v); }}
                  className={`gap-2.5 py-2 px-2 rounded-md ${filterDone ? "bg-violet-50 text-violet-700" : ""}`}
                  data-testid="filter-done"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="flex-1">Done</span>
                  {filterDone && <CheckCircle2 className="w-4 h-4 text-violet-600" />}
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className={`gap-2.5 py-2 px-2 rounded-md ${filterDue !== "all" ? "bg-violet-50 text-violet-700" : ""}`} data-testid="filter-due-trigger">
                    <CalendarDays className="w-4 h-4" />
                    <span className="flex-1">Due Date</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-40">
                    <DropdownMenuRadioGroup value={filterDue} onValueChange={(v) => setFilterDue(v as typeof filterDue)}>
                      <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="today">Due Today</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="week">This Week</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="overdue">Overdue</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className={`gap-2.5 py-2 px-2 rounded-md ${filterPriority !== "all" ? "bg-violet-50 text-violet-700" : ""}`} data-testid="filter-priority-trigger">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="flex-1">Priority</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-40">
                    <DropdownMenuRadioGroup value={filterPriority} onValueChange={(v) => setFilterPriority(v as typeof filterPriority)}>
                      <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="high">High</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="medium">Medium</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="low">Low</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground px-2 pt-1 pb-2">
                  Include
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onSelect={(e) => { e.preventDefault(); setIncludeShared((v) => !v); }}
                  className="gap-2.5 py-2 px-2 rounded-md text-violet-600 font-medium focus:text-violet-700"
                  data-testid="filter-include-shared"
                >
                  <span className="flex-1">Notes Shared With Me</span>
                  {includeShared && <CheckCircle2 className="w-4 h-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => { e.preventDefault(); setIncludeDone((v) => !v); }}
                  className="gap-2.5 py-2 px-2 rounded-md text-violet-600 font-medium focus:text-violet-700"
                  data-testid="filter-include-done"
                >
                  <span className="flex-1">Completed</span>
                  {includeDone && <CheckCircle2 className="w-4 h-4" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-1.5">
              {RANGE_SHORTCUTS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => applyShortcut(s)}
                  className={`h-9 px-3 rounded-md text-xs font-medium transition-colors ${
                    activeShortcut === s.key
                      ? "bg-violet-600 text-white shadow-sm"
                      : "bg-muted/50 text-foreground/70 hover:bg-muted"
                  }`}
                  data-testid={`shortcut-${s.key}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <Popover open={rangeOpen} onOpenChange={setRangeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`h-11 gap-2 px-4 ${range?.from ? "border-violet-400 text-violet-700 bg-violet-50/50" : ""}`}
                  data-testid="button-date-range"
                >
                  <CalendarRange className="w-4 h-4" />
                  {range?.from ? (
                    range.to && range.to.getTime() !== range.from.getTime()
                      ? `${fmtDateShort(range.from)} - ${fmtDateShort(range.to)}`
                      : fmtDateShort(range.from)
                  ) : (
                    "All time"
                  )}
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  key={rangeOpen ? "open" : "closed"}
                  mode="range"
                  captionLayout="dropdown"
                  startMonth={new Date(new Date().getFullYear() - 5, 0)}
                  endMonth={new Date(new Date().getFullYear() + 5, 11)}
                  defaultMonth={range?.from ?? new Date()}
                  selected={range}
                  onSelect={(r) => {
                    setRange(r);
                    setActiveShortcut(null);
                  }}
                  numberOfMonths={2}
                  className="[--cell-size:2.5rem] p-4"
                />
                <div className="border-t border-border/60 px-3 py-2 flex items-center justify-between">
                  <button
                    onClick={clearRange}
                    className="text-xs text-muted-foreground hover:text-foreground"
                    data-testid="button-clear-range"
                  >
                    Reset
                  </button>
                  <Button size="sm" onClick={() => setRangeOpen(false)} data-testid="button-apply-range">
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-4 flex justify-center">
              <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="h-11">
                <TabsList className="h-11 bg-muted/50">
                  {TABS.map((label) => (
                    <TabsTrigger key={label} value={label} className="h-9" data-testid={`tab-${label}`}>
                      {label}
                      {label === "My Tasks" && (
                        <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 h-4 min-w-[18px] text-[10px] bg-violet-100 text-violet-700 border-0">
                          {openCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            {selectedIds.size > 0 && (
              <div className="mb-3 flex items-center justify-between px-4 py-2.5 bg-violet-50 border border-violet-200 rounded-lg" data-testid="bulk-action-bar">
                <div className="flex items-center gap-3 text-sm text-violet-900">
                  <span className="font-semibold">{selectedIds.size} selected</span>
                  <button
                    onClick={clearSelection}
                    className="inline-flex items-center gap-1 text-xs text-violet-700 hover:text-violet-900"
                    data-testid="button-clear-selection"
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear selection
                  </button>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={bulkDelete}
                  className="gap-1.5"
                  data-testid="button-bulk-delete"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete selected
                </Button>
              </div>
            )}
            <div className="border border-border/60 rounded-xl overflow-hidden bg-card">
            <div className={`grid ${GRID_COLS} gap-x-2 px-6 py-3 text-xs font-semibold text-muted-foreground bg-muted/30 border-b border-border/60 items-center`}>
              <div className="flex items-center justify-center">
                <Checkbox
                  checked={allVisibleSelected ? true : (someVisibleSelected ? "indeterminate" : false)}
                  onCheckedChange={toggleSelectAllVisible}
                  data-testid="checkbox-select-all"
                  aria-label="Select all"
                />
              </div>
              <SortHeader label="Title" sortKey="title" current={sortKey} dir={sortDir} onClick={toggleSort} />
              <SortHeader label="Due Date" sortKey="due" current={sortKey} dir={sortDir} onClick={toggleSort} />
              <SortHeader label="Start Date" sortKey="start" current={sortKey} dir={sortDir} onClick={toggleSort} />
              <SortHeader label="Linked Note" sortKey="note" current={sortKey} dir={sortDir} onClick={toggleSort} />
              <SortHeader label="Author" sortKey="assignee" current={sortKey} dir={sortDir} onClick={toggleSort} />
              <SortHeader label="Assignees" sortKey="assignees" current={sortKey} dir={sortDir} onClick={toggleSort} />
              <SortHeader label="Priority" sortKey="priority" current={sortKey} dir={sortDir} onClick={toggleSort} />
              <div />
            </div>

            <ul>
              {filtered.map((t) => {
                const isOverdue =
                  !!t.due && !t.done && new Date(t.due) < new Date(today.toDateString());
                return (
                  <li
                    key={t.id}
                    onClick={() => setSelectedId(t.id)}
                    className={`grid ${GRID_COLS} gap-x-2 items-center px-6 py-3.5 text-sm border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors group cursor-pointer ${
                      selectedIds.has(t.id) ? "bg-violet-50/40" : ""
                    }`}
                    data-testid={`row-task-${t.id}`}
                  >
                    {/* Checkbox */}
                    <div
                      className="flex items-center justify-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={selectedIds.has(t.id)}
                        onCheckedChange={() => toggleSelected(t.id)}
                        data-testid={`checkbox-task-${t.id}`}
                        aria-label="Select task"
                      />
                    </div>
                    {/* 제목 */}
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggle(t.id); }}
                        className="shrink-0"
                        data-testid={`toggle-task-${t.id}`}
                        aria-label="Toggle done"
                      >
                        {t.done ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground/50 group-hover:text-muted-foreground" />
                        )}
                      </button>
                      <span
                        className={`truncate text-[15px] ${
                          t.done ? "line-through text-muted-foreground/60" : "text-foreground"
                        }`}
                      >
                        {t.title}
                      </span>
                    </div>

                    {/* 마감일 */}
                    <div className="text-sm">{formatDate(t.due, isOverdue)}</div>

                    {/* 시작일 */}
                    <div className="text-sm">{formatDate(t.start)}</div>

                    {/* 지정된 노트 */}
                    <div className="text-sm min-w-0">
                      {t.note ? (
                        <span className="inline-flex items-center gap-2 text-foreground/80 truncate">
                          <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="truncate">{t.note}</span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground/60">-</span>
                      )}
                    </div>

                    {/* 작성자 */}
                    <div className="text-sm">
                      {t.assignee ? (
                        <span className="inline-flex items-center gap-2">
                          <ProfileAvatar name={t.assignee} size={28} />
                          <span className="text-foreground/90">{t.assignee}</span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground/60">-</span>
                      )}
                    </div>

                    {/* 지정된 사람 */}
                    <div className="text-sm">
                      <AvatarStack names={t.assignees} />
                    </div>

                    {/* 중요도 */}
                    <div className="text-sm">
                      {t.priority ? (
                        <span className={`inline-flex items-center gap-1.5 ${PRIORITY_STYLE[t.priority].text}`}>
                          <Flag className="w-3.5 h-3.5" />
                          {PRIORITY_STYLE[t.priority].label}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/60">-</span>
                      )}
                    </div>

                    {/* Row actions */}
                    <div
                      className="flex items-center justify-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="h-7 w-7 rounded-md inline-flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity"
                            data-testid={`button-row-menu-${t.id}`}
                            aria-label="Task menu"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem
                            onSelect={() => setSelectedId(t.id)}
                            data-testid={`menu-edit-${t.id}`}
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onSelect={() => deleteTask(t.id)}
                            className="text-rose-600 focus:text-rose-700 focus:bg-rose-50"
                            data-testid={`menu-delete-${t.id}`}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </li>
                );
              })}
              {filtered.length === 0 && (
                <li className="px-5 py-10 text-center text-sm text-muted-foreground">
                  No tasks to show.
                </li>
              )}
            </ul>
            </div>
          </div>
        </div>
      </div>

      <TaskDetailDialog
        task={selected}
        onClose={() => setSelectedId(null)}
        onChange={(patch) => selected && updateTask(selected.id, patch)}
        onDelete={() => selected && deleteTask(selected.id)}
      />

      <CreateTaskDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(t) => { addTask(t); setCreateOpen(false); }}
      />
    </Layout>
  );
}

function SortHeader({
  label, sortKey, current, dir, onClick,
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey | null;
  dir: SortDir;
  onClick: (k: SortKey) => void;
}) {
  const active = current === sortKey;
  return (
    <button
      onClick={() => onClick(sortKey)}
      className={`inline-flex items-center gap-1 text-left hover:text-foreground transition-colors ${
        active ? "text-foreground" : ""
      }`}
      data-testid={`sort-${sortKey}`}
    >
      {label}
      {active ? (
        dir === "asc" ? (
          <ChevronUp className="w-3.5 h-3.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" />
        )
      ) : (
        <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />
      )}
    </button>
  );
}

function Chip({
  active, onClick, children, icon: Icon,
}: { active?: boolean; onClick?: () => void; children: React.ReactNode; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <button
      onClick={onClick}
      className={`h-8 px-3 inline-flex items-center gap-1.5 rounded-full text-xs transition-colors ${
        active
          ? "bg-violet-100 text-violet-700 border border-violet-200"
          : "bg-muted/60 text-foreground/80 border border-transparent hover:bg-muted"
      }`}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </button>
  );
}

function TaskDetailDialog({
  task, onClose, onChange, onDelete,
}: {
  task: Task | null;
  onClose: () => void;
  onChange: (patch: Partial<Task>) => void;
  onDelete: () => void;
}) {
  if (!task) return null;
  const todayKey = new Date().toISOString().slice(0, 10);
  const tomorrowKey = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const isFlagged = task.priority === "high";

  return (
    <Dialog open={!!task} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-[640px] p-0 gap-0 rounded-2xl overflow-hidden" data-testid="dialog-task-detail">
        <div className="p-7">
          {/* Notebook chip */}
          <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-5" data-testid="button-notebook">
            <FileText className="w-3.5 h-3.5" />
            {task.note ?? "To-Do"}
            <ChevronDown className="w-3 h-3" />
          </button>

          {/* Title row */}
          <div className="flex items-center gap-3 mb-7">
            <button
              onClick={() => onChange({ done: !task.done })}
              className="shrink-0"
              data-testid="button-toggle-done"
              aria-label="Toggle done"
            >
              {task.done ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              ) : (
                <Circle className="w-6 h-6 text-muted-foreground/40 hover:text-muted-foreground" />
              )}
            </button>
            <input
              value={task.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className={`flex-1 text-xl font-semibold bg-transparent outline-none ${
                task.done ? "line-through text-muted-foreground" : "text-foreground"
              }`}
              data-testid="input-task-title"
            />
          </div>

          <div className="space-y-5">
            {/* Description */}
            <Row icon={Pencil} label="Description">
              <Textarea
                placeholder="What is this task about?"
                className="resize-none min-h-[72px] text-sm rounded-lg"
                data-testid="textarea-description"
              />
            </Row>

            {/* Due Date */}
            <Row icon={CalendarDays} label="Due Date">
              <div className="flex flex-wrap gap-2">
                <Chip active={task.due === todayKey} onClick={() => onChange({ due: todayKey })}>Today</Chip>
                <Chip active={task.due === tomorrowKey} onClick={() => onChange({ due: tomorrowKey })}>Tomorrow</Chip>
                <Chip icon={Pencil}>Custom</Chip>
                <Chip icon={RotateCcw}>Repeat</Chip>
              </div>
            </Row>

            {/* Alert */}
            <Row icon={Bell} label="Alert">
              <div className="flex flex-wrap gap-2">
                <Chip>In 1 hour</Chip>
                <Chip>In 4 hours</Chip>
                <Chip icon={Pencil}>Custom</Chip>
              </div>
            </Row>

            {/* Assignee */}
            <Row icon={UserRound} label="Assignee">
              {task.assignee ? (
                <span className="inline-flex items-center gap-2 text-sm">
                  <ProfileAvatar name={task.assignee} size={24} />
                  {task.assignee}
                </span>
              ) : (
                <button className="text-sm text-muted-foreground hover:text-foreground" data-testid="button-assign">
                  Assign
                </button>
              )}
            </Row>

            {/* Priority */}
            <Row icon={AlertTriangle} label="Priority">
              <div className="flex flex-wrap gap-2">
                <Chip active={task.priority === "low"} onClick={() => onChange({ priority: "low" })}>Low</Chip>
                <Chip active={task.priority === "medium"} onClick={() => onChange({ priority: "medium" })}>Medium</Chip>
                <Chip active={task.priority === "high"} onClick={() => onChange({ priority: "high" })}>High</Chip>
              </div>
            </Row>

            {/* Flag */}
            <Row icon={FlagIcon} label="Flag">
              <Switch
                checked={isFlagged}
                onCheckedChange={(v) => onChange({ priority: v ? "high" : (task.priority === "high" ? null : task.priority) })}
                data-testid="switch-flag"
              />
            </Row>
          </div>

          <div className="mt-7 text-xs text-muted-foreground">
            Created by: jh.park@illunex.com
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-border/60 flex items-center justify-between">
          <button
            onClick={onDelete}
            className="text-sm text-rose-600 hover:text-rose-700"
            data-testid="button-delete-task"
          >
            Delete task
          </button>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose} className="rounded-lg" data-testid="button-cancel">
              Cancel
            </Button>
            <Button onClick={onClose} className="rounded-lg bg-violet-600 hover:bg-violet-700 text-white" data-testid="button-save">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CreateTaskDialog({
  open, onClose, onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (t: Omit<Task, "id" | "done">) => void;
}) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const tomorrowKey = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [due, setDue] = useState<string | null>(null);
  const [assignee, setAssignee] = useState<string | null>(null);
  const [priority, setPriority] = useState<Priority>(null);
  const [flagged, setFlagged] = useState(false);

  const reset = () => {
    setTitle(""); setDescription(""); setDue(null);
    setAssignee(null); setPriority(null); setFlagged(false);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleCreate = () => {
    if (!title.trim()) return;
    onCreate({
      title: title.trim(),
      due,
      start: null,
      note: "To-Do",
      assignee,
      assignees: assignee ? [assignee] : [],
      priority: flagged ? "high" : priority,
    });
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-[640px] p-0 gap-0 rounded-2xl overflow-hidden" data-testid="dialog-create-task">
        <div className="p-7">
          {/* Notebook chip */}
          <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-5" data-testid="button-create-notebook">
            <FileText className="w-3.5 h-3.5" />
            To-Do
            <ChevronDown className="w-3 h-3" />
          </button>

          {/* Title row */}
          <div className="flex items-center gap-3 mb-7">
            <Circle className="w-6 h-6 text-muted-foreground/40 shrink-0" />
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a task"
              className="flex-1 text-xl font-semibold bg-transparent outline-none placeholder:text-muted-foreground/60"
              data-testid="input-create-title"
            />
          </div>

          <div className="space-y-5">
            <Row icon={Pencil} label="Description">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this task about?"
                className="resize-none min-h-[72px] text-sm rounded-lg"
                data-testid="textarea-create-description"
              />
            </Row>

            <Row icon={CalendarDays} label="Due Date">
              <div className="flex flex-wrap gap-2">
                <Chip active={due === todayKey} onClick={() => setDue(due === todayKey ? null : todayKey)}>Today</Chip>
                <Chip active={due === tomorrowKey} onClick={() => setDue(due === tomorrowKey ? null : tomorrowKey)}>Tomorrow</Chip>
                <Chip icon={Pencil}>Custom</Chip>
                <Chip icon={RotateCcw}>Repeat</Chip>
              </div>
            </Row>

            <Row icon={Bell} label="Alert">
              <div className="flex flex-wrap gap-2">
                <Chip>In 1 hour</Chip>
                <Chip>In 4 hours</Chip>
                <Chip icon={Pencil}>Custom</Chip>
              </div>
            </Row>

            <Row icon={UserRound} label="Assignee">
              {assignee ? (
                <button
                  onClick={() => setAssignee(null)}
                  className="inline-flex items-center gap-2 text-sm"
                  data-testid="button-create-assignee"
                >
                  <ProfileAvatar name={assignee} size={24} />
                  {assignee}
                </button>
              ) : (
                <button
                  onClick={() => setAssignee("박지훈")}
                  className="text-sm text-muted-foreground hover:text-foreground"
                  data-testid="button-create-assign"
                >
                  Assign
                </button>
              )}
            </Row>

            <Row icon={AlertTriangle} label="Priority">
              <div className="flex flex-wrap gap-2">
                <Chip active={priority === "low"} onClick={() => setPriority(priority === "low" ? null : "low")}>Low</Chip>
                <Chip active={priority === "medium"} onClick={() => setPriority(priority === "medium" ? null : "medium")}>Medium</Chip>
                <Chip active={priority === "high"} onClick={() => setPriority(priority === "high" ? null : "high")}>High</Chip>
              </div>
            </Row>

            <Row icon={FlagIcon} label="Flag">
              <Switch
                checked={flagged}
                onCheckedChange={setFlagged}
                data-testid="switch-create-flag"
              />
            </Row>
          </div>
        </div>

        <div className="px-7 py-4 border-t border-border/60 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={handleClose} className="rounded-lg" data-testid="button-create-cancel">
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!title.trim()}
            className="rounded-lg bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
            data-testid="button-create-confirm"
          >
            Create Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({
  icon: Icon, label, children,
}: { icon: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] items-start gap-4">
      <div className="flex items-center gap-2 text-sm text-foreground/70 pt-1.5">
        <Icon className="w-4 h-4 text-muted-foreground" />
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}
