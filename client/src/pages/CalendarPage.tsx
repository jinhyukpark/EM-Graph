import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Mic, CalendarPlus, Sparkles, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight,
  Eye, EyeOff, Plus, X, Video, Users, MapPin, FileText,
} from "lucide-react";

type CalEvent = {
  id: string;
  date: string;
  start: string;
  title: string;
  color: string;
  calendar: string;
};

const EVENTS: CalEvent[] = [
  { id: "e1", date: "2026-04-27", start: "15:00", title: "MATI 프로젝트 킥오프", color: "bg-violet-200 text-violet-900 border-l-violet-500", calendar: "이벤트" },
  { id: "e2", date: "2026-04-30", start: "13:45", title: "(주)일루넥스 주간 점검", color: "bg-blue-200 text-blue-900 border-l-blue-500", calendar: "jh.park@illunex.com" },
  { id: "e3", date: "2026-04-30", start: "14:45", title: "(주)일루넥스 마케팅 회의", color: "bg-blue-200 text-blue-900 border-l-blue-500", calendar: "jh.park@illunex.com" },
  { id: "e4", date: "2026-05-04", start: "10:30", title: "PET필름 주간 운영회의", color: "bg-emerald-200 text-emerald-900 border-l-emerald-500", calendar: "이벤트" },
  { id: "e5", date: "2026-05-12", start: "14:00", title: "아라미드 단가 협상 미팅", color: "bg-rose-200 text-rose-900 border-l-rose-500", calendar: "작업" },
  { id: "e6", date: "2026-05-16", start: "11:00", title: "편광필름 품질 리뷰", color: "bg-amber-200 text-amber-900 border-l-amber-500", calendar: "이벤트" },
  { id: "e7", date: "2026-05-19", start: "16:00", title: "MOQ 정책 사내 공유", color: "bg-violet-200 text-violet-900 border-l-violet-500", calendar: "이벤트" },
  { id: "e8", date: "2026-05-25", start: "09:00", title: "흥대 외주사 미팅", color: "bg-blue-200 text-blue-900 border-l-blue-500", calendar: "jh.park@illunex.com" },
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
  const eventsByDate = useMemo(() => {
    return EVENTS.reduce<Record<string, CalEvent[]>>((acc, ev) => {
      (acc[ev.date] ||= []).push(ev);
      return acc;
    }, {});
  }, []);

  const monthLabel = `${cursor.getFullYear()}년 ${cursor.getMonth() + 1}월`;
  const shiftMonth = (delta: number) =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
  const toggleAccount = (id: string) =>
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, visible: !a.visible } : a)));

  return (
    <Layout>
      <div className="h-full flex flex-col bg-background overflow-hidden">
        <div className="flex-1 flex flex-col px-8 pt-6 pb-6 min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 shrink-0">
            <h1 className="text-3xl font-bold tracking-tight" data-testid="text-calendar-title">캘린더</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-10 rounded-full text-sm gap-2 border-violet-200 text-violet-700 hover:bg-violet-50" data-testid="button-new-recording">
                <Mic className="w-4 h-4" />새 녹음
              </Button>
              <Button variant="outline" size="sm" className="h-10 rounded-full text-sm gap-2 border-rose-200 text-rose-700 hover:bg-rose-50" data-testid="button-new-event">
                <CalendarPlus className="w-4 h-4" />새 이벤트
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-violet-600" data-testid="button-ai">
                <Sparkles className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground" data-testid="button-sort">
                <ArrowUpDown className="w-5 h-5" />
              </Button>
              <button className="h-10 px-4 inline-flex items-center gap-1.5 rounded-md border border-border text-sm text-foreground hover:bg-muted" data-testid="button-view">
                월 <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-[280px_1fr] gap-8 flex-1 min-h-0">
            {/* Sidebar */}
            <aside className="space-y-6 overflow-y-auto pr-1">
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
              <div>
                <div className="text-xs text-muted-foreground mb-3 font-medium">Evernote 캘린더</div>
                <ul className="space-y-2">
                  {CALENDAR_ACCOUNTS.map((c) => (
                    <li key={c.id} className="flex items-center gap-2.5 text-sm text-foreground/80">
                      <span className={`w-3 h-3 rounded-full ${c.color}`} />
                      {c.name}
                    </li>
                  ))}
                </ul>
              </div>

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
            </aside>

            {/* Main calendar */}
            <section className="relative flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <div className="text-base font-semibold">{monthLabel}</div>
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
                  return (
                    <div key={wi} className="grid grid-cols-[48px_repeat(7,1fr)] border-b border-border/40 last:border-b-0 min-h-0">
                      <div className="text-xs text-muted-foreground/60 flex items-center justify-center border-r border-border/40">
                        주 {wk}
                      </div>
                      {week.map((d) => {
                        const key = toKey(d);
                        const isOther = d.getMonth() !== cursor.getMonth();
                        const isToday = toKey(d) === toKey(today);
                        const dayEvents = eventsByDate[key] ?? [];
                        return (
                          <div
                            key={key}
                            onContextMenu={(e) => handleCellContext(e, d)}
                            className={`px-2.5 py-2.5 border-r border-border/40 last:border-r-0 overflow-hidden flex flex-col ${
                              isOther ? "bg-muted/20" : ""
                            }`}
                            data-testid={`day-cell-${key}`}
                          >
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
                            <div className="space-y-1 flex-1 overflow-hidden">
                              {dayEvents.slice(0, 3).map((ev) => (
                                <div
                                  key={ev.id}
                                  className={`text-xs px-2 py-1 rounded border-l-2 truncate ${ev.color}`}
                                  title={`${ev.start} ${ev.title}`}
                                  data-testid={`event-${ev.id}`}
                                >
                                  <span className="opacity-80">{Number(ev.start.split(":")[0]) >= 12 ? "오후" : "오전"} {ev.start}</span>{" "}
                                  {ev.title}
                                </div>
                              ))}
                              {dayEvents.length > 3 && (
                                <div className="text-xs text-muted-foreground pl-1">+{dayEvents.length - 3}건</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
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

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="left" className="w-[380px] p-0 flex flex-col gap-0">
            <div className="px-5 pt-5 pb-3 border-b border-border/40 flex items-center gap-3">
              <button onClick={() => setSheetOpen(false)} className="text-muted-foreground hover:text-foreground" data-testid="button-close-event">
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
          </SheetContent>
        </Sheet>
      </div>
    </Layout>
  );
}
