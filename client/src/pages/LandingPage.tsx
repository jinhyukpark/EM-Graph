import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  ArrowRight, Brain, Check, Sprout, BookOpen, Search, ListChecks,
  Calendar, Users, Network, FileText, Link2,
  Tag, Globe as GlobeIcon, Workflow, Table2, Share2, SlidersHorizontal, Database,
  Send, Plus, Puzzle, Save,
} from "lucide-react";
import { useState, useEffect } from "react";
import { translations } from "@/lib/translations";
import { motion, AnimatePresence } from "framer-motion";


const gridIcons = [Sprout, BookOpen, Search, ListChecks, Calendar, Save, Users, Brain];
const gridIconStyles = [
  "bg-blue-100 text-blue-600",
  "bg-indigo-100 text-indigo-600",
  "bg-purple-100 text-purple-600",
  "bg-emerald-100 text-emerald-600",
  "bg-sky-100 text-sky-600",
  "bg-amber-100 text-amber-600",
  "bg-rose-100 text-rose-600",
  "bg-violet-100 text-violet-600",
];

const highlightAccents = [
  { pill: "bg-blue-100 text-blue-700", icon: BookOpen, iconBg: "bg-blue-100 text-blue-600", chip: "bg-blue-50 text-blue-700 border-blue-100" },
  { pill: "bg-purple-100 text-purple-700", icon: Network, iconBg: "bg-purple-100 text-purple-600", chip: "bg-purple-50 text-purple-700 border-purple-100" },
  { pill: "bg-violet-100 text-violet-700", icon: Brain, iconBg: "bg-violet-100 text-violet-600", chip: "bg-violet-50 text-violet-700 border-violet-100" },
  { pill: "bg-indigo-100 text-indigo-700", icon: Users, iconBg: "bg-indigo-100 text-indigo-600", chip: "bg-indigo-50 text-indigo-700 border-indigo-100" },
];

const engineIcons = [Workflow, Network, Table2, Share2, SlidersHorizontal, Database];
const engineStyles = [
  "bg-blue-100 text-blue-600",
  "bg-purple-100 text-purple-600",
  "bg-indigo-100 text-indigo-600",
  "bg-violet-100 text-violet-600",
  "bg-sky-100 text-sky-600",
  "bg-blue-100 text-blue-600",
];

const float = (delay: number, distance = 12) => ({
  animate: { y: [0, -distance, 0] },
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const, delay },
});

type PreviewT = (typeof translations)['en']['hero']['preview'];

function Typewriter({ text, speed = 38, startDelay = 0, className }: { text: string; speed?: number; startDelay?: number; className?: string }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setShown(text.slice(0, i));
        if (i >= text.length && interval) clearInterval(interval);
      }, speed);
    }, startDelay);
    return () => { clearTimeout(start); if (interval) clearInterval(interval); };
  }, [text, speed, startDelay]);
  return (
    <span className={className}>
      {shown}
      {shown.length < text.length && (
        <span className="inline-block w-[2px] h-[1em] -mb-0.5 ml-0.5 bg-current animate-pulse align-middle" />
      )}
    </span>
  );
}

const GRAPH_NODES = [
  { cx: "22%", cy: "26%", color: "bg-blue-400" },
  { cx: "80%", cy: "24%", color: "bg-purple-400" },
  { cx: "26%", cy: "80%", color: "bg-sky-400" },
  { cx: "80%", cy: "78%", color: "bg-indigo-400" },
];

