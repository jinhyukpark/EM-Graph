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
  Bot, Database, FileCode, Sidebar, PanelLeft, PanelRight, Network, LayoutTemplate, Columns, Trash2, Tag, Calendar, Eye, EyeOff
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ReactFlow, Background, Controls, useNodesState, useEdgesState, BackgroundVariant, ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
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

const INITIAL_NODES = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'LG Energy Solution' }, style: { background: '#6ee7b7', border: 'none', borderRadius: '50%', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', textAlign: 'center' } },
  { id: '2', position: { x: 200, y: -100 }, data: { label: 'SK Innovation' }, style: { background: '#6ee7b7', border: 'none', borderRadius: '50%', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', textAlign: 'center' } },
  { id: '3', position: { x: 200, y: 100 }, data: { label: 'Battery Patent' }, style: { background: '#6ee7b7', border: 'none', borderRadius: '50%', width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', textAlign: 'center' } },
  { id: '4', position: { x: 400, y: 0 }, data: { label: 'Trade Secrets' }, style: { background: '#a7f3d0', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', textAlign: 'center' } },
  { id: '5', position: { x: 100, y: 200 }, data: { label: 'EV Market' }, style: { background: '#a7f3d0', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', textAlign: 'center' } },
];

const INITIAL_EDGES = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#94a3b8' } },
  { id: 'e1-3', source: '1', target: '3', style: { stroke: '#e2e8f0' } },
  { id: 'e2-3', source: '2', target: '3', style: { stroke: '#e2e8f0' } },
  { id: 'e3-4', source: '3', target: '4', style: { stroke: '#e2e8f0' } },
  { id: 'e1-5', source: '1', target: '5', style: { stroke: '#e2e8f0' } },
];

const CHAT_HISTORY = [
  {
    role: "user",
    content: "Summarize the key patents in this document.",
    time: "Today"
  },
  {
    role: "assistant",
    content: "I've analyzed the document. Here are the key patents mentioned regarding LG Energy Solution:",
    tool: "MCP Tool • Patent_search",
    data: [
      { id: "1020250175306", title: "Cathode Active Material", date: "2025-11-18" },
      { id: "1020250170023", title: "Battery Module", date: "2025-11-12" }
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

// --- Components ---

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
        fitView
        className="bg-background"
      >
        <Background color="#888" gap={20} size={1} variant={BackgroundVariant.Dots} className="opacity-20" />
        <Controls className="!bg-card !border-border !fill-foreground !shadow-sm" />
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
  const [showGraph, setShowGraph] = useState(true);
  const [showCopilot, setShowCopilot] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [docStatus, setDocStatus] = useState(STATUS_OPTIONS[0]); // Default: Draft
  const [docTags, setDocTags] = useState<string[]>(['Battery', 'EV']);
  const [customStatuses, setCustomStatuses] = useState<typeof STATUS_OPTIONS>([]);
  const [newStatusName, setNewStatusName] = useState("");
  const [newTagName, setNewTagName] = useState("");

  const allStatuses = [...STATUS_OPTIONS, ...customStatuses];

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

  return (
    <Layout>
      <div className="h-full bg-background flex flex-col">
        {/* Main Workspace */}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          
          {/* 1. File Tree */}
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
                      true 
                        ? "bg-background border-primary text-primary" 
                        : "border-transparent text-muted-foreground hover:bg-secondary/50"
                    )}
                    onClick={() => {}}
                  >
                    <div className="flex items-center">
                        <FileText className="w-3.5 h-3.5 mr-2" />
                        Document Details
                    </div>
                    <Eye className="w-3.5 h-3.5" />
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
                    onClick={() => setShowGraph(!showGraph)}
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
                    onClick={() => setShowCopilot(!showCopilot)}
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

          {/* 2. Document Editor */}
          <ResizablePanel defaultSize={40} minSize={30} className="bg-background flex flex-col">
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
                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="max-w-3xl mx-auto p-8 space-y-8">
                {/* Document Header */}
                <div className="space-y-4 border-b border-border pb-6">
                   <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    className={cn("h-7 px-2 text-xs font-medium bg-neutral-600 hover:bg-neutral-700 text-white border-transparent gap-1 rounded-sm")}
                                >
                                    {docStatus.label}
                                    <ChevronDown className="w-3 h-3 opacity-70" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-48">
                                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Select Status</DropdownMenuLabel>
                                {allStatuses.map(status => (
                                    <DropdownMenuItem 
                                        key={status.id} 
                                        className="justify-between group cursor-pointer"
                                        onClick={() => setDocStatus(status)}
                                    >
                                        <span>{status.label}</span>
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
                                <div className="p-2">
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

                        <div className="h-4 w-px bg-border" />
                        
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {docTags.map(tag => (
                                <Badge key={tag} variant="secondary" className="h-6 text-[10px] font-normal gap-1 hover:bg-secondary/80 pr-1">
                                    {tag}
                                    <X className="w-3 h-3 text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => removeTag(tag)} />
                                </Badge>
                            ))}
                            <div className="relative flex items-center">
                                <Tag className="absolute left-1.5 w-3 h-3 text-muted-foreground" />
                                <Input 
                                    className="h-6 w-24 text-[10px] pl-5 bg-transparent border-transparent hover:border-border focus:border-primary focus:w-32 transition-all p-0" 
                                    placeholder="Add tag..."
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    onKeyDown={handleAddTag}
                                />
                            </div>
                        </div>
                     </div>
                     <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Last edited 2m ago
                     </span>
                   </div>
                   <h1 className="text-3xl font-bold tracking-tight">LG Energy Solution & SK Innovation Special Analysis Report</h1>
                </div>

                {/* Content */}
                <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      1. Overview
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      This report analyzes recent patent filings by LG Energy Solution and SK Innovation to understand their technological development directions and core competencies. Both companies are major players in the secondary battery market and are strengthening their technological competitiveness through active patent activities.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
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

          <ResizableHandle />

          {/* 3. Graph View */}
          {showGraph && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={25} minSize={20} className="bg-background border-r border-border relative flex flex-col">
                 {/* Graph Header - Empty but height aligned */}
                 <div className="h-16 border-b border-border flex items-center justify-between px-3 bg-background shrink-0">
                   <div className="flex items-center gap-2 px-2">
                      <div className="p-1.5 bg-primary/10 rounded-md">
                        <Share2 className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-semibold text-sm">Ontology</span>
                   </div>
                   <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowGraph(false)}>
                     <X className="w-4 h-4 text-muted-foreground" />
                   </Button>
                 </div>
                <div className="flex-1 w-full relative">
                  <ReactFlowProvider>
                    <GraphView />
                  </ReactFlowProvider>
                  {/* Mini Analytics Overlay */}
                  <div className="absolute bottom-4 right-4 w-48 bg-card/90 backdrop-blur border border-border rounded-lg p-2 shadow-sm text-xs space-y-1">
                     <div className="flex justify-between text-muted-foreground">
                       <span>Nodes</span>
                       <span className="font-mono text-foreground">5</span>
                     </div>
                     <div className="flex justify-between text-muted-foreground">
                       <span>Density</span>
                       <span className="font-mono text-foreground">0.45</span>
                     </div>
                  </div>
                </div>
              </ResizablePanel>
            </>
          )}

          {/* 4. AI Copilot */}
          {showCopilot && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={20} minSize={15} className="bg-background flex flex-col">
                <div className="h-16 border-b border-border flex items-center px-3 justify-between shrink-0 bg-background">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="font-semibold text-sm">Copilot</span>
                  </div>
                  <div className="flex gap-1">
                     <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowCopilot(false)}>
                        <X className="w-4 h-4 text-muted-foreground" />
                     </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
               {/* New Chat Tabs */}
               <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                 <Button variant="secondary" size="sm" className="h-7 text-xs whitespace-nowrap bg-primary/10 text-primary border border-primary/20">
                   <Plus className="w-3 h-3 mr-1" /> New Chat
                 </Button>
                 <Button variant="outline" size="sm" className="h-7 text-xs whitespace-nowrap text-muted-foreground font-normal">
                   Patent Analysis
                 </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs whitespace-nowrap text-muted-foreground font-normal">
                   Legal Review
                 </Button>
               </div>

               {/* Chat Messages */}
               {CHAT_HISTORY.map((msg, i) => (
                 <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-bold text-muted-foreground uppercase">{msg.role === 'user' ? 'Me' : 'Nexus AI'}</span>
                       {msg.time && <span className="text-[10px] text-muted-foreground">{msg.time}</span>}
                    </div>
                    <div className={`text-sm leading-relaxed ${msg.role === 'user' ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {msg.content}
                    </div>
                    {msg.tool && (
                      <div className="bg-secondary/30 border border-border rounded p-2 text-xs flex items-center gap-2 text-muted-foreground">
                        <Database className="w-3 h-3" />
                        {msg.tool}
                      </div>
                    )}
                    {msg.data && (
                       <div className="space-y-1 mt-1">
                         {msg.data.map((item: any, idx: number) => (
                           <div key={idx} className="bg-card border border-border rounded p-2 text-xs hover:bg-secondary/50 cursor-pointer transition-colors">
                              <div className="font-medium text-primary mb-0.5">{item.title}</div>
                              <div className="flex justify-between text-muted-foreground text-[10px]">
                                <span className="font-mono">{item.id}</span>
                                <span>{item.date}</span>
                              </div>
                           </div>
                         ))}
                       </div>
                    )}
                    {i < CHAT_HISTORY.length - 1 && <Separator className="my-4" />}
                 </div>
               ))}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-border bg-background">
              <div className="relative">
                <Input placeholder="Ask about this document..." className="pr-10 bg-secondary/30 border-transparent focus:bg-background focus:border-primary/50" />
                <Button size="icon" className="absolute right-1 top-1 h-7 w-7 bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm">
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-2 px-1">
                 <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground"><Paperclip className="w-3.5 h-3.5" /></Button>
                 <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground"><Mic className="w-3.5 h-3.5" /></Button>
                 <div className="flex-1" />
                 <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                   <Bot className="w-3 h-3" /> Gemini 2.0
                 </span>
              </div>
            </div>
          </ResizablePanel>
          </>
          )}

        </ResizablePanelGroup>
      </div>
    </Layout>
  );
}
