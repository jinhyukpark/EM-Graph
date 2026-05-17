import { useEffect, useMemo, useRef, useState } from "react";
import Layout from "@/components/layout/Layout";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Mic, CalendarPlus, Sparkles, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight,
  Eye, EyeOff, Plus, X, Video, Users, MapPin, FileText,
} from "lucide-react";

type CalEvent = {
  id: string;
  date: string;
  endDate?: string;
  start: string;
  title: string;
  color: string;
  calendar: string;
  type?: "event" | "todo";
  done?: boolean;
};

const INITIAL_EVENTS: CalEvent[] = [
  { id: "e1", date: "2026-04-27", start: "15:00", title: "MATI 프로젝트 킥오프", color: "bg-violet-200 text-violet-900 border-l-violet-500", calendar: "이벤트" },
  { id: "e2", date: "2026-04-30", start: "13:45", title: "(주)일루넥스 주간 점검", color: "bg-blue-200 text-blue-900 border-l-blue-500", calendar: "jh.park@illunex.com" },
  { id: "e3", date: "2026-04-30", start: "14:45", title: "(주)일루넥스 마케팅 회의", color: "bg-blue-200 text-blue-900 border-l-blue-500", calendar: "jh.park@illunex.com" },
  { id: "e4", date: "2026-05-04", start: "10:30", title: "PET필름 주간 운영회의", color: "bg-emerald-200 text-emerald-900 border-l-emerald-500", calendar: "이벤트" },
  { id: "e5", date: "2026-05-12", start: "14:00", title: "아라미드 단가 협상 미팅", color: "bg-rose-200 text-rose-900 border-l-rose-500", calendar: "작업", type: "todo" },
  { id: "e6", date: "2026-05-16", start: "11:00", title: "편광필름 품질 리뷰", color: "bg-amber-200 text-amber-900 border-l-amber-500", calendar: "이벤트" },
  { id: "e7", date: "2026-05-19", start: "16:00", title: "MOQ 정책 사내 공유", color: "bg-violet-200 text-violet-900 border-l-violet-500", calendar: "작업", type: "todo" },
  { id: "e8", date: "2026-05-25", start: "09:00", title: "흥대 외주사 미팅", color: "bg-blue-200 text-blue-900 border-l-blue-500", calendar: "jh.park@illunex.com" },
  { id: "e9", date: "2026-05-13", start: "10:00", title: "PET필름 단가 검토 보고", color: "bg-violet-200 text-violet-900 border-l-violet-500", calendar: "작업", type: "todo", done: true },
  { id: "e10", date: "2026-05-21", start: "09:30", title: "월간 안전점검 체크리스트", color: "bg-rose-200 text-rose-900 border-l-rose-500", calendar: "작업", type: "todo" },
  { id: "d1", date: "2026-05-19", start: "08:00", title: "조회 및 일일 안전교육", color: "bg-emerald-200 text-emerald-900 border-l-emerald-500", calendar: "이벤트" },
  { id: "d2", date: "2026-05-19", start: "08:30", title: "원자재 입고 검수", color: "bg-amber-200 text-amber-900 border-l-amber-500", calendar: "작업", type: "todo" },
  { id: "d3", date: "2026-05-19", start: "09:00", title: "PET필름 라인 점검 회의", color: "bg-blue-200 text-blue-900 border-l-blue-500", calendar: "jh.park@illunex.com" },
  { id: "d4", date: "2026-05-19", start: "09:30", title: "주간 생산 실적 보고", color: "bg-violet-200 text-violet-900 border-l-violet-500", calendar: "이벤트" },
  { id: "d5", date: "2026-05-19", start: "10:00", title: "구매팀 단가 협의", color: "bg-rose-200 text-rose-900 border-l-rose-500", calendar: "작업", type: "todo" },
  { id: "d6", date: "2026-05-19", start: "10:30", title: "MOQ 정책 사내 공유 (본미팅)", color: "bg-violet-200 text-violet-900 border-l-violet-500", calendar: "이벤트" },
  { id: "d7", date: "2026-05-19", start: "11:00", title: "아라미드 신규 거래선 인터뷰", color: "bg-blue-200 text-blue-900 border-l-blue-500", calendar: "jh.park@illunex.com" },
  { id: "d8", date: "2026-05-19", start: "11:30", title: "편광필름 품질 이슈 리뷰", color: "bg-amber-200 text-amber-900 border-l-amber-500", calendar: "이벤트" },
  { id: "d9", date: "2026-05-19", start: "13:00", title: "점심 - 외주사 환영회", color: "bg-emerald-200 text-emerald-900 border-l-emerald-500", calendar: "이벤트" },
  { id: "d10", date: "2026-05-19", start: "14:00", title: "BOM 변경 승인 회의", color: "bg-rose-200 text-rose-900 border-l-rose-500", calendar: "작업", type: "todo" },
  { id: "d11", date: "2026-05-19", start: "15:00", title: "열연코일 발주 컨펌", color: "bg-blue-200 text-blue-900 border-l-blue-500", calendar: "작업", type: "todo" },
  { id: "d12", date: "2026-05-19", start: "15:30", title: "AI 코파일럿 데모 시연", color: "bg-violet-200 text-violet-900 border-l-violet-500", calendar: "이벤트" },
  { id: "d13", date: "2026-05-19", start: "16:30", title: "마케팅 캠페인 결과 공유", color: "bg-emerald-200 text-emerald-900 border-l-emerald-500", calendar: "이벤트" },
  { id: "d14", date: "2026-05-19", start: "17:00", title: "주간 OKR 점검", color: "bg-amber-200 text-amber-900 border-l-amber-500", calendar: "작업", type: "todo" },
  { id: "d15", date: "2026-05-19", start: "18:00", title: "퇴근 전 일일 보고서 작성", color: "bg-rose-200 text-rose-900 border-l-rose-500", calendar: "작업", type: "todo" },
];

