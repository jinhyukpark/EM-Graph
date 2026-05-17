import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ListTodo, Plus, Calendar as CalendarIcon, User as UserIcon, Flag } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

type Todo = {
  id: string;
  title: string;
  assignee: string;
  due: string;
  priority: "high" | "medium" | "low";
  project: string;
  done: boolean;
};

const SEED: Todo[] = [
  { id: "td1", title: "PET필름 #3 라인 가동률 보고서 작성", assignee: "박지훈", due: "2026-05-19", priority: "high", project: "필름사업본부", done: false },
  { id: "td2", title: "아라미드 단가 협상 자료 검토 회신", assignee: "김민서", due: "2026-05-18", priority: "high", project: "산업자재", done: false },
  { id: "td3", title: "편광필름 품질 이슈 원인 분석 노트 정리", assignee: "최수정", due: "2026-05-20", priority: "medium", project: "필름사업본부", done: false },
  { id: "td4", title: "MOQ 정책 개정 초안 사내 공유", assignee: "정해린", due: "2026-05-22", priority: "medium", project: "영업본부", done: false },
  { id: "td5", title: "열연코일 BOM 자재 코드 매핑 4건 보완", assignee: "이도현", due: "2026-05-17", priority: "low", project: "철강사업본부", done: true },
  { id: "td6", title: "공급망 지식정원 신규 노드 검수", assignee: "박지훈", due: "2026-05-21", priority: "low", project: "공급망", done: false },
];

const PRIORITY_STYLE: Record<Todo["priority"], string> = {
  high: "bg-rose-100 text-rose-700 border-rose-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-slate-100 text-slate-600 border-slate-200",
};

const PRIORITY_LABEL: Record<Todo["priority"], string> = {
  high: "긴급",
  medium: "보통",
  low: "낮음",
};

export default function TodoList() {
  const { t } = useLanguage();
  const [todos, setTodos] = useState<Todo[]>(SEED);
  const [filter, setFilter] = useState<"all" | "open" | "done">("all");
  const [newTitle, setNewTitle] = useState("");

  const toggle = (id: string) =>
    setTodos((prev) => prev.map((td) => (td.id === id ? { ...td, done: !td.done } : td)));

  const add = () => {
    if (!newTitle.trim()) return;
    setTodos((prev) => [
      {
        id: `td${Date.now()}`,
        title: newTitle.trim(),
        assignee: "나",
        due: new Date().toISOString().slice(0, 10),
        priority: "medium",
        project: "기타",
        done: false,
      },
      ...prev,
    ]);
    setNewTitle("");
  };

  const filtered = todos.filter((td) =>
    filter === "all" ? true : filter === "done" ? td.done : !td.done
  );
  const openCount = todos.filter((td) => !td.done).length;
  const doneCount = todos.filter((td) => td.done).length;

  return (
    <Layout>
      <div className="h-full overflow-y-auto bg-background">
        <div className="max-w-5xl mx-auto px-8 py-10 space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ListTodo className="w-6 h-6 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight" data-testid="text-todolist-title">{t("todoList")}</h1>
              </div>
              <p className="text-sm text-muted-foreground">팀의 작업과 노트에서 발생한 할 일을 한 곳에서 관리합니다.</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>진행 중 <span className="font-semibold text-foreground">{openCount}</span></span>
              <span>완료 <span className="font-semibold text-foreground">{doneCount}</span></span>
            </div>
          </div>

          <Card>
            <CardContent className="p-4 flex items-center gap-2">
              <Input
                placeholder="새 할 일을 입력하고 Enter 키를 누르세요"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && add()}
                data-testid="input-new-todo"
              />
              <Button onClick={add} className="gap-1" data-testid="button-add-todo">
                <Plus className="w-4 h-4" />추가
              </Button>
            </CardContent>
          </Card>

          <div className="flex items-center gap-2">
            {([
              ["all", "전체"],
              ["open", "진행 중"],
              ["done", "완료"],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  filter === key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:bg-muted"
                }`}
                data-testid={`filter-${key}`}
              >
                {label}
              </button>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">할 일 ({filtered.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {filtered.map((td) => (
                  <li
                    key={td.id}
                    className="flex items-start gap-3 px-5 py-3 hover:bg-muted/40 transition-colors"
                    data-testid={`todo-${td.id}`}
                  >
                    <Checkbox
                      checked={td.done}
                      onCheckedChange={() => toggle(td.id)}
                      className="mt-1"
                      data-testid={`checkbox-todo-${td.id}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${td.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {td.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" />{td.assignee}</span>
                        <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" />{td.due}</span>
                        <Badge variant="outline" className="text-[10px] h-4 px-1.5">{td.project}</Badge>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-[10px] gap-1 ${PRIORITY_STYLE[td.priority]}`}>
                      <Flag className="w-3 h-3" />
                      {PRIORITY_LABEL[td.priority]}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
