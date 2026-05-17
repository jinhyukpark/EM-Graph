import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

type Event = {
  id: string;
  date: string;
  title: string;
  type: "meeting" | "deadline" | "review";
  owner: string;
};

const EVENTS: Event[] = [
  { id: "e1", date: "2026-05-18", title: "PET필름 주간 운영회의", type: "meeting", owner: "김민서" },
  { id: "e2", date: "2026-05-19", title: "아라미드 단가 협상 마감", type: "deadline", owner: "박지훈" },
  { id: "e3", date: "2026-05-20", title: "편광필름 품질 리뷰", type: "review", owner: "최수정" },
  { id: "e4", date: "2026-05-22", title: "MOQ 정책 사내 공유", type: "meeting", owner: "정해린" },
  { id: "e5", date: "2026-05-25", title: "공급망 지식정원 검수", type: "review", owner: "박지훈" },
  { id: "e6", date: "2026-05-27", title: "월간 KPI 보고", type: "deadline", owner: "이도현" },
];

const TYPE_STYLE: Record<Event["type"], string> = {
  meeting: "bg-blue-100 text-blue-700 border-blue-200",
  deadline: "bg-rose-100 text-rose-700 border-rose-200",
  review: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const TYPE_LABEL: Record<Event["type"], string> = {
  meeting: "회의",
  deadline: "마감",
  review: "검토",
};

function buildMonthMatrix(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function toKey(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export default function CalendarPage() {
  const { t } = useLanguage();
  const [cursor, setCursor] = useState(new Date(2026, 4, 1));
  const cells = buildMonthMatrix(cursor.getFullYear(), cursor.getMonth());
  const today = new Date();
  const todayKey = toKey(today);
  const eventsByDate = EVENTS.reduce<Record<string, Event[]>>((acc, ev) => {
    (acc[ev.date] ||= []).push(ev);
    return acc;
  }, {});
  const monthEvents = EVENTS.filter((ev) => {
    const d = new Date(ev.date);
    return d.getFullYear() === cursor.getFullYear() && d.getMonth() === cursor.getMonth();
  }).sort((a, b) => a.date.localeCompare(b.date));

  const shift = (delta: number) =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));

  return (
    <Layout>
      <div className="h-full overflow-y-auto bg-background">
        <div className="max-w-6xl mx-auto px-8 py-10 space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CalendarIcon className="w-6 h-6 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight" data-testid="text-calendar-title">{t("calendar")}</h1>
              </div>
              <p className="text-sm text-muted-foreground">팀의 회의, 마감, 검토 일정을 한 화면에서 확인합니다.</p>
            </div>
            <Button className="gap-1" data-testid="button-new-event">
              <Plus className="w-4 h-4" />일정 추가
            </Button>
          </div>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => shift(-1)} data-testid="button-prev-month">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h2 className="text-lg font-semibold" data-testid="text-current-month">
                    {cursor.getFullYear()}년 {cursor.getMonth() + 1}월
                  </h2>
                  <Button variant="ghost" size="icon" onClick={() => shift(1)} data-testid="button-next-month">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={() => setCursor(new Date())} data-testid="button-today">
                  오늘
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-px bg-border rounded-md overflow-hidden border border-border">
                {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
                  <div key={d} className="bg-muted/40 text-center py-2 text-[11px] font-semibold text-muted-foreground">
                    {d}
                  </div>
                ))}
                {cells.map((d, i) => {
                  const key = d ? toKey(d) : `empty-${i}`;
                  const dayEvents = d ? eventsByDate[toKey(d)] ?? [] : [];
                  const isToday = d && toKey(d) === todayKey;
                  return (
                    <div key={key} className={`bg-background min-h-[92px] p-1.5 ${d ? "" : "bg-muted/20"}`}>
                      {d && (
                        <>
                          <div className={`text-[11px] font-medium mb-1 ${isToday ? "text-primary" : "text-foreground"}`}>
                            {d.getDate()}
                            {isToday && <span className="ml-1 text-[10px] text-primary">오늘</span>}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 2).map((ev) => (
                              <div
                                key={ev.id}
                                className={`text-[10px] px-1.5 py-0.5 rounded truncate border ${TYPE_STYLE[ev.type]}`}
                                title={ev.title}
                              >
                                {ev.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="text-[10px] text-muted-foreground">+{dayEvents.length - 2}건 더</div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold mb-3">이번 달 일정 ({monthEvents.length})</h3>
              <ul className="divide-y divide-border">
                {monthEvents.map((ev) => (
                  <li key={ev.id} className="py-2.5 flex items-center gap-3" data-testid={`event-${ev.id}`}>
                    <div className="w-20 text-xs text-muted-foreground">{ev.date}</div>
                    <Badge variant="outline" className={`text-[10px] ${TYPE_STYLE[ev.type]}`}>
                      {TYPE_LABEL[ev.type]}
                    </Badge>
                    <div className="flex-1 text-sm font-medium">{ev.title}</div>
                    <div className="text-xs text-muted-foreground">{ev.owner}</div>
                  </li>
                ))}
                {monthEvents.length === 0 && (
                  <li className="py-6 text-center text-sm text-muted-foreground">이번 달 일정이 없습니다.</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