const CALENDAR_ACCOUNTS = [
  { id: "ev", name: "이벤트", color: "bg-emerald-500", group: "Evernote 캘린더" },
  { id: "wk", name: "작업", color: "bg-violet-500", group: "Evernote 캘린더" },
];

const ACCOUNT_LIST = [
  { id: "jh", email: "jh.park@illunex.com", color: "bg-blue-500", visible: true },
  { id: "bk", email: "bk.park@illunex.com", color: "bg-pink-400", visible: false },
  { id: "edu", email: "교육캘린더", color: "bg-amber-300", visible: false },
  { id: "kr", email: "대한민국의 휴일", color: "bg-emerald-400", visible: true },
];

const CONNECTIONS = [
  { id: "google", name: "Google", icon: "G", color: "text-rose-500" },
  { id: "outlook", name: "Outlook", icon: "O", color: "text-blue-500" },
];

function SidebarToggleButton({ onToggle }: { onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="p-1.5 -ml-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted"
      title="패널 토글"
      aria-label="Toggle calendar panel"
      data-testid="button-toggle-calendar-panel"
    >
      <PanelLeft className="w-4 h-4" />
    </button>
  );
}

const KO_DAYS = ["월", "화", "수", "목", "금", "토", "일"];
const KO_MINI_DAYS = ["월", "화", "수", "목", "금", "토", "일"];

function startOfMondayWeek(date: Date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(d: Date, n: number) {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + n);
  return nd;
}

function toKey(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function isoWeek(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function buildMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const gridStart = startOfMondayWeek(first);
  const weeks: Date[][] = [];
  let cursor = gridStart;
  for (let w = 0; w < 6; w++) {
    const row: Date[] = [];
    for (let d = 0; d < 7; d++) {
      row.push(addDays(cursor, d));
    }
    weeks.push(row);
    cursor = addDays(cursor, 7);
  }
  return weeks;
}

function buildMiniMonth(year: number, month: number) {
  const first = new Date(year, month, 1);
  const gridStart = startOfMondayWeek(first);
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) cells.push(addDays(gridStart, i));
  return cells;
}

