import { useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sparkles, Filter, ArrowUpDown, Search, Circle, CheckCircle2,
  FileText, Flag, ChevronDown, Pencil, CalendarDays, Bell, UserRound,
  AlertTriangle, Flag as FlagIcon, RotateCcw, ListTodo,
  ChevronUp, ChevronsUpDown,
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

function AvatarStack({ names, max = 3 }: { names: string[]; max?: number }) {
  if (names.length === 0) return <span className="text-muted-foreground/60">-</span>;
  const shown = names.slice(0, max);
  const overflow = names.length - shown.length;
  return (
    <div className="flex items-center">
      {shown.map((n, i) => (
        <span
          key={`${n}-${i}`}
          title={n}
          className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-[11px] font-semibold ring-2 ring-card ${colorFor(n)}`}
          style={{ marginLeft: i === 0 ? 0 : -8 }}
        >
          {n.charAt(0)}
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

const TABS = ["내 작업", "노트북별", "노트", "오늘", "할당됨"] as const;
type Tab = (typeof TABS)[number];

const PRIORITY_STYLE: Record<NonNullable<Priority>, { dot: string; label: string; text: string }> = {
  high: { dot: "bg-rose-500", label: "높음", text: "text-rose-600" },
  medium: { dot: "bg-amber-500", label: "보통", text: "text-amber-600" },
  low: { dot: "bg-slate-400", label: "낮음", text: "text-slate-500" },
};

function formatDate(d: string | null, overdue = false) {
  if (!d) return <span className="text-muted-foreground/60">-</span>;
  const date = new Date(d);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const day = date.getDate();
  const label = `${y}년 ${m}월 ${day}일`;
  return <span className={overdue ? "text-rose-500" : "text-foreground/90"}>{label}</span>;
}

const GRID_COLS = "grid-cols-[1.7fr_0.95fr_0.95fr_1.2fr_0.85fr_0.95fr_0.7fr]";

type SortKey = "title" | "due" | "start" | "note" | "assignee" | "assignees" | "priority";
type SortDir = "asc" | "desc";
const PRIORITY_RANK: Record<NonNullable<Priority>, number> = { high: 3, medium: 2, low: 1 };

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>(SEED);
  const [tab, setTab] = useState<Tab>("내 작업");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [createOpen, setCreateOpen] = useState(false);

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
    setSelectedId(null);
  };

  const filtered = useMemo(() => {
    let list = tasks;
    if (tab === "오늘") {
      const k = today.toISOString().slice(0, 10);
      list = list.filter((t) => t.due === k || t.start === k);
    } else if (tab === "할당됨") {
      list = list.filter((t) => !!t.assignee);
    } else if (tab === "노트") {
      list = list.filter((t) => !!t.note);
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
  }, [tasks, tab, search, sortKey, sortDir]);

  const toggle = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const openCount = tasks.filter((x) => !x.done).length;
  const doneCount = tasks.length - openCount;

  return (
    <Layout>
      <div className="h-full flex flex-col bg-background">
        {/* Page Header (Brain Market style) */}
        <div className="border-b border-border bg-card/50 px-8 py-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3" data-testid="text-todo-title">
                <ListTodo className="w-8 h-8 text-violet-600" />
                할 일 목록
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl text-base">
                팀의 모든 작업을 한 곳에서 추적하세요. 마감일, 담당자, 우선순위를 한눈에 확인하고,
                노트와 연결된 작업을 신속하게 처리할 수 있습니다.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 shadow-sm"
                data-testid="button-completed"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                완료된 작업
                <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 min-w-[20px] text-xs bg-emerald-100 text-emerald-700 border-0">
                  {doneCount}
                </Badge>
              </Button>
              <Button
                size="lg"
                onClick={() => setCreateOpen(true)}
                className="gap-2 shadow-lg bg-violet-600 hover:bg-violet-700 text-white"
                data-testid="button-new-task"
              >
                <Sparkles className="w-5 h-5" />
                새 작업
              </Button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex items-center gap-4 mt-2">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="작업을 찾으세요..."
                className="pl-10 h-11 bg-background shadow-sm border-muted-foreground/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search-task"
              />
            </div>
            <Button variant="outline" className="h-11 gap-2 px-4" data-testid="button-filter">
              <Filter className="w-4 h-4" />
              필터
            </Button>
            <Button variant="outline" className="h-11 gap-2 px-4" data-testid="button-sort">
              <ArrowUpDown className="w-4 h-4" />
              정렬
            </Button>
            <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="h-11">
              <TabsList className="h-11 bg-muted/50">
                {TABS.map((label) => (
                  <TabsTrigger key={label} value={label} className="h-9" data-testid={`tab-${label}`}>
                    {label}
                    {label === "내 작업" && (
                      <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 h-4 min-w-[18px] text-[10px] bg-violet-100 text-violet-700 border-0">
                        {openCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1400px] mx-auto">
            <div className="border border-border/60 rounded-xl overflow-hidden bg-card">
            <div className={`grid ${GRID_COLS} px-6 py-3 text-xs font-semibold text-muted-foreground bg-muted/30 border-b border-border/60`}>
              <SortHeader label="제목" sortKey="title" current={sortKey} dir={sortDir} onClick={toggleSort} />
              <SortHeader label="마감일" sortKey="due" current={sortKey} dir={sortDir} onClick={toggleSort} />
              <SortHeader label="시작일" sortKey="start" current={sortKey} dir={sortDir} onClick={toggleSort} />
              <SortHeader label="지정된 노트" sortKey="note" current={sortKey} dir={sortDir} onClick={toggleSort} />
              <SortHeader label="작성자" sortKey="assignee" current={sortKey} dir={sortDir} onClick={toggleSort} />
              <SortHeader label="지정된 사람" sortKey="assignees" current={sortKey} dir={sortDir} onClick={toggleSort} />
              <SortHeader label="중요도" sortKey="priority" current={sortKey} dir={sortDir} onClick={toggleSort} />
            </div>

            <ul>
              {filtered.map((t) => {
                const isOverdue =
                  !!t.due && !t.done && new Date(t.due) < new Date(today.toDateString());
                return (
                  <li
                    key={t.id}
                    onClick={() => setSelectedId(t.id)}
                    className={`grid ${GRID_COLS} items-center px-6 py-3.5 text-sm border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors group cursor-pointer`}
                    data-testid={`row-task-${t.id}`}
                  >
                    {/* 제목 */}
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggle(t.id); }}
                        className="shrink-0"
                        data-testid={`toggle-task-${t.id}`}
                        aria-label="완료 토글"
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
                          <span className={`w-7 h-7 rounded-full text-[11px] font-semibold inline-flex items-center justify-center ${colorFor(t.assignee)}`}>
                            {t.assignee.charAt(0)}
                          </span>
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
                  </li>
                );
              })}
              {filtered.length === 0 && (
                <li className="px-5 py-10 text-center text-sm text-muted-foreground">
                  표시할 작업이 없습니다.
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
            {task.note ?? "해야 할 일"}
            <ChevronDown className="w-3 h-3" />
          </button>

          {/* Title row */}
          <div className="flex items-center gap-3 mb-7">
            <button
              onClick={() => onChange({ done: !task.done })}
              className="shrink-0"
              data-testid="button-toggle-done"
              aria-label="완료 토글"
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
            {/* 설명 */}
            <Row icon={Pencil} label="설명">
              <Textarea
                placeholder="이 작업은 무엇에 관한 것인가요?"
                className="resize-none min-h-[72px] text-sm rounded-lg"
                data-testid="textarea-description"
              />
            </Row>

            {/* 마감일 */}
            <Row icon={CalendarDays} label="마감일">
              <div className="flex flex-wrap gap-2">
                <Chip active={task.due === todayKey} onClick={() => onChange({ due: todayKey })}>오늘</Chip>
                <Chip active={task.due === tomorrowKey} onClick={() => onChange({ due: tomorrowKey })}>내일</Chip>
                <Chip icon={Pencil}>사용자 지정</Chip>
                <Chip icon={RotateCcw}>반복</Chip>
              </div>
            </Row>

            {/* 알림 */}
            <Row icon={Bell} label="알림">
              <div className="flex flex-wrap gap-2">
                <Chip>1시간 후</Chip>
                <Chip>4시간 후에</Chip>
                <Chip icon={Pencil}>사용자 지정</Chip>
              </div>
            </Row>

            {/* 담당자 */}
            <Row icon={UserRound} label="담당자">
              {task.assignee ? (
                <span className="inline-flex items-center gap-2 text-sm">
                  <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-[11px] font-semibold inline-flex items-center justify-center">
                    {task.assignee.charAt(0)}
                  </span>
                  {task.assignee}
                </span>
              ) : (
                <button className="text-sm text-muted-foreground hover:text-foreground" data-testid="button-assign">
                  할당
                </button>
              )}
            </Row>

            {/* 우선 순위 */}
            <Row icon={AlertTriangle} label="우선 순위">
              <div className="flex flex-wrap gap-2">
                <Chip active={task.priority === "low"} onClick={() => onChange({ priority: "low" })}>낮음</Chip>
                <Chip active={task.priority === "medium"} onClick={() => onChange({ priority: "medium" })}>중간</Chip>
                <Chip active={task.priority === "high"} onClick={() => onChange({ priority: "high" })}>높음</Chip>
              </div>
            </Row>

            {/* 플래그 */}
            <Row icon={FlagIcon} label="플래그">
              <Switch
                checked={isFlagged}
                onCheckedChange={(v) => onChange({ priority: v ? "high" : (task.priority === "high" ? null : task.priority) })}
                data-testid="switch-flag"
              />
            </Row>
          </div>

          <div className="mt-7 text-xs text-muted-foreground">
            만든 사람: jh.park@illunex.com
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-border/60 flex items-center justify-between">
          <button
            onClick={onDelete}
            className="text-sm text-rose-600 hover:text-rose-700"
            data-testid="button-delete-task"
          >
            작업 삭제
          </button>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose} className="rounded-lg" data-testid="button-cancel">
              취소
            </Button>
            <Button onClick={onClose} className="rounded-lg bg-violet-600 hover:bg-violet-700 text-white" data-testid="button-save">
              저장
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
      note: "해야 할 일",
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
            해야 할 일
            <ChevronDown className="w-3 h-3" />
          </button>

          {/* Title row */}
          <div className="flex items-center gap-3 mb-7">
            <Circle className="w-6 h-6 text-muted-foreground/40 shrink-0" />
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="작업을 입력하세요"
              className="flex-1 text-xl font-semibold bg-transparent outline-none placeholder:text-muted-foreground/60"
              data-testid="input-create-title"
            />
          </div>

          <div className="space-y-5">
            <Row icon={Pencil} label="설명">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="이 작업은 무엇에 관한 것인가요?"
                className="resize-none min-h-[72px] text-sm rounded-lg"
                data-testid="textarea-create-description"
              />
            </Row>

            <Row icon={CalendarDays} label="마감일">
              <div className="flex flex-wrap gap-2">
                <Chip active={due === todayKey} onClick={() => setDue(due === todayKey ? null : todayKey)}>오늘</Chip>
                <Chip active={due === tomorrowKey} onClick={() => setDue(due === tomorrowKey ? null : tomorrowKey)}>내일</Chip>
                <Chip icon={Pencil}>사용자 지정</Chip>
                <Chip icon={RotateCcw}>반복</Chip>
              </div>
            </Row>

            <Row icon={Bell} label="알림">
              <div className="flex flex-wrap gap-2">
                <Chip>1시간 후</Chip>
                <Chip>4시간 후에</Chip>
                <Chip icon={Pencil}>사용자 지정</Chip>
              </div>
            </Row>

            <Row icon={UserRound} label="담당자">
              {assignee ? (
                <button
                  onClick={() => setAssignee(null)}
                  className="inline-flex items-center gap-2 text-sm"
                  data-testid="button-create-assignee"
                >
                  <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-[11px] font-semibold inline-flex items-center justify-center">
                    {assignee.charAt(0)}
                  </span>
                  {assignee}
                </button>
              ) : (
                <button
                  onClick={() => setAssignee("박지훈")}
                  className="text-sm text-muted-foreground hover:text-foreground"
                  data-testid="button-create-assign"
                >
                  할당
                </button>
              )}
            </Row>

            <Row icon={AlertTriangle} label="우선 순위">
              <div className="flex flex-wrap gap-2">
                <Chip active={priority === "low"} onClick={() => setPriority(priority === "low" ? null : "low")}>낮음</Chip>
                <Chip active={priority === "medium"} onClick={() => setPriority(priority === "medium" ? null : "medium")}>중간</Chip>
                <Chip active={priority === "high"} onClick={() => setPriority(priority === "high" ? null : "high")}>높음</Chip>
              </div>
            </Row>

            <Row icon={FlagIcon} label="플래그">
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
            취소
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!title.trim()}
            className="rounded-lg bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
            data-testid="button-create-confirm"
          >
            작업 만들기
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
