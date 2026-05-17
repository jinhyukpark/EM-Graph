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
  Newspaper, Smile, Layout as LayoutIcon, BadgeCheck, User, Users, TrendingUp,
  Bot, Database, FileCode, Sidebar, PanelLeft, PanelRight, Network, LayoutTemplate, Columns, Trash2, Tag, Calendar as CalendarIcon, Eye, EyeOff, Image as ImageIcon, AtSign, ArrowUp, Copy, RotateCcw, Link, AlertCircle,
  Play, Pause, ChevronsLeft, ChevronsRight, ChevronLeft, ZoomIn, ZoomOut, Filter
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

import stockPrison from '@assets/stock_images/modern_prison_buildi_9bacaffd.jpg';
import stockDetective from '@assets/stock_images/police_detective_inv_e00135e9.jpg';
import stockCriminal from '@assets/stock_images/criminal_mugshot_or__e3300888.jpg';
import stockVictim from '@assets/stock_images/victim_of_crime_port_a8ed2300.jpg';
import stockCase from '@assets/stock_images/legal_case_file_docu_d34f6df4.jpg';
import stockVictimB from '@assets/stock_images/portrait_of_a_young__70369a95.jpg';
import stockCompany from '@assets/stock_images/modern_corporate_off_11c42306.jpg';
import stockPhone from '@assets/stock_images/old_burner_mobile_ph_af367193.jpg';
import stockMoney from '@assets/stock_images/stacks_of_money_in_b_5f30198e.jpg';

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
        { id: "n1", name: "Note 1", type: "note", tags: ["EM", "BOX"], createdAt: "2026-05-10" },
        { id: "n2", name: "Note 2", type: "note", tags: ["CRM", "apply"], createdAt: "2026-05-12" },
        { id: "n3", name: "Note 3", type: "note", isNew: true, tags: ["EM 아이디어", "IR"], createdAt: "2026-05-17" }
      ]},
      { id: "f5", name: "Test", type: "folder", children: [] },
      { id: "f6", name: "2024 Analysis", type: "folder", children: [
         { id: "n4", name: "LG Energy Solution & SK Innovation", type: "note", active: true, isNew: true, tags: ["Battery", "EV", "Patent"], createdAt: "2026-05-15" }
      ]}
    ]
  },
  {
    id: "shared-root",
    name: "Shared with me",
    type: "shared-root",
    subscribed: true,
    children: [
      {
        id: "sf1",
        name: "주식 투자 인사이트",
        type: "folder",
        subscribed: true,
        owner: "박투자",
        children: [
          { id: "sn1", name: "2024 코스피 반도체 섹터 전망", type: "note", subscribed: true, owner: "박투자", tags: ["반도체", "코스피"], createdAt: "2026-04-22" },
          { id: "sn2", name: "삼성전자 vs SK하이닉스 비교 분석", type: "note", subscribed: true, owner: "박투자", isNew: true, tags: ["반도체", "IR"], createdAt: "2026-05-14" },
          { id: "sn3", name: "배터리 3사 투자 포인트", type: "note", subscribed: true, owner: "박투자", isNew: true, tags: ["Battery", "EV"], createdAt: "2026-05-16" },
        ]
      },
      {
        id: "sf2",
        name: "글로벌 매크로 리포트",
        type: "folder",
        subscribed: true,
        owner: "김애널",
        children: [
          { id: "sn4", name: "美 연준 금리 시나리오", type: "note", subscribed: true, owner: "김애널", isNew: true, tags: ["매크로", "금리"], createdAt: "2026-05-17" },
          { id: "sn5", name: "원/달러 환율 주간 노트", type: "note", subscribed: true, owner: "김애널", tags: ["매크로", "환율"], createdAt: "2026-04-05" },
        ]
      }
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
      type: 'criminal',
      borderColor: '#ef4444', // red-500
      highlight: true,
      image: stockCriminal
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
      type: 'criminal',
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
      type: 'victim',
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
      type: 'detective',
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
      type: 'detective',
      borderColor: '#3b82f6', // blue-500
      image: stockDetective
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
      type: 'criminal',
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
      type: 'criminal',
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
      type: 'criminal',
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
      type: 'victim',
      borderColor: '#f97316', // orange-500
      image: stockVictim
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
      type: 'detective',
      borderColor: '#a855f7', // purple-500
      image: stockCase
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
      type: 'victim',
      borderColor: '#eab308', // yellow-500
      image: stockVictimB
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
      type: 'victim',
      borderColor: '#eab308', // yellow-500
      image: stockCompany
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
      type: 'detective',
      borderColor: '#64748b', // slate-500
      image: stockPhone
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
      type: 'criminal',
      borderColor: '#10b981', // emerald-500
      image: stockMoney
    },
    style: { width: 60, height: 60 }
  },
  // Bottom Right (Prison - Replacing Warehouse)
  { 
    id: 'prison_central', 
    type: 'entity',
    position: { x: 250, y: 350 }, 
    data: { 
      label: 'Seoul Central', 
      subLabel: 'Prison',
      type: 'prison',
      borderColor: '#10b981', // emerald-500
      image: stockPrison
    },
    style: { width: 75, height: 75 }
  }
];