function HeroDemo({ p }: { p: PreviewT }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const durations = [4200, 4400, 5200];
    const id = setTimeout(() => setStep((s) => (s + 1) % 3), durations[step]);
    return () => clearTimeout(id);
  }, [step]);

  return (
    <motion.div {...float(0.3, 8)} className="rounded-2xl border bg-white shadow-2xl overflow-hidden text-left">
      {/* Window top bar */}
      <div className="h-11 bg-slate-50 border-b flex items-center px-4 gap-4">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 flex items-center">
          <div className="bg-white text-slate-500 text-xs px-3 py-1.5 rounded-md flex items-center gap-2 border w-full max-w-md">
            <Sprout className="w-3 h-3 text-primary" />
            <span className="truncate">{p.breadcrumb}</span>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Mini sidebar */}
        <div className="w-14 bg-slate-50/70 border-r flex flex-col items-center py-4 gap-3 shrink-0">
          <div className="p-2 bg-primary rounded-lg shadow-sm"><Sprout className="w-4 h-4 text-primary-foreground" /></div>
          <div className="p-2 rounded-lg"><Search className="w-4 h-4 text-slate-400" /></div>
          <div className="p-2 rounded-lg"><ListChecks className="w-4 h-4 text-slate-400" /></div>
          <div className="p-2 rounded-lg"><Users className="w-4 h-4 text-slate-400" /></div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Step tabs */}
          <div className="flex items-center gap-1.5 px-5 md:px-7 pt-4 pb-1">
            {p.steps.map((label, i) => (
              <div
                key={i}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors ${
                  step === i ? 'bg-primary/10 text-primary' : 'text-slate-400'
                }`}
                data-testid={`hero-step-${i}`}
              >
                {label}
              </div>
            ))}
          </div>

          <div className="px-5 md:px-7 pb-6 pt-2 min-h-[260px]">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="note"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {[p.tag1, p.tag2].map((tg, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 + i * 0.15, type: "spring", stiffness: 400, damping: 20 }}
                        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                          i === 0 ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-purple-50 text-purple-700 border-purple-100'
                        }`}
                      >
                        <Tag className="w-3 h-3" /> {tg}
                      </motion.span>
                    ))}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 min-h-[1.75rem]">
                    <Typewriter text={p.noteTitle} startDelay={450} />
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5 max-w-xl min-h-[2.5rem]">
                    <Typewriter text={p.noteBody} speed={18} startDelay={1500} />
                  </p>
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3.2 }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1"
                  >
                    <Check className="w-3.5 h-3.5" /> {p.saved}
                  </motion.div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="graph"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="relative h-[230px] rounded-xl border bg-slate-50/60 overflow-hidden"
                >
                  <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
                    {GRAPH_NODES.map((n, i) => (
                      <motion.line
                        key={i}
                        x1="50%" y1="50%" x2={n.cx} y2={n.cy}
                        stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 + i * 0.35 }}
                      />
                    ))}
                  </svg>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
                      className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
                    >
                      <Network className="w-5 h-5" />
                    </motion.div>
                  </div>
                  {GRAPH_NODES.map((n, i) => (
                    <div
                      key={i}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                      style={{ left: n.cx, top: n.cy }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.7 + i * 0.35 }}
                        className={`w-7 h-7 rounded-full shadow-md ${n.color}`}
                      />
                    </div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20, delay: 2.3 }}
                    className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-white border border-emerald-100 shadow-sm rounded-full px-3 py-1.5"
                  >
                    <Link2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-xs font-semibold text-slate-700">{p.connections}</span>
                  </motion.div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col gap-3"
                >
                  {/* User question */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="self-end max-w-[80%] bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-2.5 text-sm shadow-sm"
                  >
                    <Typewriter text={p.chatPrompt} startDelay={400} />
                  </motion.div>
                  {/* AI answer */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.9 }}
                    className="self-start max-w-[88%] flex gap-2"
                  >
                    <div className="w-7 h-7 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-white flex items-center justify-center shadow-sm">
                      <Brain className="w-4 h-4" />
                    </div>
                    <div className="bg-slate-100 text-slate-700 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed">
                      <Typewriter text={p.chatAnswer} speed={16} startDelay={2100} />
                    </div>
                  </motion.div>
                  {/* Input bar */}
                  <div className="mt-auto pt-2">
                    <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white">
                      <Plus className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="flex-1 text-xs text-slate-400 truncate">{p.typePlaceholder}</span>
                      <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                        <Send className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── HIGHLIGHT MOCK 1: Explorer + Editor ────────────────────────────────────
