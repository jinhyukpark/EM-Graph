import { useState, useCallback, useRef, useEffect, Component, ErrorInfo } from "react";
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
  Bot, Database, FileCode, Sidebar, PanelLeft, PanelRight, Network, LayoutTemplate, Columns, Trash2, Tag, Calendar as CalendarIcon, Eye, EyeOff, Image as ImageIcon, AtSign, ArrowUp, Copy, RotateCcw, Link, AlertCircle,
  Play, Pause, ChevronsLeft, ChevronsRight, ChevronLeft, ZoomIn, ZoomOut
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ReactFlow, Background, Controls, useNodesState, useEdgesState, BackgroundVariant, ReactFlowProvider, MarkerType } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ImageNode from "@/components/graph/ImageNode";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
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

// --- Error Boundary ---
class GraphErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.error("GraphErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center bg-muted/10">
          <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
          <h3 className="font-semibold text-foreground">Graph Rendering Error</h3>
          <p className="text-sm text-muted-foreground mt-1">Something went wrong while loading the graph.</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={() => this.setState({ hasError: false })}
          >
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}


// --- Mock Data ---

const stockPrison = "/assets/generated_images/subtle_dark_data_network_background.png";
const stockDetective = "/assets/generated_images/police_detectives_in_high-tech_room.png";
const stockCriminal = "/assets/generated_images/hacker_in_dark_hoodie_with_digital_code_overlay.png";
const stockVictim = "/assets/generated_images/scientist_with_test_tube.png";
const stockCase = "/assets/generated_images/abstract_database_ontology_illustration.png";
const stockVictimB = "/assets/generated_images/abstract_collaboration_network_illustration.png";
const stockCompany = "/assets/generated_images/global_supply_chain_network_with_logistics_nodes.png";
const stockPhone = "/assets/generated_images/data_import_and_mapping_ui.png";
const stockMoney = "/assets/generated_images/financial_transaction_graph_with_fraud_anomaly.png";

const STATUS_KEYS = [
  { id: 'draft', labelKey: 'kgDraft' as const, color: 'bg-slate-500' },
  { id: 'review', labelKey: 'kgReview' as const, color: 'bg-orange-500' },
  { id: 'done', labelKey: 'kgDone' as const, color: 'bg-green-500' },
  { id: 'hold', labelKey: 'kgHold' as const, color: 'bg-red-500' },
];

const INITIAL_FILE_TREE = [
  {
    id: "root",
    name: "지식정원",
    type: "root",
    children: [
      { id: "f1", name: "산업자재 분석", type: "folder", children: [
        { id: "n1", name: "철강 코일 시장 동향", type: "note" },
        { id: "n2", name: "동박 수급 현황", type: "note" },
      ]},
      { id: "f2", name: "화학사업부", type: "folder", children: [
        { id: "n3", name: "에틸렌 스프레드 분석", type: "note" },
      ]},
      { id: "f3", name: "필름/전자재료", type: "folder", children: [] },
      { id: "f4", name: "경쟁사 분석", type: "folder", children: [
        { id: "n5", name: "도레이 vs SKC 비교", type: "note" },
        { id: "n6", name: "미쓰비시 필름 사업 현황", type: "note" },
      ]},
      { id: "f5", name: "시장 동향", type: "folder", children: [] },
      { id: "f6", name: "2024 전략 분석", type: "folder", children: [
         { id: "n4", name: "PET 필름 시장 경쟁력 분석", type: "note", active: true }
      ]}
    ]
  }
];

const nodeTypes = {
  entity: ImageNode,
};

