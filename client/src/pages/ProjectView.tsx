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
import { Search, Filter, Bot, Layers, ZoomIn, ZoomOut, Maximize2, Share2, Info, Settings, Palette, Zap, Sparkles, ArrowRight, Plus, Minus, Circle, Network, List, LayoutTemplate, PanelRightClose, PanelRightOpen, RefreshCw, Waypoints, EyeOff, Scale, Grid, Cpu, Download, Share, MousePointer2, ChevronDown, ChevronRight, MessageSquare, Play, Pause, ChevronsLeft, ChevronsRight, ChevronLeft, X, Edit } from "lucide-react";
import { LegendConfigDialog, type LegendItem } from "@/components/graph/LegendConfigDialog";
import { MOCK_FIELDS } from "@/lib/mockData";
import "@xyflow/react/dist/style.css";
import { Checkbox } from "@/components/ui/checkbox";
import { AnimatePresence } from "framer-motion";
import { format } from "date-fns";

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
      className="absolute top-4 left-4 z-10 max-w-[340px] group cursor-move"
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
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-foreground/90">AI Network Briefing</span>
              </div>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => setIsExpanded(!isExpanded)}>
                   {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={onClose}>
                   <X className="w-4 h-4" />
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
                  className="p-4"
                >
                  <div className="space-y-4">
                    <div>
                       <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Domain Analysis</div>
                       <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                          Criminal Organization Network
                       </div>
                    </div>

                    <div className="space-y-2">
                       <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Key Insights</div>
                       
                       <div className="p-3 rounded bg-muted/30 border border-border/50 space-y-3">
                          <div className="flex gap-2.5 items-start text-sm text-foreground/80 leading-relaxed">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            <span>
                              <strong className="text-foreground">Kang "The Viper"</strong> exhibits highest degree centrality, indicating role as key decision maker.
                            </span>
                          </div>
                          <div className="flex gap-2.5 items-start text-sm text-foreground/80 leading-relaxed">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            <span>
                              <strong className="text-foreground">Det. Choi</strong> serves as critical bridge node between criminal & legal clusters.
                            </span>
                          </div>
                          <div className="flex gap-2.5 items-start text-sm text-foreground/80 leading-relaxed">
                             <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                             <span>
                                <strong className="text-foreground">Warehouse 4</strong> identified as high-risk asset connected to multiple investigation paths.
                             </span>
                          </div>
                       </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <Button size="sm" variant="outline" className="h-8 text-sm gap-2 bg-background hover:bg-muted/50">
                            <MessageSquare className="w-3.5 h-3.5" />
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

  // Outer Circle (Evidence, Locations, Lower Associates, Court)
  const outerCircle = [
    { id: 'ev-1', label: 'Burner Phone', sub: 'Evidence', type: 'Evidence', color: '#64748b' },
    { id: 'loc-1', label: 'Warehouse 4', sub: 'Crime Scene', type: 'Location', color: '#10b981', img: warehouseImg },
    { id: 'loc-2', label: 'Offshore Account', sub: 'Asset', type: 'Asset', color: '#10b981' },
    { id: 'case-1', label: 'Case #22-004', sub: 'Lawsuit', type: 'Lawsuit', color: '#8b5cf6' },
    { id: 'asn-1', label: 'Thug A', sub: 'Associate', type: 'Criminal', color: '#ef4444', img: thugAImg },
    { id: 'wit-1', label: 'Witness Kim', sub: 'Observer', type: 'Witness', color: '#fbbf24', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop' },
    { id: 'dt-2', label: 'Det. Lee', sub: 'Partner', type: 'Detective', color: '#3b82f6', img: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop' },
    { id: 'vic-3', label: 'Company X', sub: 'Fraud Victim', type: 'Victim', color: '#fbbf24', img: companyLogoImg },
  ];

  outerCircle.forEach((entity, i) => {
    const angle = (i / outerCircle.length) * 2 * Math.PI + (Math.PI / 8); 
    nodes.push({
      id: entity.id,
      type: 'imageNode',
      position: {
        x: center.x + radius2 * Math.cos(angle),
        y: center.y + radius2 * Math.sin(angle)
      },
      data: { 
        label: entity.label, 
        subLabel: entity.sub,
        type: entity.type,
        image: (entity as any).img,
        borderColor: entity.color 
      },
      style: { width: 60, height: 60 }
    });
  });

  return nodes;
};

const INITIAL_NODES = createRadialLayout();

const INITIAL_EDGES = [
  // Boss Connections
  { id: 'e-boss-lt1', source: 'boss', target: 'lt-1', label: 'Command', type: 'centerEdge', style: { stroke: '#ef4444', strokeWidth: 3 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
  { id: 'e-boss-lt2', source: 'boss', target: 'lt-2', label: 'Money Flow', type: 'centerEdge', style: { stroke: '#ef4444', strokeWidth: 3, strokeDasharray: '5,5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
  { id: 'e-boss-lw1', source: 'boss', target: 'lw-1', label: 'Representation', type: 'centerEdge', style: { stroke: '#8b5cf6', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' } },
  
  // Detective Connections
  { id: 'e-dt1-boss', source: 'dt-1', target: 'boss', label: 'Investigating', type: 'centerEdge', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },
  { id: 'e-dt1-ev1', source: 'dt-1', target: 'ev-1', label: 'Found', type: 'centerEdge', style: { stroke: '#3b82f6', strokeWidth: 1 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },
  { id: 'e-dt1-dt2', source: 'dt-1', target: 'dt-2', label: 'Partners', type: 'centerEdge', style: { stroke: '#3b82f6', strokeWidth: 1 } },
  { id: 'e-dt2-loc1', source: 'dt-2', target: 'loc-1', label: 'Raided', type: 'centerEdge', style: { stroke: '#3b82f6', strokeWidth: 1 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },

  // Crime Actions
  { id: 'e-lt1-vc1', source: 'lt-1', target: 'vc-1', label: 'Assaulted', type: 'centerEdge', style: { stroke: '#ef4444', strokeWidth: 1 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
  { id: 'e-lt2-vc2', source: 'lt-2', target: 'vc-2', label: 'Defrauded', type: 'centerEdge', style: { stroke: '#ef4444', strokeWidth: 1 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
  { id: 'e-lt2-loc2', source: 'lt-2', target: 'loc-2', label: 'Hidden Assets', type: 'centerEdge', style: { stroke: '#10b981', strokeWidth: 1 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
  { id: 'e-lt1-loc1', source: 'lt-1', target: 'loc-1', label: 'Base', type: 'centerEdge', style: { stroke: '#ef4444', strokeWidth: 1 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },

  // Legal / Witness
  { id: 'e-wit1-dt1', source: 'wit-1', target: 'dt-1', label: 'Testimony', type: 'centerEdge', animated: true, style: { stroke: '#fbbf24', strokeWidth: 1 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#fbbf24' } },
  { id: 'e-lw1-case1', source: 'lw-1', target: 'case-1', label: 'Filing', type: 'centerEdge', style: { stroke: '#8b5cf6', strokeWidth: 1 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' } },
  { id: 'e-vc3-case1', source: 'vic-3', target: 'case-1', label: 'Plaintiff', type: 'centerEdge', style: { stroke: '#8b5cf6', strokeWidth: 1 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' } },
  
  // Associates
  { id: 'e-asn1-lt1', source: 'asn-1', target: 'lt-1', label: 'Henchman', type: 'centerEdge', style: { stroke: '#ef4444', strokeWidth: 1 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
];

// Mock Legend Data (Updated)
const DEFAULT_LEGEND_ITEMS: LegendItem[] = [
  { id: "1", label: "Criminal", color: "bg-red-500", alias: "Criminal" },
  { id: "2", label: "Detective", color: "bg-blue-500", alias: "Detective" },
  { id: "3", label: "Victim/Witness", color: "bg-amber-400", alias: "Victim/Witness" },
  { id: "4", label: "Legal/Lawsuit", color: "bg-violet-500", alias: "Legal/Lawsuit" },
  { id: "5", label: "Asset/Location", color: "bg-emerald-500", alias: "Asset/Location" },
  { id: "6", label: "Evidence", color: "bg-slate-500", alias: "Evidence" },
];

import GraphToolsSidebar, { GraphSettings } from "@/components/graph/GraphToolsSidebar";
import CompareDialog from "@/components/graph/CompareDialog";

export default function ProjectView() {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [graphToolsOpen, setGraphToolsOpen] = useState(true);
  const [sidebarMode, setSidebarMode] = useState<"nav" | "list">("list");
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
  
  // Legend State
  const [legendItems, setLegendItems] = useState<LegendItem[]>(DEFAULT_LEGEND_ITEMS);
  const [isLegendConfigOpen, setIsLegendConfigOpen] = useState(false);

  const onPaneContextMenu = (event: React.MouseEvent | MouseEvent) => {
    event.preventDefault();
    // Adjust coordinates to be relative to the viewport or container if needed
    // For fixed position, clientX/Y work well
    const clientX = 'clientX' in event ? event.clientX : 0;
    const clientY = 'clientY' in event ? event.clientY : 0;
    setContextMenu({ x: clientX, y: clientY });
  };

  const onPaneClick = () => {
    if (contextMenu) setContextMenu(null);
  };

  // Close context menu on any click
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);
  
  // Graph Settings State
  const [graphSettings, setGraphSettings] = useState<GraphSettings>({
    nodeSelectionMode: 'multi',
    nodeWeight: 50,
    nodeDirection: 'directed',
    showTimeline: true,
    showAiBriefing: true,
    showLegend: true,
    showNodeLabels: true,
    showEdgeLabels: false,
    curvedEdges: true,
    particlesEffect: true
  });

  // Multi-select state for legend items - initialize with all selected
  const [selectedCategories, setSelectedCategories] = useState<string[]>(DEFAULT_LEGEND_ITEMS.map(d => d.label));
  const constraintsRef = useRef(null);
  
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const [nodeMappings, setNodeMappings] = useState([
    { id: 1, sheet: "Sheet1", key: "id", title: "name", type: "string", image: "img_url" }
  ]);

  const addNodeMapping = () => {
    setNodeMappings([...nodeMappings, { id: Date.now(), sheet: "", key: "", title: "", type: "", image: "" }]);
  };

  const removeNodeMapping = (id: number) => {
    setNodeMappings(nodeMappings.filter(m => m.id !== id));
  };

  const onNodeClick = (_: any, node: any) => {
    setSelectedNode(node);
  };

  const handleSidebarNodeSelect = (node: any) => {
    // In a real app, you'd select the node in the graph. 
    // Here we just set selectedNode to show the panel
    if (!node) {
      setSelectedNode(null);
      return;
    }
    
    setSelectedNode({ 
      id: node.id, 
      data: { 
        label: node.name, 
        type: node.category,
        image: node.image // Pass the image from the node data
      }, 
      position: { x: 0, y: 0 } // dummy position
    });
  };

  const SidebarToggle = (
    <div className="w-full mb-2">
      <Tabs value={sidebarMode} onValueChange={(v) => setSidebarMode(v as "nav" | "list")} className="w-full">
        <TabsList className="w-full grid grid-cols-2 bg-muted p-1 rounded-lg border border-border/50 h-auto">
          <TabsTrigger 
            value="list" 
            className="rounded-md py-2 flex items-center justify-center gap-2 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
          >
            <List className="w-4 h-4" />
            Node List
          </TabsTrigger>
          <TabsTrigger 
            value="nav" 
            className="rounded-md py-2 flex items-center justify-center gap-2 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
          >
            <LayoutTemplate className="w-4 h-4" />
            Graph Connect
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );

  return (
    <Layout 
      sidebar={
        sidebarMode === "list" 
          ? <NodeListSidebar onNodeSelect={handleSidebarNodeSelect} selectedNode={selectedNode} /> 
          : undefined
      }
      sidebarControls={selectedNode ? null : SidebarToggle}
    >
      <div className="flex h-full overflow-hidden">
        {/* Main Graph Area */}
        <div className="relative flex-1 bg-background h-full" ref={constraintsRef}>
          {/* Context Menu */}
          {contextMenu && (
            <div 
              style={{ top: contextMenu.y, left: contextMenu.x }} 
              className="fixed z-50 min-w-[180px] bg-popover border border-border rounded-lg shadow-xl p-1.5 animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                  className="flex items-center gap-2 px-2.5 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                  onClick={() => {
                      setContextMenu(null);
                      // Trigger refresh animation or logic here
                  }}
              >
                  <RefreshCw className="w-4 h-4 text-muted-foreground" />
                  <span>Refresh Network</span>
              </div>
               <div 
                  className="flex items-center gap-2 px-2.5 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                  onClick={() => {
                      setContextMenu(null);
                  }}
              >
                  <Download className="w-4 h-4 text-muted-foreground" />
                  <span>Save Snapshot</span>
              </div>
            </div>
          )}

          {/* AI Insight Card - Added */}
          {graphSettings.showAiBriefing && <GraphInsightCard onClose={() => setGraphSettings(prev => ({ ...prev, showAiBriefing: false }))} />}
          
          {/* Top Center Stats Bar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 pointer-events-none">
            <div className="flex items-center bg-card/80 backdrop-blur-md border border-border/50 rounded-full h-10 px-4 shadow-lg pointer-events-auto text-xs text-muted-foreground">
              <span className="font-medium text-foreground mr-3">
                <span className="text-muted-foreground font-normal mr-1">Project:</span>
                Graph View
              </span>
              <div className="h-3 w-px bg-border mx-2" />
              <span className="flex items-center gap-1 mx-2">
                Nodes <span className="font-mono text-foreground font-medium">{nodes.length}</span>
              </span>
              <div className="h-3 w-px bg-border mx-2" />
              <span className="flex items-center gap-1 mx-2">
                Links <span className="font-mono text-foreground font-medium">{edges.length}</span>
              </span>
              <div className="h-3 w-px bg-border mx-2" />
              <span className="flex items-center gap-1 mx-2">
                Density <span className="font-mono text-blue-500 font-medium">{(2 * edges.length / (Math.max(1, nodes.length) * (Math.max(1, nodes.length) - 1)) * 100).toFixed(2)}%</span>
              </span>
            </div>

            <Button size="sm" variant="secondary" className="h-10 rounded-full px-4 bg-card/80 backdrop-blur-md border border-border/50 shadow-lg pointer-events-auto hover:bg-card" onClick={() => setCompareOpen(true)}>
               <Scale className="w-3.5 h-3.5 mr-2" />
               Compare
            </Button>
          </div>
          
          {/* Participants - Top Right */}
          <div className="absolute top-4 right-4 z-10 pointer-events-auto">
             <ParticipantsDisplay />
          </div>

          <CompareDialog 
            open={compareOpen} 
            onOpenChange={setCompareOpen} 
            nodes={nodes} 
          />

          {/* Graph Visualization */}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onPaneContextMenu={onPaneContextMenu}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            className="bg-background"
            minZoom={0.5}
            maxZoom={2}
          >
            <Background color="hsl(var(--foreground))" gap={30} size={1} variant={BackgroundVariant.Dots} className="opacity-10" />
            
            {/* Toolbox Panel */}
            <motion.div 
              drag
              dragConstraints={constraintsRef}
              dragMomentum={false}
              className="absolute top-1/2 left-6 z-20 flex flex-col gap-2"
              style={{ y: "-50%" }}
            >
              <div className="bg-card/90 backdrop-blur-md border border-border/50 shadow-xl rounded-xl w-14 overflow-hidden pointer-events-auto transition-all duration-300 hover:w-64 group flex flex-col cursor-move">
                 {/* Toolbox Header (Icon only when collapsed) */}
                 <div className="h-14 flex items-center justify-center border-b border-border/50 shrink-0 bg-secondary/30 relative overflow-hidden">
                    <Grid className="w-6 h-6 text-primary absolute left-[15px] transition-all duration-300" />
                    <span className="ml-10 font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-0 group-hover:w-auto overflow-hidden">Graph Tools</span>
                 </div>

                 {/* Tools List */}
                 <div className="flex flex-col p-2 gap-1">
                    <Button variant="ghost" size="icon" className="w-full h-10 justify-start px-2 hover:bg-primary/10 hover:text-primary transition-colors gap-3 relative overflow-hidden" onClick={() => {}}>
                       <MousePointer2 className="w-5 h-5 shrink-0" />
                       <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">Select Mode</span>
                    </Button>
                    
                    <div className="h-px bg-border/50 my-1 mx-2" />
                    
                    <Button variant="ghost" size="icon" className="w-full h-10 justify-start px-2 hover:bg-primary/10 hover:text-primary transition-colors gap-3 relative overflow-hidden" onClick={() => {}}>
                       <RefreshCw className="w-5 h-5 shrink-0" />
                       <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">Refresh Layout</span>
                    </Button>

                    <Button variant="ghost" size="icon" className="w-full h-10 justify-start px-2 hover:bg-primary/10 hover:text-primary transition-colors gap-3 relative overflow-hidden" onClick={() => {}}>
                       <Waypoints className="w-5 h-5 shrink-0" />
                       <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">Shortest Path</span>
                    </Button>

                    <Button variant="ghost" size="icon" className="w-full h-10 justify-start px-2 hover:bg-primary/10 hover:text-primary transition-colors gap-3 relative overflow-hidden" onClick={() => {}}>
                       <Cpu className="w-5 h-5 shrink-0" />
                       <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">Analysis</span>
                    </Button>

                    <div className="h-px bg-border/50 my-1 mx-2" />

                    <Button variant="ghost" size="icon" className="w-full h-10 justify-start px-2 hover:bg-primary/10 hover:text-primary transition-colors gap-3 relative overflow-hidden" onClick={() => {}}>
                       <EyeOff className="w-5 h-5 shrink-0" />
                       <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">Filters</span>
                    </Button>

                    <Button variant="ghost" size="icon" className="w-full h-10 justify-start px-2 hover:bg-primary/10 hover:text-primary transition-colors gap-3 relative overflow-hidden" onClick={() => {}}>
                       <Download className="w-5 h-5 shrink-0" />
                       <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">Export</span>
                    </Button>
                 </div>
              </div>
            </motion.div>
            
          </ReactFlow>

          {/* Timeline - Added */}
          {graphSettings.showTimeline && <GraphTimeline />}



          {/* Legend Panel */}
          {graphSettings.showLegend && (
            <motion.div 
              drag
              dragConstraints={constraintsRef}
              dragMomentum={false}
              className={cn(
                "absolute right-16 w-80 bg-card/95 backdrop-blur border border-border shadow-lg rounded-lg overflow-hidden z-10",
                graphSettings.showTimeline ? "bottom-[230px]" : "bottom-4"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-3 border-b border-border bg-secondary/10 flex justify-between items-center cursor-move">
                 <div className="flex flex-col">
                   <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                     Category
                   </h3>
                 </div>
                 <div className="flex items-center gap-1">
                   <Button variant="ghost" size="icon" className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setIsLegendConfigOpen(true)}>
                     <Edit className="w-3 h-3" />
                   </Button>
                   <Button variant="ghost" size="icon" className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setGraphSettings(prev => ({...prev, showLegend: false}))} onPointerDown={(e) => e.stopPropagation()}>
                     <span className="sr-only">Close</span>
                     <X className="w-3 h-3" />
                   </Button>
                 </div>
              </div>
              <div className="p-0">
                <table className="w-full text-xs">
                  <thead className="bg-secondary/20">
                    <tr className="text-muted-foreground">
                      <th className="px-3 py-2 text-left font-medium w-8"></th>
                      <th className="px-2 py-2 text-left font-medium">Category</th>
                      <th className="px-3 py-2 text-right font-medium">Count</th>
                      <th className="px-3 py-2 text-right font-medium">%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {legendItems.map((item, i) => {
                      const isSelected = selectedCategories.includes(item.label);
                      // Mock stats for new items, use defaults for known ones
                      // In a real app, this would be computed from graph data
                      const count = i < 4 ? 4 - i : 1; 
                      const percent = i < 4 ? `${25 - i * 5}%` : "5%";
                      
                      return (
                        <tr key={item.id} className="hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => toggleCategory(item.label)}>
                          <td className="px-3 py-1.5">
                            <Checkbox 
                              checked={isSelected}
                              onCheckedChange={() => toggleCategory(item.label)}
                              className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-muted-foreground/50"
                            />
                          </td>
                          <td className="px-2 py-1.5">
                            <div className="flex items-center gap-2">
                              <div className={cn("w-2 h-2 rounded-full", item.color)} />
                              <span className={cn("font-medium truncate max-w-[120px]", !isSelected && "text-muted-foreground line-through decoration-muted-foreground/50")}>
                                {item.alias || item.label}
                              </span>
                            </div>
                          </td>
                          <td className={cn("px-3 py-1.5 text-right font-mono", isSelected ? "text-muted-foreground" : "text-muted-foreground/50")}>{count}</td>
                          <td className={cn("px-3 py-1.5 text-right font-mono", isSelected ? "text-muted-foreground" : "text-muted-foreground/50")}>{percent}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Sidebar - Graph Tools */}
        <div className="relative border-l border-border bg-card/50 backdrop-blur-sm flex flex-col h-full w-14 shrink-0 z-30">
            <div className="w-14 h-full overflow-visible">
                <GraphToolsSidebar 
                  className="w-full h-full border-none bg-transparent"
                  stats={{
                    nodes: nodes.length,
                    edges: edges.length,
                    types: new Set(nodes.map(n => n.data.type)).size,
                    density: (2 * edges.length / (nodes.length * (nodes.length - 1))).toFixed(2)
                  }}
                  settings={graphSettings}
                  onSettingsChange={setGraphSettings}
                />
            </div>
        </div>
      </div>

      {/* Node Details Panel (Floating) */}
      {selectedNode && (
        <div className={cn(
          "absolute top-20 w-80 bg-card/95 backdrop-blur border border-border shadow-xl rounded-lg overflow-hidden z-20 animate-in slide-in-from-right-10 duration-300 transition-all",
          graphToolsOpen ? "right-[340px]" : "right-4"
        )}>
            <div className="h-2 bg-primary w-full" />
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{selectedNode.data.label}</h3>
                  <Badge variant="outline" className="mt-1 bg-secondary text-secondary-foreground border-none">{selectedNode.data.type}</Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedNode(null)}>
                  <span className="sr-only">Close</span>
                  <span className="text-lg">×</span>
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-secondary/50 rounded border border-border/50">
                    <div className="text-[10px] text-muted-foreground uppercase">Degree</div>
                    <div className="text-lg font-mono font-bold">12</div>
                  </div>
                   <div className="p-2 bg-secondary/50 rounded border border-border/50">
                    <div className="text-[10px] text-muted-foreground uppercase">Centrality</div>
                    <div className="text-lg font-mono font-bold">0.85</div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Node detected as a high-traffic bridge in the network topology. Connected to 3 major clusters.</p>
                </div>

                <Button className="w-full" variant="secondary">View Raw Data</Button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Drawer */}
        <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
          <SheetContent side="right" className="w-[800px] border-l border-border bg-card text-foreground p-0 sm:max-w-none">
            <SheetHeader className="p-6 border-b border-border">
              <SheetTitle className="flex items-center gap-2 text-xl">
                <Settings className="w-5 h-5" />
                Graph Settings
              </SheetTitle>
              <SheetDescription>
                Configure data sources, analysis functions, and visualization properties.
              </SheetDescription>
            </SheetHeader>
            
            <div className="overflow-y-auto h-[calc(100vh-80px)]">
              <Tabs defaultValue="graph-set" className="w-full">
                <div className="px-6 py-4 border-b border-border bg-secondary/10 sticky top-0 z-10 backdrop-blur-md">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="graph-set">Graph Set</TabsTrigger>
                    <TabsTrigger value="function">Function</TabsTrigger>
                    <TabsTrigger value="view">View</TabsTrigger>
                  </TabsList>
                </div>

                {/* Graph Set Tab */}
                <TabsContent value="graph-set" className="p-6 space-y-6 mt-0">
                  <Tabs defaultValue="nodes" className="w-full">
                    <TabsList className="w-40 mb-6 bg-secondary/50">
                      <TabsTrigger value="nodes">Nodes</TabsTrigger>
                      <TabsTrigger value="edges">Links</TabsTrigger>
                    </TabsList>

                    <TabsContent value="nodes" className="space-y-4">
                      <div className="text-sm text-muted-foreground mb-4">
                        Define which data fields map to node properties.
                      </div>
                      
                      <div className="border border-border rounded-lg overflow-hidden">
                        <div className="grid grid-cols-12 gap-4 bg-secondary/30 p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
                          <div className="col-span-2">Sheet Name</div>
                          <div className="col-span-2">Node Key</div>
                          <div className="col-span-3">Node Title</div>
                          <div className="col-span-2">Field Type</div>
                          <div className="col-span-2">Image Field</div>
                          <div className="col-span-1"></div>
                        </div>
                        
                        <div className="bg-card/50">
                          {nodeMappings.map((mapping) => (
                            <div key={mapping.id} className="grid grid-cols-12 gap-4 p-3 items-center border-b border-border/50 last:border-0 hover:bg-secondary/10 transition-colors">
                              <div className="col-span-2">
                                <Select defaultValue={mapping.sheet}>
                                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Sheet1">Crime Data</SelectItem>
                                    <SelectItem value="Sheet2">Suspects</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="col-span-2">
                                <Select defaultValue={mapping.key}>
                                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="id">ID</SelectItem>
                                    <SelectItem value="uuid">UUID</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="col-span-3">
                                <Select defaultValue={mapping.title}>
                                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="name">Name</SelectItem>
                                    <SelectItem value="label">Label</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="col-span-2">
                                <Select defaultValue={mapping.type}>
                                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="string">String</SelectItem>
                                    <SelectItem value="number">Number</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="col-span-2">
                                <Select defaultValue={mapping.image}>
                                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="img_url">Image URL</SelectItem>
                                    <SelectItem value="icon">Icon Name</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="col-span-1 flex justify-end">
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeNodeMapping(mapping.id)}>
                                  <Minus className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="p-2 bg-secondary/10 border-t border-border/50">
                           <Button variant="ghost" size="sm" className="w-full text-xs text-primary hover:text-primary hover:bg-primary/5 gap-1 dashed border border-primary/20" onClick={addNodeMapping}>
                             <Plus className="w-3 h-3" /> Add Mapping
                           </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="edges" className="space-y-6">
                      <div className="rounded-lg border border-border p-4 bg-card/50">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-muted-foreground">
                            <Network className="w-4 h-4" />
                          </div>
                          <h3 className="font-semibold">Link Definition</h3>
                        </div>
                        
                        <div className="space-y-4">
                           <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label className="text-xs font-medium text-muted-foreground uppercase">Source Column</Label>
                                <Select defaultValue="src">
                                  <SelectTrigger><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="src">source_node_id</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label className="text-xs font-medium text-muted-foreground uppercase">Target Column</Label>
                                <Select defaultValue="tgt">
                                  <SelectTrigger><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="tgt">target_node_id</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                           </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </TabsContent>

                {/* Function Tab (previously Filters) */}
                <TabsContent value="function" className="p-6 space-y-6 mt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm">Active Filters</h3>
                      <Button variant="ghost" size="sm" className="h-6 text-xs">Reset All</Button>
                    </div>
                    
                    <div className="rounded-lg border border-border p-4 bg-card/50 space-y-4">
                       <div className="space-y-2">
                          <div className="flex justify-between">
                             <Label className="text-xs font-medium uppercase text-muted-foreground">Severity Score</Label>
                             <span className="text-xs font-mono">Min: 4</span>
                          </div>
                          <Slider defaultValue={[4]} max={10} step={1} />
                       </div>

                       <div className="space-y-2 pt-2">
                          <Label className="text-xs font-medium uppercase text-muted-foreground mb-1.5 block">Incident Type</Label>
                          <div className="flex flex-wrap gap-2">
                            {['Theft', 'Assault', 'Traffic', 'Cyber'].map(tag => (
                              <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                       </div>
                    </div>
                  </div>
                </TabsContent>

                {/* View Tab (previously Visuals) */}
                <TabsContent value="view" className="p-6 space-y-6 mt-0">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Palette className="w-4 h-4 text-muted-foreground" />
                          Color Scheme
                        </Label>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {['bg-primary', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'].map((color, i) => (
                          <div key={i} className={`h-8 rounded-md cursor-pointer ring-offset-background hover:ring-2 hover:ring-ring ring-offset-2 transition-all ${color} ${i === 0 ? 'ring-2 ring-ring' : ''}`} />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="node-size" className="text-sm font-medium">Base Size</Label>
                        <span className="text-xs text-muted-foreground">Medium</span>
                      </div>
                      <Slider id="node-size" defaultValue={[50]} max={100} step={1} />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Zap className="w-4 h-4 text-muted-foreground" />
                          Physics Simulation
                        </Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="pl-6 border-l-2 border-border space-y-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Gravity</Label>
                          <Slider defaultValue={[30]} max={100} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Repulsion</Label>
                          <Slider defaultValue={[70]} max={100} />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <SheetFooter className="p-4 border-t border-border bg-background/95 backdrop-blur absolute bottom-0 w-full">
               <Button variant="outline" className="w-1/3" onClick={() => setSettingsOpen(false)}>Cancel</Button>
               <Button className="w-2/3 bg-primary hover:bg-primary/90 text-white">Apply Changes</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {/* AI Drawer */}
        <Sheet open={aiDrawerOpen} onOpenChange={setAiDrawerOpen}>
          <SheetContent className="w-[400px] sm:w-[540px] border-l border-border bg-card text-foreground">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-2xl">
                <Bot className="w-6 h-6 text-purple-500" />
                Nexus AI Insights
              </SheetTitle>
              <SheetDescription>
                Real-time analysis of the current network topology.
              </SheetDescription>
            </SheetHeader>
            
            <div className="mt-8 space-y-6">
              <div className="p-4 rounded-lg border border-purple-500/30 bg-purple-500/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
                <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Anomaly Detected
                </h4>
                <p className="text-sm text-purple-900/80 dark:text-purple-100/80 leading-relaxed">
                  Cluster #3 shows unusual density compared to historical baselines. 
                  This pattern often indicates a coordinated supply chain bottleneck or organized activity.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">Recommended Actions</h4>
                
                {[
                  "Filter network by 'Severity > 8' to isolate risk nodes.",
                  "Run 'Shortest Path' analysis between Node A and Node B.",
                  "Generate report for Q1 anomalies."
                ].map((action, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary cursor-pointer transition-colors border border-transparent hover:border-border">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                      {i + 1}
                    </div>
                    <span className="text-sm">{action}</span>
                    <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border">
                <div className="relative">
                  <Input placeholder="Ask Nexus about this graph..." className="pl-4 pr-10 py-6 bg-secondary/50 border-transparent focus-visible:ring-primary/20" />
                  <Button size="icon" className="absolute right-2 top-2 h-8 w-8 bg-purple-600 hover:bg-purple-700 text-white">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <LegendConfigDialog 
           open={isLegendConfigOpen} 
           onOpenChange={setIsLegendConfigOpen}
           items={legendItems}
           onSave={setLegendItems}
        />
    </Layout>
  );
}