const INITIAL_EDGES = [
  // Red Arrows (Criminal/Hostile)
  { id: 'e-kang-park', source: 'kang', target: 'park_razor', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
  { id: 'e-kang-kim', source: 'kang', target: 'kim_ledger', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '5,5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
  { id: 'e-park-warehouse', source: 'park_razor', target: 'prison_central', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
  { id: 'e-thug-kang', source: 'thug_a', target: 'kang', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
  
  // Blue Lines (Police/Investigation)
  { id: 'e-lee-choi', source: 'det_lee', target: 'det_choi', type: 'straight', style: { stroke: '#3b82f6', strokeWidth: 1.5 } },
  { id: 'e-choi-kang', source: 'det_choi', target: 'kang', type: 'straight', style: { stroke: '#3b82f6', strokeWidth: 1.5, strokeDasharray: '5,5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },
  { id: 'e-choi-case', source: 'det_choi', target: 'case_22004', type: 'straight', style: { stroke: '#3b82f6', strokeWidth: 1.5 } },
  { id: 'e-park-burner', source: 'park_razor', target: 'burner_phone', type: 'straight', style: { stroke: '#3b82f6', strokeWidth: 1.5 } },
  { id: 'e-lee-warehouse', source: 'det_lee', target: 'prison_central', type: 'straight', style: { stroke: '#3b82f6', strokeWidth: 1 } },
  
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
    sources: [
      { id: "note-1", title: "LG Energy Solution Patent Portfolio", date: "2024-12-01" },
      { id: "note-2", title: "SK Innovation Battery Tech Analysis", date: "2024-11-20" },
      { id: "note-3", title: "Meeting Notes: Cross-licensing Strategy", date: "2024-10-15" }
    ],
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

const AVAILABLE_SUBSCRIPTIONS: any[] = [
  {
    id: "sf-avail-1",
    name: "ESG 투자 트렌드",
    type: "folder",
    subscribed: true,
    owner: "이ESG",
    children: [
      { id: "sn-avail-1a", name: "탄소 배출권 시장 분석", type: "note", subscribed: true, owner: "이ESG" },
      { id: "sn-avail-1b", name: "그린본드 발행 현황", type: "note", subscribed: true, owner: "이ESG" },
    ],
  },
  {
    id: "sf-avail-2",
    name: "美 빅테크 실적 모음",
    type: "folder",
    subscribed: true,
    owner: "정퀀트",
    children: [
      { id: "sn-avail-2a", name: "Apple Q4 실적 노트", type: "note", subscribed: true, owner: "정퀀트" },
      { id: "sn-avail-2b", name: "NVIDIA 데이터센터 매출", type: "note", subscribed: true, owner: "정퀀트" },
      { id: "sn-avail-2c", name: "Meta 광고 트렌드", type: "note", subscribed: true, owner: "정퀀트" },
    ],
  },
  {
    id: "sf-avail-3",
    name: "암호화폐 온체인 분석",
    type: "folder",
    subscribed: true,
    owner: "최체인",
    children: [
      { id: "sn-avail-3a", name: "비트코인 고래 지갑 추적", type: "note", subscribed: true, owner: "최체인" },
      { id: "sn-avail-3b", name: "이더리움 스테이킹 리포트", type: "note", subscribed: true, owner: "최체인" },
    ],
  },
];

const countNotes = (node: any): number => {
  if (!node) return 0;
  if (node.type === 'note') return 1;
  if (!Array.isArray(node.children)) return 0;
  return node.children.reduce((sum: number, child: any) => sum + countNotes(child), 0);
};

const hasNewNote = (node: any): boolean => {
  if (!node) return false;
  if (node.type === 'note') return !!node.isNew;
  if (!Array.isArray(node.children)) return false;
  return node.children.some((c: any) => hasNewNote(c));
};

const FileTreeNode = ({
  node,
  level = 0,
  onRemoveSubscription,
  onAddSubscription,
  existingSubscriptionIds,
  onOpenManageDialog,
}: {
  node: any;
  level?: number;
  onRemoveSubscription?: (id: string) => void;
  onAddSubscription?: (item: any) => void;
  existingSubscriptionIds?: Set<string>;
  onOpenManageDialog?: () => void;
}) => {
  const [expanded, setExpanded] = useState(true);
  const isSubscribed = !!node.subscribed;
  const isSharedRoot = node.type === 'shared-root';
  const isSubscribedFolder = isSubscribed && !isSharedRoot && node.type === 'folder';
  const isFolderLike = node.type === 'folder' || node.type === 'root' || isSharedRoot;
  const noteCount = isFolderLike ? countNotes(node) : 0;
  const folderHasNew = isFolderLike && hasNewNote(node);
  const isNoteNew = node.type === 'note' && !!node.isNew;

  const folderIconColor = isSubscribed ? 'text-indigo-400' : 'text-blue-400/80';
  const fileIconColor = isSubscribed ? 'text-indigo-500' : 'text-muted-foreground';

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  const addableSubscriptions = (AVAILABLE_SUBSCRIPTIONS || []).filter(
    (s) => !existingSubscriptionIds?.has(s.id)
  );

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-1 py-1 px-2 hover:bg-secondary/50 cursor-pointer text-sm group/treeitem",
          node.active ? 'bg-secondary text-primary font-medium' : 'text-muted-foreground',
          isSubscribed && !node.active && 'text-indigo-700 dark:text-indigo-300',
          isSharedRoot && 'mt-2 border-t border-dashed border-indigo-300/60 dark:border-indigo-700/60 pt-2'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => setExpanded(!expanded)}
      >
        {node.children ? (
          <span className="text-muted-foreground/50 w-4 h-4 flex items-center justify-center">
            {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </span>
        ) : <span className="w-4" />}

        {isSharedRoot ? (
          <Users className="w-4 h-4 text-indigo-500" />
        ) : node.type === 'folder' || node.type === 'root' ? (
          expanded ? <FolderOpen className={cn("w-4 h-4", folderIconColor)} /> : <Folder className={cn("w-4 h-4", folderIconColor)} />
        ) : (
          <FileText className={cn("w-4 h-4", fileIconColor)} />
        )}
        <span className={cn("truncate", isSharedRoot && "font-semibold text-indigo-600 dark:text-indigo-300 uppercase tracking-wide text-xs")}>
          {node.name}
        </span>

        {isFolderLike && (
          <span
            className={cn(
              "shrink-0 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full text-[10px] font-semibold tabular-nums",
              isSubscribed
                ? "bg-indigo-100/80 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300"
                : "bg-secondary text-muted-foreground"
            )}
            title={`${noteCount} notes`}
          >
            {noteCount}
          </span>
        )}

        {isNoteNew && (
          <span
            className="shrink-0 inline-flex items-center gap-0.5 px-1.5 h-[16px] rounded-sm text-[9px] font-bold uppercase tracking-wide bg-emerald-500 text-white shadow-sm"
            title="최근 추가됨"
          >
            New
          </span>
        )}

        {!expanded && folderHasNew && isFolderLike && (
          <span
            className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500"
            title="새 노트 포함"
          />
        )}

        {isSubscribed && !isSharedRoot && node.owner && (
          <span
            className="ml-auto flex items-center gap-1 text-[10px] font-medium text-indigo-500/90 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/60 rounded-full px-1.5 py-0.5 shrink-0 opacity-80 group-hover/treeitem:opacity-100"
            title={`${node.owner} 님이 공유`}
          >
            <Share2 className="w-2.5 h-2.5" />
            {node.owner}
          </span>
        )}

        {isSharedRoot && (
          <div className={cn("flex items-center", !isSubscribed && node.owner ? "" : "ml-auto")} onClick={stop}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 opacity-70 group-hover/treeitem:opacity-100"
                  data-testid="button-shared-root-menu"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs">공유 지식</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onOpenManageDialog?.()}
                  data-testid="item-open-manage-subscriptions"
                  className="text-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-2 text-indigo-500" />
                  구독 관리
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {isSubscribedFolder && (
          <div className="flex items-center ml-1" onClick={stop}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 opacity-0 group-hover/treeitem:opacity-100 transition-opacity"
                  data-testid={`button-sub-item-menu-${node.id}`}
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs truncate">{node.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onRemoveSubscription?.(node.id)}
                  className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                  data-testid={`item-remove-sub-${node.id}`}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  구독 삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {expanded && node.children && (
        <div className={cn(isSubscribed && !isSharedRoot && "border-l border-dashed border-indigo-200/60 dark:border-indigo-800/40 ml-4")}>
          {node.children.map((child: any) => (
            <FileTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onRemoveSubscription={onRemoveSubscription}
              onAddSubscription={onAddSubscription}
              existingSubscriptionIds={existingSubscriptionIds}
              onOpenManageDialog={onOpenManageDialog}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SourceList = ({ data }: { data: any[] }) => {
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
             <span>Source {data.length}</span>
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

// Timeline Component
function GraphTimeline() {
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
                <div className="text-muted-foreground">{d.value} events recorded</div>
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
             <span className="text-[11px] text-muted-foreground font-medium">Timeline Range:</span>
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

  const existingSubscriptionIds = (() => {
    const sharedRoot = fileTree.find((n: any) => n.type === 'shared-root');
    const ids = new Set<string>();
    sharedRoot?.children?.forEach((c: any) => ids.add(c.id));
    return ids;
  })();

  const handleRemoveSubscription = (id: string) => {
    setFileTree((prev: any) =>
      prev.map((n: any) =>
        n.type === 'shared-root'
          ? { ...n, children: (n.children || []).filter((c: any) => c.id !== id) }
          : n
      )
    );
  };

  const handleAddSubscription = (item: any) => {
    setFileTree((prev: any) => {
      const hasShared = prev.some((n: any) => n.type === 'shared-root');
      if (hasShared) {
        return prev.map((n: any) =>
          n.type === 'shared-root'
            ? { ...n, children: [...(n.children || []), item] }
            : n
        );
      }
      return [
        ...prev,
        {
          id: 'shared-root',
          name: 'Shared with me',
          type: 'shared-root',
          subscribed: true,
          children: [item],
        },
      ];
    });
  };

  const [showManageSubsDialog, setShowManageSubsDialog] = useState(false);

  const [treeSearchQuery, setTreeSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [shareFilter, setShareFilter] = useState<'all' | 'shared' | 'mine'>('all');
  const [tagSearchInput, setTagSearchInput] = useState("");

  const allTags = (() => {
    const tags = new Set<string>();
    const walk = (n: any) => {
      if (n.type === 'note' && Array.isArray(n.tags)) {
        n.tags.forEach((t: string) => tags.add(t));
      }
      (n.children || []).forEach(walk);
    };
    fileTree.forEach(walk);
    return Array.from(tags).sort();
  })();

  const noteMatchesFilters = (note: any): boolean => {
    if (selectedTags.length > 0) {
      const noteTags: string[] = Array.isArray(note.tags) ? note.tags : [];
      if (!selectedTags.some((t) => noteTags.includes(t))) return false;
    }
    if (dateFilter !== 'all') {
      if (!note.createdAt) return false;
      const created = new Date(note.createdAt).getTime();
      const now = Date.now();
      const day = 24 * 60 * 60 * 1000;
      const cutoff = dateFilter === 'today' ? day : dateFilter === 'week' ? 7 * day : 30 * day;
      if (now - created > cutoff) return false;
    }
    if (shareFilter === 'shared' && !note.subscribed) return false;
    if (shareFilter === 'mine' && note.subscribed) return false;
    return true;
  };

  const filterTree = useCallback((nodes: any[], query: string): any[] => {
    const q = query.trim().toLowerCase();
    const noFilters = !q && selectedTags.length === 0 && dateFilter === 'all' && shareFilter === 'all';
    if (noFilters) return nodes;
    const walk = (node: any): any | null => {
      if (node.type === 'note') {
        const nameMatches = !q || (node.name || "").toLowerCase().includes(q);
        if (nameMatches && noteMatchesFilters(node)) return { ...node };
        return null;
      }
      const filteredChildren = (node.children || []).map(walk).filter(Boolean);
      const selfNameMatches = !!q && (node.name || "").toLowerCase().includes(q);
      if (filteredChildren.length > 0 || (selfNameMatches && selectedTags.length === 0 && dateFilter === 'all' && shareFilter === 'all')) {
        return { ...node, children: filteredChildren };
      }
      return null;
    };
    return nodes.map(walk).filter(Boolean);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTags, dateFilter, shareFilter]);

  const visibleTree = filterTree(fileTree, treeSearchQuery);

  const activeFilterCount =
    (selectedTags.length > 0 ? 1 : 0) +
    (dateFilter !== 'all' ? 1 : 0) +
    (shareFilter !== 'all' ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedTags([]);
    setDateFilter('all');
    setShareFilter('all');
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  type WorkTab = { id: string; title: string; kind: 'note' | 'new' };
  const [tabs, setTabs] = useState<WorkTab[]>([
    { id: 'tab-1', title: 'LG Energy Solution & SK Innovation', kind: 'note' },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const handleAddTab = () => {
    const id = `tab-${Date.now()}`;
    setTabs(prev => [...prev, { id, title: 'New Workspace', kind: 'new' }]);
    setActiveTabId(id);
  };

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTabs(prev => {
      if (prev.length <= 1) return prev;
      const next = prev.filter(t => t.id !== id);
      if (id === activeTabId) {
        const idx = prev.findIndex(t => t.id === id);
        const fallback = next[Math.max(0, idx - 1)] || next[0];
        setActiveTabId(fallback.id);
      }
      return next;
    });
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
                    <span className="text-sm font-medium">At least one view must be open.</span>
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
                     <span className="font-semibold text-sm">Explorer</span>
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
                <div className="px-3 pt-2 pb-2 border-b border-border/60 shrink-0 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/70 pointer-events-none" />
                      <Input
                        data-testid="input-tree-search"
                        value={treeSearchQuery}
                        onChange={(e) => setTreeSearchQuery(e.target.value)}
                        placeholder="노트 검색..."
                        className="h-8 pl-8 pr-7 text-xs bg-background"
                      />
                      {treeSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setTreeSearchQuery("")}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-muted text-muted-foreground"
                          data-testid="button-clear-tree-search"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className={cn(
                            "h-8 w-8 shrink-0 relative",
                            activeFilterCount > 0 && "border-blue-500 text-blue-600 bg-blue-50/40 hover:bg-blue-50"
                          )}
                          data-testid="button-tree-filter"
                          title="필터"
                        >
                          <Filter className="w-3.5 h-3.5" />
                          {activeFilterCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center">
                              {activeFilterCount}
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-80 p-0" data-testid="popover-tree-filter">
                        <div className="flex items-center justify-between px-3 py-2 border-b">
                          <span className="text-sm font-semibold">필터</span>
                          {activeFilterCount > 0 && (
                            <button
                              type="button"
                              onClick={clearAllFilters}
                              className="text-xs text-blue-600 hover:underline"
                              data-testid="button-clear-filters"
                            >
                              모두 지우기
                            </button>
                          )}
                        </div>

                        <div className="p-3 space-y-4 max-h-[420px] overflow-y-auto">
                          {/* Date filter */}
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              <CalendarIcon className="w-3 h-3" /> 생성일
                            </div>
                            <div className="grid grid-cols-4 gap-1">
                              {([
                                { v: 'all', l: '전체' },
                                { v: 'today', l: '오늘' },
                                { v: 'week', l: '이번 주' },
                                { v: 'month', l: '이번 달' },
                              ] as const).map((opt) => (
                                <button
                                  key={opt.v}
                                  type="button"
                                  onClick={() => setDateFilter(opt.v)}
                                  data-testid={`button-date-${opt.v}`}
                                  className={cn(
                                    "h-7 rounded-md text-xs font-medium border transition-colors",
                                    dateFilter === opt.v
                                      ? "bg-blue-500 text-white border-blue-500"
                                      : "bg-background border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                                  )}
                                >
                                  {opt.l}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Share filter */}
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              <Share2 className="w-3 h-3" /> 공유
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                              {([
                                { v: 'all', l: '전체' },
                                { v: 'mine', l: '내 노트' },
                                { v: 'shared', l: '공유받음' },
                              ] as const).map((opt) => (
                                <button
                                  key={opt.v}
                                  type="button"
                                  onClick={() => setShareFilter(opt.v)}
                                  data-testid={`button-share-${opt.v}`}
                                  className={cn(
                                    "h-7 rounded-md text-xs font-medium border transition-colors",
                                    shareFilter === opt.v
                                      ? "bg-indigo-500 text-white border-indigo-500"
                                      : "bg-background border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                                  )}
                                >
                                  {opt.l}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                <Tag className="w-3 h-3" /> 태그
                              </div>
                              {selectedTags.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => setSelectedTags([])}
                                  className="text-[10px] text-muted-foreground hover:text-foreground"
                                >
                                  초기화
                                </button>
                              )}
                            </div>
                            <Input
                              value={tagSearchInput}
                              onChange={(e) => setTagSearchInput(e.target.value)}
                              placeholder="태그 검색..."
                              className="h-7 text-xs"
                              data-testid="input-tag-search"
                            />
                            <div className="max-h-40 overflow-y-auto rounded-md border border-border/60 p-1.5 space-y-0.5 bg-muted/20">
                              {allTags.filter(t => t.toLowerCase().includes(tagSearchInput.toLowerCase())).length === 0 ? (
                                <div className="text-center text-[11px] text-muted-foreground py-3">태그 없음</div>
                              ) : (
                                allTags
                                  .filter(t => t.toLowerCase().includes(tagSearchInput.toLowerCase()))
                                  .map((tag) => {
                                    const checked = selectedTags.includes(tag);
                                    return (
                                      <label
                                        key={tag}
                                        className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-background transition-colors"
                                        data-testid={`label-tag-${tag}`}
                                      >
                                        <Checkbox
                                          checked={checked}
                                          onCheckedChange={() => toggleTag(tag)}
                                          className="h-3.5 w-3.5"
                                        />
                                        <span className="text-xs">{tag}</span>
                                      </label>
                                    );
                                  })
                              )}
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {(selectedTags.length > 0 || dateFilter !== 'all' || shareFilter !== 'all') && (
                    <div className="flex flex-wrap gap-1">
                      {dateFilter !== 'all' && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] bg-blue-50 text-blue-700 border border-blue-200">
                          <CalendarIcon className="w-2.5 h-2.5" />
                          {dateFilter === 'today' ? '오늘' : dateFilter === 'week' ? '이번 주' : '이번 달'}
                          <button onClick={() => setDateFilter('all')} className="hover:text-blue-900"><X className="w-2.5 h-2.5" /></button>
                        </span>
                      )}
                      {shareFilter !== 'all' && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200">
                          <Share2 className="w-2.5 h-2.5" />
                          {shareFilter === 'mine' ? '내 노트' : '공유받음'}
                          <button onClick={() => setShareFilter('all')} className="hover:text-indigo-900"><X className="w-2.5 h-2.5" /></button>
                        </span>
                      )}
                      {selectedTags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] bg-muted text-foreground border border-border">
                          <Tag className="w-2.5 h-2.5" />
                          {tag}
                          <button onClick={() => toggleTag(tag)} className="hover:text-foreground"><X className="w-2.5 h-2.5" /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <ScrollArea className="flex-1">
                   <div className="p-2">
                     {visibleTree.length === 0 ? (
                       <div className="text-center text-xs text-muted-foreground py-8 px-2">
                         "{treeSearchQuery}" 에 대한 검색 결과가 없습니다.
                       </div>
                     ) : (
                       visibleTree.map((node: any) => (
                         <FileTreeNode
                           key={node.id}
                           node={node}
                           onRemoveSubscription={handleRemoveSubscription}
                           onAddSubscription={handleAddSubscription}
                           existingSubscriptionIds={existingSubscriptionIds}
                           onOpenManageDialog={() => setShowManageSubsDialog(true)}
                         />
                       ))
                     )}
                   </div>
                </ScrollArea>
                
                <div className="p-4 border-t border-border bg-background space-y-3">
                    <div className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">View Options</div>
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
                                <span>Document Details</span>
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
                                <span>Ontology</span>
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
                                <span>Copilot</span>
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
                {/* Tab Bar */}
                <div className="flex items-stretch h-9 border-b border-border bg-muted/30 shrink-0 overflow-x-auto">
                  {tabs.map((tab) => {
                    const isActive = tab.id === activeTabId;
                    return (
                      <div
                        key={tab.id}
                        data-testid={`tab-${tab.id}`}
                        onClick={() => setActiveTabId(tab.id)}
                        className={cn(
                          "group/tab flex items-center gap-2 pl-3 pr-2 max-w-[220px] border-r border-border cursor-pointer text-xs transition-colors shrink-0",
                          isActive
                            ? "bg-background text-foreground border-b-2 border-b-blue-500 -mb-px"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        )}
                      >
                        {tab.kind === 'note' ? (
                          <FileText className={cn("w-3.5 h-3.5 shrink-0", isActive ? "text-blue-500" : "text-muted-foreground/70")} />
                        ) : (
                          <Sparkles className={cn("w-3.5 h-3.5 shrink-0", isActive ? "text-blue-500" : "text-muted-foreground/70")} />
                        )}
                        <span className="truncate">{tab.title}</span>
                        {tabs.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => handleCloseTab(tab.id, e)}
                            data-testid={`button-close-tab-${tab.id}`}
                            className={cn(
                              "p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-opacity",
                              isActive ? "opacity-100" : "opacity-0 group-hover/tab:opacity-100"
                            )}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    onClick={handleAddTab}
                    data-testid="button-add-tab"
                    className="flex items-center justify-center w-9 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shrink-0"
                    title="새 탭"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {!showExplorer && (
                  <div className="absolute top-9 left-2 z-20">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowExplorer(true)}>
                      <PanelLeft className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                )}

                {activeTab?.kind === 'new' ? (
                  <div className="flex-1 flex items-center justify-center bg-white">
                    <div className="text-center max-w-md px-8 py-16">
                      <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                        <Plus className="w-8 h-8 text-blue-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">새로운 작업 공간</h3>
                      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                        왼쪽 탐색기에서 노트를 선택하거나 새 노트를 만들어 이 탭에서 작업을 시작하세요.
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleAddNewFile} data-testid="button-newtab-create-note">
                          <Plus className="w-3.5 h-3.5 mr-1.5" /> 새 노트 만들기
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setTreeSearchQuery("")} data-testid="button-newtab-browse">
                          <Search className="w-3.5 h-3.5 mr-1.5" /> 노트 찾아보기
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                <ScrollArea className="flex-1 bg-white">
                  <div className="max-w-3xl mx-auto p-8 space-y-8">
                    <div className="space-y-6">
                      <div className="group relative mt-6">
                        {/* Title Toolbar */}
                        <div className="absolute -top-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-4 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-border/50 shadow-sm">
                           <button className="flex items-center gap-1.5 hover:text-foreground hover:bg-muted/50 px-1.5 py-0.5 rounded transition-colors">
                             <Smile className="w-3.5 h-3.5" />
                             <span>Add Icon</span>
                           </button>
                           <button className="flex items-center gap-1.5 hover:text-foreground hover:bg-muted/50 px-1.5 py-0.5 rounded transition-colors">
                             <LayoutIcon className="w-3.5 h-3.5" />
                             <span>Title Bar</span>
                           </button>
                           <button className="flex items-center gap-1.5 hover:text-foreground hover:bg-muted/50 px-1.5 py-0.5 rounded transition-colors">
                             <BadgeCheck className="w-3.5 h-3.5" />
                             <span>Verify</span>
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
                                     <DropdownMenuLabel className="text-xs text-muted-foreground font-normal px-2 py-1.5">Change Status</DropdownMenuLabel>
                                     {STATUS_OPTIONS.map(status => (
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

                        <h1 
                          contentEditable 
                          suppressContentEditableWarning 
                          className="text-3xl font-bold tracking-tight text-foreground/90 mb-4 pt-2 outline-none cursor-text relative"
                        >
                          Patent Dispute Analysis: LG Energy Solution vs SK Innovation
                        </h1>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground border-b border-border pb-6 min-h-[50px] relative">
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
                                                    placeholder="Add tag"
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
                                <span className="font-medium">This document was generated by <span className="font-bold">Gemini</span> on October 12, 2025.</span>
                                
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
                )}
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
          <SubscriptionManageDialog
            open={showManageSubsDialog}
            onOpenChange={setShowManageSubsDialog}
            currentSubscriptions={(fileTree.find((n: any) => n.type === 'shared-root')?.children) || []}
            availableSubscriptions={AVAILABLE_SUBSCRIPTIONS.filter((s) => !existingSubscriptionIds.has(s.id))}
            onAdd={handleAddSubscription}
            onRemove={handleRemoveSubscription}
          />
          <DeleteSessionDialog 
            open={showDeleteDialog} 
            onOpenChange={setShowDeleteDialog} 
            onConfirm={confirmDeleteSession} 
          />
        </Layout>
      );
    }

function SubscriptionManageDialog({
  open,
  onOpenChange,
  currentSubscriptions,
  availableSubscriptions,
  onAdd,
  onRemove,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSubscriptions: any[];
  availableSubscriptions: any[];
  onAdd: (item: any) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            구독 관리
          </DialogTitle>
          <DialogDescription>
            현재 구독중인 지식과 추가로 구독할 수 있는 지식을 한눈에 확인하고, 트리에 표시할지 직접 선택하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {/* Current subscriptions */}
          <div className="border border-border rounded-lg overflow-hidden flex flex-col bg-card">
            <div className="px-4 py-3 bg-indigo-50/60 dark:bg-indigo-950/30 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                  현재 구독중
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {currentSubscriptions.length}개
              </span>
            </div>
            <ScrollArea className="max-h-[360px]">
              <div className="divide-y divide-border">
                {currentSubscriptions.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground">
                    아직 구독한 지식이 없습니다
                  </div>
                ) : (
                  currentSubscriptions.map((sub) => (
                    <div key={sub.id} className="flex items-start gap-3 p-3 hover:bg-muted/30 transition-colors">
                      <Folder className="w-4 h-4 text-indigo-400 mt-1 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{sub.name}</div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <Share2 className="w-2.5 h-2.5" />
                          {sub.owner} · {sub.children?.length ?? 0} notes
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0" title="트리에 표시">
                        <Switch
                          checked
                          onCheckedChange={(v) => { if (!v) onRemove(sub.id); }}
                          data-testid={`switch-current-${sub.id}`}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Available subscriptions */}
          <div className="border border-border rounded-lg overflow-hidden flex flex-col bg-card">
            <div className="px-4 py-3 bg-muted/40 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">
                  추가 가능
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {availableSubscriptions.length}개
              </span>
            </div>
            <ScrollArea className="max-h-[360px]">
              <div className="divide-y divide-border">
                {availableSubscriptions.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground">
                    추가 가능한 구독이 없습니다
                  </div>
                ) : (
                  availableSubscriptions.map((sub) => (
                    <div key={sub.id} className="flex items-start gap-3 p-3 hover:bg-muted/30 transition-colors">
                      <Folder className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{sub.name}</div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <Share2 className="w-2.5 h-2.5" />
                          {sub.owner} · {sub.children?.length ?? 0} notes
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0" title="트리에 추가">
                        <Switch
                          checked={false}
                          onCheckedChange={(v) => { if (v) onAdd(sub); }}
                          data-testid={`switch-available-${sub.id}`}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-close-manage-subs">
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
