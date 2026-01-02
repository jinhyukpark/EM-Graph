import { useState, useMemo, useRef, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import NodeListSidebar, { MOCK_COMPANY_NODES } from "@/components/layout/NodeListSidebar";
import ImageNode from "@/components/graph/ImageNode";
import { ReactFlow, Background, Controls, ControlButton, useNodesState, useEdgesState, MiniMap, BackgroundVariant, NodeTypes, MarkerType } from "@xyflow/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Bot, Layers, ZoomIn, ZoomOut, Maximize2, Share2, Info, Settings, Palette, Zap, Sparkles, ArrowRight, Plus, Minus, Circle, Network, List, LayoutTemplate, PanelRightClose, PanelRightOpen, RefreshCw, Waypoints, EyeOff, Scale, Grid, Cpu, Download, Share, MousePointer2, ChevronDown, ChevronRight, MessageSquare, Play, Pause, ChevronsLeft, ChevronsRight, ChevronLeft, X, Edit, Database, CircleDot } from "lucide-react";
import { LegendConfigDialog, type LegendItem } from "@/components/graph/LegendConfigDialog";
import { MOCK_FIELDS } from "@/lib/mockData";
import "@xyflow/react/dist/style.css";
import { Checkbox } from "@/components/ui/checkbox";
import { AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

import CenterEdge from "@/components/graph/CenterEdge";

// Import stock images
import victimBImg from '@assets/stock_images/portrait_of_a_young__1114e5ec.jpg';
import thugAImg from '@assets/stock_images/portrait_of_a_young__7ceb0422.jpg';
import lawyerHanImg from '@assets/stock_images/portrait_of_a_male_l_cbb92d94.jpg';
import enforcerImg from '@assets/stock_images/portrait_of_a_male_e_fa4e764a.jpg';
import laundererImg from '@assets/stock_images/portrait_of_a_male_m_7b9dd078.jpg';
import warehouseImg from '@assets/stock_images/abandoned_warehouse__5ca79054.jpg';
import companyLogoImg from '@assets/stock_images/modern_tech_company__bbd857a2.jpg';

import { cn } from "@/lib/utils";

// Define custom node types
const nodeTypes: NodeTypes = {
  imageNode: ImageNode,
};

// --- New Components Copied from KnowledgeGarden.tsx ---

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Check, Mail, UserPlus, Shield, Edit2, Eye } from "lucide-react";

// Mock Data for Graph Connect
const MOCK_GRAPH_DBS = [
  { id: "neo4j-prod", name: "Neo4j Production", type: "Neo4j", url: "bolt://prod-db.internal:7687", status: "Connected", nodeCount: "12.5M", edgeCount: "45.2M" },
  { id: "memgraph-dev", name: "Memgraph Dev", type: "Memgraph", url: "bolt://dev-mem.internal:7687", status: "Idle", nodeCount: "450K", edgeCount: "1.2M" },
  { id: "nebula-analytics", name: "Nebula Analytics", type: "NebulaGraph", url: "http://nebula-ana.internal:9669", status: "Offline", nodeCount: "N/A", edgeCount: "N/A" },
];

const MOCK_DB_SCHEMA = {
  nodes: [
    { label: "Person", count: 5240, properties: ["name", "age", "ssn", "address"] },
    { label: "Company", count: 1205, properties: ["name", "reg_no", "industry", "founded_date"] },
    { label: "Account", count: 8500, properties: ["account_no", "bank_code", "balance", "status"] },
    { label: "Transaction", count: 45200, properties: ["amount", "timestamp", "currency", "type"] },
    { label: "Location", count: 320, properties: ["lat", "lng", "city", "country"] },
  ],
  relationships: [
    { type: "OWNS", source: "Person", target: "Account", count: 6200 },
    { type: "WORKS_FOR", source: "Person", target: "Company", count: 4100 },
    { type: "TRANSFERRED", source: "Account", target: "Account", count: 45200 },
    { type: "LOCATED_AT", source: "Company", target: "Location", count: 1205 },
    { type: "LIVES_IN", source: "Person", target: "Location", count: 5100 },
  ]
};

// Graph Connect Sidebar Component
function GraphConnectSidebar() {
  const [selectedDb, setSelectedDb] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-left-5 duration-300">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
           <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
             <Database className="w-4 h-4 text-primary" />
             Graph Connect
           </h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">Select Graph Database</Label>
            <Select value={selectedDb || ""} onValueChange={setSelectedDb}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select connection..." />
              </SelectTrigger>
              <SelectContent>
                {MOCK_GRAPH_DBS.map(db => (
                  <SelectItem key={db.id} value={db.id}>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", 
                        db.status === "Connected" ? "bg-green-500" : 
                        db.status === "Idle" ? "bg-amber-500" : "bg-red-500"
                      )} />
                      <span>{db.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedDb && (
            <div className="p-3 bg-secondary/20 rounded-lg border border-border/50 space-y-2">
               <div className="flex justify-between items-center text-xs">
                 <span className="text-muted-foreground">Type</span>
                 <span className="font-medium">{MOCK_GRAPH_DBS.find(d => d.id === selectedDb)?.type}</span>
               </div>
               <div className="flex justify-between items-center text-xs">
                 <span className="text-muted-foreground">URL</span>
                 <span className="font-mono text-[10px]">{MOCK_GRAPH_DBS.find(d => d.id === selectedDb)?.url}</span>
               </div>
               <div className="flex justify-between items-center text-xs pt-1 border-t border-border/50 mt-1">
                 <span className="text-muted-foreground">Status</span>
                 <Badge variant="outline" className={cn("h-5 text-[10px]", 
                    MOCK_GRAPH_DBS.find(d => d.id === selectedDb)?.status === "Connected" ? "text-green-600 bg-green-500/10 border-green-500/20" : "text-amber-600"
                 )}>
                   {MOCK_GRAPH_DBS.find(d => d.id === selectedDb)?.status}
                 </Badge>
               </div>
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
         {selectedDb ? (
           <div className="space-y-6">
              {/* Nodes Section */}
              <div className="space-y-3">
                 <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                   <span>Node Labels</span>
                   <Badge variant="secondary" className="text-[10px] h-5">{MOCK_DB_SCHEMA.nodes.length}</Badge>
                 </h4>
                 <div className="space-y-2">
                    {MOCK_DB_SCHEMA.nodes.map((node, i) => (
                       <div key={i} className="bg-card rounded-md border border-border p-3 hover:bg-secondary/20 transition-colors cursor-pointer group">
                          <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center gap-2">
                                <CircleDot className="w-3.5 h-3.5 text-primary" />
                                <span className="font-semibold text-sm">{node.label}</span>
                             </div>
                             <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full">{node.count.toLocaleString()}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                             {node.properties.map(prop => (
                               <span key={prop} className="text-[10px] px-1.5 py-0.5 bg-secondary/50 rounded text-muted-foreground group-hover:bg-secondary group-hover:text-foreground transition-colors">
                                 {prop}
                               </span>
                             ))}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Relationships Section */}
              <div className="space-y-3">
                 <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                   <span>Relationships</span>
                   <Badge variant="secondary" className="text-[10px] h-5">{MOCK_DB_SCHEMA.relationships.length}</Badge>
                 </h4>
                 <div className="space-y-2">
                    {MOCK_DB_SCHEMA.relationships.map((rel, i) => (
                       <div key={i} className="bg-card rounded-md border border-border p-3 hover:bg-secondary/20 transition-colors cursor-pointer flex items-center gap-3">
                          <div className="flex flex-col items-center gap-1 shrink-0">
                             <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                                {rel.source.substring(0, 2).toUpperCase()}
                             </div>
                          </div>
                          
                          <div className="flex-1 flex flex-col items-center gap-1">
                             <div className="h-px w-full bg-border relative top-2"></div>
                             <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 rounded relative z-10">
                               {rel.type}
                             </span>
                          </div>

                          <div className="flex flex-col items-center gap-1 shrink-0">
                             <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                                {rel.target.substring(0, 2).toUpperCase()}
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
         ) : (
           <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2 py-10 opacity-60">
             <Database className="w-8 h-8" />
             <p className="text-sm">Select a database to view schema</p>
           </div>
         )}
      </ScrollArea>
    </div>
  );
}

// Participants Component
function ParticipantsDisplay() {
  const participants = [
    { id: 1, name: "John Doe", image: "https://github.com/shadcn.png", color: "bg-blue-500", initials: "JD" },
    { id: 2, name: "Sarah Smith", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop", color: "bg-green-500", initials: "SS" },
    { id: 3, name: "Mike Johnson", image: null, color: "bg-purple-500", initials: "MJ" },
  ];

  return (
    <div className="flex items-center gap-1 bg-card/80 backdrop-blur-md border border-border/50 rounded-full p-1 pl-3 shadow-sm">
      <div className="flex -space-x-2">
        <TooltipProvider delayDuration={0}>
          {participants.map((user) => (
            <Tooltip key={user.id}>
              <TooltipTrigger asChild>
                <Avatar className="w-7 h-7 border-2 border-background cursor-pointer hover:z-10 transition-transform hover:scale-110">
                  <AvatarImage src={user.image || undefined} alt={user.name} />
                  <AvatarFallback className={cn("text-[10px] text-white", user.color)}>{user.initials}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <p>{user.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
      <InviteTeamDialog />
    </div>
  );
}

function InviteTeamDialog() {
  const [emails, setEmails] = useState("");
  const [role, setRole] = useState("viewer");
  const [open, setOpen] = useState(false);

  // Mock users for "Select from team"
  const teamMembers = [
    { id: 1, name: "Alice Kim", email: "alice@example.com", avatar: null, initial: "AK" },
    { id: 2, name: "Bob Lee", email: "bob@example.com", avatar: null, initial: "BL" },
    { id: 3, name: "Charlie Park", email: "charlie@example.com", avatar: null, initial: "CP" },
    { id: 4, name: "David Choi", email: "david@example.com", avatar: null, initial: "DC" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted ml-1">
            <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Invite to Team
          </DialogTitle>
          <DialogDescription>
            Invite new members to collaborate on this project.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="team" className="w-full mt-2">
            <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="team">Existing Team</TabsTrigger>
                <TabsTrigger value="email">Invite by Email</TabsTrigger>
            </TabsList>

            <TabsContent value="team" className="space-y-4 focus-visible:outline-none">
                <div className="space-y-2">
                    <div className="border rounded-md divide-y max-h-[300px] overflow-y-auto bg-card">
                        {teamMembers.map(member => (
                            <div key={member.id} className="flex items-center justify-between p-3 hover:bg-accent/50 transition-colors cursor-pointer group">
                                 <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8 border border-border">
                                        <AvatarFallback className="text-xs bg-secondary">{member.initial}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="text-sm font-medium leading-none">{member.name}</div>
                                        <div className="text-xs text-muted-foreground mt-1">{member.email}</div>
                                    </div>
                                 </div>
                                 <Button size="sm" variant="outline" className="h-7 px-3 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground">
                                    Add
                                 </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-4 focus-visible:outline-none">
                <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase text-muted-foreground">Email Addresses</Label>
                    <Textarea 
                        placeholder="Enter email addresses, separated by commas..." 
                        value={emails}
                        onChange={(e) => setEmails(e.target.value)}
                        className="min-h-[120px] resize-none"
                    />
                    <p className="text-[10px] text-muted-foreground">Multiple emails can be entered using commas.</p>
                </div>

                <div className="flex items-center justify-between space-x-2 bg-secondary/30 p-3 rounded-lg border border-border/50">
                    <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium leading-none">Access Role</span>
                        <span className="text-xs text-muted-foreground">Set default permissions for new members</span>
                    </div>
                    <Select value={role} onValueChange={setRole}>
                        <SelectTrigger className="w-[140px] h-8 text-xs bg-background">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="admin">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-3.5 h-3.5 text-red-500" />
                                    <span>Admin</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="editor">
                                 <div className="flex items-center gap-2">
                                    <Edit2 className="w-3.5 h-3.5 text-blue-500" />
                                    <span>Editor</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="viewer">
                                 <div className="flex items-center gap-2">
                                    <Eye className="w-3.5 h-3.5 text-green-500" />
                                    <span>Viewer</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="pt-2">
                    <Button type="submit" onClick={() => {
                        setOpen(false);
                        setEmails("");
                    }} className="gap-2 w-full">
                        <Mail className="w-4 h-4" />
                        Send Invitations
                    </Button>
                </div>
            </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// AI Insight Card
function GraphInsightCard({ onClose }: { onClose: () => void }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div 
      drag
      dragMomentum={false}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-4 left-4 z-10 max-w-[320px] group cursor-move"
    >
      {/* Moving Light Border Effect */}
      <div className={cn(
        "relative rounded-xl overflow-hidden p-[1.5px] transition-all duration-300",
        isExpanded ? "w-full" : "w-auto"
      )}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-60 animate-gradient-xy" />
        
        {/* Main Card Content */}
        <div className="relative h-full bg-background/95 backdrop-blur-md rounded-[10px] overflow-hidden">
            {/* Header */}
            <div 
              className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-blue-50/50 to-transparent border-b border-border/50"
            >
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <div className="p-1 rounded bg-blue-100 text-blue-600">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-foreground/90">AI Network Briefing</span>
              </div>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => setIsExpanded(!isExpanded)}>
                   {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={onClose}>
                   <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-3"
                >
                  <div className="space-y-3">
                    <div>
                       <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Domain Analysis</div>
                       <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          Criminal Organization Network
                       </div>
                    </div>

                    <div className="space-y-2">
                       <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Key Insights</div>
                       
                       <div className="p-2 rounded bg-muted/30 border border-border/50 space-y-2">
                          <div className="flex gap-2 items-start text-xs text-foreground/80 leading-relaxed">
                            <span className="mt-1 w-1 h-1 rounded-full bg-blue-500 shrink-0" />
                            <span>
                              <strong className="text-foreground">Kang "The Viper"</strong> exhibits highest degree centrality, indicating role as key decision maker.
                            </span>
                          </div>
                          <div className="flex gap-2 items-start text-xs text-foreground/80 leading-relaxed">
                            <span className="mt-1 w-1 h-1 rounded-full bg-blue-500 shrink-0" />
                            <span>
                              <strong className="text-foreground">Det. Choi</strong> serves as critical bridge node between criminal & legal clusters.
                            </span>
                          </div>
                          <div className="flex gap-2 items-start text-xs text-foreground/80 leading-relaxed">
                             <span className="mt-1 w-1 h-1 rounded-full bg-orange-500 shrink-0" />
                             <span>
                                <strong className="text-foreground">Warehouse 4</strong> identified as high-risk asset connected to multiple investigation paths.
                             </span>
                          </div>
                       </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5 bg-background hover:bg-muted/50">
                            <MessageSquare className="w-3 h-3" />
                            Ask Copilot Details
                        </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

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



const edgeTypes = {
  centerEdge: CenterEdge,
};

// Radial Layout Helper
const createRadialLayout = () => {
  const center = { x: 0, y: 0 };
  const radius1 = 250;
  const radius2 = 450;
  
  const nodes: any[] = [];

  // Central Boss (The Kingpin)
  nodes.push({ 
    id: 'boss', 
    type: 'imageNode',
    position: { x: 0, y: 0 }, 
    data: { 
      label: 'Kang "The Viper"', 
      subLabel: 'Crime Boss', 
      type: 'Criminal', 
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', 
      highlight: true, 
      borderColor: '#ef4444' // Red for criminal
    },
    style: { width: 100, height: 100 }
  });

  // Inner Circle (Lieutenants & Key Associates)
  const innerCircle = [
    { id: 'lt-1', label: 'Park "Razor"', sub: 'Enforcer', type: 'Criminal', color: '#ef4444', img: enforcerImg },
    { id: 'lt-2', label: 'Kim "ledger"', sub: 'Money Launderer', type: 'Criminal', color: '#ef4444', img: laundererImg },
    { id: 'vc-1', label: 'Victim A', sub: 'Assault', type: 'Victim', color: '#fbbf24', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop' },
    { id: 'vc-2', label: 'Victim B', sub: 'Fraud', type: 'Victim', color: '#fbbf24', img: victimBImg },
    { id: 'dt-1', label: 'Det. Choi', sub: 'Lead Investigator', type: 'Detective', color: '#3b82f6', img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop' },
    { id: 'lw-1', label: 'Lawyer Han', sub: 'Defense Attorney', type: 'Lawyer', color: '#8b5cf6', img: lawyerHanImg },
  ];

  innerCircle.forEach((entity, i) => {
    const angle = (i / innerCircle.length) * 2 * Math.PI;
    nodes.push({
      id: entity.id,
      type: 'imageNode',
      position: {
        x: center.x + radius1 * Math.cos(angle),
        y: center.y + radius1 * Math.sin(angle)
      },
      data: { 
        label: entity.label, 
        subLabel: entity.sub,
        type: entity.type,
        image: entity.img,
        borderColor: entity.color 
      },
      style: { width: 70, height: 70 }
    });
  });

  return nodes;
};