const TREE_DATA = [
  { depth: 0, label: "Knowledge Garden", isFolder: true, active: false, isNew: false, highlight: false, count: 0 },
  { depth: 1, label: "Competitor Analysis", isFolder: true, count: 4, active: false, isNew: false, highlight: false },
  { depth: 1, label: "Market Research", isFolder: true, count: 3, active: false, isNew: false, highlight: false },
  { depth: 1, label: "Patent Research", isFolder: true, count: 9, active: true, isNew: false, highlight: false },
  { depth: 2, label: "Industry Trend Research", isFolder: false, isNew: true, active: false, highlight: false, count: 0 },
  { depth: 2, label: "Battery Materials Market Trends", isFolder: false, active: false, isNew: false, highlight: false, count: 0 },
  { depth: 2, label: "LG Energy Solution & SK Innovation", isFolder: false, isNew: true, active: true, highlight: true, count: 0 },
];

function MockExplorer() {
  const [visible, setVisible] = useState(4);
  useEffect(() => {
    const t = setInterval(() => setVisible(v => (v < TREE_DATA.length ? v + 1 : v)), 380);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden text-left">
      <div className="h-8 bg-slate-50 border-b flex items-center px-3 gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-400" /><div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <span className="ml-2 text-[11px] text-slate-400 truncate">Knowledge Garden / Patent Research</span>
      </div>
      <div className="flex" style={{ height: 300 }}>
        <div className="w-44 border-r bg-slate-50/70 overflow-hidden shrink-0 py-1">
          <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">탐색기</div>
          {TREE_DATA.slice(0, visible).map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-1.5 py-[3px] pr-2 rounded-sm text-[11px] cursor-pointer ${item.highlight ? "bg-primary/10 text-primary font-semibold" : item.active ? "text-slate-800 font-medium" : "text-slate-500"}`}
              style={{ paddingLeft: `${6 + item.depth * 10}px` }}>
              {item.isFolder
                ? <BookOpen className="w-3 h-3 shrink-0 text-blue-500 opacity-80" />
                : <FileText className="w-3 h-3 shrink-0 text-slate-400 opacity-70" />}
              <span className="truncate flex-1">{item.label}</span>
              {item.isNew && <span className="shrink-0 text-[8px] bg-blue-100 text-blue-600 font-bold px-1 rounded">NEW</span>}
              {item.count > 0 && !item.isNew && <span className="shrink-0 text-[9px] text-slate-400">{item.count}</span>}
            </motion.div>
          ))}
        </div>
        <div className="flex-1 p-3 overflow-hidden flex flex-col gap-2">
          <div className="text-[9px] text-slate-400">LG Energy Solution & SK Innovation</div>
          <div className="text-xs font-bold text-slate-800 leading-snug">Patent Dispute Analysis: LG Energy Solution vs SK Innovation</div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-100 rounded px-1.5 py-0.5 flex items-center gap-1">
              <Brain className="w-2.5 h-2.5 inline" /> AI 생성 · Oct 12, 2025
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-4">전기차 배터리 제조사 간 진행 중인 특허 분쟁에 대한 종합 분석. 주요 특허, 법적 주장, 잠재적 시장 영향을 검토합니다.</p>
          <div className="mt-auto flex items-center gap-3">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.6 }}
              className="inline-flex items-center gap-1 text-[9px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
              <FileText className="w-2.5 h-2.5" /> 1,247 노트
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.9 }}
              className="inline-flex items-center gap-1 text-[9px] text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1">
              <Link2 className="w-2.5 h-2.5" /> 12 연결
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HIGHLIGHT MOCK 2: Graph Visualization ──────────────────────────────────
const GV_NODES = [
  { id: 0, label: "LG에너지솔루션", x: 50, y: 22, r: 22, fill: "#a78bfa" },
  { id: 1, label: "SK이노베이션", x: 80, y: 50, r: 17, fill: "#60a5fa" },
  { id: 2, label: "특허분쟁", x: 22, y: 58, r: 15, fill: "#818cf8" },
  { id: 3, label: "배터리셀", x: 68, y: 78, r: 13, fill: "#38bdf8" },
  { id: 4, label: "이차전지", x: 16, y: 30, r: 11, fill: "#c084fc" },
  { id: 5, label: "양극재", x: 50, y: 68, r: 10, fill: "#7dd3fc" },
];
const GV_EDGES = [[0,1],[0,2],[1,3],[2,3],[0,4],[3,5],[1,5]];

function MockGraphViz() {
  const [shownNodes, setShownNodes] = useState(0);
  const [shownEdges, setShownEdges] = useState(0);
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    GV_NODES.forEach((_, i) => timers.push(setTimeout(() => setShownNodes(i + 1), 300 + i * 320)));
    GV_EDGES.forEach((_, i) => timers.push(setTimeout(() => setShownEdges(i + 1), 300 + GV_NODES.length * 320 + 200 + i * 230)));
    return () => timers.forEach(clearTimeout);
  }, []);
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden text-left">
      <div className="h-8 bg-slate-50 border-b flex items-center px-3 gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-400" /><div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <span className="ml-2 text-[11px] text-slate-400">그래프 뷰 — Patent Analysis</span>
      </div>
      <div className="relative bg-slate-50/40" style={{ height: 300 }}>
        <svg className="absolute inset-0 w-full h-full" aria-hidden>
          {GV_EDGES.slice(0, shownEdges).map(([a, b], i) => (
            <motion.line key={i}
              x1={`${GV_NODES[a].x}%`} y1={`${GV_NODES[a].y}%`}
              x2={`${GV_NODES[b].x}%`} y2={`${GV_NODES[b].y}%`}
              stroke="#c7d2fe" strokeWidth="1.5" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.45 }}
            />
          ))}
        </svg>
        {GV_NODES.slice(0, shownNodes).map((node, i) => (
          <motion.div key={i} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 18 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 z-10"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}>
            <div className="rounded-full shadow-md flex items-center justify-center text-white font-bold"
              style={{ width: node.r * 2, height: node.r * 2, background: node.fill, fontSize: node.r * 0.55 }}>
              {node.label[0]}
            </div>
            <span className="text-[9px] text-slate-600 font-medium bg-white/85 rounded px-1 whitespace-nowrap shadow-sm">{node.label}</span>
          </motion.div>
        ))}
        {shownEdges >= GV_EDGES.length && (
          <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }}
            className="absolute top-3 right-3 flex items-center gap-1.5 bg-white border border-emerald-100 shadow-sm rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700 z-20">
            <Link2 className="w-3.5 h-3.5 text-emerald-500" /> 12 connections
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── HIGHLIGHT MOCK 3: AI Copilot Chat ──────────────────────────────────────
function MockAIChat() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 700),
      setTimeout(() => setPhase(2), 2300),
      setTimeout(() => setPhase(3), 3500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);
  const AI_ANS = "3건의 핵심 특허를 확인했습니다: ① 양극재 특허(2025-11-18) ② 배터리 모듈 특허(2025-11-12) ③ 배터리 관리 시스템 특허(2025-11-12)";
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden text-left">
      <div className="h-8 bg-slate-50 border-b flex items-center px-3 gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-400" /><div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <span className="ml-2 text-[11px] text-slate-400">AI Copilot</span>
        <div className="ml-auto flex items-center gap-1">
          <span className="text-[9px] bg-primary/10 text-primary font-semibold rounded px-2 py-0.5">특허 분석</span>
          <span className="text-[9px] text-slate-400 px-1.5 py-0.5">법률 검토</span>
        </div>
      </div>
      <div className="flex flex-col gap-2.5 p-3" style={{ minHeight: 220 }}>
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div key="user" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="self-end max-w-[82%] bg-primary text-primary-foreground rounded-xl rounded-br-sm px-3 py-2 text-[11px]">
              이 문서의 핵심 특허를 요약해줘
            </motion.div>
          )}
          {phase === 2 && (
            <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="self-start flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shrink-0">
                <Brain className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-slate-100 rounded-xl rounded-tl-sm px-3 py-2 flex gap-1 items-center">
                {[0,1,2].map(i => (
                  <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400"
                    animate={{ y: [0,-4,0] }} transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>
            </motion.div>
          )}
          {phase >= 3 && (
            <motion.div key="ai" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="self-start flex gap-1.5 max-w-[92%]">
              <div className="w-6 h-6 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                <Brain className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-slate-100 text-slate-700 rounded-xl rounded-tl-sm px-3 py-2 text-[11px] leading-relaxed">
                <Typewriter text={AI_ANS} speed={22} startDelay={80} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="px-3 pb-3 mt-auto">
        <div className="flex items-center gap-2 border rounded-lg px-2.5 py-1.5 bg-slate-50 text-[11px] text-slate-400">
          <span className="flex-1">Ask anything...</span>
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center shrink-0">
            <Send className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HIGHLIGHT MOCK 4: Shared With Me ───────────────────────────────────────
const SHARED_DOCS = [
  { initials: "JK", name: "Stock Investment Insights", sub: "3 notes", color: "bg-blue-500", isNew: false },
  { initials: "SH", name: "2024 KOSPI Semiconductor Sector Outlook", sub: "기업연구", color: "bg-purple-500", isNew: false },
  { initials: "MR", name: "Samsung vs SK Hynix Comparison", sub: "비교분석", color: "bg-indigo-500", isNew: true },
  { initials: "BG", name: "Battery Big 3 Investment Points", sub: "투자분석", color: "bg-violet-500", isNew: true },
  { initials: "JO", name: "USD/KRW Weekly FX Note", sub: "FX 리서치", color: "bg-sky-500", isNew: true },
];

function MockSharedWithMe() {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    const timers = SHARED_DOCS.map((_, i) => setTimeout(() => setVisible(i + 1), i * 430 + 300));
    return () => timers.forEach(clearTimeout);
  }, []);
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden text-left">
      <div className="h-8 bg-slate-50 border-b flex items-center px-3 gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-400" /><div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <span className="ml-2 text-[11px] text-slate-400">Shared With Me</span>
      </div>
      <div className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] font-semibold text-slate-700">공유된 지식 정원</span>
          <motion.span animate={{ opacity: 1 }} initial={{ opacity: 0 }}
            className="ml-auto text-[9px] bg-primary/10 text-primary rounded-full px-2 py-0.5 font-semibold">
            {visible}명 연결
          </motion.span>
        </div>
        <div className="flex flex-col gap-1.5">
          {SHARED_DOCS.slice(0, visible).map((doc, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 340, damping: 22 }}
              className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
              <div className={`w-7 h-7 rounded-full ${doc.color} text-white text-[10px] font-bold flex items-center justify-center shrink-0`}>
                {doc.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-slate-700 truncate">{doc.name}</div>
                <div className="text-[9px] text-slate-400">{doc.sub}</div>
              </div>
              {doc.isNew && <span className="text-[8px] bg-blue-100 text-blue-600 font-bold px-1.5 py-0.5 rounded shrink-0">NEW</span>}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

const HIGHLIGHT_MOCKS = [MockExplorer, MockGraphViz, MockAIChat, MockSharedWithMe];

export default function LandingPage() {
  const [lang, setLang] = useState<'en' | 'ko'>('en');
  const t = translations[lang];

  const toggleLanguage = () => setLang(prev => (prev === 'en' ? 'ko' : 'en'));

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const p = t.hero.preview;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sprout className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">EM-Graph</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <button onClick={() => scrollToSection('features')} className="hover:text-foreground transition-colors" data-testid="link-nav-features">{t.nav.features}</button>
            <button onClick={() => scrollToSection('highlights')} className="hover:text-foreground transition-colors" data-testid="link-nav-highlights">{t.nav.solutions}</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-foreground transition-colors" data-testid="link-nav-pricing">{t.nav.pricing}</button>
          </nav>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="hidden md:flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground"
              data-testid="button-toggle-language"
            >
              <GlobeIcon className="w-4 h-4" />
              {lang === 'en' ? 'ENG' : 'KOR'}
            </Button>
            <Link href="/dashboard">
              <Button variant="ghost" data-testid="button-login">{t.nav.login}</Button>
            </Link>
            <Link href="/organization-select">
              <Button data-testid="button-get-started">{t.nav.getStarted}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-28">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="absolute top-0 right-0 -z-10 opacity-30 blur-3xl overflow-hidden">
          <div className="w-[700px] h-[700px] bg-primary/20 rounded-full translate-x-1/3 -translate-y-1/3" />
        </div>
        <div className="absolute top-40 left-0 -z-10 opacity-25 blur-3xl overflow-hidden">
          <div className="w-[600px] h-[600px] bg-purple-400/20 rounded-full -translate-x-1/3" />
        </div>

        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold border-transparent bg-primary/10 text-primary mb-8">
              <Sprout className="w-3.5 h-3.5 mr-1.5" />
              {t.hero.newBadge}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto leading-tight" data-testid="text-hero-title">
              {t.hero.titleLine} <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                {t.hero.subtitle}
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              {t.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/organization-select">
                <Button size="lg" className="h-12 px-8 text-base gap-2" data-testid="button-hero-start">
                  {t.hero.startBtn} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base" data-testid="button-hero-demo">
                {t.hero.demoBtn}
              </Button>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              {t.hero.loginPrompt}{' '}
              <Link href="/dashboard">
                <span className="font-semibold text-primary underline-offset-4 hover:underline cursor-pointer">{t.hero.loginLink}</span>
              </Link>
            </p>
          </motion.div>

          {/* Animated Product Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-20 relative mx-auto max-w-4xl"
          >
            {/* Floating accent chips */}
            <motion.div
              {...float(0)}
              className="absolute -top-6 -left-4 md:-left-10 z-20 hidden sm:flex items-center gap-2 bg-white border border-slate-100 shadow-xl rounded-xl px-4 py-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <Search className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-slate-700">{p.chipSearch}</span>
            </motion.div>

            <motion.div
              {...float(1.2)}
              className="absolute top-1/2 -right-4 md:-right-12 z-20 hidden sm:flex items-center gap-2 bg-white border border-slate-100 shadow-xl rounded-xl px-4 py-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Link2 className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-slate-700">{p.chipLink}</span>
            </motion.div>

            <motion.div
              {...float(0.6)}
              className="absolute -bottom-5 left-6 md:left-12 z-20 hidden sm:flex items-center gap-2 bg-white border border-slate-100 shadow-xl rounded-xl px-4 py-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-slate-700">{p.chipNote}</span>
            </motion.div>

            {/* Animated app window */}
            <HeroDemo p={p} />
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" data-testid="text-grid-title">{t.grid.title}</h2>
            <p className="text-muted-foreground max-w-4xl mx-auto break-keep">{t.grid.subtitle}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.grid.items.map((item, i) => {
              const Icon = gridIcons[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 4) * 0.08 }}
                  className="bg-background rounded-2xl border shadow-sm hover:shadow-md transition-all p-6"
                  data-testid={`card-feature-${i}`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${gridIconStyles[i]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed break-keep">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dark Productivity Band */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-24">
        <div className="absolute -top-20 -left-20 w-[420px] h-[420px] bg-blue-600/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-16 w-[460px] h-[460px] bg-purple-600/30 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/3 w-[260px] h-[260px] bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-5">{t.band.title}</h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-lg">{t.band.desc}</p>
            <Link href="/organization-select">
              <Button size="lg" className="h-12 px-8 text-base bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 gap-2" data-testid="button-band-learn-more">
                {t.band.btn} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Highlights — alternating rows */}
      <section id="highlights" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t.highlights.title}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">{t.highlights.subtitle}</p>
          </div>

          <div className="space-y-20">
            {t.highlights.rows.map((row, i) => {
              const accent = highlightAccents[i];
              const Icon = accent.icon;
              const imageLeft = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: imageLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col md:flex-row items-center gap-12 lg:gap-20"
                  data-testid={`row-highlight-${i}`}
                >
                  <div className={`flex-1 w-full ${imageLeft ? 'order-2 md:order-1' : 'order-2 md:order-2'}`}>
                    <div className="transform hover:-translate-y-1 transition-transform duration-500">
                      {(() => { const Mock = HIGHLIGHT_MOCKS[i]; return <Mock />; })()}
                    </div>
                  </div>
                  <div className={`flex-1 space-y-6 ${imageLeft ? 'order-1 md:order-2' : 'order-1 md:order-1'}`}>
                    <span className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full ${accent.pill}`}>{row.pill}</span>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${accent.iconBg}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">{row.title}</h3>
                      <p className="text-lg text-slate-600 leading-relaxed mb-6">{row.desc}</p>
                      <div className="flex flex-col gap-3">
                        {row.benefits.map((benefit, idx) => (
                          <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg border font-medium text-sm ${accent.chip}`}>
                            <div className="w-5 h-5 rounded-full bg-white/70 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3" />
                            </div>
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Graph & Data Engine */}
      <section id="engine" className="py-24 bg-gradient-to-br from-blue-50/60 via-white to-purple-50/50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="inline-flex items-center rounded-full border border-transparent bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
                <Network className="w-3.5 h-3.5 mr-1.5" />
                {t.engine.badge}
              </div>
              <div className="inline-flex items-center rounded-full bg-amber-100 text-amber-700 px-3 py-1 text-xs font-semibold" data-testid="badge-engine-plugin">
                <Puzzle className="w-3.5 h-3.5 mr-1.5" />
                {t.engine.plugin}
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" data-testid="text-engine-title">{t.engine.title}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">{t.engine.subtitle}</p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-amber-700" data-testid="text-engine-plugin-note">
              <Puzzle className="w-4 h-4" />
              {t.engine.pluginNote}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.engine.items.map((item, i) => {
              const Icon = engineIcons[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                  className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all p-6"
                  data-testid={`card-engine-${i}`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${engineStyles[i]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed break-keep">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{t.pricing.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.pricing.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 border shadow-sm hover:shadow-md transition-shadow relative"
            >
              <h3 className="text-xl font-semibold mb-2">{t.pricing.starter.name}</h3>
              <p className="text-muted-foreground text-sm mb-6">{t.pricing.starter.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {t.pricing.starter.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" data-testid="button-pricing-starter">{t.pricing.starter.btn}</Button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl p-8 border-2 border-primary shadow-lg relative transform scale-105 z-10"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                {t.pricing.pro.badge}
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.pricing.pro.name}</h3>
              <p className="text-muted-foreground text-sm mb-6">{t.pricing.pro.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {t.pricing.pro.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" data-testid="button-pricing-pro">{t.pricing.pro.btn}</Button>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 border shadow-sm hover:shadow-md transition-shadow relative"
            >
              <h3 className="text-xl font-semibold mb-2">{t.pricing.enterprise.name}</h3>
              <p className="text-muted-foreground text-sm mb-6">{t.pricing.enterprise.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">{t.pricing.enterprise.price}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {t.pricing.enterprise.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" data-testid="button-pricing-enterprise">{t.pricing.enterprise.btn}</Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-[420px] h-[420px] bg-blue-600/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 w-[460px] h-[460px] bg-purple-600/25 rounded-full blur-3xl" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.cta.title}</h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-10 text-lg">{t.cta.desc}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-slate-700 hover:bg-slate-800 text-slate-100 hover:text-white" data-testid="button-cta-inquiry">
                {t.cta.btnSecondary}
              </Button>
              <Link href="/signup">
                <Button size="lg" className="h-14 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-cta-signup">
                  {t.cta.btnPrimary}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-12 border-t">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <Sprout className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg tracking-tight">EM-Graph</span>
              </div>
              <p className="text-sm text-muted-foreground">{t.footer.tagline}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t.footer.product}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-foreground text-left">{t.nav.features}</button></li>
                <li><button onClick={() => scrollToSection('highlights')} className="hover:text-foreground text-left">{t.nav.solutions}</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-foreground text-left">{t.nav.pricing}</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t.footer.resources}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Blog</li>
                <li>Community</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t.footer.company}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About Us</li>
                <li>Careers</li>
                <li>Legal</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">{t.footer.copyright}</p>
            <div className="flex gap-4">
              <div className="w-5 h-5 bg-muted rounded-full" />
              <div className="w-5 h-5 bg-muted rounded-full" />
              <div className="w-5 h-5 bg-muted rounded-full" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
