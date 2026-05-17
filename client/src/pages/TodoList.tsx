import { useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sparkles, ListFilter, ArrowUpDown, Search, Circle, CheckCircle2,
  FileText, Flag,
} from "lucide-react";

type Priority = "high" | "medium" | "low" | null;

type Task = {
  id: string;
  title: string;
  due: string | null;
  start: string | null;
  note: string | null;
  assignee: string | null;
  priority: Priority;
  done: boolean;
};

const SEED: Task[] = [
  { id: "t1", title: "장외거래 중개업 신청", due: "2026-05-19", start: "2026-05-15", note: "테크스톰 - STO 사업 검토", assignee: "박지훈", priority: "high", done: false },
  { id: "t2", title: "특허 mcp 홍보", due: null, start: null, note: "해야 할 일 모음", assignee: null, priority: "medium", done: false },
  { id: "t3", title: "스톡 게임 적용", due: null, start: null, note: "해야 할 일 모음", assignee: null, priority: "medium", done: false },
  { id: "t4", title: "스톡 마케팅", due: null, start: null, note: "해야 할 일 모음", assignee: null, priority: "low", done: false },
  { id: "t5", title: "홈페이지 개편 em 솔루션 기반", due: "2026-05-30", start: "2026-05-17", note: "해야 할 일 모음", assignee: "김민서", priority: "high", done: false },
  { id: "t6", title: "회사소개서 포맷", due: null, start: null, note: "해야 할 일 모음", assignee: null, priority: "low", done: false },
  { id: "t7", title: "반도체 fdc 사업 진행", due: "2026-06-10", start: "2026-05-20", note: "해야 할 일 모음", assignee: "최수정", priority: "high", done: false },
  { id: "t8", title: "제품소개서 (data, graph, gpt)", due: null, start: null, note: "해야 할 일 모음", assignee: null, priority: "medium", done: false },
  { id: "t9", title: "자외거래 중개업", due: null, start: null, note: "해야 할 일 모음", assignee: null, priority: "low", done: false },
  { id: "t10", title: "재호님 작업 관련 내용 확인", due: "2026-05-10", start: "2026-05-08", note: "260510-내부 프로젝트 검수 노트", assignee: "이도현", priority: "medium", done: true },
  { id: "t11", title: "PET필름 #3 라인 가동률 보고서", due: "2026-05-22", start: "2026-05-18", note: "PET필름 주간 운영회의 W20", assignee: "김민서", priority: "high", done: false },
  { id: "t12", title: "아라미드 단가 협상 회신", due: "2026-05-18", start: "2026-05-14", note: "아라미드 단가 협상 전략 Q3", assignee: "박지훈", priority: "high", done: false },
  { id: "t13", title: "MOQ 정책 개정 초안 사내 공유", due: "2026-05-25", start: "2026-05-20", note: "MOQ 정책 개정 초안", assignee: "정해린", priority: "medium", done: false },
];

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
  return <span className={overdue ? "text-rose-500" : "text-foreground/80"}>{label}</span>;
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>(SEED);
  const [tab, setTab] = useState<Tab>("내 작업");
  const [search, setSearch] = useState("");
  const today = new Date();

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
    return list;
  }, [tasks, tab, search]);

  const toggle = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  return (
    <Layout>
      <div className="h-full overflow-y-auto bg-background">
        <div className="max-w-[1400px] mx-auto px-10 pt-10 pb-16">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl font-bold tracking-tight" data-testid="text-todo-title">작업</h1>
              <span className="text-sm text-muted-foreground">{tasks.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-full text-xs gap-1.5 border-violet-200 text-violet-700 hover:bg-violet-50"
                data-testid="button-new-task"
              >
                <Sparkles className="w-3.5 h-3.5" />새 작업
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" data-testid="button-filter">
                <ListFilter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" data-testid="button-sort">
                <ArrowUpDown className="w-4 h-4" />
              </Button>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="작업을 찾으세요..."
                  className="h-8 w-56 pl-8 text-xs rounded-full border-violet-200 focus-visible:ring-violet-300"
                  data-testid="input-search-task"
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-6 border-b border-border/60">
            {TABS.map((label) => (
              <button
                key={label}
                onClick={() => setTab(label)}
                className={`relative px-3 py-2 text-xs font-medium transition-colors ${
                  tab === label
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`tab-${label}`}
              >
                {label}
                {tab === label && (
                  <span className="absolute left-2 right-2 -bottom-px h-0.5 bg-foreground rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="border border-border/60 rounded-xl overflow-hidden bg-card">
            <div className="grid grid-cols-[1.6fr_0.9fr_0.9fr_1.2fr_0.7fr_0.7fr] px-5 py-2.5 text-[11px] font-medium text-muted-foreground bg-muted/30 border-b border-border/60">
              <div>제목</div>
              <div>마감일</div>
              <div>시작일</div>
              <div>지정된 노트</div>
              <div>작성자</div>
              <div>중요도</div>
            </div>

            <ul>
              {filtered.map((t) => {
                const isOverdue =
                  !!t.due && !t.done && new Date(t.due) < new Date(today.toDateString());
                return (
                  <li
                    key={t.id}
                    className="grid grid-cols-[1.6fr_0.9fr_0.9fr_1.2fr_0.7fr_0.7fr] items-center px-5 py-3 text-sm border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors group"
                    data-testid={`row-task-${t.id}`}
                  >
                    {/* 제목 */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        onClick={() => toggle(t.id)}
                        className="shrink-0"
                        data-testid={`toggle-task-${t.id}`}
                        aria-label="완료 토글"
                      >
                        {t.done ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground" />
                        )}
                      </button>
                      <span
                        className={`truncate ${
                          t.done ? "line-through text-muted-foreground/60" : "text-foreground"
                        }`}
                      >
                        {t.title}
                      </span>
                    </div>

                    {/* 마감일 */}
                    <div className="text-xs">{formatDate(t.due, isOverdue)}</div>

                    {/* 시작일 */}
                    <div className="text-xs">{formatDate(t.start)}</div>

                    {/* 지정된 노트 */}
                    <div className="text-xs min-w-0">
                      {t.note ? (
                        <span className="inline-flex items-center gap-1.5 text-foreground/70 truncate">
                          <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate">{t.note}</span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground/60">-</span>
                      )}
                    </div>

                    {/* 작성자 */}
                    <div className="text-xs">
                      {t.assignee ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-semibold inline-flex items-center justify-center">
                            {t.assignee.charAt(0)}
                          </span>
                          <span className="text-foreground/80">{t.assignee}</span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground/60">-</span>
                      )}
                    </div>

                    {/* 중요도 */}
                    <div className="text-xs">
                      {t.priority ? (
                        <span className={`inline-flex items-center gap-1.5 ${PRIORITY_STYLE[t.priority].text}`}>
                          <Flag className="w-3 h-3" />
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
    </Layout>
  );
}
