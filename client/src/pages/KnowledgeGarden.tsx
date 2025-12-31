import { useState, useCallback, useRef, useEffect } from "react";
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
  Newspaper, Smile, Layout as LayoutIcon, BadgeCheck, User,
  Bot, Database, FileCode, Sidebar, PanelLeft, PanelRight, Network, LayoutTemplate, Columns, Trash2, Tag, Calendar as CalendarIcon, Eye, EyeOff, Image as ImageIcon, AtSign, ArrowUp, Copy, RotateCcw, Link
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ReactFlow, Background, Controls, useNodesState, useEdgesState, BackgroundVariant, ReactFlowProvider, MarkerType } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ImageNode from "@/components/graph/ImageNode";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

// --- Mock Data ---

const STATUS_OPTIONS = [
  { id: 'draft', label: 'Draft', color: 'bg-slate-500' },
  { id: 'review', label: 'Review', color: 'bg-orange-500' },
  { id: 'done', label: 'Done', color: 'bg-green-500' },
  { id: 'hold', label: 'Hold', color: 'bg-red-500' },
];

const INITIAL_FILE_TREE = [
  {
    id: "root",
    name: "Knowledge Garden",
    type: "root",
    children: [
      { id: "f1", name: "Test Folder 1", type: "folder", children: [] },
      { id: "f2", name: "New Folder 2", type: "folder", children: [] },
      { id: "f3", name: "New Folder", type: "folder", children: [] },
      { id: "f4", name: "Research", type: "folder", children: [
        { id: "n1", name: "Note 1", type: "note" },
        { id: "n2", name: "Note 2", type: "note" },
        { id: "n3", name: "Note 3", type: "note" }
      ]},
      { id: "f5", name: "Test", type: "folder", children: [] },
      { id: "f6", name: "2024 Analysis", type: "folder", children: [
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
      borderColor: '#ef4444', // red-500
      highlight: true,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
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
      borderColor: '#ef4444', // red-500
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'
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
      borderColor: '#eab308', // yellow-500
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop'
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
      borderColor: '#3b82f6', // blue-500
      image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop'
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
      borderColor: '#3b82f6', // blue-500
      image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop'
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
      borderColor: '#a855f7', // purple-500
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
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
      borderColor: '#ef4444', // red-500
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop'
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
      borderColor: '#ef4444', // red-500
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
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
      borderColor: '#f97316', // orange-500
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop'
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
    content: "Based on the recent patent trends analysis of LG Energy Solution and SK Innovation, both companies are focusing on developing technology to improve battery safety and lifespan. LG Energy Solution is particularly prominent in patent applications related to high-nickel cathode materials and silicon anode materials, while SK Innovation is identified as securing numerous patents related to separator technology and battery recycling technology. Competition is also intensifying to secure next-generation battery technologies such as solid-state batteries. This document suggests changes in market share and potential technical disputes based on these technological trends.",
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
    content: "Find related cases in the US market.",
    time: "Today"
  },
  {
    role: "assistant",
    content: "Searching for related lawsuits in US District Courts...",
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
                <span className="text-xs font-semibold text-muted-foreground">Views</span>
                <div className="flex gap-4 text-xs font-semibold text-muted-foreground">
                    <span>Count</span>
                    <span>Ratio(%)</span>
                </div>
            </div>
            <div className="py-1">
                {[
                    { color: 'bg-red-500', label: '> 1000', count: 154, ratio: '8%' },
                    { color: 'bg-orange-500', label: '< 1000', count: 42, ratio: '2%' },
                    { color: 'bg-amber-500', label: '< 500', count: 133, ratio: '7%' },
                    { color: 'bg-green-500', label: '< 100', count: 90, ratio: '5%' },
                    { color: 'bg-emerald-500', label: '< 50', count: 237, ratio: '12%' },
                    { color: 'bg-blue-600', label: '< 10', count: 84, ratio: '4%' },
                    { color: 'bg-indigo-500', label: '< 5', count: 144, ratio: '7%' },
                    { color: 'bg-purple-500', label: '< 1', count: 36, ratio: '2%' },
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
             <span>News Results {data.length}</span>
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

const WikiLink = ({ children }: { children: string }) => {
  const docName = children.replace(/\[\[|\]\]/g, '');
  
  return (
    <span 
      className="inline-flex items-center gap-1.5 text-blue-600 bg-blue-50/50 hover:bg-blue-100/80 border border-blue-100 hover:border-blue-200 rounded-md px-2 py-0.5 cursor-pointer transition-all text-[13px] font-medium align-middle mx-1 select-none group shadow-sm hover:shadow"
      onClick={(e) => {
        e.stopPropagation();
        toast.info("Navigate to Document", {
          description: `Navigating to '${docName}'...`
        });
      }}
    >
      <Link className="w-3 h-3 text-blue-400 group-hover:text-blue-600 transition-colors" />
      <span className="border-b border-transparent group-hover:border-blue-600/30">{docName}</span>
    </span>
  );
};

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
  const [docDate, setDocDate] = useState<Date>(new Date(2025, 11, 15)); // Dec 15, 2025
  const [docTags, setDocTags] = useState<string[]>(['Battery', 'EV']);
  const [customStatuses, setCustomStatuses] = useState<typeof STATUS_OPTIONS>([]);
  const [newStatusName, setNewStatusName] = useState("");
  const [newTagName, setNewTagName] = useState("");

  const [editingMessage, setEditingMessage] = useState<{sessionId: string, index: number} | null>(null);
  
  // Dialog state
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditingTags, setIsEditingTags] = useState(false);
  
  // Ref for handling click outside
  const editingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (editingRef.current && !editingRef.current.contains(event.target as Node)) {
        setEditingMessage(null);
      }
    }

    if (editingMessage) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingMessage]);


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

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteSessionId(sessionId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteSession = () => {
    if (deleteSessionId) {
      const newSessions = chatSessions.filter(s => s.id !== deleteSessionId);
      
      if (newSessions.length === 0) {
          // If all deleted, add a new empty one
          const newId = `s${Date.now()}`;
          setChatSessions([{ id: newId, title: 'New Chat', messages: [] }]);
          setActiveSessionId(newId);
      } else {
          setChatSessions(newSessions);
          if (activeSessionId === deleteSessionId) {
            setActiveSessionId(newSessions[0].id);
          }
      }
      setDeleteSessionId(null);
      setShowDeleteDialog(false);
    }
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

  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendMessage = () => {
    // Implement dummy response or logic here
    console.log("Sending message...", prompt);
    // ... logic for adding message
  };

  return (
    <Layout>
      <div className="h-full flex flex-col bg-background relative overflow-hidden">
         {/* Warning Toast */}
         <AnimatePresence>
            {showWarning && (
                <motion.div 
                    initial={{ opacity: 0, y: -20, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, y: -20, x: "-50%" }}
                    className="absolute top-4 left-1/2 z-50 bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
                >
                    <X className="w-4 h-4" />
                    <span className="text-sm font-medium">At least one view must be open.</span>
                </motion.div>
            )}
         </AnimatePresence>

        <ResizablePanelGroup direction="horizontal">
          {/* 1. File Explorer */}
          {showExplorer && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="bg-muted/10 border-r border-border flex flex-col">
                <div className="h-16 border-b border-border flex items-center px-4 shrink-0 justify-between">
                  <div className="flex items-center gap-2 text-foreground/80">
                     <Folder className="w-5 h-5 text-blue-500" />
                     <span className="font-semibold text-sm">탐색기</span>
                  </div>
                  <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handleAddNewFile}>
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => toggleView(showExplorer, setShowExplorer, [showDocDetails, showGraph, showCopilot])}
                      >
                         <PanelLeft className="w-4 h-4" />
                      </Button>
                  </div>
                </div>
                <ScrollArea className="flex-1">
                   <div className="p-2">
                     {fileTree.map(node => (
                       <FileTreeNode key={node.id} node={node} />
                     ))}
                   </div>
                </ScrollArea>
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}

          {/* Main Content Area */}
          <ResizablePanel defaultSize={80}>
            <ResizablePanelGroup direction="horizontal">
              
              {/* 2. Document Details */}
              {showDocDetails && (
              <ResizablePanel defaultSize={40} minSize={30} className="bg-background flex flex-col relative group">
                <div className="h-16 border-b border-border flex items-center justify-between px-6 shrink-0 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
                  <div className="flex items-center gap-3">
                     {!showExplorer && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2 mr-1" onClick={() => setShowExplorer(true)}>
                           <PanelLeft className="w-4 h-4 text-muted-foreground" />
                        </Button>
                     )}
                     <div className="p-1.5 bg-blue-50 rounded-lg">
                        <FileText className="w-4 h-4 text-blue-600" />
                     </div>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="hover:text-foreground cursor-pointer transition-colors">지식 가든</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                        <span className="hover:text-foreground cursor-pointer transition-colors">2024년 분석</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                        <span className="font-medium text-foreground">LG 에너지솔루션 & SK 이노베이션</span>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                     <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => toggleView(showDocDetails, setShowDocDetails, [showExplorer, showGraph, showCopilot])}
                     >
                        <X className="w-4 h-4 text-muted-foreground" />
                     </Button>
                  </div>
                </div>

                <ScrollArea className="flex-1 bg-white">
                  <div className="max-w-3xl mx-auto p-8 space-y-8">
                    <div className="space-y-6">
                      <div className="group relative mt-6">
                        {/* Title Toolbar */}
                        <div className="absolute -top-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-4 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-border/50 shadow-sm">
                           <button className="flex items-center gap-1.5 hover:text-foreground hover:bg-muted/50 px-1.5 py-0.5 rounded transition-colors">
                             <Smile className="w-3.5 h-3.5" />
                             <span>아이콘 추가</span>
                           </button>
                           <button className="flex items-center gap-1.5 hover:text-foreground hover:bg-muted/50 px-1.5 py-0.5 rounded transition-colors">
                             <LayoutIcon className="w-3.5 h-3.5" />
                             <span>커버 추가</span>
                           </button>
                           <button className="flex items-center gap-1.5 hover:text-foreground hover:bg-muted/50 px-1.5 py-0.5 rounded transition-colors">
                             <BadgeCheck className="w-3.5 h-3.5" />
                             <span>인증하기</span>
                           </button>
                           <button className="flex items-center gap-1.5 hover:text-foreground hover:bg-muted/50 px-1.5 py-0.5 rounded transition-colors">
                             <MessageSquare className="w-3.5 h-3.5" />
                             <span>댓글 추가</span>
                           </button>
                        </div>
                        <h1 
                          contentEditable 
                          suppressContentEditableWarning 
                          className="text-3xl font-bold tracking-tight text-foreground/90 mb-4 pt-2 outline-none cursor-text"
                        >
                          특허 분쟁 분석: LG 에너지솔루션 vs SK 이노베이션
                        </h1>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground border-b border-border pb-6 min-h-[50px]">
                          {/* Author Info */}
                          <div className="flex items-center gap-2 mr-2">
                             <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center">
                                <User className="h-3 w-3 text-muted-foreground" />
                             </div>
                             <span className="text-sm font-medium text-foreground/80">Analyst_Kim</span>
                          </div>
                          
                          <span className="w-1 h-1 rounded-full bg-border shrink-0" />

                          <span className="flex items-center gap-1.5 shrink-0">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            <Popover>
                                <PopoverTrigger asChild>
                                    <span className="hover:text-foreground hover:bg-secondary/50 px-1.5 py-0.5 rounded cursor-pointer transition-colors">
                                        {format(docDate, "MMM d, yyyy")}
                                    </span>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={docDate}
                                        onSelect={(date) => date && setDocDate(date)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                          </span>
                          <span className="w-1 h-1 rounded-full bg-border shrink-0" />
                          
                          {/* Dynamic Tag Area */}
                          <div className="flex items-center gap-1.5 flex-1 min-w-0">
                             <Tag className="w-3.5 h-3.5 shrink-0" />
                             
                             {!isEditingTags ? (
                                <div 
                                    className="hover:bg-secondary/50 px-2 py-1 rounded-md cursor-pointer transition-colors -ml-1 flex items-center gap-2 group/tags"
                                    onClick={() => setIsEditingTags(true)}
                                >
                                    <span className="truncate">{docTags.join(', ')}</span>
                                    <Edit3 className="w-3 h-3 opacity-0 group-hover/tags:opacity-50" />
                                </div>
                             ) : (
                                <div className="flex flex-wrap gap-2 items-center animate-in fade-in slide-in-from-left-2 duration-200">
                                    {docTags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="px-2 py-0.5 h-6 text-xs bg-secondary/50 hover:bg-secondary text-foreground/80 gap-1 pr-1">
                                            {tag}
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-3.5 w-3.5 hover:bg-red-100 hover:text-red-500 rounded-full p-0"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeTag(tag);
                                                }}
                                            >
                                                <X className="w-2.5 h-2.5" />
                                            </Button>
                                        </Badge>
                                    ))}
                                    <div className="relative group/tag flex items-center gap-1">
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 h-6 rounded-full border border-dashed border-muted-foreground/30 text-muted-foreground text-xs hover:border-primary/50 hover:text-primary transition-colors cursor-text bg-transparent">
                                            <Plus className="w-3 h-3" />
                                            <input 
                                                type="text" 
                                                className="bg-transparent border-none outline-none w-16 placeholder:text-muted-foreground/50 h-full"
                                                placeholder="Add tag"
                                                value={newTagName}
                                                onChange={(e) => setNewTagName(e.target.value)}
                                                onKeyDown={handleAddTag}
                                                autoFocus
                                            />
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-6 w-6 rounded-full"
                                            onClick={() => setIsEditingTags(false)}
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                             )}
                          </div>
                          
                          <div className="ml-auto flex items-center gap-2 shrink-0">
                             {/* Status Dropdown moved here */}
                             <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                     <Button 
                                         variant="outline" 
                                         size="sm" 
                                         className={cn(
                                             "h-7 gap-2 px-2.5 border-transparent text-white hover:text-white/90 shadow-sm transition-all",
                                             docStatus.color
                                         )}
                                     >
                                         <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                         <span className="text-xs font-medium">{docStatus.label}</span>
                                         <ChevronDown className="w-3 h-3 opacity-50" />
                                     </Button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="end" className="w-48">
                                     <DropdownMenuLabel className="text-xs text-muted-foreground font-normal px-2 py-1.5">Change Status</DropdownMenuLabel>
                                     {allStatuses.map(status => (
                                         <DropdownMenuItem 
                                             key={status.id} 
                                             onClick={() => setDocStatus(status)}
                                             className="gap-2 focus:bg-accent cursor-pointer"
                                         >
                                             <div className={cn("w-2 h-2 rounded-full", status.color)} />
                                             <span className="text-sm">{status.label}</span>
                                             {docStatus.id === status.id && <div className="ml-auto text-primary text-xs">Active</div>}
                                         </DropdownMenuItem>
                                     ))}
                                     <DropdownMenuSeparator />
                                     <div className="p-2">
                                         <div className="flex items-center gap-2">
                                             <Input 
                                                 placeholder="New status..." 
                                                 className="h-7 text-xs" 
                                                 value={newStatusName}
                                                 onChange={(e) => setNewStatusName(e.target.value)}
                                                 onKeyDown={(e) => e.key === 'Enter' && handleAddStatus()}
                                             />
                                             <Button size="icon" className="h-7 w-7" onClick={handleAddStatus}>
                                                 <Plus className="w-3 h-3" />
                                             </Button>
                                         </div>
                                     </div>
                                     {customStatuses.length > 0 && (
                                         <>
                                             <DropdownMenuSeparator />
                                             <DropdownMenuLabel className="text-xs text-muted-foreground font-normal px-2">Manage Custom</DropdownMenuLabel>
                                             {customStatuses.map(status => (
                                                 <div key={status.id} className="flex items-center justify-between px-2 py-1.5 text-sm hover:bg-muted/50 rounded-sm">
                                                     <div className="flex items-center gap-2">
                                                         <div className={cn("w-2 h-2 rounded-full", status.color)} />
                                                         <span>{status.label}</span>
                                                     </div>
                                                     <Button 
                                                         variant="ghost" 
                                                         size="icon" 
                                                         className="h-5 w-5 hover:text-red-500"
                                                         onClick={(e) => {
                                                             e.stopPropagation();
                                                             handleDeleteStatus(status.id);
                                                         }}
                                                     >
                                                         <Trash2 className="w-3 h-3" />
                                                     </Button>
                                                 </div>
                                             ))}
                                         </>
                                     )}
                                 </DropdownMenuContent>
                             </DropdownMenu>
                          </div>
                        </div>
                      </div>

                      <div 
                        contentEditable 
                        suppressContentEditableWarning 
                        className="prose prose-slate max-w-none prose-sm prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-foreground/90 prose-li:leading-relaxed outline-none min-h-[500px] cursor-text px-2"
                      >
                        <p className="lead text-lg text-foreground/80 mb-8 leading-relaxed tracking-wide">
                           A comprehensive analysis of the ongoing patent dispute between two major EV battery manufacturers, reviewing key patents, legal arguments, and potential market impacts.
                        </p>

                        <h3 className="mt-8 mb-4 text-base font-bold text-foreground">1. Overview</h3>
                        <div className="pl-6 border-l-2 border-transparent hover:border-muted transition-colors">
                            <p className="mb-3">
                              The legal battle between <strong>LG Energy Solution</strong> and <strong>SK Innovation</strong> centers on trade secret misappropriation and patent infringement claims. 
                              This document consolidates key findings from recent court filings and technical analysis of the disputed patents.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-foreground/90">
                                <li><strong>Consolidated Analysis:</strong> Summary of trade secret misappropriation claims.</li>
                                <li><strong>Patent Infringement:</strong> Details on specific technology infringements.</li>
                                <li><strong>Court Filings:</strong> Review of recent legal documentation.</li>
                            </ul>
                        </div>

                        <h3 className="mt-10 mb-4 text-base font-bold text-foreground">2. Key Disputed Patents</h3>
                        <div className="pl-6 border-l-2 border-transparent hover:border-muted transition-colors">
                            <div className="not-prose my-6 rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                              <table className="w-full text-sm text-left">
                                <thead className="bg-muted/40 text-muted-foreground font-medium border-b border-border">
                                  <tr>
                                    <th className="px-4 py-3 font-semibold">No.</th>
                                    <th className="px-4 py-3 font-semibold">Patent ID</th>
                                    <th className="px-4 py-3 font-semibold">Title</th>
                                    <th className="px-4 py-3 font-semibold">Date</th>
                                    <th className="px-4 py-3 font-semibold">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                  <tr className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-3 text-muted-foreground">1</td>
                                    <td className="px-4 py-3 font-mono text-xs text-foreground/80">1020250175306</td>
                                    <td className="px-4 py-3 font-medium text-foreground">Secondary battery including cathode active material</td>
                                    <td className="px-4 py-3 text-muted-foreground text-xs">2025-11-18</td>
                                    <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px] font-normal bg-green-50 text-green-700 hover:bg-green-100 border-green-200">Public</Badge></td>
                                  </tr>
                                  <tr className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-3 text-muted-foreground">2</td>
                                    <td className="px-4 py-3 font-mono text-xs text-foreground/80">1020250170023</td>
                                    <td className="px-4 py-3 font-medium text-foreground">Battery module and battery pack including same</td>
                                    <td className="px-4 py-3 text-muted-foreground text-xs">2025-11-12</td>
                                    <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px] font-normal bg-green-50 text-green-700 hover:bg-green-100 border-green-200">Public</Badge></td>
                                  </tr>
                                  <tr className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-3 text-muted-foreground">3</td>
                                    <td className="px-4 py-3 font-mono text-xs text-foreground/80">1020250170024</td>
                                    <td className="px-4 py-3 font-medium text-foreground">Battery management system and method</td>
                                    <td className="px-4 py-3 text-muted-foreground text-xs">2025-11-12</td>
                                    <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px] font-normal bg-green-50 text-green-700 hover:bg-green-100 border-green-200">Public</Badge></td>
                                  </tr>
                                   <tr className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-3 text-muted-foreground">4</td>
                                    <td className="px-4 py-3 font-mono text-xs text-foreground/80">1020250167131</td>
                                    <td className="px-4 py-3 font-medium text-foreground">Thermal management system for electric vehicles</td>
                                    <td className="px-4 py-3 text-muted-foreground text-xs">2025-11-07</td>
                                    <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px] font-normal bg-green-50 text-green-700 hover:bg-green-100 border-green-200">Public</Badge></td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                        </div>

                        <h3 className="mt-10 mb-4 text-base font-bold text-foreground">3. Core Arguments & Evidence ⚖️</h3>
                        <div className="pl-6 border-l-2 border-transparent hover:border-muted transition-colors">
                            <p className="mb-3">The core dispute revolves around three main technical areas. Below is a breakdown of the primary arguments presented by both sides:</p>
                            <ul className="list-disc pl-5 space-y-2 text-foreground/90">
                                <li><strong>Separator Technology:</strong> Claims regarding the misappropriation of ceramic coated separator (CCS) technology.</li>
                                <li><strong>Cathode Materials:</strong> Infringement allegations related to high-nickel content cathode manufacturing processes.</li>
                                <li><strong>Manufacturing Data:</strong> Disputes over the transfer of yield rate data and production line schematics. 📉</li>
                            </ul>
                        </div>

                        <h3 className="mt-10 mb-4 text-base font-bold text-foreground">4. Analysis Process (Step-by-Step)</h3>
                        <div className="pl-6 border-l-2 border-transparent hover:border-muted transition-colors">
                            <ol className="list-decimal pl-5 space-y-2 text-foreground/90 marker:text-muted-foreground marker:font-medium">
                                <li>Collect all public court filings from the <strong>US ITC</strong> and <strong>Delaware District Court</strong>.</li>
                                <li>Compare patent claims against the technical specifications of the <a href="#" className="no-underline hover:underline text-blue-600">SK Innovation Battery Module</a>.</li>
                                <li>Evaluate the validity of the "prior art" defense strategy using the database.</li>
                                <li>Assess potential damages and royalty models based on market share projections.</li>
                            </ol>
                        </div>

                        <h3 className="mt-10 mb-4 text-base font-bold text-foreground">5. Visual Evidence</h3>
                        <div className="pl-6 border-l-2 border-transparent hover:border-muted transition-colors">
                            <p className="mb-4">Comparison of the disputed battery cell structures and the diagrams found in the patent filings.</p>
                            
                            <div className="grid grid-cols-2 gap-6 my-6 not-prose">
                                <div className="rounded-xl border border-border overflow-hidden bg-muted/10 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="aspect-video bg-slate-100 flex items-center justify-center text-slate-400">
                                        <ImageIcon className="w-10 h-10 opacity-40" />
                                    </div>
                                    <div className="p-3 text-xs text-muted-foreground bg-card border-t border-border font-medium">
                                        Fig 1. LGES Patent Diagram (US 10,123,456)
                                    </div>
                                </div>
                                <div className="rounded-xl border border-border overflow-hidden bg-muted/10 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="aspect-video bg-slate-100 flex items-center justify-center text-slate-400">
                                        <ImageIcon className="w-10 h-10 opacity-40" />
                                    </div>
                                    <div className="p-3 text-xs text-muted-foreground bg-card border-t border-border font-medium">
                                        Fig 2. SKI Battery Cell Cross-section
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h3 className="mt-10 mb-4 text-base font-bold text-foreground">6. Action Items</h3>
                        <div className="pl-6 border-l-2 border-transparent hover:border-muted transition-colors">
                            <ul className="contains-task-list task-list list-none pl-0 space-y-2">
                                <li className="flex items-start gap-3 group">
                                    <input type="checkbox" checked readOnly className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 accent-blue-600 cursor-default" /> 
                                    <span className="text-foreground/80 group-hover:text-foreground transition-colors line-through decoration-muted-foreground/50">Review initial court filings (Completed 2024-12-01)</span>
                                </li>
                                <li className="flex items-start gap-3 group">
                                    <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 accent-blue-600 cursor-pointer" /> 
                                    <span className="text-foreground/90 group-hover:text-foreground transition-colors">Analyze SK Battery Module technical schematics</span>
                                </li>
                                <li className="flex items-start gap-3 group">
                                    <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 accent-blue-600 cursor-pointer" /> 
                                    <span className="text-foreground/90 group-hover:text-foreground transition-colors">Prepare counter-arguments for cross-licensing proposal</span>
                                </li>
                            </ul>
                        </div>

                        <h3 className="mt-10 mb-4 text-base font-bold text-foreground">7. References & Attachments</h3>
                        <p>
                            For more details, refer to the <a href="https://www.usitc.gov" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">US ITC Case Details</a> page.
                            Related internal analysis can be found in <WikiLink>[[Previous Litigation History]]</WikiLink>.
                        </p>

                        <div className="not-prose mt-4 space-y-2">
                            <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors cursor-pointer group">
                                <div className="h-10 w-10 rounded bg-red-50 flex items-center justify-center shrink-0">
                                    <FileText className="w-5 h-5 text-red-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">technical_analysis_v2.pdf</div>
                                    <div className="text-xs text-muted-foreground">2.4 MB • Uploaded yesterday</div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                    <ArrowUp className="w-4 h-4 rotate-45" />
                                </Button>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors cursor-pointer group">
                                <div className="h-10 w-10 rounded bg-blue-50 flex items-center justify-center shrink-0">
                                    <FileText className="w-5 h-5 text-blue-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">market_impact_report.docx</div>
                                    <div className="text-xs text-muted-foreground">1.8 MB • Uploaded 2 hours ago</div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                    <ArrowUp className="w-4 h-4 rotate-45" />
                                </Button>
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
                              <Share2 className="w-4 h-4 text-blue-500" />
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
                            <span className="font-semibold text-sm">AI Copilot</span>
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
                        <ScrollArea className="flex-1">
                           <div className="p-4 space-y-4">
                           {/* New Chat Tabs */}
                           <div className="flex items-center gap-2 mb-4 px-1 w-full min-w-0">
                             <div className="flex-1 min-w-0 overflow-x-auto scrollbar-hide flex gap-2">
                               {chatSessions.map(session => (
                                 <div key={session.id} className="relative group/tab shrink-0">
                                   <Button 
                                     variant="ghost"
                                     size="sm" 
                                     className={cn(
                                       "h-8 text-xs whitespace-nowrap px-3.5 rounded-lg transition-all duration-200 border pr-7",
                                       activeSessionId === session.id 
                                         ? "bg-blue-600 text-white font-medium shadow-md border-blue-600 hover:bg-blue-700 hover:text-white" 
                                         : "bg-background border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:border-blue-500 hover:text-blue-600"
                                     )}
                                     onClick={() => setActiveSessionId(session.id)}
                                   >
                                     {session.title}
                                   </Button>
                                   <Button
                                      variant="ghost"
                                      size="icon"
                                      className={cn(
                                          "absolute right-0.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md opacity-0 group-hover/tab:opacity-100 transition-all",
                                          activeSessionId === session.id 
                                            ? "text-white/70 hover:text-white hover:bg-white/20" 
                                            : "text-muted-foreground hover:text-red-500 hover:bg-red-100/50"
                                      )}
                                      onClick={(e) => handleDeleteSession(session.id, e)}
                                   >
                                      <X className="w-3 h-3" />
                                   </Button>
                                 </div>
                               ))}
                             </div>
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 text-blue-600 hover:bg-blue-50 rounded-full shrink-0 ml-auto"
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
                                      ref={editingMessage?.sessionId === activeSessionId && editingMessage?.index === i ? editingRef : null}
                                      className={cn(
                                        "relative transition-all duration-200 rounded-xl group",
                                        editingMessage?.sessionId === activeSessionId && editingMessage?.index === i 
                                          ? "border border-blue-500 shadow-sm bg-background" 
                                          : "hover:bg-muted/30 hover:ring-1 hover:ring-border/50 p-2 -m-2 cursor-pointer"
                                      )}
                                      onDoubleClick={() => setEditingMessage({ sessionId: activeSessionId, index: i })}
                                    >
                                      <Textarea 
                                        className={cn(
                                          "min-h-[40px] w-full resize-none border-0 bg-transparent shadow-none p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0",
                                          editingMessage?.sessionId === activeSessionId && editingMessage?.index === i ? "text-foreground p-3 min-h-[80px]" : "text-foreground cursor-pointer pointer-events-none"
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
                                              <Button 
                                                size="icon" 
                                                className="h-8 w-8 ml-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-sm"
                                                onClick={() => {
                                                  setEditingMessage(null);
                                                  // Simulate re-sending or just saving edits
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
                        </ScrollArea>
            
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
          <DeleteSessionDialog 
            open={showDeleteDialog} 
            onOpenChange={setShowDeleteDialog} 
            onConfirm={confirmDeleteSession} 
          />
        </Layout>
      );
    }

function DeleteSessionDialog({ 
  open, 
  onOpenChange, 
  onConfirm 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  onConfirm: () => void; 
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Chat Session?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this chat session? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
