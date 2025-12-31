import { useState, useCallback, useRef } from "react";
import Layout from "@/components/layout/Layout";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  FileText, Folder, FolderOpen, Plus, Search, MoreHorizontal, 
  ChevronRight, ChevronDown, Edit3, Share2, MessageSquare, 
  Sparkles, Maximize2, X, Send, Paperclip, Mic, Globe,
  Newspaper,
  Bot, Database, FileCode, Sidebar, PanelLeft, PanelRight, Network, LayoutTemplate, Columns, Trash2, Tag, Calendar, Eye, EyeOff, Image as ImageIcon, AtSign, ArrowUp, Copy, RotateCcw
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ReactFlow, Background, Controls, useNodesState, useEdgesState, BackgroundVariant, ReactFlowProvider, MarkerType } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ImageNode from "@/components/graph/ImageNode";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// --- Mock Data ---

const STATUS_OPTIONS = [
  { id: 'draft', label: '초안', color: 'bg-slate-500' },
  { id: 'review', label: '리뷰중', color: 'bg-orange-500' },
  { id: 'done', label: '완료', color: 'bg-green-500' },
  { id: 'hold', label: '보류', color: 'bg-red-500' },
];

const INITIAL_FILE_TREE = [
  {
    id: "root",
    name: "Knowledge Garden",
    type: "root",
    children: [
      { id: "f1", name: "Test folder 1", type: "folder", children: [] },
      { id: "f2", name: "New Folder 2", type: "folder", children: [] },
      { id: "f3", name: "New Folder", type: "folder", children: [] },
      { id: "f4", name: "Research", type: "folder", children: [
        { id: "n1", name: "Note 1", type: "note" },
        { id: "n2", name: "Note 2", type: "note" },
        { id: "n3", name: "Note 3", type: "note" }
      ]},
      { id: "f5", name: "test", type: "folder", children: [] },
      { id: "f6", name: "Analysis 2024", type: "folder", children: [
         { id: "n4", name: "LG Energy Solution & SK Innovation", type: "note", active: true }
      ]}
    ]
  }
];

const nodeTypes = {
  entity: ImageNode,
};

const INITIAL_NODES = [
  // Center
  { 
    id: 'kang', 
    type: 'entity',
    position: { x: 0, y: 0 }, 
    data: { 
      label: 'Kang "The Viper"', 
      subLabel: 'Crime Boss',
      image: 'https://i.pravatar.cc/150?u=kang',
      borderColor: '#ef4444', // red-500
      highlight: true
    },
    style: { width: 80, height: 80 }
  },
  // Top Left
  { 
    id: 'thug_a', 
    type: 'entity',
    position: { x: -300, y: -150 }, 
    data: { 
      label: 'Thug A', 
      subLabel: 'Associate',
      image: 'https://i.pravatar.cc/150?u=thug',
      borderColor: '#ef4444' // red-500
    },
    style: { width: 60, height: 60 }
  },
  // Top
  { 
    id: 'witness_kim', 
    type: 'entity',
    position: { x: -100, y: -250 }, 
    data: { 
      label: 'Witness Kim', 
      subLabel: 'Observer',
      image: 'https://i.pravatar.cc/150?u=kim',
      borderColor: '#eab308' // yellow-500
    },
    style: { width: 60, height: 60 }
  },
  // Top Right
  { 
    id: 'det_lee', 
    type: 'entity',
    position: { x: 150, y: -280 }, 
    data: { 
      label: 'Det. Lee', 
      subLabel: 'Partner',
      image: 'https://i.pravatar.cc/150?u=lee',
      borderColor: '#3b82f6' // blue-500
    },
    style: { width: 60, height: 60 }
  },
  // Left Middle (Det Choi)
  { 
    id: 'det_choi', 
    type: 'entity',
    position: { x: -100, y: -100 }, 
    data: { 
      label: 'Det. Choi', 
      subLabel: 'Lead Investigator',
      image: 'https://i.pravatar.cc/150?u=choi',
      borderColor: '#3b82f6' // blue-500
    },
    style: { width: 70, height: 70 }
  },
  // Right Middle (Lawyer Han)
  { 
    id: 'lawyer_han', 
    type: 'entity',
    position: { x: 150, y: -80 }, 
    data: { 
      label: 'Lawyer Han', 
      subLabel: 'Defense Attorney',
      image: 'https://i.pravatar.cc/150?u=han',
      borderColor: '#a855f7' // purple-500
    },
    style: { width: 65, height: 65 }
  },
  // Right (Park Razor)
  { 
    id: 'park_razor', 
    type: 'entity',
    position: { x: 300, y: 50 }, 
    data: { 
      label: 'Park "Razor"', 
      subLabel: 'Enforcer',
      image: 'https://i.pravatar.cc/150?u=park',
      borderColor: '#ef4444' // red-500
    },
    style: { width: 70, height: 70 }
  },
  // Bottom Right (Kim Ledger)
  { 
    id: 'kim_ledger', 
    type: 'entity',
    position: { x: 200, y: 250 }, 
    data: { 
      label: 'Kim "Ledger"', 
      subLabel: 'Money Launderer',
      image: 'https://i.pravatar.cc/150?u=ledger',
      borderColor: '#ef4444' // red-500
    },
    style: { width: 65, height: 65 }
  },
  // Bottom (Victim A)
  { 
    id: 'victim_a', 
    type: 'entity',
    position: { x: -50, y: 200 }, 
    data: { 
      label: 'Victim A', 
      subLabel: 'Assault',
      image: 'https://i.pravatar.cc/150?u=victima',
      borderColor: '#f97316' // orange-500
    },
    style: { width: 60, height: 60 }
  },
  // Far Left (Case)
  { 
    id: 'case_22004', 
    type: 'entity',
    position: { x: -350, y: 150 }, 
    data: { 
      label: 'Case #22-004', 
      subLabel: 'Lawsuit',
      borderColor: '#a855f7' // purple-500
    },
    style: { width: 60, height: 60 }
  },
  // Far Left 2 (Victim B)
  { 
    id: 'victim_b', 
    type: 'entity',
    position: { x: -250, y: 20 }, 
    data: { 
      label: 'Victim B', 
      subLabel: 'Fraud',
      borderColor: '#eab308' // yellow-500
    },
    style: { width: 50, height: 50 }
  },
  // Far Right (Company X)
  { 
    id: 'company_x', 
    type: 'entity',
    position: { x: 450, y: -50 }, 
    data: { 
      label: 'Company X', 
      subLabel: 'Fraud Victim',
      borderColor: '#eab308' // yellow-500
    },
    style: { width: 60, height: 60 }
  },
  // Far Right Bottom (Burner Phone)
  { 
    id: 'burner_phone', 
    type: 'entity',
    position: { x: 400, y: 200 }, 
    data: { 
      label: 'Burner Phone', 
      subLabel: 'Evidence',
      borderColor: '#64748b' // slate-500
    },
    style: { width: 50, height: 50 }
  },
  // Bottom Left (Offshore Account)
  { 
    id: 'offshore_account', 
    type: 'entity',
    position: { x: -150, y: 350 }, 
    data: { 
      label: 'Offshore Account', 
      subLabel: 'Asset',
      borderColor: '#10b981' // emerald-500
    },
    style: { width: 60, height: 60 }
  },
  // Bottom Right (Warehouse 4)
  { 
    id: 'warehouse_4', 
    type: 'entity',
    position: { x: 250, y: 350 }, 
    data: { 
      label: 'Warehouse 4', 
      subLabel: 'Crime Scene',
      borderColor: '#10b981' // emerald-500
    },
    style: { width: 60, height: 60 }
  }
];