function formatDateLong(d: Date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[d.getDay()]}, ${months[d.getMonth()]}, ${d.getDate()}`;
}

type ContextMenuState = { x: number; y: number; date: Date } | null;

export default function CalendarPage() {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(2026, 4, 1));
  const [accounts, setAccounts] = useState(ACCOUNT_LIST);

  const [ctxMenu, setCtxMenu] = useState<ContextMenuState>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [evDate, setEvDate] = useState<Date>(new Date());
  const [evTitle, setEvTitle] = useState("");
  const [evAllDay, setEvAllDay] = useState(false);
  const [evStartTime, setEvStartTime] = useState("14:15");
  const [evEndTime, setEvEndTime] = useState("15:15");
  const [evRepeat, setEvRepeat] = useState("none");
  const [evAlert, setEvAlert] = useState("10");
  const [evOccupancy, setEvOccupancy] = useState("busy");
  const [evVisibility, setEvVisibility] = useState("default");

  const openCreateAt = (date: Date) => {
    setEvDate(date);
    setEvTitle("");
    setEvAllDay(false);
    setSheetOpen(true);
    setCtxMenu(null);
  };

  const handleCellContext = (e: React.MouseEvent, date: Date) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY, date });
  };

  useEffect(() => {
    if (!ctxMenu) return;
    const close = () => setCtxMenu(null);
    window.addEventListener("click", close);
    window.addEventListener("scroll", close, true);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [ctxMenu]);

  const weeks = useMemo(
    () => buildMonthGrid(cursor.getFullYear(), cursor.getMonth()),
    [cursor]
  );
  const miniCells = useMemo(
    () => buildMiniMonth(cursor.getFullYear(), cursor.getMonth()),
    [cursor]
  );
  const [events, setEvents] = useState<CalEvent[]>(INITIAL_EVENTS);
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalEvent[]> = {};
    for (const ev of events) {
      const start = new Date(ev.date + "T00:00:00");
      const end = new Date((ev.endDate ?? ev.date) + "T00:00:00");
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const k = toKey(d);
        (map[k] ||= []).push(ev);
      }
    }
    return map;
  }, [events]);

  // Resize logic: drag right edge of an event chip to extend its end date.
  const [resizingId, setResizingId] = useState<string | null>(null);
  useEffect(() => {
    if (!resizingId) return;
    const onMove = (e: MouseEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const cell = el?.closest("[data-date]") as HTMLElement | null;
      if (!cell) return;
      const targetDate = cell.dataset.date!;
      setEvents((prev) =>
        prev.map((ev) => {
          if (ev.id !== resizingId) return ev;
          if (targetDate < ev.date) return ev;
          return { ...ev, endDate: targetDate === ev.date ? undefined : targetDate };
        })
      );
    };
    const onUp = () => setResizingId(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [resizingId]);

  const [panelOpen, setPanelOpen] = useState(true);
  const [dayPopup, setDayPopup] = useState<string | null>(null);
  const [eventPopup, setEventPopup] = useState<string | null>(null);
  const weekRowRef = useRef<HTMLDivElement | null>(null);
  const [maxLanes, setMaxLanes] = useState(3);
  useEffect(() => {
    const el = weekRowRef.current;
    if (!el) return;
    const LANE_H = 24;
    const HEADER = 36;
    const MORE_BTN = 22;
    const recompute = () => {
      const h = el.clientHeight;
      const n = Math.max(1, Math.floor((h - HEADER - MORE_BTN) / LANE_H));
      setMaxLanes(n);
    };
    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [weeks.length, panelOpen]);

  const monthLabel = `${cursor.getFullYear()}년 ${cursor.getMonth() + 1}월`;
  const shiftMonth = (delta: number) =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
  const toggleAccount = (id: string) =>
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, visible: !a.visible } : a)));

  return (
    <Layout>
      <div className="h-full flex flex-col bg-background overflow-hidden">
        {/* Header */}
        <div className="h-16 px-8 flex items-center justify-between shrink-0 border-b border-border">
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-calendar-title">캘린더</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 rounded-full text-sm gap-2 border-violet-200 text-violet-700 hover:bg-violet-50" data-testid="button-new-recording">
              <Mic className="w-4 h-4" />새 녹음
            </Button>
            <Button variant="outline" size="sm" className="h-9 rounded-full text-sm gap-2 border-rose-200 text-rose-700 hover:bg-rose-50" data-testid="button-new-event">
              <CalendarPlus className="w-4 h-4" />새 이벤트
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-violet-600" data-testid="button-ai">
              <Sparkles className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" data-testid="button-sort">
              <ArrowUpDown className="w-5 h-5" />
            </Button>
            <button className="h-9 px-4 inline-flex items-center gap-1.5 rounded-md border border-border text-sm text-foreground hover:bg-muted" data-testid="button-view">
              월 <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col px-8 pb-6 min-h-0">
          <div className={`grid ${panelOpen ? "grid-cols-[280px_1fr]" : "grid-cols-[0px_1fr]"} gap-0 flex-1 min-h-0 transition-[grid-template-columns] duration-200`}>
            {/* Sidebar */}
            <aside className={`space-y-6 overflow-y-auto pt-6 pr-6 border-r border-border ${panelOpen ? "" : "hidden"}`}>
              {/* Mini calendar */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-base font-semibold">{monthLabel}</div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <button onClick={() => shiftMonth(-1)} className="p-1.5 hover:text-foreground" data-testid="mini-prev"><ChevronLeft className="w-4 h-4" /></button>
                    <button onClick={() => shiftMonth(1)} className="p-1.5 hover:text-foreground" data-testid="mini-next"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-y-1 text-xs text-center">
                  {KO_MINI_DAYS.map((d) => (
                    <div key={d} className="text-muted-foreground/70 pb-1.5 font-medium">{d}</div>
                  ))}
                  {miniCells.map((d, i) => {
                    const isOther = d.getMonth() !== cursor.getMonth();
                    const isToday = toKey(d) === toKey(today);
                    return (
                      <div key={i} className="flex items-center justify-center h-8">
                        <span
                          className={`w-8 h-8 inline-flex items-center justify-center rounded-full text-xs ${
                            isToday
                              ? "bg-violet-600 text-white font-semibold"
                              : isOther
                              ? "text-muted-foreground/40"
                              : "text-foreground/80"
                          }`}
                        >
                          {d.getDate()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Evernote calendars */}
              {/* Accounts */}
              <div>
                <div className="text-xs text-muted-foreground mb-3 font-medium">jh.park@illunex.com</div>
                <ul className="space-y-2">
                  {accounts.map((a) => (
                    <li key={a.id} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2.5 text-foreground/80 truncate">
                        <span className={`w-3 h-3 rounded-full ${a.color}`} />
                        <span className="truncate">{a.email}</span>
                      </span>
                      <button
                        onClick={() => toggleAccount(a.id)}
                        className="p-1 text-muted-foreground hover:text-foreground"
                        data-testid={`toggle-account-${a.id}`}
                        aria-label="가시성 토글"
                      >
                        {a.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connections */}
              <div>
                <div className="text-xs text-muted-foreground mb-3 font-medium">캘린더 연결</div>
                <ul className="space-y-2">
                  {CONNECTIONS.map((c) => (
                    <li key={c.id} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2.5 text-foreground/80">
                        <span className={`w-6 h-6 inline-flex items-center justify-center rounded font-bold text-sm ${c.color}`}>{c.icon}</span>
                        {c.name}
                      </span>
                      <button className="p-1 text-muted-foreground hover:text-foreground" data-testid={`connect-${c.id}`} aria-label="연결">
                        <Plus className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* This month's To-Do List */}
              <div>
                <div className="text-xs text-muted-foreground mb-3 font-medium">이달의 To-Do List</div>
                {(() => {
                  const ym = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
                  const monthTodos = events
                    .filter((ev) => ev.type === "todo" && ev.date.startsWith(ym))
                    .sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start));
                  if (monthTodos.length === 0) {
                    return <div className="text-xs text-muted-foreground/70">등록된 할 일이 없습니다.</div>;
                  }
                  return (
                    <ul className="space-y-2">
                      {monthTodos.map((ev) => {
                        const isDone = !!ev.done;
                        const dot = ev.color.split(" ").find((c) => c.startsWith("border-l-"))?.replace("border-l-", "bg-") ?? "bg-violet-500";
                        const md = ev.date.slice(5).replace("-", "/");
                        return (
                          <li key={ev.id} className="flex items-start gap-2 text-sm" data-testid={`sidebar-todo-${ev.id}`}>
                            <button
                              onClick={() => setEvents((prev) => prev.map((x) => x.id === ev.id ? { ...x, done: !x.done } : x))}
                              className={`mt-0.5 shrink-0 w-4 h-4 rounded-[4px] border inline-flex items-center justify-center ${isDone ? "bg-foreground border-foreground" : "border-muted-foreground/40 hover:border-foreground"}`}
                              aria-label={isDone ? "완료 해제" : "완료"}
                              data-testid={`sidebar-todo-toggle-${ev.id}`}
                            >
                              {isDone && (
                                <svg viewBox="0 0 12 12" className="w-3 h-3 text-background" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2.5 6.5l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                              )}
                            </button>
                            <div className={`flex-1 min-w-0 ${isDone ? "opacity-50" : ""}`}>
                              <div className={`flex items-center gap-1.5 text-sm leading-snug ${isDone ? "line-through" : ""}`}>
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
                                <span className="truncate text-foreground/90">{ev.title}</span>
                              </div>
                              <div className="text-[11px] text-muted-foreground mt-0.5">
                                {md} · {Number(ev.start.split(":")[0]) >= 12 ? "오후" : "오전"} {ev.start}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  );
                })()}
              </div>
            </aside>

            {/* Main calendar */}
            <section className="relative flex flex-col min-h-0 pt-6">
              <div className="flex items-center justify-between mb-4 shrink-0 pl-6">
                <div className="flex items-center gap-2">
                  <SidebarToggleButton onToggle={() => setPanelOpen((v) => !v)} />
                  <div className="text-base font-semibold">{monthLabel}</div>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <button onClick={() => setCursor(new Date())} className="px-3 py-1.5 hover:text-foreground" data-testid="button-today-main">오늘</button>
                  <button onClick={() => shiftMonth(-1)} className="p-1.5 hover:text-foreground" data-testid="main-prev"><ChevronLeft className="w-4 h-4" /></button>
                  <button onClick={() => shiftMonth(1)} className="p-1.5 hover:text-foreground" data-testid="main-next"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-[48px_repeat(7,1fr)] border-b border-border/60 shrink-0">
                <div />
                {KO_DAYS.map((d) => (
                  <div key={d} className="px-3 py-3 text-sm font-medium text-muted-foreground">{d}</div>
                ))}
              </div>

              {/* Weeks */}
              <div className="flex-1 grid grid-rows-6 min-h-0">
                {weeks.map((week, wi) => {
                  const wk = isoWeek(week[0]);
                  const weekStartKey = toKey(week[0]);
                  const weekEndKey = toKey(week[6]);
                  type Seg = { ev: CalEvent; sIdx: number; eIdx: number; startsHere: boolean; endsHere: boolean; lane: number };
                  const segs: Seg[] = [];
                  for (const ev of events) {
                    const s = ev.date;
                    const e = ev.endDate ?? ev.date;
                    if (e < weekStartKey || s > weekEndKey) continue;
                    const sIdx = s < weekStartKey ? 0 : week.findIndex((d) => toKey(d) === s);
                    const eIdx = e > weekEndKey ? 6 : week.findIndex((d) => toKey(d) === e);
                    segs.push({ ev, sIdx, eIdx, startsHere: s >= weekStartKey, endsHere: e <= weekEndKey, lane: 0 });
                  }
                  segs.sort((a, b) => a.sIdx - b.sIdx || (b.eIdx - b.sIdx) - (a.eIdx - a.sIdx) || a.ev.start.localeCompare(b.ev.start));
                  const laneEnds: number[] = [];
                  for (const seg of segs) {
                    let lane = laneEnds.findIndex((end) => end < seg.sIdx);
                    if (lane === -1) { lane = laneEnds.length; laneEnds.push(seg.eIdx); }
                    else laneEnds[lane] = seg.eIdx;
                    seg.lane = lane;
                  }
                  const MAX_LANES = maxLanes;
                  const LANE_H = 24;
                  return (
                    <div key={wi} ref={wi === 0 ? weekRowRef : undefined} className="relative grid grid-cols-[48px_repeat(7,1fr)] border-b border-border/40 last:border-b-0 min-h-0 overflow-hidden">
                      <div className="text-xs text-muted-foreground/60 flex items-center justify-center border-r border-border/40">
                        주 {wk}
                      </div>
                      {week.map((d) => {
                        const key = toKey(d);
                        const isOther = d.getMonth() !== cursor.getMonth();
                        const isToday = toKey(d) === toKey(today);
                        const overflow = segs.filter((s) => s.lane >= MAX_LANES && s.sIdx <= week.findIndex((dd) => toKey(dd) === key) && s.eIdx >= week.findIndex((dd) => toKey(dd) === key)).length;
                        return (
                          <div
                            key={key}
                            onContextMenu={(e) => handleCellContext(e, d)}
                            className={`px-2.5 py-2.5 border-r border-border/40 last:border-r-0 overflow-hidden flex flex-col ${
                              isOther ? "bg-muted/20" : ""
                            }`}
                            data-testid={`day-cell-${key}`}
                            data-date={key}
                          >
                            <Popover open={dayPopup === key} onOpenChange={(o) => setDayPopup(o ? key : null)}>
                              <div className="flex items-center justify-end mb-2 shrink-0">
                                <span
                                  className={`text-sm inline-flex items-center justify-center ${
                                    isToday
                                      ? "w-7 h-7 rounded-full bg-violet-600 text-white font-semibold"
                                      : isOther
                                      ? "text-muted-foreground/40"
                                      : "text-foreground/70"
                                  }`}
                                >
                                  {d.getDate()}
                                  {!isToday && <span className="ml-0.5 text-muted-foreground/50 text-xs">일</span>}
                                </span>
                              </div>
                              <div className="flex-1" />
                              {overflow > 0 && (
                                <PopoverTrigger asChild>
                                  <button
                                    onClick={(e) => e.stopPropagation()}
                                    className="self-start text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted px-1.5 py-0.5 rounded shrink-0 relative z-10"
                                    data-testid={`button-more-${key}`}
                                  >
                                    +{overflow}건 더보기
                                  </button>
                                </PopoverTrigger>
                              )}
                              <PopoverContent
                                align="center"
                                side="top"
                                sideOffset={6}
                                className="w-[360px] p-0 overflow-hidden"
                                data-testid={`popover-day-${key}`}
                              >
                                {(() => {
                                  const dayList = eventsByDate[key] ?? [];
                                  const sorted = [...dayList].sort((a, b) => a.start.localeCompare(b.start));
                                  const dd = new Date(key + "T00:00:00");
                                  const label = `${dd.getMonth() + 1}월 ${dd.getDate()}일 (${KO_DAYS[(dd.getDay() + 6) % 7]}) (${sorted.length})`;
                                  return (
                                    <div>
                                      <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
                                        <div className="text-sm font-semibold">{label}</div>
                                        <button onClick={() => setDayPopup(null)} className="text-muted-foreground hover:text-foreground" aria-label="닫기">
                                          <X className="w-4 h-4" />
                                        </button>
                                      </div>
                                      <div className="max-h-[380px] overflow-y-auto px-2 py-2 space-y-1">
                                        {sorted.map((ev) => {
                                          const isTodo = ev.type === "todo";
                                          const isDone = !!ev.done;
                                          return (
                                            <div
                                              key={ev.id}
                                              className={`flex items-center gap-2 px-2.5 py-1.5 rounded border-l-2 text-xs ${ev.color} ${isDone ? "opacity-50" : ""}`}
                                              data-testid={`day-popup-event-${ev.id}`}
                                            >
                                              {isTodo && (
                                                <button
                                                  onClick={() => setEvents((prev) => prev.map((x) => x.id === ev.id ? { ...x, done: !x.done } : x))}
                                                  className={`shrink-0 w-3.5 h-3.5 rounded-[3px] border inline-flex items-center justify-center ${isDone ? "bg-current/80 border-current/60" : "bg-white/70 border-current/50 hover:border-current/80"}`}
                                                  aria-label={isDone ? "완료 해제" : "완료"}
                                                >
                                                  {isDone && (
                                                    <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2.5 6.5l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                  )}
                                                </button>
                                              )}
                                              <div className={`flex-1 min-w-0 truncate ${isDone ? "line-through" : ""}`}>
                                                <span className="opacity-80 mr-1">{Number(ev.start.split(":")[0]) >= 12 ? "오후" : "오전"} {ev.start}</span>
                                                {ev.title}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })()}
                              </PopoverContent>
                            </Popover>
                          </div>
                        );
                      })}
                      {/* Continuous event bars overlay */}
                      <div className="absolute inset-y-0 left-12 right-0 pointer-events-none" style={{ paddingTop: 36 }}>
                        <div className="relative grid grid-cols-7 h-full">
                          {segs.filter((s) => s.lane < MAX_LANES).map((seg) => {
                            const ev = seg.ev;
                            const isTodo = ev.type === "todo";
                            const isDone = !!ev.done;
                            const leftPct = (seg.sIdx / 7) * 100;
                            const widthPct = ((seg.eIdx - seg.sIdx + 1) / 7) * 100;
                            const roundedL = seg.startsHere ? "rounded-l" : "rounded-l-none";
                            const roundedR = seg.endsHere ? "rounded-r" : "rounded-r-none";
                            const borderL = seg.startsHere ? "border-l-2" : "border-l-0";
                            const segKey = `${ev.id}-${wi}`;
                            return (
                              <Popover
                                key={segKey}
                                open={eventPopup === segKey}
                                onOpenChange={(o) => setEventPopup(o ? segKey : null)}
                              >
                                <PopoverTrigger asChild>
                                  <div
                                    role="button"
                                    onClick={(e) => { e.stopPropagation(); setEventPopup(segKey); }}
                                    className={`absolute pointer-events-auto group flex items-center gap-1.5 text-xs px-2 py-1 truncate cursor-pointer ${borderL} ${roundedL} ${roundedR} ${ev.color} ${isDone ? "opacity-50" : ""}`}
                                    style={{
                                      left: `calc(${leftPct}% + 2px)`,
                                      width: `calc(${widthPct}% - 4px)`,
                                      top: seg.lane * LANE_H,
                                      height: LANE_H - 4,
                                    }}
                                    title={`${ev.start} ${ev.title}`}
                                    data-testid={`event-${ev.id}-w${wi}`}
                                  >
                                    {isTodo && seg.startsHere && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEvents((prev) => prev.map((x) => x.id === ev.id ? { ...x, done: !x.done } : x));
                                        }}
                                        className={`shrink-0 w-3.5 h-3.5 rounded-[3px] border inline-flex items-center justify-center ${isDone ? "bg-current/80 border-current/60" : "bg-white/70 border-current/40 hover:border-current/70"}`}
                                        aria-label={isDone ? "완료 해제" : "완료"}
                                        data-testid={`todo-toggle-${ev.id}`}
                                      >
                                        {isDone && (
                                          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2.5 6.5l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        )}
                                      </button>
                                    )}
                                    {seg.startsHere && (
                                      <span className={`truncate ${isDone ? "line-through" : ""}`}>
                                        <span className="opacity-80">{Number(ev.start.split(":")[0]) >= 12 ? "오후" : "오전"} {ev.start}</span>{" "}
                                        {ev.title}
                                      </span>
                                    )}
                                    {seg.endsHere && (
                                      <span
                                        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setResizingId(ev.id); }}
                                        className="absolute right-0 top-0 h-full w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 bg-foreground/10 rounded-r"
                                        title="드래그하여 기간 조정"
                                        data-testid={`resize-${ev.id}`}
                                      />
                                    )}
                                  </div>
                                </PopoverTrigger>
                                <PopoverContent
                                  align="center"
                                  side="top"
                                  sideOffset={6}
                                  className="w-[340px] p-0 overflow-hidden"
                                  data-testid={`event-popover-${ev.id}`}
                                >
                                  {(() => {
                                    const sd = new Date(ev.date + "T00:00:00");
                                    const ed = new Date((ev.endDate ?? ev.date) + "T00:00:00");
                                    const sLabel = `${sd.getMonth() + 1}월 ${sd.getDate()}일 (${KO_DAYS[(sd.getDay() + 6) % 7]})`;
                                    const eLabel = `${ed.getMonth() + 1}월 ${ed.getDate()}일 (${KO_DAYS[(ed.getDay() + 6) % 7]})`;
                                    const hh = Number(ev.start.split(":")[0]);
                                    const ampm = hh >= 12 ? "오후" : "오전";
                                    const sameDay = sLabel === eLabel;
                                    return (
                                      <div>
                                        <div className={`h-1.5 w-full ${ev.color.split(" ").find((c) => c.startsWith("bg-")) ?? "bg-muted"}`} />
                                        <div className="px-4 pt-3 pb-2 flex items-start justify-between gap-2 border-b border-border">
                                          <div className="min-w-0">
                                            <div className="text-sm font-semibold leading-snug">
                                              {isTodo && <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground mr-1.5 align-middle">할 일</span>}
                                              {ev.title}
                                            </div>
                                            <div className="text-[11px] text-muted-foreground mt-0.5">{ev.calendar}</div>
                                          </div>
                                          <button
                                            onClick={() => setEventPopup(null)}
                                            className="text-muted-foreground hover:text-foreground shrink-0"
                                            aria-label="닫기"
                                          >
                                            <X className="w-4 h-4" />
                                          </button>
                                        </div>
                                        <div className="px-4 py-3 space-y-2 text-xs">
                                          <div className="flex items-start gap-2">
                                            <CalendarPlus className="w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0" />
                                            <div className="leading-snug">
                                              {sameDay ? (
                                                <>{sLabel} · {ampm} {ev.start}</>
                                              ) : (
                                                <>{sLabel} {ampm} {ev.start} ~ {eLabel}</>
                                              )}
                                            </div>
                                          </div>
                                          <div className="flex items-start gap-2">
                                            <MapPin className="w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0" />
                                            <div className="text-muted-foreground">위치 미지정</div>
                                          </div>
                                          <div className="flex items-start gap-2">
                                            <Users className="w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0" />
                                            <div className="text-muted-foreground">참석자 미지정</div>
                                          </div>
                                          <div className="flex items-start gap-2">
                                            <FileText className="w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0" />
                                            <div className="text-muted-foreground">메모 없음</div>
                                          </div>
                                        </div>
                                        {isTodo && (
                                          <div className="px-4 pb-3">
                                            <button
                                              onClick={() => setEvents((prev) => prev.map((x) => x.id === ev.id ? { ...x, done: !x.done } : x))}
                                              className="w-full h-8 text-xs rounded-md border border-border hover:bg-muted"
                                              data-testid={`button-toggle-done-${ev.id}`}
                                            >
                                              {isDone ? "완료 해제" : "완료로 표시"}
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })()}
                                </PopoverContent>
                              </Popover>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Floating add button */}
              <button
                onClick={() => openCreateAt(today)}
                className="absolute bottom-4 right-4 w-14 h-14 rounded-full bg-foreground text-background shadow-lg hover:scale-105 transition-transform inline-flex items-center justify-center z-10"
                data-testid="button-fab-add"
                aria-label="새 이벤트"
              >
                <Plus className="w-6 h-6" />
              </button>
            </section>
          </div>
        </div>

        {ctxMenu && (
          <div
            className="fixed z-50 bg-background border border-border/60 rounded-full shadow-lg px-1 py-1"
            style={{ left: ctxMenu.x, top: ctxMenu.y }}
            onClick={(e) => e.stopPropagation()}
            data-testid="calendar-context-menu"
          >
            <button
              onClick={() => openCreateAt(ctxMenu.date)}
              className="px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-full transition-colors"
              data-testid="button-create-new-event"
            >
              Create New Event
            </button>
          </div>
        )}

        <Dialog open={sheetOpen} onOpenChange={setSheetOpen}>
          <DialogContent
            className="sm:max-w-[640px] w-[640px] p-0 gap-0 rounded-2xl overflow-hidden max-h-[88vh] flex flex-col"
            data-testid="dialog-new-event"
          >
            <VisuallyHidden>
              <DialogTitle>New Event</DialogTitle>
              <DialogDescription>Create a new calendar event</DialogDescription>
            </VisuallyHidden>
            <div className="px-5 pt-5 pb-3 border-b border-border/40 flex items-center gap-3">
              <button onClick={() => setSheetOpen(false)} className="text-muted-foreground hover:text-foreground" data-testid="button-close-event" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
              <span className="font-semibold">New Event</span>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>jh.park@illunex.com</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </div>

              <Input
                value={evTitle}
                onChange={(e) => setEvTitle(e.target.value)}
                placeholder="New Event"
                className="border-0 border-b border-border/60 rounded-none px-0 text-base h-9 focus-visible:ring-0 shadow-none"
                data-testid="input-event-title"
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={evAllDay} onCheckedChange={(v) => setEvAllDay(!!v)} data-testid="checkbox-all-day" />
                  All day
                </label>
                <span className="text-xs text-muted-foreground">GMT+9</span>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-[60px_1fr_1fr] items-center gap-2">
                  <span className="text-sm text-muted-foreground">Start:</span>
                  {!evAllDay && (
                    <Input value={evStartTime} onChange={(e) => setEvStartTime(e.target.value)} className="h-8 text-sm" data-testid="input-start-time" />
                  )}
                  <button className={`h-8 px-2 text-sm border border-border/60 rounded-md inline-flex items-center justify-between bg-background ${evAllDay ? "col-span-2" : ""}`} data-testid="button-start-date">
                    <span>{formatDateLong(evDate)}</span>
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
                <div className="grid grid-cols-[60px_1fr_1fr] items-center gap-2">
                  <span className="text-sm text-muted-foreground">End:</span>
                  {!evAllDay && (
                    <Input value={evEndTime} onChange={(e) => setEvEndTime(e.target.value)} className="h-8 text-sm" data-testid="input-end-time" />
                  )}
                  <button className={`h-8 px-2 text-sm border border-border/60 rounded-md inline-flex items-center justify-between bg-background ${evAllDay ? "col-span-2" : ""}`} data-testid="button-end-date">
                    <span>{formatDateLong(evDate)}</span>
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
              </div>

              <div className="border-t border-border/40 pt-3 space-y-2">
                <div className="grid grid-cols-[90px_1fr] items-center gap-2">
                  <span className="text-sm text-muted-foreground">Repeat:</span>
                  <Select value={evRepeat} onValueChange={setEvRepeat}>
                    <SelectTrigger className="h-8 text-sm" data-testid="select-repeat"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-[90px_1fr_28px] items-center gap-2">
                  <span className="text-sm text-muted-foreground">Alert:</span>
                  <Select value={evAlert} onValueChange={setEvAlert}>
                    <SelectTrigger className="h-8 text-sm" data-testid="select-alert"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">At time of event</SelectItem>
                      <SelectItem value="5">5 minutes before</SelectItem>
                      <SelectItem value="10">10 minutes before</SelectItem>
                      <SelectItem value="30">30 minutes before</SelectItem>
                      <SelectItem value="60">1 hour before</SelectItem>
                    </SelectContent>
                  </Select>
                  <button className="w-7 h-7 rounded-full border border-border/60 inline-flex items-center justify-center text-muted-foreground hover:text-foreground" data-testid="button-add-alert">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-[90px_1fr] items-center gap-2">
                  <span className="text-sm text-muted-foreground">Occupancy:</span>
                  <Select value={evOccupancy} onValueChange={setEvOccupancy}>
                    <SelectTrigger className="h-8 text-sm" data-testid="select-occupancy"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="busy">Busy</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-[90px_1fr] items-center gap-2">
                  <span className="text-sm text-muted-foreground">Visibility:</span>
                  <Select value={evVisibility} onValueChange={setEvVisibility}>
                    <SelectTrigger className="h-8 text-sm" data-testid="select-visibility"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button className="w-full h-10 px-3 border border-border/60 rounded-md flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30" data-testid="button-add-video">
                  <Video className="w-4 h-4" />
                  Add Video Conference
                  <ChevronDown className="w-3 h-3 ml-auto" />
                </button>
                <button className="w-full h-10 px-3 border border-border/60 rounded-md flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30" data-testid="button-add-attendee">
                  <Users className="w-4 h-4" />
                  Add Attendee
                </button>
                <button className="w-full h-10 px-3 border border-border/60 rounded-md flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30" data-testid="button-add-location">
                  <MapPin className="w-4 h-4" />
                  Add Location
                </button>
                <button className="w-full min-h-[160px] p-3 border border-border/60 rounded-md flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30" data-testid="button-add-note">
                  <FileText className="w-4 h-4 mt-0.5" />
                  Add Note
                </button>
              </div>
            </div>
            <div className="p-4 border-t border-border/40">
              <Button
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setSheetOpen(false)}
                data-testid="button-create-event"
              >
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </Layout>
  );
}