const INITIAL_NODES = [
  { 
    id: 'kolon_ind', 
    type: 'entity',
    position: { x: 0, y: 0 }, 
    data: { 
      label: '코오롱인더스트리', 
      subLabel: '모회사',
      type: 'criminal',
      borderColor: '#3b82f6',
      highlight: true,
      image: stockCompany
    },
    style: { width: 80, height: 80 }
  },
  { 
    id: 'div_material', 
    type: 'entity',
    position: { x: -300, y: -150 }, 
    data: { 
      label: '산업자재사업부', 
      subLabel: '철강/동박',
      type: 'detective',
      borderColor: '#3b82f6',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'
    },
    style: { width: 65, height: 65 }
  },
  { 
    id: 'div_chem', 
    type: 'entity',
    position: { x: -100, y: -250 }, 
    data: { 
      label: '화학사업부', 
      subLabel: 'ABS/에틸렌',
      type: 'detective',
      borderColor: '#3b82f6',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop'
    },
    style: { width: 65, height: 65 }
  },
  { 
    id: 'div_film', 
    type: 'entity',
    position: { x: 150, y: -280 }, 
    data: { 
      label: '필름/전자재료', 
      subLabel: 'PET/편광필름',
      type: 'detective',
      borderColor: '#3b82f6',
      image: stockDetective
    },
    style: { width: 70, height: 70 }
  },
  { 
    id: 'div_fashion', 
    type: 'entity',
    position: { x: -100, y: -100 }, 
    data: { 
      label: '패션사업부', 
      subLabel: '코오롱스포츠',
      type: 'detective',
      borderColor: '#3b82f6',
      image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop'
    },
    style: { width: 60, height: 60 }
  },
  { 
    id: 'pet_film', 
    type: 'entity',
    position: { x: 300, y: -150 }, 
    data: { 
      label: '광학용 PET필름', 
      subLabel: '주력 제품',
      type: 'criminal',
      borderColor: '#10b981',
      image: stockCase
    },
    style: { width: 65, height: 65 }
  },
  { 
    id: 'polarizer', 
    type: 'entity',
    position: { x: 300, y: 50 }, 
    data: { 
      label: '편광필름', 
      subLabel: '디스플레이',
      type: 'criminal',
      borderColor: '#10b981',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop'
    },
    style: { width: 60, height: 60 }
  },
  { 
    id: 'toray', 
    type: 'entity',
    position: { x: 200, y: 250 }, 
    data: { 
      label: '도레이(Toray)', 
      subLabel: '경쟁사',
      type: 'victim',
      borderColor: '#ef4444',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
    },
    style: { width: 60, height: 60 }
  },
  { 
    id: 'skc', 
    type: 'entity',
    position: { x: -50, y: 200 }, 
    data: { 
      label: 'SKC', 
      subLabel: '경쟁사',
      type: 'victim',
      borderColor: '#ef4444',
      image: stockVictim
    },
    style: { width: 55, height: 55 }
  },
  { 
    id: 'mitsubishi', 
    type: 'entity',
    position: { x: -350, y: 150 }, 
    data: { 
      label: '미쓰비시화학', 
      subLabel: '경쟁사',
      type: 'victim',
      borderColor: '#ef4444',
      image: stockVictimB
    },
    style: { width: 55, height: 55 }
  },
  { 
    id: 'samsung_sdi', 
    type: 'entity',
    position: { x: -250, y: 20 }, 
    data: { 
      label: '삼성SDI', 
      subLabel: '주요 고객사',
      type: 'criminal',
      borderColor: '#a855f7',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
    },
    style: { width: 60, height: 60 }
  },
  { 
    id: 'lg_display', 
    type: 'entity',
    position: { x: 450, y: -50 }, 
    data: { 
      label: 'LG디스플레이', 
      subLabel: '주요 고객사',
      type: 'criminal',
      borderColor: '#a855f7',
      image: stockPhone
    },
    style: { width: 60, height: 60 }
  },
  { 
    id: 'raw_pta', 
    type: 'entity',
    position: { x: 400, y: 200 }, 
    data: { 
      label: 'PTA/MEG', 
      subLabel: '원자재',
      type: 'detective',
      borderColor: '#64748b',
      image: stockMoney
    },
    style: { width: 50, height: 50 }
  },
  { 
    id: 'factory_gumi', 
    type: 'entity',
    position: { x: -150, y: 350 }, 
    data: { 
      label: '구미공장', 
      subLabel: '생산거점',
      type: 'prison',
      borderColor: '#10b981',
      image: stockPrison
    },
    style: { width: 65, height: 65 }
  },
  { 
    id: 'factory_sejong', 
    type: 'entity',
    position: { x: 250, y: 350 }, 
    data: { 
      label: '세종공장', 
      subLabel: '생산거점',
      type: 'prison',
      borderColor: '#10b981',
      image: stockCriminal
    },
    style: { width: 65, height: 65 }
  }
];