const INITIAL_EDGES = [
  // Red Arrows (Criminal/Hostile)
  { id: 'e-kang-park', source: 'kang', target: 'park_razor', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
  { id: 'e-kang-kim', source: 'kang', target: 'kim_ledger', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '5,5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
  { id: 'e-park-warehouse', source: 'park_razor', target: 'warehouse_4', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
  { id: 'e-thug-kang', source: 'thug_a', target: 'kang', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
  
  // Blue Lines (Police/Investigation)
  { id: 'e-lee-choi', source: 'det_lee', target: 'det_choi', type: 'straight', style: { stroke: '#3b82f6', strokeWidth: 1.5 } },
  { id: 'e-choi-kang', source: 'det_choi', target: 'kang', type: 'straight', style: { stroke: '#3b82f6', strokeWidth: 1.5, strokeDasharray: '5,5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },
  { id: 'e-choi-case', source: 'det_choi', target: 'case_22004', type: 'straight', style: { stroke: '#3b82f6', strokeWidth: 1.5 } },
  { id: 'e-park-burner', source: 'park_razor', target: 'burner_phone', type: 'straight', style: { stroke: '#3b82f6', strokeWidth: 1.5 } },
  { id: 'e-lee-warehouse', source: 'det_lee', target: 'warehouse_4', type: 'straight', style: { stroke: '#3b82f6', strokeWidth: 1 } },
  
  // Purple (Legal)
  { id: 'e-han-kang', source: 'lawyer_han', target: 'kang', type: 'straight', style: { stroke: '#a855f7', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' } },
  { id: 'e-han-case', source: 'lawyer_han', target: 'case_22004', type: 'straight', style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  
  // Green (Money/Asset)
  { id: 'e-kim-offshore', source: 'kim_ledger', target: 'offshore_account', type: 'straight', style: { stroke: '#10b981', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
  
  // Misc
  { id: 'e-witness-choi', source: 'witness_kim', target: 'det_choi', type: 'straight', style: { stroke: '#eab308', strokeWidth: 1.5, strokeDasharray: '5,5' } },
  { id: 'e-company-kang', source: 'company_x', target: 'kang', type: 'straight', style: { stroke: '#eab308', strokeWidth: 1.5 } },
];

const CHAT_HISTORY = [
  {
    role: "user",
    content: "Summarize the key patents in this document.",
    time: "Today"
  },
  {
    role: "assistant",
    content: "LG 에너지솔루션과 SK이노베이션의 최근 특허 동향을 분석한 결과, 양사는 배터리 안전성과 수명 향상을 위한 기술 개발에 집중하고 있습니다. 특히 LG 에너지솔루션은 하이니켈 양극재 및 실리콘 음극재 관련 특허 출원이 두드러지며, SK이노베이션은 분리막 기술 및 배터리 재활용 기술 관련 특허를 다수 확보하고 있는 것으로 파악됩니다. 또한, 전고체 배터리 등 차세대 배터리 기술 선점을 위한 경쟁도 치열해지고 있습니다. 이 문서는 이러한 기술적 흐름을 바탕으로 향후 시장 점유율 변화 및 기술 분쟁 가능성을 시사하고 있습니다.",
    tool: "MCP Tool • Patent_search",
    data: [
      { id: "Electronic Times", title: "[Analysis] LG Energy Solution vs SK Innovation, Patent Dispute Intensity Increases", date: "2024-12-15" },
      { id: "ZDNet Korea", title: "Battery Industry 'Solid-state Battery' Technology Competition Intensifies", date: "2024-12-10" },
      { id: "Investing.com", title: "Korean Stock Market | 1983-2025 Data | 2026-2027 Forecast - Economic Indicators", date: "2024-12-08" },
      { id: "Investing.com", title: "Korean Stock Market - Investing.com", date: "2024-12-08" },
      { id: "KRX Info System", title: "Korea Exchange | Information Data System", date: "2024-12-05" },
      { id: "Korea Economic Daily", title: "Market Summary | Korea Economic Daily", date: "2024-12-01" },
      { id: "KCIF", title: "2024 Domestic Stock Market Conditions Outlook and Evaluation", date: "2024-11-28" },
      { id: "Hankyoreh", title: "KOSPI & KOSDAQ Both Down 3%, Bitcoin Below $90k", date: "2024-11-25" },
      { id: "Maeil Business", title: "KOSPI & KOSDAQ Close Lower... Market Cools Down on Trump Remarks", date: "2024-11-22" },
      { id: "KyungHyang", title: "Breaking: KOSPI 3900 Line Collapses... KOSPI/KOSDAQ Plunge Over 3%", date: "2024-11-20" }
    ]
  },
  {
    role: "user",
    content: "Find related cases in US market.",
    time: "Today"
  },
  {
    role: "assistant",
    content: "Searching for related litigation in US district courts...",
    tool: "MCP Tool • Legal_search"
  }
];

const INITIAL_SESSIONS = [
  {
    id: 's1',
    title: 'Patent Analysis',
    messages: CHAT_HISTORY
  },
  {
    id: 's2',
    title: 'Legal Review',
    messages: []
  }
];

// --- Components ---

function GraphLegend() {
    return (
        <div className="absolute bottom-6 right-6 z-20 bg-background/95 backdrop-blur-sm border border-border shadow-lg rounded-lg w-64 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/20">
                <span className="text-xs font-semibold text-muted-foreground">매출</span>
                <div className="flex gap-4 text-xs font-semibold text-muted-foreground">
                    <span>개수</span>
                    <span>비중(%)</span>
                </div>
            </div>
            <div className="py-1">
                {[
                    { color: 'bg-red-500', label: '1000억원 이상', count: 154, ratio: '8%' },
                    { color: 'bg-orange-500', label: '1000억원 이하', count: 42, ratio: '2%' },
                    { color: 'bg-amber-500', label: '500억원 이하', count: 133, ratio: '7%' },
                    { color: 'bg-green-500', label: '100억원 이하', count: 90, ratio: '5%' },
                    { color: 'bg-emerald-500', label: '50억원 이하', count: 237, ratio: '12%' },
                    { color: 'bg-blue-600', label: '10억원 이하', count: 84, ratio: '4%' },
                    { color: 'bg-indigo-500', label: '5억원 이하', count: 144, ratio: '7%' },
                    { color: 'bg-purple-500', label: '1억원 이하', count: 36, ratio: '2%' },
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-1.5 hover:bg-muted/50 cursor-pointer text-xs group">
                        <div className="flex items-center gap-2 flex-1">
                            <input type="checkbox" className="h-3 w-3 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
                            <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", item.color)} />
                            <span className="text-foreground truncate">{item.label}</span>
                        </div>
                        <div className="flex gap-4 tabular-nums w-20 justify-end text-muted-foreground group-hover:text-foreground">
                            <span className="w-8 text-right">{item.count}</span>
                            <span className="w-8 text-right">{item.ratio}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const FileTreeNode = ({ node, level = 0 }: { node: any, level?: number }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-1 py-1 px-2 hover:bg-secondary/50 cursor-pointer text-sm ${node.active ? 'bg-secondary text-primary font-medium' : 'text-muted-foreground'}`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => setExpanded(!expanded)}
      >
        {node.children ? (
          <span className="text-muted-foreground/50 w-4 h-4 flex items-center justify-center">
            {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </span>
        ) : <span className="w-4" />}

        {node.type === 'folder' || node.type === 'root' ? (
          expanded ? <FolderOpen className="w-4 h-4 text-blue-400/80" /> : <Folder className="w-4 h-4 text-blue-400/80" />
        ) : (
          <FileText className="w-4 h-4 text-muted-foreground" />
        )}
        <span className="truncate">{node.name}</span>
      </div>

      {expanded && node.children && (
        <div>
          {node.children.map((child: any) => (
            <FileTreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const NewsResultList = ({ data }: { data: any[] }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!data || data.length === 0) return null;

  return (
    <div className="mt-2 border border-border rounded-xl overflow-hidden bg-card/50">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-2.5 py-2 bg-muted/30 hover:bg-muted/50 transition-colors text-xs font-medium"
      >
        <div className="flex items-center gap-2 text-muted-foreground">
             <Globe className="w-3.5 h-3.5 text-blue-500" />
             <span>결과 {data.length}개</span>
        </div>
        <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform duration-200", !isExpanded && "-rotate-90")} />
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="divide-y divide-border/50">
              {data.map((item, idx) => (
                <div key={idx} className="p-3 hover:bg-muted/30 transition-colors cursor-pointer group">
                  <div className="flex items-start gap-2.5">
                    <Globe className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                    <div className="space-y-1 min-w-0">
                      <div className="text-sm text-foreground/90 font-medium leading-snug group-hover:text-blue-600 group-hover:underline decoration-blue-600/30 underline-offset-4">
                        {item.title}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="font-medium text-foreground/70">{item.id}</span>
                        {item.date && <span>{item.date}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Separate GraphView component for ReactFlow
function GraphView() {
  console.log("[GraphView] Component rendering...");

  try {
    const [nodes, , onNodesChange] = useNodesState(INITIAL_NODES);
    const [edges, , onEdgesChange] = useEdgesState(INITIAL_EDGES);

    console.log("[GraphView] Hooks initialized successfully", { nodesCount: nodes.length, edgesCount: edges.length });

    return (
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
      >
        <Background color="#888" gap={20} size={1} variant={BackgroundVariant.Dots} className="opacity-20" />
        <Controls className="!bg-card !border-border !fill-foreground !shadow-sm" />
        <GraphLegend />
      </ReactFlow>
    );
  } catch (error) {
    console.error("[GraphView] Error:", error);
    return <div className="p-4 text-red-500">GraphView Error: {String(error)}</div>;
  }
}

export default function KnowledgeGarden() {
  console.log("[KnowledgeGarden] Component rendering...");

  const [fileTree, setFileTree] = useState(INITIAL_FILE_TREE);
  const [showExplorer, setShowExplorer] = useState(true);
  const [showDocDetails, setShowDocDetails] = useState(true);
  const [showGraph, setShowGraph] = useState(true);
  const [showCopilot, setShowCopilot] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [docStatus, setDocStatus] = useState(STATUS_OPTIONS[0]); // Default: Draft
  const [docTags, setDocTags] = useState<string[]>(['Battery', 'EV']);
  const [customStatuses, setCustomStatuses] = useState<typeof STATUS_OPTIONS>([]);
  const [newStatusName, setNewStatusName] = useState("");
  const [newTagName, setNewTagName] = useState("");

  const [editingMessage, setEditingMessage] = useState<{sessionId: string, index: number} | null>(null);

  const [chatSessions, setChatSessions] = useState(INITIAL_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState('s1');

  const activeSession = chatSessions.find(s => s.id === activeSessionId) || chatSessions[0];

  const handleAddSession = () => {
    const newId = `s${Date.now()}`;
    const newSession = {
      id: newId,
      title: 'New Chat',
      messages: []
    };
    setChatSessions([...chatSessions, newSession]);
    setActiveSessionId(newId);
  };

  const allStatuses = [...STATUS_OPTIONS, ...customStatuses];

  // Helper function to toggle views safely
  const toggleView = (
    viewState: boolean, 
    setViewState: (val: boolean) => void,
    otherViews: boolean[]
  ) => {
    // If we are trying to hide the view (viewState is true)
    if (viewState) {
        // Check if all other views are hidden
        const allOthersHidden = otherViews.every(v => !v);
        if (allOthersHidden) {
            // Prevent hiding and show warning
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 3000);
            return;
        }
    }
    setViewState(!viewState);
  };

  const handleAddStatus = () => {
    if (newStatusName.trim()) {
      setCustomStatuses([...customStatuses, { id: `custom-${Date.now()}`, label: newStatusName, color: 'bg-blue-500' }]);
      setNewStatusName("");
    }
  };

  const handleDeleteStatus = (id: string) => {
    setCustomStatuses(customStatuses.filter(s => s.id !== id));
    if (docStatus.id === id) {
        setDocStatus(STATUS_OPTIONS[0]);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTagName.trim()) {
        if (!docTags.includes(newTagName.trim())) {
            setDocTags([...docTags, newTagName.trim()]);
        }
        setNewTagName("");
    }
  };

  const removeTag = (tagToRemove: string) => {
      setDocTags(docTags.filter(tag => tag !== tagToRemove));
  };

  const handleAddNewFile = () => {
    const newTree = JSON.parse(JSON.stringify(fileTree));
    let added = false;

    // Recursive function to find active node and add sibling
    const addSiblingToActive = (nodes: any[]) => {
      for (const node of nodes) {
        if (node.children) {
          // Check if any child is active
          const activeChildIndex = node.children.findIndex((c: any) => c.active);
          if (activeChildIndex !== -1) {
            // Deactivate current active
            node.children[activeChildIndex].active = false;
            
            // Add new node
            const newNode = {
              id: `n-${Date.now()}`,
              name: "Untitled Note",
              type: "note",
              active: true
            };
            // Insert after active node
            node.children.splice(activeChildIndex + 1, 0, newNode);
            added = true;
            return true;
          }
          
          // Check if folder itself is active (if we supported that) or recurse
          if (addSiblingToActive(node.children)) return true;
        }
      }
      return false;
    };

    if (!addSiblingToActive(newTree)) {
      // Fallback: Add to 'Analysis 2024' (f6) or root's children if not found
      const addToDefault = (nodes: any[]) => {
          for (const node of nodes) {
              if (node.id === 'f6') { // Analysis 2024
                  // Deactivate all
                  node.children.forEach((c: any) => c.active = false);
                  node.children.push({
                      id: `n-${Date.now()}`,
                      name: "Untitled Note",
                      type: "note",
                      active: true
                  });
                  return true;
              }
              if (node.children && addToDefault(node.children)) return true;
          }
          return false;
      }
      addToDefault(newTree);
    }

    setFileTree(newTree);
  };

  const [isProcessing, setIsProcessing] = useState(false);

  // Function to simulate processing state
  const handleSendMessage = () => {
    setIsProcessing(true);
    // Simulate API delay
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <Layout>
      <div className="h-full bg-background flex flex-col relative">
        {/* Warning Toast */}
        <AnimatePresence>
            {showWarning && (
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 20, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none"
                >
                    <div className="bg-background border border-border/50 shadow-lg rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium text-foreground">
                        <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <span className="text-amber-600 text-xs font-bold">!</span>
                        </div>
                        한개의 뷰화면은 존재해야합니다.
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Main Workspace */}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          
          {/* 1. File Tree (Outer Group) */}
          {showExplorer && (
            <>
              <ResizablePanel defaultSize={15} minSize={10} maxSize={20} className="bg-background flex flex-col border-r border-border">
                <div className="h-16 flex items-center justify-between border-b border-border/50 px-2 shrink-0 bg-background relative z-10">
                  <span className="text-xs font-bold text-muted-foreground uppercase px-2">Explorer</span>
                  <div className="flex gap-1">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className={cn("h-8 w-8 text-muted-foreground", showSearch && "text-primary bg-primary/10")}
                        onClick={() => setShowSearch(!showSearch)}
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground"
                        onClick={handleAddNewFile}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <AnimatePresence>
                {showSearch && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-secondary/10 border-b border-border/50"
                    >
                        <div className="p-2">
                             <div className="relative">
                                <Search className="absolute left-2 top-1.5 w-3.5 h-3.5 text-muted-foreground" />
                                <Input 
                                    className="h-8 text-xs pl-8 bg-background border-border/50 focus-visible:ring-1" 
                                    placeholder="Search files..." 
                                    autoFocus
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>
                <ScrollArea className="flex-1 py-2">
                  {fileTree.map(node => <FileTreeNode key={node.id} node={node} />)}
                </ScrollArea>
                
                {/* View Toggles Footer */}
                <div className="p-2 border-t border-border/50 space-y-1">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase px-2 mb-1">View Options</div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn(
                      "w-full justify-between h-8 text-xs font-normal border group",
                      showDocDetails 
                        ? "bg-background border-primary text-primary" 
                        : "border-transparent text-muted-foreground hover:bg-secondary/50"
                    )}
                    onClick={() => toggleView(showDocDetails, setShowDocDetails, [showGraph, showCopilot])}
                  >
                    <div className="flex items-center">
                        <FileText className="w-3.5 h-3.5 mr-2" />
                        Document Details
                    </div>
                    {showDocDetails ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 opacity-50" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn(
                      "w-full justify-between h-8 text-xs font-normal border group",
                      showGraph 
                        ? "bg-background border-primary text-primary" 
                        : "border-transparent text-muted-foreground hover:bg-secondary/50"
                    )}
                    onClick={() => toggleView(showGraph, setShowGraph, [showDocDetails, showCopilot])}
                  >
                    <div className="flex items-center">
                        <Share2 className="w-3.5 h-3.5 mr-2" />
                        Ontology
                    </div>
                    {showGraph ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 opacity-50" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn(
                      "w-full justify-between h-8 text-xs font-normal border group",
                      showCopilot 
                        ? "bg-background border-primary text-primary" 
                        : "border-transparent text-muted-foreground hover:bg-secondary/50"
                    )}
                    onClick={() => toggleView(showCopilot, setShowCopilot, [showDocDetails, showGraph])}
                  >
                    <div className="flex items-center">
                        <Sparkles className="w-3.5 h-3.5 mr-2" />
                        Copilot
                    </div>
                    {showCopilot ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 opacity-50" />}
                  </Button>
                </div>
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}

          {/* Content Wrapper (Inner Group) */}
          <ResizablePanel defaultSize={85}>
            <ResizablePanelGroup direction="horizontal">
            
              {/* 2. Document Editor */}
              {showDocDetails && (
                <ResizablePanel defaultSize={50} minSize={30} className="bg-background flex flex-col">
                {/* Document Breadcrumb Header */}
                <div className="h-16 border-b border-border flex items-center px-4 justify-between bg-background shrink-0">
                  <div className="flex items-center gap-2">
                     <Button 
                        variant="ghost" 
                        size="icon" 
                        className={cn("h-8 w-8 mr-1 text-muted-foreground", !showExplorer && "text-primary bg-primary/10")}
                        onClick={() => setShowExplorer(!showExplorer)}
                        title="Toggle Explorer"
                     >
                       <PanelLeft className="w-4 h-4" />
                     </Button>
    
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                       <span className="font-semibold text-foreground">Knowledge Garden</span>
                       <ChevronRight className="w-4 h-4" />
                       <span>Analysis 2024</span>
                       <ChevronRight className="w-4 h-4" />
                       <span className="text-foreground">LG Energy Solution & SK Innovation</span>
                     </div>
                  </div>
    
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Share2 className="w-4 h-4" /></Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => toggleView(showDocDetails, setShowDocDetails, [showGraph, showCopilot])}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
    
                <ScrollArea className="flex-1">
                  <div className="max-w-3xl mx-auto p-8 space-y-8">
                {/* Document Header */}
                <div className="space-y-4 border-b border-border pb-6">
                   <div className="flex items-center justify-between mb-2">
                     <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Today, 10:23 AM
                     </span>
                     <span className="text-[10px] text-muted-foreground">
                        Edited by You
                     </span>
                   </div>

                   <h1 
                        className="text-3xl font-bold tracking-tight text-foreground leading-tight outline-none hover:bg-secondary/10 focus:bg-secondary/10 rounded transition-colors cursor-text"
                        contentEditable
                        suppressContentEditableWarning
                   >
                        LG Energy Solution & SK Innovation Special Analysis Report
                   </h1>

                   <div className="flex items-center gap-3 pt-1">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    className={cn("h-8 px-3 text-xs font-medium bg-neutral-700 hover:bg-neutral-800 text-white border-transparent gap-1.5 rounded-md shadow-sm")}
                                >
                                    {docStatus.label}
                                    <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56">
                                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Select Status</DropdownMenuLabel>
                                {allStatuses.map(status => (
                                    <DropdownMenuItem 
                                        key={status.id} 
                                        className="justify-between group cursor-pointer"
                                        onClick={() => setDocStatus(status)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-2 h-2 rounded-full", status.color)} />
                                            <span>{status.label}</span>
                                        </div>
                                        {status.id.startsWith('custom-') && (
                                            <Trash2 
                                                className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteStatus(status.id);
                                                }}
                                            />
                                        )}
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <div className="p-2 space-y-2">
                                    <div className="flex gap-1 mb-1 justify-between">
                                        {['bg-slate-500', 'bg-red-500', 'bg-orange-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500'].map(color => (
                                            <div 
                                                key={color}
                                                className={cn("w-4 h-4 rounded-full cursor-pointer hover:scale-110 transition-transform ring-offset-background", color === 'bg-blue-500' ? "ring-2 ring-primary ring-offset-1" : "")}
                                                // Simplified color selection - in a real app this would update a state
                                            />
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Input 
                                            placeholder="New Status..." 
                                            className="h-7 text-xs" 
                                            value={newStatusName}
                                            onChange={(e) => setNewStatusName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddStatus()}
                                        />
                                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={handleAddStatus}>
                                            <Plus className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="h-5 w-px bg-border/60" />
                        
                        <div className="flex items-center gap-2 flex-wrap">
                            {docTags.map(tag => (
                                <Badge key={tag} variant="secondary" className="h-7 px-2.5 text-[11px] font-normal gap-1.5 hover:bg-secondary/80 bg-secondary/50 border-transparent text-foreground/80">
                                    {tag}
                                    <X className="w-3 h-3 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" onClick={() => removeTag(tag)} />
                                </Badge>
                            ))}
                            <div className="relative flex items-center group">
                                <Tag className="absolute left-2.5 w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors z-10" />
                                <Input 
                                    className="h-7 w-24 text-[11px] pl-7 pr-2 bg-transparent border-transparent hover:bg-secondary/30 hover:border-border/50 focus:border-primary focus:w-32 focus:bg-background transition-all rounded-md" 
                                    placeholder="Add tag..."
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    onKeyDown={handleAddTag}
                                />
                            </div>
                        </div>
                     </div>
                </div>

                {/* Content */}
                <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
                  <div>
                    <h2 
                        className="text-xl font-semibold flex items-center gap-2 outline-none hover:bg-secondary/10 focus:bg-secondary/10 rounded transition-colors cursor-text"
                        contentEditable
                        suppressContentEditableWarning
                    >
                      1. Overview
                    </h2>
                    <p 
                        className="text-muted-foreground leading-relaxed outline-none hover:bg-secondary/10 focus:bg-secondary/10 rounded transition-colors cursor-text mt-2"
                        contentEditable
                        suppressContentEditableWarning
                    >
                      This report analyzes recent patent filings by LG Energy Solution and SK Innovation to understand their technological development directions and core competencies. Both companies are major players in the secondary battery market and are strengthening their technological competitiveness through active patent activities.
                    </p>
                  </div>

                  <div>
                    <h2 
                        className="text-xl font-semibold flex items-center gap-2 outline-none hover:bg-secondary/10 focus:bg-secondary/10 rounded transition-colors cursor-text"
                        contentEditable
                        suppressContentEditableWarning
                    >
                      2. LG Energy Solution Patent List (Total 10)
                    </h2>
                    
                    <div className="border border-border rounded-lg overflow-hidden mt-4">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-secondary/30 text-xs uppercase text-muted-foreground font-medium">
                          <tr>
                            <th className="px-4 py-3">No</th>
                            <th className="px-4 py-3">App Number</th>
                            <th className="px-4 py-3">Invention Name</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr>
                            <td className="px-4 py-3">1</td>
                            <td className="px-4 py-3 font-mono text-xs">1020250175306</td>
                            <td className="px-4 py-3">Secondary battery including cathode active material</td>
                            <td className="px-4 py-3 text-muted-foreground">2025-11-18</td>
                            <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">Public</Badge></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3">2</td>
                            <td className="px-4 py-3 font-mono text-xs">1020250170023</td>
                            <td className="px-4 py-3">Battery module and battery pack including same</td>
                            <td className="px-4 py-3 text-muted-foreground">2025-11-12</td>
                            <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">Public</Badge></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3">3</td>
                            <td className="px-4 py-3 font-mono text-xs">1020250170024</td>
                            <td className="px-4 py-3">Battery management system and method</td>
                            <td className="px-4 py-3 text-muted-foreground">2025-11-12</td>
                            <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">Public</Badge></td>
                          </tr>
                           <tr>
                            <td className="px-4 py-3">4</td>
                            <td className="px-4 py-3 font-mono text-xs">1020250167131</td>
                            <td className="px-4 py-3">Thermal management system for electric vehicles</td>
                            <td className="px-4 py-3 text-muted-foreground">2025-11-07</td>
                            <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">Public</Badge></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </ResizablePanel>
              )}

          {/* 3. Graph View */}
              {showGraph && (
                <>
                  {showDocDetails && <ResizableHandle />}
                  <ResizablePanel defaultSize={30} minSize={20} className="bg-background border-r border-border relative flex flex-col">
                     {/* Graph Header - Empty but height aligned */}
                     <div className="h-16 border-b border-border flex items-center justify-between px-3 bg-background shrink-0">
                       <div className="flex items-center gap-2 px-2">
                          <Share2 className="w-5 h-5 text-blue-500" />
                          <span className="font-semibold text-sm">Ontology</span>
                       </div>
                       <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => toggleView(showGraph, setShowGraph, [showDocDetails, showCopilot])}
                       >
                         <X className="w-4 h-4 text-muted-foreground" />
                       </Button>
                     </div>
                    <div className="flex-1 w-full relative">
                      <ReactFlowProvider>
                        <GraphView />
                      </ReactFlowProvider>
                    </div>
                  </ResizablePanel>
                </>
              )}

              {/* 4. AI Copilot */}
              {showCopilot && (
                <>
                  {(showDocDetails || showGraph) && <ResizableHandle />}
                  <ResizablePanel defaultSize={20} minSize={15} className="bg-background flex flex-col">
                    <div className="h-16 border-b border-border flex items-center px-3 justify-between shrink-0 bg-background">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <span className="font-semibold text-sm">Copilot</span>
                      </div>
                      <div className="flex gap-1">
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => toggleView(showCopilot, setShowCopilot, [showDocDetails, showGraph])}
                         >
                            <X className="w-4 h-4 text-muted-foreground" />
                         </Button>
                      </div>
                    </div>
                    {/* ... Copilot Content ... */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                       {/* New Chat Tabs */}
                       <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide items-center px-1">
                         {chatSessions.map(session => (
                           <Button 
                             key={session.id}
                             variant="ghost"
                             size="sm" 
                             className={cn(
                               "h-8 text-xs whitespace-nowrap px-3.5 rounded-lg transition-all duration-200 border",
                               activeSessionId === session.id 
                                 ? "bg-blue-600 text-white font-medium shadow-md border-blue-600 hover:bg-blue-700 hover:text-white" 
                                 : "bg-background border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                             )}
                             onClick={() => setActiveSessionId(session.id)}
                           >
                             {session.title}
                           </Button>
                         ))}
                         <div className="flex-1" />
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-primary hover:bg-primary/10 rounded-full shrink-0"
                            onClick={handleAddSession}
                         >
                           <Plus className="w-4 h-4" />
                         </Button>
                       </div>
        
                       {/* Chat Messages */}
                       {activeSession.messages.length === 0 ? (
                         <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-xs">
                           <Bot className="w-8 h-8 mb-2 opacity-20" />
                           <p>Start a new conversation</p>
                         </div>
                       ) : (
                         activeSession.messages.map((msg, i) => (
                         <div key={i} className="space-y-2">
                            <div className="flex items-center justify-between">
                               <span className="text-[10px] font-bold text-muted-foreground uppercase">{msg.role === 'user' ? 'Me' : 'Nexus AI'}</span>
                               {msg.time && <span className="text-[10px] text-muted-foreground">{msg.time}</span>}
                            </div>
                            
                            {msg.tool && (
                              <div className="bg-secondary/30 border border-border rounded px-2.5 py-1.5 text-xs flex items-center gap-2 text-muted-foreground w-fit mb-2">
                                <Database className="w-3.5 h-3.5 text-blue-500" />
                                <div className="flex items-center gap-2">
                                  {msg.tool.includes(' • ') ? (
                                    msg.tool.split(' • ').map((part, idx) => (
                                      <div key={idx} className="flex items-center gap-2">
                                        {idx > 0 && <div className="h-3 w-[1px] bg-border/60" />}
                                        <span className={idx === 1 ? "font-medium text-foreground/80" : ""}>{part}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <span>{msg.tool}</span>
                                  )}
                                </div>
                              </div>
                            )}
                            {msg.data && (
                               <NewsResultList data={msg.data} />
                            )}

                            <div className={`text-sm leading-relaxed ${msg.role === 'user' ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {msg.role === 'user' ? (
                                <div 
                                  className={cn(
                                    "relative transition-all duration-200 rounded-lg",
                                    editingMessage?.sessionId === activeSessionId && editingMessage?.index === i ? "ring-2 ring-primary bg-background shadow-lg scale-[1.01]" : "bg-transparent"
                                  )}
                                  onDoubleClick={() => setEditingMessage({ sessionId: activeSessionId, index: i })}
                                >
                                  <Textarea 
                                    className={cn(
                                      "min-h-[40px] w-full resize-none border-0 bg-transparent shadow-none p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0",
                                      editingMessage?.sessionId === activeSessionId && editingMessage?.index === i ? "text-foreground p-3" : "text-foreground cursor-default"
                                    )}
                                    value={msg.content}
                                    readOnly={!(editingMessage?.sessionId === activeSessionId && editingMessage?.index === i)}
                                    onChange={(e) => {
                                      const newSessions = [...chatSessions];
                                      const sessionIndex = newSessions.findIndex(s => s.id === activeSessionId);
                                      if (sessionIndex !== -1) {
                                        newSessions[sessionIndex].messages[i].content = e.target.value;
                                        setChatSessions(newSessions);
                                      }
                                    }}
                                  />
                                  
                                  {/* Toolbar for editing mode */}
                                  {editingMessage?.sessionId === activeSessionId && editingMessage?.index === i && (
                                    <div className="flex items-center justify-between p-2 rounded-b-lg border-t border-border/50 bg-muted/20">
                                       <div className="flex items-center gap-1 shrink-0">
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs font-medium text-muted-foreground hover:text-foreground gap-1.5 rounded-full hover:bg-secondary/80">
                                                    <span className="truncate max-w-[80px] sm:max-w-none">Sonnet 4.5</span>
                                                    <ChevronDown className="w-3 h-3 opacity-50" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start">
                                                <DropdownMenuItem>Sonnet 4.5</DropdownMenuItem>
                                                <DropdownMenuItem>GPT-4o</DropdownMenuItem>
                                                <DropdownMenuItem>Gemini 1.5 Pro</DropdownMenuItem>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                       </div>

                                       <div className="flex items-center gap-1 shrink-0 ml-auto">
                                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary/80">
                                            <AtSign className="w-4 h-4" />
                                          </Button>
                                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary/80">
                                            <FileText className="w-4 h-4" />
                                          </Button>
                                          <Button 
                                            size="icon" 
                                            className="h-8 w-8 ml-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-sm"
                                            onClick={() => {
                                              setEditingMessage(null);
                                              handleSendMessage();
                                            }}
                                          >
                                            <ArrowUp className="w-4 h-4" />
                                          </Button>
                                       </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                msg.content
                              )}
                            </div>
                            {msg.role === 'assistant' && (
                                <div className="flex justify-between mt-1 items-center">
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full hover:bg-secondary text-muted-foreground hover:text-primary" title="Rollback">
                                        <RotateCcw className="w-3.5 h-3.5" />
                                    </Button>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-transparent text-blue-500 hover:text-blue-600" title="Ontology">
                                            <Share2 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full hover:bg-secondary text-muted-foreground hover:text-primary" title="Copy text">
                                            <Copy className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full hover:bg-secondary text-muted-foreground hover:text-red-500" title="Delete message">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                            
                            {i < activeSession.messages.length - 1 && <Separator className="my-4" />}
                         </div>
                       )))}
                    </div>
        
                    {/* Input Area */}
                    <div className="p-4 bg-background">
                      {isProcessing && (
                         <motion.div 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: 10 }}
                           className="flex items-center gap-2 mb-3 px-1"
                         >
                           <div className="grid grid-cols-2 gap-0.5">
                             <motion.div 
                               className="w-1.5 h-1.5 rounded-full bg-primary"
                               animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                               transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                             />
                             <motion.div 
                               className="w-1.5 h-1.5 rounded-full bg-primary"
                               animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                               transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                             />
                             <motion.div 
                               className="w-1.5 h-1.5 rounded-full bg-primary"
                               animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                               transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                             />
                             <motion.div 
                               className="w-1.5 h-1.5 rounded-full bg-primary"
                               animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                               transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
                             />
                           </div>
                           <span className="text-sm font-medium text-foreground">Working.</span>
                         </motion.div>
                      )}

                      <div className="relative border border-blue-500 rounded-xl shadow-sm bg-background focus-within:ring-1 focus-within:ring-blue-600 focus-within:border-blue-600 transition-all">
                        <Textarea 
                          placeholder="Ask anything..." 
                          className="min-h-[60px] max-h-[200px] w-full resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none p-3 text-sm placeholder:text-muted-foreground/60" 
                        />
                        
                        <div className="flex items-center justify-between p-2 rounded-b-xl flex-wrap gap-2">
                           <div className="flex items-center gap-1 shrink-0">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs font-medium text-muted-foreground hover:text-foreground gap-1.5 rounded-full hover:bg-secondary/80">
                                        <span className="truncate max-w-[80px] sm:max-w-none">Sonnet 4.5</span>
                                        <ChevronDown className="w-3 h-3 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem>Sonnet 4.5</DropdownMenuItem>
                                    <DropdownMenuItem>GPT-4o</DropdownMenuItem>
                                    <DropdownMenuItem>Gemini 1.5 Pro</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                           </div>

                           <div className="flex items-center gap-1 shrink-0 ml-auto">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary/80">
                                <AtSign className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary/80">
                                <FileText className="w-4 h-4" />
                              </Button>
                              <Button size="icon" className="h-8 w-8 ml-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-sm" onClick={handleSendMessage}>
                                {isProcessing ? (
                                  <div className="w-3 h-3 bg-primary-foreground rounded-[1px]" />
                                ) : (
                                  <ArrowUp className="w-4 h-4" />
                                )}
                              </Button>
                           </div>
                        </div>
                      </div>
                    </div>
                  </ResizablePanel>
                </>
              )}

            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </Layout>
  );
}
