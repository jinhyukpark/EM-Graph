import { useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Mic, CalendarPlus, Sparkles, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight,
  Eye, EyeOff, Plus,
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

export default function CalendarPage() {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(2026, 4, 1));
  const [accounts, setAccounts] = useState(ACCOUNT_LIST);

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
      <div className="h-full overflow-y-auto bg-background">
        <div className="max-w-[1500px] mx-auto px-8 pt-8 pb-16">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold tracking-tight" data-testid="text-calendar-title">캘린더</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 rounded-full text-xs gap-1.5 border-violet-200 text-violet-700 hover:bg-violet-50" data-testid="button-new-recording">
                <Mic className="w-3.5 h-3.5" />새 녹음
              </Button>
              <Button variant="outline" size="sm" className="h-8 rounded-full text-xs gap-1.5 border-rose-200 text-rose-700 hover:bg-rose-50" data-testid="button-new-event">
                <CalendarPlus className="w-3.5 h-3.5" />새 이벤트
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-violet-600" data-testid="button-ai">
                <Sparkles className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" data-testid="button-sort">
                <ArrowUpDown className="w-4 h-4" />
              </Button>
              <button className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border text-xs text-foreground hover:bg-muted" data-testid="button-view">
                월 <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-[240px_1fr] gap-6">
            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Mini calendar */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold">{monthLabel}</div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <button onClick={() => shiftMonth(-1)} className="p-1 hover:text-foreground" data-testid="mini-prev"><ChevronLeft className="w-3.5 h-3.5" /></button>
                    <button onClick={() => shiftMonth(1)} className="p-1 hover:text-foreground" data-testid="mini-next"><ChevronRight className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-y-1 text-[10px] text-center">
                  {KO_MINI_DAYS.map((d) => (
                    <div key={d} className="text-muted-foreground/70 pb-1">{d}</div>
                  ))}
                  {miniCells.map((d, i) => {
                    const isOther = d.getMonth() !== cursor.getMonth();
                    const isToday = toKey(d) === toKey(today);
                    return (
                      <div key={i} className="flex items-center justify-center h-6">
                        <span
                          className={`w-6 h-6 inline-flex items-center justify-center rounded-full text-[10px] ${
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
                <div className="text-[11px] text-muted-foreground mb-2">Evernote 캘린더</div>
                <ul className="space-y-1.5">
                  {CALENDAR_ACCOUNTS.map((c) => (
                    <li key={c.id} className="flex items-center gap-2 text-xs text-foreground/80">
                      <span className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
                      {c.name}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Accounts */}
              <div>
                <div className="text-[11px] text-muted-foreground mb-2">jh.park@illunex.com</div>
                <ul className="space-y-1.5">
                  {accounts.map((a) => (
                    <li key={a.id} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-foreground/80 truncate">
                        <span className={`w-2.5 h-2.5 rounded-full ${a.color}`} />
                        <span className="truncate">{a.email}</span>
                      </span>
                      <button
                        onClick={() => toggleAccount(a.id)}
                        className="p-1 text-muted-foreground hover:text-foreground"
                        data-testid={`toggle-account-${a.id}`}
                        aria-label="가시성 토글"
                      >
                        {a.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connections */}
              <div>
                <div className="text-[11px] text-muted-foreground mb-2">캘린더 연결</div>
                <ul className="space-y-1.5">
                  {CONNECTIONS.map((c) => (
                    <li key={c.id} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-foreground/80">
                        <span className={`w-5 h-5 inline-flex items-center justify-center rounded font-bold text-xs ${c.color}`}>{c.icon}</span>
                        {c.name}
                      </span>
                      <button className="p-1 text-muted-foreground hover:text-foreground" data-testid={`connect-${c.id}`} aria-label="연결">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Main calendar */}
            <section className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold">{monthLabel}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <button onClick={() => setCursor(new Date())} className="px-2 py-1 hover:text-foreground" data-testid="button-today-main">오늘</button>
                  <button onClick={() => shiftMonth(-1)} className="p-1 hover:text-foreground" data-testid="main-prev"><ChevronLeft className="w-3.5 h-3.5" /></button>
                  <button onClick={() => shiftMonth(1)} className="p-1 hover:text-foreground" data-testid="main-next"><ChevronRight className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-[36px_repeat(7,1fr)] border-b border-border/60">
                <div />
                {KO_DAYS.map((d) => (
                  <div key={d} className="px-2 py-2 text-[11px] font-medium text-muted-foreground">{d}</div>
                ))}
              </div>

              {/* Weeks */}
              <div>
                {weeks.map((week, wi) => {
                  const wk = isoWeek(week[0]);
                  return (
                    <div key={wi} className="grid grid-cols-[36px_repeat(7,1fr)] border-b border-border/40 min-h-[110px]">
                      <div className="text-[10px] text-muted-foreground/60 flex items-center justify-center border-r border-border/40">
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
                            className={`px-2 py-2 border-r border-border/40 last:border-r-0 ${
                              isOther ? "bg-muted/20" : ""
                            }`}
                          >
                            <div className="flex items-center justify-end mb-1">
                              <span
                                className={`text-[11px] inline-flex items-center justify-center ${
                                  isToday
                                    ? "w-6 h-6 rounded-full bg-violet-600 text-white font-semibold"
                                    : isOther
                                    ? "text-muted-foreground/40"
                                    : "text-foreground/70"
                                }`}
                              >
                                {d.getDate()}
                                {!isToday && <span className="ml-0.5 text-muted-foreground/50">일</span>}
                              </span>
                            </div>
                            <div className="space-y-1">
                              {dayEvents.slice(0, 3).map((ev) => (
                                <div
                                  key={ev.id}
                                  className={`text-[10px] px-1.5 py-0.5 rounded-sm border-l-2 truncate ${ev.color}`}
                                  title={`${ev.start} ${ev.title}`}
                                  data-testid={`event-${ev.id}`}
                                >
                                  <span className="opacity-80">{Number(ev.start.split(":")[0]) >= 12 ? "오후" : "오전"} {ev.start}</span>{" "}
                                  {ev.title}
                                </div>
                              ))}
                              {dayEvents.length > 3 && (
                                <div className="text-[10px] text-muted-foreground">+{dayEvents.length - 3}건</div>
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
                className="absolute bottom-2 right-2 w-11 h-11 rounded-full bg-foreground text-background shadow-lg hover:scale-105 transition-transform inline-flex items-center justify-center"
                data-testid="button-fab-add"
                aria-label="새 이벤트"
              >
                <Plus className="w-5 h-5" />
              </button>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