const INITIAL_EDGES = [
  { id: 'e-kolon-material', source: 'kolon_ind', target: 'div_material', type: 'straight', style: { stroke: '#3b82f6', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },
  { id: 'e-kolon-chem', source: 'kolon_ind', target: 'div_chem', type: 'straight', style: { stroke: '#3b82f6', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },
  { id: 'e-kolon-film', source: 'kolon_ind', target: 'div_film', type: 'straight', style: { stroke: '#3b82f6', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },
  { id: 'e-kolon-fashion', source: 'kolon_ind', target: 'div_fashion', type: 'straight', style: { stroke: '#3b82f6', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },
  { id: 'e-film-pet', source: 'div_film', target: 'pet_film', type: 'straight', style: { stroke: '#10b981', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
  { id: 'e-film-polar', source: 'div_film', target: 'polarizer', type: 'straight', style: { stroke: '#10b981', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
  { id: 'e-pet-toray', source: 'pet_film', target: 'toray', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 1.5, strokeDasharray: '5,5' } },
  { id: 'e-pet-skc', source: 'pet_film', target: 'skc', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 1.5, strokeDasharray: '5,5' } },
  { id: 'e-kolon-mitsu', source: 'kolon_ind', target: 'mitsubishi', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 1, strokeDasharray: '5,5' } },
  { id: 'e-polar-lg', source: 'polarizer', target: 'lg_display', type: 'straight', style: { stroke: '#a855f7', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' } },
  { id: 'e-kolon-samsung', source: 'kolon_ind', target: 'samsung_sdi', type: 'straight', style: { stroke: '#a855f7', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' } },
  { id: 'e-pet-pta', source: 'raw_pta', target: 'pet_film', type: 'straight', style: { stroke: '#64748b', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' } },
  { id: 'e-film-gumi', source: 'div_film', target: 'factory_gumi', type: 'straight', style: { stroke: '#10b981', strokeWidth: 1.5 } },
  { id: 'e-chem-sejong', source: 'div_chem', target: 'factory_sejong', type: 'straight', style: { stroke: '#10b981', strokeWidth: 1.5 } },
  { id: 'e-material-samsung', source: 'div_material', target: 'samsung_sdi', type: 'straight', style: { stroke: '#a855f7', strokeWidth: 1 } },
];

const CHAT_HISTORY = [
  {
    role: "user",
    content: "PET 필름 시장에서 코오롱인더스트리의 경쟁 포지션을 분석해줘.",
    time: "오늘"
  },
  {
    role: "assistant",
    content: "코오롱인더스트리는 광학용 PET 필름 시장에서 글로벌 3위권의 시장 점유율(약 15%)을 확보하고 있습니다. 도레이(일본, 28%)와 SKC(한국, 18%)에 이어 경쟁하고 있으며, 특히 고부가가치 광학용 필름 분야에서는 차별화된 기술력을 보유하고 있습니다. 구미공장의 생산 라인 증설 이후 연간 생산능력이 120,000톤으로 확대되었고, OLED용 편광필름 신규 라인도 2025년 상반기 가동 예정입니다. 다만 원료(PTA/MEG) 가격 상승과 중국 로컬 업체들의 가격 공세가 리스크 요인으로 작용하고 있습니다.",
    tool: "MCP Tool • 시장분석_검색",
    sources: [
      { id: "report-1", title: "2024 PET 필름 글로벌 시장 보고서", date: "2024-12-01" },
      { id: "report-2", title: "코오롱인더스트리 IR 실적 발표 자료", date: "2024-11-20" },
      { id: "report-3", title: "구미공장 증설 계획 내부 보고서", date: "2024-10-15" }
    ],
    data: [
      { id: "한국경제", title: "[분석] 코오롱인더스트리, PET 필름 시장 점유율 확대 전략", date: "2024-12-15" },
      { id: "전자신문", title: "OLED 편광필름 시장 경쟁 심화... 코오롱 vs SKC", date: "2024-12-10" },
      { id: "매일경제", title: "PTA/MEG 가격 동향과 필름 업체 수익성 전망", date: "2024-12-08" },
      { id: "조선비즈", title: "코오롱인더스트리 구미공장 증설 완료, 생산능력 30% 확대", date: "2024-12-05" },
      { id: "산업통상자원부", title: "2024 소재·부품·장비 산업 동향 보고서", date: "2024-12-01" },
      { id: "한국IR협의회", title: "코오롱인더스트리 기업분석 리포트", date: "2024-11-28" },
      { id: "글로벌이코노믹", title: "중국 PET 필름 업체 공급 과잉 우려... 가격 하락 압력", date: "2024-11-25" },
      { id: "투자정보", title: "화학/소재 업종 Q4 실적 전망 및 투자 전략", date: "2024-11-22" },
    ]
  },
  {
    role: "user",
    content: "도레이와의 기술 격차는 어떤 상황이야?",
    time: "오늘"
  },
  {
    role: "assistant",
    content: "도레이와의 기술 비교 분석 중입니다...",
    tool: "MCP Tool • 경쟁사_분석"
  }
];

const INITIAL_SESSIONS = [
  {
    id: 's1',
    title: '시장 분석',
    messages: CHAT_HISTORY
  },
  {
    id: 's2',
    title: '기술 리서치',
    messages: []
  }
];

// --- Components ---

function GraphLegend() {
    const { t } = useLanguage();
    return (
        <div className="absolute bottom-6 right-6 z-20 bg-background/95 backdrop-blur-sm border border-border shadow-lg rounded-lg w-64 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/20">
                <span className="text-xs font-semibold text-muted-foreground">{t('kgViews')}</span>
                <div className="flex gap-4 text-xs font-semibold text-muted-foreground">
                    <span>{t('kgCount')}</span>
                    <span>{t('kgRatio')}</span>
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

const SourceList = ({ data }: { data: any[] }) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!data || data.length === 0) return null;

  return (
    <div className="mt-2 border border-border rounded-xl overflow-hidden bg-card/50">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-2.5 py-2 bg-muted/30 hover:bg-muted/50 transition-colors text-xs font-medium"
      >
        <div className="flex items-center gap-2 text-muted-foreground">
             <FileText className="w-3.5 h-3.5 text-orange-500" />
             <span>{t('kgSource')} {data.length}</span>
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
                    <FileText className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" />
                    <div className="space-y-1 min-w-0 flex-1">
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

const NewsResultList = ({ data }: { data: any[] }) => {
  const { t } = useLanguage();
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
             <span>{t('kgNewsResults')} {data.length}</span>
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

// Timeline Component
function GraphTimeline() {
  const { t } = useLanguage();
  // Mock data for the timeline
  const timelineData = Array.from({ length: 60 }, (_, i) => ({
    date: new Date(2024, 0, 1 + i * 3), // Jan 2024 start
    value: Math.floor(Math.random() * 50) + 15,
    hasEvent: Math.random() > 0.85,
    isHigh: Math.random() > 0.9
  }));

  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 bg-background/95 backdrop-blur-sm border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      {/* Header / Filter Bar */}
      <div className="h-9 border-b border-border/50 bg-secondary/10 flex items-center justify-between px-4 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
           <Maximize2 className="w-3.5 h-3.5 cursor-pointer hover:text-foreground transition-colors" />
        </div>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
             <Checkbox defaultChecked className="w-3.5 h-3.5 data-[state=checked]:bg-blue-600 border-blue-600/50" />
             <div className="flex items-center gap-1.5">
               <span className="w-2 h-2 rounded-full bg-green-500" />
               <span className="font-medium text-foreground">&lt; 100</span>
             </div>
           </div>
           <div className="flex gap-6 text-muted-foreground font-mono">
             <span>90</span>
             <span>5%</span>
           </div>
        </div>
      </div>

      {/* Timeline Chart Area */}
      <div className="h-32 w-full px-4 pt-6 pb-2 relative group/chart">
        <div className="h-full w-full flex items-end gap-[3px] px-8">
          {timelineData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer">
              {/* Event Marker (Red Circle) */}
              {d.hasEvent && (
                <div className="absolute -top-3 w-2.5 h-2.5 rounded-full border-[1.5px] border-red-500 bg-background z-10 group-hover:bg-red-500 transition-colors" />
              )}
              
              {/* Bar */}
              <div 
                className={cn(
                  "w-full rounded-t-sm transition-all duration-200 min-h-[4px]",
                  d.hasEvent ? "bg-slate-400 group-hover:bg-slate-500" : "bg-slate-300/60 group-hover:bg-slate-400/80",
                  d.isHigh && "bg-slate-500 group-hover:bg-slate-600"
                )}
                style={{ height: `${d.value}%` }}
              />
              
              {/* Tooltip */}
              <div className="absolute bottom-full mb-3 hidden group-hover:block bg-popover text-popover-foreground text-[10px] px-2.5 py-1.5 rounded-md shadow-lg whitespace-nowrap border border-border z-30 animate-in fade-in slide-in-from-bottom-1 duration-200">
                <div className="font-semibold">{format(d.date, 'MMM d, yyyy')}</div>
                <div className="text-muted-foreground">{d.value} {t('kgEventsRecorded')}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Month Labels */}
        <div className="absolute bottom-1 left-0 right-0 flex justify-between px-12 pointer-events-none text-[10px] text-muted-foreground/70 font-medium">
          <span>Jan 2024</span>
          <span>Feb 2024</span>
          <span>Mar 2024</span>
          <span>Apr 2024</span>
          <span>May 2024</span>
          <span>Jun 2024</span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="h-12 border-t border-border bg-card flex items-center justify-between px-6">
         <div className="flex items-center gap-2">
             <span className="text-[11px] text-muted-foreground font-medium">{t('kgTimelineRange')}</span>
             <span className="text-[11px] text-foreground font-bold">Jan 1, 2024 - Jun 30, 2024</span>
         </div>

         <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center gap-4">
             <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="w-4 h-4" />
                </Button>
             </div>
             
             <Button 
                variant="default" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 shadow-md text-white border border-blue-500/50"
                onClick={() => setIsPlaying(!isPlaying)}
             >
                 {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
             </Button>
             
             <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <ChevronsRight className="w-4 h-4" />
                </Button>
             </div>
         </div>

         <div className="flex items-center gap-1">
             <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                 <ZoomOut className="w-4 h-4" />
             </Button>
             <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                 <ZoomIn className="w-4 h-4" />
             </Button>
         </div>
      </div>
    </div>
  );
}

// Separate GraphView component for ReactFlow
function GraphView() {
  console.log("[GraphView] Component rendering...");

  try {
    const [nodes, , onNodesChange] = useNodesState(INITIAL_NODES);
    const [edges, , onEdgesChange] = useEdgesState(INITIAL_EDGES);

    console.log("[GraphView] Hooks initialized successfully", { nodesCount: nodes.length, edgesCount: edges.length });

    return (
      <div className="w-full h-full relative flex flex-col">
        <div className="flex-1 relative min-h-0">
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
              <Controls className="!bg-card !border-border !fill-foreground !shadow-sm !mb-28" />
              <GraphLegend />
            </ReactFlow>
        </div>
        <GraphTimeline />
      </div>
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
  const { t } = useLanguage();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Add a small delay to ensure layout is stable before rendering heavy graph components
    // This helps prevent ResizeObserver errors in iframe environments
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const [fileTree, setFileTree] = useState(INITIAL_FILE_TREE);
  const [showExplorer, setShowExplorer] = useState(true);
  const [showDocDetails, setShowDocDetails] = useState(true);
  const [showGraph, setShowGraph] = useState(true);
  const [showCopilot, setShowCopilot] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const STATUS_OPTIONS = STATUS_KEYS.map(s => ({ ...s, label: t(s.labelKey) }));
  const [docStatusId, setDocStatusId] = useState('review');
  const docStatus = STATUS_OPTIONS.find(s => s.id === docStatusId) || STATUS_OPTIONS[0];
  const setDocStatus = (s: typeof docStatus) => setDocStatusId(s.id);
  const [docDate, setDocDate] = useState<Date>(new Date(2025, 11, 15));
  const [docTags, setDocTags] = useState<string[]>(['PET필름', '시장분석', '경쟁사']);
  const [customStatuses, setCustomStatuses] = useState<typeof STATUS_OPTIONS>([]);
  const [newStatusName, setNewStatusName] = useState("");
  const [newTagName, setNewTagName] = useState("");

  const [editingMessage, setEditingMessage] = useState<{sessionId: string, index: number} | null>(null);
  
  // Dialog state
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [showAiAlert, setShowAiAlert] = useState(true);
  
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
      title: t('kgNewChat'),
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
          const newId = `s${Date.now()}`;
          setChatSessions([{ id: newId, title: t('kgNewChat'), messages: [] }]);
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
      setCustomStatuses([...customStatuses, { id: `custom-${Date.now()}`, labelKey: '' as any, label: newStatusName, color: 'bg-blue-500' }]);
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
              name: "새 노트",
              type: "note",
              active: true
            };
            node.children.splice(activeChildIndex + 1, 0, newNode);
            added = true;
            return true;
          }
          
          if (addSiblingToActive(node.children)) return true;
        }
      }
      return false;
    };

    if (!addSiblingToActive(newTree)) {
      const addToDefault = (nodes: any[]) => {
          for (const node of nodes) {
              if (node.id === 'f6') {
                  node.children.forEach((c: any) => c.active = false);
                  node.children.push({
                      id: `n-${Date.now()}`,
                      name: "새 노트",
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
      <div className="h-full flex flex-col bg-background relative overflow-hidden overscroll-none">
         {/* Warning Toast */}
         <AnimatePresence>
            {showWarning && (
                <motion.div 
                    initial={{ opacity: 0, y: -20, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, y: -20, x: "-50%" }}
                    className="fixed top-24 left-1/2 z-[100] bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 pointer-events-none"
                >
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('kgAtLeastOneView')}</span>
                </motion.div>
            )}
         </AnimatePresence>

        <ResizablePanelGroup direction="horizontal" className="h-full items-stretch">
          {/* 1. File Explorer */}
          {showExplorer && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="bg-muted/10 border-r border-border flex flex-col h-full">
                <div className="h-16 border-b border-border flex items-center px-4 shrink-0 justify-between">
                  <div className="flex items-center gap-2 text-foreground/80">
                     <Folder className="w-5 h-5 text-blue-500" />
                     <span className="font-semibold text-sm">{t('kgExplorer')}</span>
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
                
                <div className="p-4 border-t border-border bg-background space-y-3">
                    <div className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">{t('kgViewOptions')}</div>
                    <div className="flex flex-col gap-2">
                         <Button 
                            variant="outline"
                            className={cn(
                                "justify-between h-10 px-3 w-full font-medium transition-all duration-200", 
                                showDocDetails 
                                    ? "bg-background border-blue-500 text-blue-600 hover:bg-blue-50/50 hover:text-blue-700 hover:border-blue-600 shadow-sm" 
                                    : "border-transparent bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                            onClick={() => toggleView(showDocDetails, setShowDocDetails, [showGraph, showCopilot])}
                         >
                            <div className="flex items-center gap-2.5">
                                <FileText className={cn("w-4 h-4", showDocDetails ? "text-blue-500" : "text-muted-foreground/70")} />
                                <span>{t('kgDocDetails')}</span>
                            </div>
                            {showDocDetails ? <Eye className="w-4 h-4 text-blue-500" /> : <EyeOff className="w-4 h-4 text-muted-foreground/50" />}
                         </Button>

                         <Button 
                            variant="outline"
                            className={cn(
                                "justify-between h-10 px-3 w-full font-medium transition-all duration-200", 
                                showGraph 
                                    ? "bg-background border-blue-500 text-blue-600 hover:bg-blue-50/50 hover:text-blue-700 hover:border-blue-600 shadow-sm" 
                                    : "border-transparent bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                            onClick={() => toggleView(showGraph, setShowGraph, [showDocDetails, showCopilot])}
                         >
                            <div className="flex items-center gap-2.5">
                                <Network className={cn("w-4 h-4", showGraph ? "text-blue-500" : "text-muted-foreground/70")} />
                                <span>{t('kgOntology')}</span>
                            </div>
                             {showGraph ? <Eye className="w-4 h-4 text-blue-500" /> : <EyeOff className="w-4 h-4 text-muted-foreground/50" />}
                         </Button>

                         <Button 
                            variant="outline"
                            className={cn(
                                "justify-between h-10 px-3 w-full font-medium transition-all duration-200", 
                                showCopilot 
                                    ? "bg-background border-blue-500 text-blue-600 hover:bg-blue-50/50 hover:text-blue-700 hover:border-blue-600 shadow-sm" 
                                    : "border-transparent bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                            onClick={() => toggleView(showCopilot, setShowCopilot, [showDocDetails, showGraph])}
                         >
                            <div className="flex items-center gap-2.5">
                                <Sparkles className={cn("w-4 h-4", showCopilot ? "text-blue-500" : "text-muted-foreground/70")} />
                                <span>{t('kgCopilot')}</span>
                            </div>
                             {showCopilot ? <Eye className="w-4 h-4 text-blue-500" /> : <EyeOff className="w-4 h-4 text-muted-foreground/50" />}
                         </Button>
                    </div>
                </div>
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}

          {/* Main Content Area */}
          <ResizablePanel defaultSize={80} className="h-full">
            <ResizablePanelGroup direction="horizontal" className="h-full items-stretch">
              
              {/* 2. Document Details */}
              {showDocDetails && (
              <ResizablePanel defaultSize={40} minSize={30} className="bg-background flex flex-col relative group h-full">
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
                        <span className="hover:text-foreground cursor-pointer transition-colors">{t('knowledgeGarden')}</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                        <span className="hover:text-foreground cursor-pointer transition-colors">2024 전략 분석</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                        <span className="font-medium text-foreground">PET 필름 시장 경쟁력 분석</span>
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
                             <span>{t('kgAddIcon')}</span>
                           </button>
                           <button className="flex items-center gap-1.5 hover:text-foreground hover:bg-muted/50 px-1.5 py-0.5 rounded transition-colors">
                             <LayoutIcon className="w-3.5 h-3.5" />
                             <span>{t('kgTitleBar')}</span>
                           </button>
                           <button className="flex items-center gap-1.5 hover:text-foreground hover:bg-muted/50 px-1.5 py-0.5 rounded transition-colors">
                             <BadgeCheck className="w-3.5 h-3.5" />
                             <span>{t('kgVerify')}</span>
                           </button>
                           <button className="flex items-center gap-1.5 hover:text-foreground hover:bg-muted/50 px-1.5 py-0.5 rounded transition-colors">
                             <MessageSquare className="w-3.5 h-3.5" />
                             <span>{t("documents")}</span>
                           </button>
                        </div>
                        
                        {/* Status Dropdown - Moved to top right */}
                        <div className="absolute -top-8 right-0">
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
                                     <DropdownMenuLabel className="text-xs text-muted-foreground font-normal px-2 py-1.5">{t('kgChangeStatus')}</DropdownMenuLabel>
                                     {STATUS_OPTIONS.map(status => (
                                         <DropdownMenuItem 
                                             key={status.id} 
                                             onClick={() => setDocStatus(status)}
                                             className="gap-2 focus:bg-accent cursor-pointer"
                                         >
                                             <div className={cn("w-2 h-2 rounded-full", status.color)} />
                                             <span className="text-sm">{status.label}</span>
                                             {docStatus.id === status.id && <div className="ml-auto text-primary text-xs">{t('kgActive')}</div>}
                                         </DropdownMenuItem>
                                     ))}
                                     <DropdownMenuSeparator />
                                     <div className="p-2">
                                         <div className="flex items-center gap-2">
                                             <Input 
                                                 placeholder={t('kgNewStatus')} 
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
                                             <DropdownMenuLabel className="text-xs text-muted-foreground font-normal px-2">{t('kgManageCustom')}</DropdownMenuLabel>
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

                        <h1 
                          contentEditable 
                          suppressContentEditableWarning 
                          className="text-3xl font-bold tracking-tight text-foreground/90 mb-4 pt-2 outline-none cursor-text relative"
                        >
                          PET 필름 시장 경쟁력 분석: 코오롱인더스트리 포지셔닝 전략
                        </h1>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground border-b border-border pb-6 min-h-[50px] relative">
                          {/* Author Info */}
                          <div className="flex items-center gap-2 mr-2">
                             <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center">
                                <User className="h-3 w-3 text-muted-foreground" />
                             </div>
                             <span className="text-sm font-medium text-foreground/80">김분석</span>
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
                          <div className="flex items-center gap-1.5 flex-1 min-w-0 mr-32">
                             <Tag className="w-3.5 h-3.5 shrink-0" />
                             
                             {!isEditingTags ? (
                                <div 
                                    className="hover:bg-secondary/50 px-2 py-1 rounded-md cursor-pointer transition-colors -ml-1 flex items-center gap-2 group/tags max-w-full overflow-hidden"
                                    onClick={() => setIsEditingTags(true)}
                                >
                                    <span className="truncate block">
                                      {docTags.length > 3 
                                        ? `${docTags.slice(0, 3).join(', ')} +${docTags.length - 3}` 
                                        : docTags.join(', ')}
                                    </span>
                                    <Edit3 className="w-3 h-3 opacity-0 group-hover/tags:opacity-50 shrink-0" />
                                </div>
                             ) : (
                                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-200 overflow-x-auto scrollbar-hide max-w-[400px] flex-nowrap pr-2">
                                    {docTags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="px-2 py-0.5 h-6 text-xs bg-secondary/50 hover:bg-secondary text-foreground/80 gap-1 pr-1 whitespace-nowrap shrink-0">
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
                                    {docTags.length < 5 && (
                                        <div className="relative group/tag flex items-center gap-1 shrink-0">
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 h-6 rounded-full border border-dashed border-muted-foreground/30 text-muted-foreground text-xs hover:border-primary/50 hover:text-primary transition-colors cursor-text bg-transparent whitespace-nowrap">
                                                <Plus className="w-3 h-3" />
                                                <input 
                                                    type="text" 
                                                    className="bg-transparent border-none outline-none w-16 placeholder:text-muted-foreground/50 h-full text-xs"
                                                    placeholder={t('kgAddTag')}
                                                    value={newTagName}
                                                    onChange={(e) => setNewTagName(e.target.value)}
                                                    onKeyDown={handleAddTag}
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-6 w-6 rounded-full shrink-0"
                                        onClick={() => setIsEditingTags(false)}
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                             )}
                          </div>
                          
                          <div className="ml-auto flex items-center gap-2 shrink-0">
                             {/* Status Dropdown moved to top */}
                          </div>
                        </div>
                      </div>

                      <div 
                        contentEditable 
                        suppressContentEditableWarning 
                        className="prose prose-slate max-w-none prose-sm prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-foreground/90 prose-li:leading-relaxed outline-none min-h-[500px] cursor-text px-2"
                      >
                        {showAiAlert && (
                            <div className="flex items-center gap-2 p-3 mb-6 text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-lg select-none group relative">
                                <Sparkles className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                                <span className="font-medium">이 문서는 <span className="font-bold">Gemini</span>에 의해 2025년 10월 12일에 생성되었습니다.</span>
                                
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowAiAlert(false);
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-blue-100 rounded-full text-blue-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}

                        <p className="lead text-lg text-foreground/80 mb-8 leading-relaxed tracking-wide">
                           코오롱인더스트리의 PET 필름 사업 경쟁력과 시장 포지셔닝 전략을 분석한 종합 보고서입니다. 주요 경쟁사 대비 기술력, 생산능력, 고객 포트폴리오를 비교 분석합니다.
                        </p>

                        <h3 className="mt-8 mb-4 text-base font-bold text-foreground">1. 시장 개요</h3>
                        <div className="pl-6 border-l-2 border-transparent hover:border-muted transition-colors">
                            <p className="mb-3">
                              글로벌 PET 필름 시장은 <strong>도레이(일본)</strong>, <strong>SKC(한국)</strong>, <strong>코오롱인더스트리</strong>가 3강 구도를 형성하고 있습니다.
                              본 문서는 각 사의 기술력, 생산능력, 고객 기반을 비교 분석하여 코오롱인더스트리의 전략적 방향을 제시합니다.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-foreground/90">
                                <li><strong>시장 규모:</strong> 2024년 글로벌 PET 필름 시장 약 280억 달러 규모</li>
                                <li><strong>성장 동인:</strong> OLED 디스플레이, 전기차 배터리 분리막, 태양광 백시트 수요 증가</li>
                                <li><strong>주요 리스크:</strong> 중국 로컬 업체 가격 공세, 원자재(PTA/MEG) 가격 변동</li>
                            </ul>
                        </div>

                        <h3 className="mt-10 mb-4 text-base font-bold text-foreground">2. 경쟁사별 시장 점유율</h3>
                        <div className="pl-6 border-l-2 border-transparent hover:border-muted transition-colors">
                            <div className="not-prose my-6 rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                              <table className="w-full text-sm text-left">
                                <thead className="bg-muted/40 text-muted-foreground font-medium border-b border-border">
                                  <tr>
                                    <th className="px-4 py-3 font-semibold">순위</th>
                                    <th className="px-4 py-3 font-semibold">기업명</th>
                                    <th className="px-4 py-3 font-semibold">시장 점유율</th>
                                    <th className="px-4 py-3 font-semibold">연간 생산능력</th>
                                    <th className="px-4 py-3 font-semibold">주요 제품</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                  <tr className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-3 text-muted-foreground">1</td>
                                    <td className="px-4 py-3 font-medium text-foreground">도레이 (Toray)</td>
                                    <td className="px-4 py-3 text-foreground/80">28%</td>
                                    <td className="px-4 py-3 text-muted-foreground text-xs">350,000톤/년</td>
                                    <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px] font-normal bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">광학용/산업용</Badge></td>
                                  </tr>
                                  <tr className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-3 text-muted-foreground">2</td>
                                    <td className="px-4 py-3 font-medium text-foreground">SKC</td>
                                    <td className="px-4 py-3 text-foreground/80">18%</td>
                                    <td className="px-4 py-3 text-muted-foreground text-xs">200,000톤/년</td>
                                    <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px] font-normal bg-green-50 text-green-700 hover:bg-green-100 border-green-200">반도체/디스플레이</Badge></td>
                                  </tr>
                                  <tr className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-3 text-muted-foreground">3</td>
                                    <td className="px-4 py-3 font-medium text-foreground">코오롱인더스트리</td>
                                    <td className="px-4 py-3 text-foreground/80">15%</td>
                                    <td className="px-4 py-3 text-muted-foreground text-xs">120,000톤/년</td>
                                    <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px] font-normal bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200">광학용/편광필름</Badge></td>
                                  </tr>
                                   <tr className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-3 text-muted-foreground">4</td>
                                    <td className="px-4 py-3 font-medium text-foreground">미쓰비시화학</td>
                                    <td className="px-4 py-3 text-foreground/80">12%</td>
                                    <td className="px-4 py-3 text-muted-foreground text-xs">160,000톤/년</td>
                                    <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px] font-normal bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200">포장용/산업용</Badge></td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                        </div>

                        <h3 className="mt-10 mb-4 text-base font-bold text-foreground">3. 코오롱인더스트리 핵심 경쟁력</h3>
                        <div className="pl-6 border-l-2 border-transparent hover:border-muted transition-colors">
                            <p className="mb-3">코오롱인더스트리의 PET 필름 사업은 세 가지 핵심 경쟁력을 보유하고 있습니다:</p>
                            <ul className="list-disc pl-5 space-y-2 text-foreground/90">
                                <li><strong>고부가가치 광학용 필름:</strong> OLED 디스플레이용 초박막 필름 기술에서 업계 최고 수준의 두께 균일도(±0.3μm) 달성</li>
                                <li><strong>수직 계열화:</strong> PTA 원료부터 최종 필름 제품까지 일관 생산 체계 구축, 원가 경쟁력 확보</li>
                                <li><strong>고객 다변화:</strong> 삼성SDI, LG디스플레이 등 대형 고객사 외 해외 고객 비중 40% 이상 달성</li>
                            </ul>
                        </div>

                        <h3 className="mt-10 mb-4 text-base font-bold text-foreground">4. 분석 프로세스</h3>
                        <div className="pl-6 border-l-2 border-transparent hover:border-muted transition-colors">
                            <ol className="list-decimal pl-5 space-y-2 text-foreground/90 marker:text-muted-foreground marker:font-medium">
                                <li><strong>산업통상자원부</strong> 소재·부품·장비 통계 및 <strong>KITA</strong> 수출입 데이터 수집</li>
                                <li>경쟁사 <a href="#" className="no-underline hover:underline text-blue-600">도레이 기술 사양서</a> 대비 코오롱 제품 스펙 비교 분석</li>
                                <li>구미/세종 공장 가동률 및 수율 데이터 기반 생산 효율성 평가</li>
                                <li>고객사 수요 예측 및 중장기 시장 점유율 시나리오 분석</li>
                            </ol>
                        </div>

                        <h3 className="mt-10 mb-4 text-base font-bold text-foreground">5. 생산 거점 현황</h3>
                        <div className="pl-6 border-l-2 border-transparent hover:border-muted transition-colors">
                            <p className="mb-4">코오롱인더스트리의 PET 필름 주요 생산 거점 및 설비 투자 현황입니다.</p>
                            
                            <div className="grid grid-cols-2 gap-6 my-6 not-prose">
                                <div className="rounded-xl border border-border overflow-hidden bg-muted/10 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="aspect-video bg-slate-100 flex items-center justify-center text-slate-400">
                                        <ImageIcon className="w-10 h-10 opacity-40" />
                                    </div>
                                    <div className="p-3 text-xs text-muted-foreground bg-card border-t border-border font-medium">
                                        그림 1. 구미공장 생산라인 배치도 (연 80,000톤)
                                    </div>
                                </div>
                                <div className="rounded-xl border border-border overflow-hidden bg-muted/10 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="aspect-video bg-slate-100 flex items-center justify-center text-slate-400">
                                        <ImageIcon className="w-10 h-10 opacity-40" />
                                    </div>
                                    <div className="p-3 text-xs text-muted-foreground bg-card border-t border-border font-medium">
                                        그림 2. 세종공장 신규 OLED 필름 라인 (연 40,000톤)
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h3 className="mt-10 mb-4 text-base font-bold text-foreground">6. 후속 과제</h3>
                        <div className="pl-6 border-l-2 border-transparent hover:border-muted transition-colors">
                            <ul className="contains-task-list task-list list-none pl-0 space-y-2">
                                <li className="flex items-start gap-3 group">
                                    <input type="checkbox" checked readOnly className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 accent-blue-600 cursor-default" /> 
                                    <span className="text-foreground/80 group-hover:text-foreground transition-colors line-through decoration-muted-foreground/50">경쟁사 시장 점유율 데이터 수집 완료 (2024-12-01)</span>
                                </li>
                                <li className="flex items-start gap-3 group">
                                    <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 accent-blue-600 cursor-pointer" /> 
                                    <span className="text-foreground/90 group-hover:text-foreground transition-colors">구미공장 3차 증설 라인 가동 일정 확인</span>
                                </li>
                                <li className="flex items-start gap-3 group">
                                    <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 accent-blue-600 cursor-pointer" /> 
                                    <span className="text-foreground/90 group-hover:text-foreground transition-colors">OLED 편광필름 고객사 테스트 결과 보고서 작성</span>
                                </li>
                            </ul>
                        </div>

                        <h3 className="mt-10 mb-4 text-base font-bold text-foreground">7. 참고 자료 및 첨부</h3>
                        <p>
                            상세 데이터는 <a href="#" className="text-blue-600 hover:underline">한국IR협의회 기업분석 리포트</a>를 참고하세요.
                            관련 내부 분석은 <WikiLink>[[2023년 PET 필름 시장 분석 보고서]]</WikiLink>에서 확인할 수 있습니다.
                        </p>

                        <div className="not-prose mt-4 space-y-2">
                            <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors cursor-pointer group">
                                <div className="h-10 w-10 rounded bg-red-50 flex items-center justify-center shrink-0">
                                    <FileText className="w-5 h-5 text-red-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">코오롱_PET필름_기술분석_v2.pdf</div>
                                    <div className="text-xs text-muted-foreground">2.4 MB</div>
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
                                    <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">시장점유율_분석_보고서.xlsx</div>
                                    <div className="text-xs text-muted-foreground">1.8 MB</div>
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
                      <ResizablePanel defaultSize={30} minSize={20} className="bg-background border-r border-border relative flex flex-col h-full">
                         {/* Graph Header - Empty but height aligned */}
                         <div className="h-16 border-b border-border flex items-center justify-between px-3 bg-background shrink-0">
                           <div className="flex items-center gap-2 px-2">
                              <Share2 className="w-4 h-4 text-blue-500" />
                              <span className="font-semibold text-sm">{t('kgOntology')}</span>
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
                            <GraphErrorBoundary>
                              {isMounted && <GraphView />}
                            </GraphErrorBoundary>
                          </ReactFlowProvider>
                        </div>
                      </ResizablePanel>
                    </>
                  )}

                  {/* 4. AI Copilot */}
                  {showCopilot && (
                    <>
                      {(showDocDetails || showGraph) && <ResizableHandle />}
                      <ResizablePanel defaultSize={30} minSize={15} className="bg-background flex flex-col h-full">
                        <div className="h-16 border-b border-border flex items-center px-3 justify-between shrink-0 bg-background">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-500" />
                            <span className="font-semibold text-sm">{t('kgCopilot')}</span>
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
                           <div className="relative flex items-center mb-4 px-1 w-full min-w-0 h-10">
                             <div className="absolute inset-y-0 left-0 right-10 overflow-x-auto scrollbar-hide flex items-center gap-2 pr-2">
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
                             
                             {/* Fixed + Button with gradient mask on the left */}
                             <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-background pl-2 z-10">
                                 <div className="absolute left-0 top-0 bottom-0 w-4 -translate-x-full bg-gradient-to-l from-background to-transparent pointer-events-none" />
                                 <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7 text-blue-600 hover:bg-blue-50 rounded-full shrink-0"
                                    onClick={handleAddSession}
                                 >
                                   <Plus className="w-4 h-4" />
                                 </Button>
                             </div>
                           </div>
            
                           {/* Chat Messages */}
                           {activeSession.messages.length === 0 ? (
                             <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-xs">
                               <Bot className="w-8 h-8 mb-2 opacity-20" />
                               <p>{t('kgStartConversation')}</p>
                             </div>
                           ) : (
                             activeSession.messages.map((msg, i) => (
                             <div key={i} className="space-y-2">
                                <div className="flex items-center justify-between">
                                   <span className="text-[10px] font-bold text-muted-foreground uppercase">{msg.role === 'user' ? t('kgMe') : t('kgAiName')}</span>
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
                                {msg.sources && (
                                   <SourceList data={msg.sources} />
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
                               <span className="text-sm font-medium text-foreground">{t('kgWorking')}</span>
                             </motion.div>
                          )}

                          <div className="relative border border-blue-500 rounded-xl shadow-sm bg-background focus-within:ring-1 focus-within:ring-blue-600 focus-within:border-blue-600 transition-all">
                            <Textarea 
                              placeholder={t('kgAskAnything')} 
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
  const { t } = useLanguage();
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('kgDeleteSession')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('kgDeleteSessionDesc')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('kgCancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-500 hover:bg-red-600">{t('kgDelete')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
