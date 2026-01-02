import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Settings2, 
  Filter, 
  Maximize2,
  Network,
  FileText,
  Box,
  Sliders,
  CircleDot,
  X,
  Sparkles,
  MoreHorizontal,
  PlusCircle,
  Edit,
  Trash2,
  GripVertical,
  Map as MapIcon,
  Eye,
  Info,
  Layers,
  Share2,
  ListEnd,
  Workflow,
  CircleDashed,
  LayoutGrid as LayoutGridIcon,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowLeft
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import AICopilotPanel from "./AICopilotPanel";

const SectionHeader = ({ icon: Icon, title, onHide, onEditControl }: { icon: any, title: string, onHide?: () => void, onEditControl?: () => void }) => (
  <div className="flex items-center justify-between mb-2">
    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <Icon className="w-3.5 h-3.5" /> {title}
    </h4>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-secondary text-muted-foreground">
          <MoreHorizontal className="w-3.5 h-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs">Configure Section</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xs" onClick={onEditControl}>
          <Edit className="w-3.5 h-3.5 mr-2" /> Edit Control
        </DropdownMenuItem>
        <DropdownMenuItem className="text-xs">
          <Layers className="w-3.5 h-3.5 mr-2" /> Edit Layout
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xs text-destructive focus:text-destructive" onClick={onHide}>
          <Trash2 className="w-3.5 h-3.5 mr-2" /> Hide Section
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

const ViewModeCard = ({ icon, label, description, active }: { icon: any, label: string, description: string, active: boolean }) => (
  <div className={cn(
    "flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent/50",
    active ? "bg-primary/10 border-primary/50 text-primary" : "bg-card border-border text-muted-foreground"
  )}>
    <div className={cn("mb-2 p-2 rounded-full", active ? "bg-primary/20" : "bg-secondary")}>
      {icon}
    </div>
    <div className="text-xs font-semibold mb-0.5">{label}</div>
    <div className="text-[10px] opacity-70 text-center leading-tight">{description}</div>
  </div>
);

export interface GraphSettings {
  nodeSelectionMode: 'single' | 'multi';
  nodeWeight: number;
  nodeDirection: 'directed' | 'undirected';
  showTimeline: boolean;
  showAiBriefing: boolean;
  showLegend: boolean;
  showNodeLabels: boolean;
  showEdgeLabels: boolean;
  curvedEdges: boolean;
  particlesEffect: boolean;
}

interface GraphToolsSidebarProps {
  className?: string;
  stats?: { nodes: number, edges: number, types: number, density: string };
  settings?: GraphSettings;
  onSettingsChange?: (settings: GraphSettings) => void;
}

export default function GraphToolsSidebar({ className, stats, settings, onSettingsChange }: GraphToolsSidebarProps) {
  const [activeTab, setActiveTab] = useState<"view" | "settings" | "sizing" | "filters" | "report" | "ai" | null>(null);
  const [panelWidth, setPanelWidth] = useState(384); // Default 96 (384px)
  const [isResizing, setIsResizing] = useState(false);
  const [showLayoutDescription, setShowLayoutDescription] = useState(true);
  const [showGraphSettingsDescription, setShowGraphSettingsDescription] = useState(true);
  const [visibleSections, setVisibleSections] = useState({ layout: true, graphSettings: true });
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [controlVisibility, setControlVisibility] = useState({
    nodeTypeSelection: true,
    nodeWeight: true,
    edgeDirection: true,
    visibilityGroup: true,
    displayGroup: true,
  });
  
  // Layout Edit State
  const [editLayoutType, setEditLayoutType] = useState('organic');
  const [editTightness, setEditTightness] = useState([5]);
  const [editOrientation, setEditOrientation] = useState('down');

  const sidebarRef = useRef<HTMLDivElement>(null);

  const updateSetting = (key: keyof GraphSettings, value: any) => {
    if (onSettingsChange && settings) {
      onSettingsChange({ ...settings, [key]: value });
    }
  };

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !sidebarRef.current) return;
      
      // Calculate new width: We are resizing from the left edge.
      // The sidebar is anchored to the right. 
      // The mouse position relative to the viewport determines the new width.
      // The right edge of the panel is fixed at `sidebarRef.current.getBoundingClientRect().right`.
      const rightEdge = sidebarRef.current.getBoundingClientRect().right;
      const newWidth = rightEdge - e.clientX;
      
      // Min width 300px, Max width 800px
      if (newWidth >= 300 && newWidth <= 800) {
        setPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const toggleTab = (tab: "view" | "settings" | "sizing" | "filters" | "report" | "ai") => {
    if (activeTab === tab) {
      setActiveTab(null);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div ref={sidebarRef} className={cn("relative flex h-full z-40", className)}>
      
      {/* Content Panel (Flyout) */}
      <div 
        style={{ width: activeTab ? panelWidth : 0 }}
        className={cn(
          "absolute top-0 right-full h-full bg-card border-l border-y border-border shadow-2xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col z-50",
          activeTab ? "opacity-100 border-r" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Resize Handle */}
        <div 
            className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-primary/50 z-50 flex items-center justify-center group"
            onMouseDown={startResizing}
        >
            <div className="h-8 w-1 bg-border group-hover:bg-primary rounded-full transition-colors" />
        </div>
        {activeTab === "ai" ? (
            <AICopilotPanel onClose={() => setActiveTab(null)} />
        ) : (
            <>
        <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-secondary/10 shrink-0">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            {activeTab === "view" && <><Box className="w-4 h-4" /> View Options</>}
            {activeTab === "settings" && <><Sliders className="w-4 h-4" /> General Settings</>}
            {activeTab === "sizing" && <><CircleDot className="w-4 h-4" /> Node Sizing</>}
            {activeTab === "filters" && <><Filter className="w-4 h-4" /> Graph Filters</>}
            {activeTab === "report" && <><FileText className="w-4 h-4" /> Analysis Report</>}
          </h3>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setActiveTab(null)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            
            {/* View / Clustering Tab */}
            {activeTab === "view" && (
              <div className="space-y-6">
                
                {editingSection === 'layout' ? (
                    <div className="space-y-6 animate-in slide-in-from-right-5 duration-200">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <h4 className="text-sm font-semibold flex items-center gap-2">
                                <Edit className="w-4 h-4 text-primary" />
                                Edit Layout Control
                            </h4>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}>Cancel</Button>
                                <Button size="sm" onClick={() => setEditingSection(null)}>Done</Button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Layout Type</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div onClick={() => setEditLayoutType('organic')}>
                                        <ViewModeCard 
                                            icon={<Share2 className="w-5 h-5" />}
                                            label="Organic"
                                            description="Natural clustering"
                                            active={editLayoutType === 'organic'}
                                        />
                                    </div>
                                    <div onClick={() => setEditLayoutType('sequential')}>
                                        <ViewModeCard 
                                            icon={<ListEnd className="w-5 h-5" />}
                                            label="Sequential"
                                            description="Linear progression"
                                            active={editLayoutType === 'sequential'}
                                        />
                                    </div>
                                    <div onClick={() => setEditLayoutType('hierarchy')}>
                                        <ViewModeCard 
                                            icon={<Workflow className="w-5 h-5" />}
                                            label="Hierarchy"
                                            description="Tree structure"
                                            active={editLayoutType === 'hierarchy'}
                                        />
                                    </div>
                                    <div onClick={() => setEditLayoutType('lens')}>
                                        <ViewModeCard 
                                            icon={<Maximize2 className="w-5 h-5" />}
                                            label="Lens"
                                            description="Focus context"
                                            active={editLayoutType === 'lens'}
                                        />
                                    </div>
                                    <div onClick={() => setEditLayoutType('radial')}>
                                        <ViewModeCard 
                                            icon={<CircleDashed className="w-5 h-5" />}
                                            label="Radial"
                                            description="Circular view"
                                            active={editLayoutType === 'radial'}
                                        />
                                    </div>
                                    <div onClick={() => setEditLayoutType('structural')}>
                                        <ViewModeCard 
                                            icon={<LayoutGridIcon className="w-5 h-5" />}
                                            label="Structural"
                                            description="Grid arrangement"
                                            active={editLayoutType === 'structural'}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-sm">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Run Layout
                            </Button>

                            <Separator />

                            <div className="space-y-5">
                                <h4 className="text-sm font-semibold">Configuration</h4>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-xs">Tightness</Label>
                                        <span className="text-xs font-medium bg-secondary px-2 py-0.5 rounded text-muted-foreground">{editTightness}</span>
                                    </div>
                                    <Slider 
                                        value={editTightness} 
                                        onValueChange={setEditTightness}
                                        max={10} 
                                        step={1} 
                                        className="py-2" 
                                    />
                                    <p className="text-[10px] text-muted-foreground">Adjusts how closely nodes are packed together.</p>
                                </div>

                                {(editLayoutType === 'hierarchy' || editLayoutType === 'sequential') && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <Label className="text-xs">Orientation</Label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {[
                                                { value: 'down', icon: ArrowDown, label: 'Down' },
                                                { value: 'up', icon: ArrowUp, label: 'Up' },
                                                { value: 'left', icon: ArrowLeft, label: 'Left' },
                                                { value: 'right', icon: ArrowRight, label: 'Right' }
                                            ].map((opt) => (
                                                <div 
                                                    key={opt.value}
                                                    onClick={() => setEditOrientation(opt.value)}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center p-2 rounded border cursor-pointer transition-all",
                                                        editOrientation === opt.value 
                                                            ? "bg-primary/10 border-primary/50 text-primary" 
                                                            : "bg-card border-border text-muted-foreground hover:bg-accent"
                                                    )}
                                                >
                                                    <opt.icon className="w-4 h-4 mb-1" />
                                                    <span className="text-[10px]">{opt.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                <>
                {visibleSections.layout && (
                <div className="space-y-4">
                    <SectionHeader 
                        icon={Box} 
                        title="Layout Type" 
                        onHide={() => setVisibleSections(prev => ({...prev, layout: false}))} 
                        onEditControl={() => setEditingSection('layout')}
                    />
                    {showLayoutDescription && (
                        <div className="group relative bg-primary/5 border border-primary/20 rounded-md p-3 mb-3 flex gap-2.5 items-start">
                            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <p className="text-[11px] text-muted-foreground leading-snug pr-4">
                                Customize the graph structure layout view.
                            </p>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10"
                                onClick={() => setShowLayoutDescription(false)}
                            >
                                <X className="w-3 h-3 text-muted-foreground" />
                            </Button>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2 pl-3">
                      <ViewModeCard 
                        icon={<Maximize2 className="w-5 h-5" />} 
                        label="Lens" 
                        description="Focus on context" 
                        active={true}
                      />
                      <ViewModeCard 
                        icon={<Network className="w-5 h-5" />} 
                        label="Standard" 
                        description="Force-directed" 
                        active={false}
                      />
                      <ViewModeCard 
                        icon={<Network className="w-5 h-5 rotate-180" />} 
                        label="Structure" 
                        description="Hierarchical tree" 
                        active={false}
                      />
                      <ViewModeCard 
                        icon={<MapIcon className="w-5 h-5" />} 
                        label="Map" 
                        description="Geospatial view" 
                        active={false}
                      />
                    </div>
                </div>
                )}

                {visibleSections.layout && visibleSections.graphSettings && <Separator />}

                {visibleSections.graphSettings && (
                <div className="space-y-6">
                    {editingSection === 'graphSettings' ? (
                        <div className="space-y-6 animate-in slide-in-from-right-5 duration-200">
                             <div className="flex items-center justify-between border-b border-border pb-4">
                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                    <Edit className="w-4 h-4 text-primary" />
                                    Edit Control
                                </h4>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}>Cancel</Button>
                                    <Button size="sm" onClick={() => setEditingSection(null)}>Done</Button>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">Visible Controls</Label>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 rounded-md border bg-card/50">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/10 p-2 rounded-full">
                                                <CircleDot className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="text-sm font-medium">Node Type Selection</span>
                                        </div>
                                        <Switch 
                                            checked={controlVisibility.nodeTypeSelection}
                                            onCheckedChange={(c) => setControlVisibility(prev => ({ ...prev, nodeTypeSelection: c }))}
                                        />
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 rounded-md border bg-card/50">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/10 p-2 rounded-full">
                                                <Sliders className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="text-sm font-medium">Node Weight</span>
                                        </div>
                                        <Switch 
                                            checked={controlVisibility.nodeWeight}
                                            onCheckedChange={(c) => setControlVisibility(prev => ({ ...prev, nodeWeight: c }))}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-md border bg-card/50">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/10 p-2 rounded-full">
                                                <ArrowRight className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="text-sm font-medium">Edge Direction</span>
                                        </div>
                                        <Switch 
                                            checked={controlVisibility.edgeDirection}
                                            onCheckedChange={(c) => setControlVisibility(prev => ({ ...prev, edgeDirection: c }))}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-md border bg-card/50">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/10 p-2 rounded-full">
                                                <Eye className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="text-sm font-medium">Visibility Options</span>
                                        </div>
                                        <Switch 
                                            checked={controlVisibility.visibilityGroup}
                                            onCheckedChange={(c) => setControlVisibility(prev => ({ ...prev, visibilityGroup: c }))}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-md border bg-card/50">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/10 p-2 rounded-full">
                                                <Maximize2 className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="text-sm font-medium">Display Options</span>
                                        </div>
                                        <Switch 
                                            checked={controlVisibility.displayGroup}
                                            onCheckedChange={(c) => setControlVisibility(prev => ({ ...prev, displayGroup: c }))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                    <div>
                        <SectionHeader 
                            icon={Settings2} 
                            title="Graph Settings" 
                            onHide={() => setVisibleSections(prev => ({...prev, graphSettings: false}))}
                            onEditControl={() => setEditingSection('graphSettings')}
                        />
                        {showGraphSettingsDescription && (
                            <div className="group relative bg-primary/5 border border-primary/20 rounded-md p-3 mb-4 flex gap-2.5 items-start">
                                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <p className="text-[11px] text-muted-foreground leading-snug pr-4">
                                    Configure visual elements and interactive features.
                                </p>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10"
                                    onClick={() => setShowGraphSettingsDescription(false)}
                                >
                                    <X className="w-3 h-3 text-muted-foreground" />
                                </Button>
                            </div>
                        )}
                    
                        {/* Node Type Selection Mode */}
                        {controlVisibility.nodeTypeSelection && (
                        <div className="space-y-3 mb-6">
                            <Label className="text-[10px] font-bold text-muted-foreground/80 mb-1 block uppercase tracking-widest">Node Type Selection</Label>
                            <RadioGroup 
                                defaultValue={settings?.nodeSelectionMode || 'multi'} 
                                onValueChange={(v) => updateSetting("nodeSelectionMode", v)}
                                className="flex gap-4 pt-1 pl-3"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="single" id="mode-single" />
                                    <Label htmlFor="mode-single" className="text-sm font-medium">Single</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="multi" id="mode-multi" />
                                    <Label htmlFor="mode-multi" className="text-sm font-medium">Multi-Select</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        )}

                        {/* Node Weight & Direction */}
                        <div className="space-y-6">
                             {controlVisibility.nodeWeight && (
                             <div className="space-y-2">
                                <div className="flex justify-between">
                                  <Label className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest">Node Weight Threshold</Label>
                                  <span className="text-sm font-medium text-muted-foreground">{settings?.nodeWeight || 50}%</span>
                                </div>
                                <div className="pl-3">
                                    <Slider 
                                        defaultValue={[settings?.nodeWeight || 50]} 
                                        max={100} 
                                        step={1} 
                                        className="py-1" 
                                        onValueChange={(v) => updateSetting("nodeWeight", v[0])}
                                    />
                                </div>
                             </div>
                             )}

                             {controlVisibility.edgeDirection && (
                             <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest block">Edge Direction</Label>
                                <div className="pl-3">
                                     <Select 
                                        value={settings?.nodeDirection || 'directed'} 
                                        onValueChange={(v) => updateSetting("nodeDirection", v)}
                                     >
                                        <SelectTrigger className="h-8 text-sm w-full">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="directed">Directed</SelectItem>
                                          <SelectItem value="undirected">Undirected</SelectItem>
                                        </SelectContent>
                                     </Select>
                                </div>
                            </div>
                            )}
                        </div>

                        {/* Visibility Toggles */}
                        {controlVisibility.visibilityGroup && (
                        <div className="space-y-3 pt-4">
                            <Label className="text-[10px] font-bold text-muted-foreground/80 mb-2 block uppercase tracking-widest">Visibility</Label>
                            
                            <div className="space-y-3 pl-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">Timeline</Label>
                                    <Switch 
                                        checked={settings?.showTimeline ?? true}
                                        onCheckedChange={(c) => updateSetting("showTimeline", c)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium flex items-center gap-1.5">
                                        AI Briefing
                                        <svg width="0" height="0" className="absolute">
                                            <linearGradient id="ai-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#3b82f6" />
                                                <stop offset="50%" stopColor="#8b5cf6" />
                                                <stop offset="100%" stopColor="#ec4899" />
                                            </linearGradient>
                                        </svg>
                                        <Sparkles 
                                            className="w-3.5 h-3.5 animate-pulse" 
                                            style={{ 
                                                stroke: "url(#ai-gradient)", 
                                                fill: "url(#ai-gradient)",
                                                fillOpacity: 0.2
                                            }} 
                                        />
                                    </Label>
                                    <Switch 
                                        checked={settings?.showAiBriefing ?? true}
                                        onCheckedChange={(c) => updateSetting("showAiBriefing", c)}
                                    />
                                </div>
                                 <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">Legend</Label>
                                    <Switch 
                                        checked={settings?.showLegend ?? true}
                                        onCheckedChange={(c) => updateSetting("showLegend", c)}
                                    />
                                </div>
                            </div>
                        </div>
                        )}

                        {/* Display */}
                        {controlVisibility.displayGroup && (
                        <div className="space-y-3 pt-4">
                            <Label className="text-[10px] font-bold text-muted-foreground/80 mb-2 block uppercase tracking-widest">Display</Label>
                            <div className="space-y-3 pl-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">Show Node Labels</Label>
                                    <Switch 
                                        checked={settings?.showNodeLabels ?? true}
                                        onCheckedChange={(c) => updateSetting("showNodeLabels", c)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">Show Edge Labels</Label>
                                    <Switch 
                                        checked={settings?.showEdgeLabels ?? false}
                                        onCheckedChange={(c) => updateSetting("showEdgeLabels", c)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">Curved Edges</Label>
                                    <Switch 
                                        checked={settings?.curvedEdges ?? true}
                                        onCheckedChange={(c) => updateSetting("curvedEdges", c)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">Particles Effect</Label>
                                    <Switch 
                                        checked={settings?.particlesEffect ?? true}
                                        onCheckedChange={(c) => updateSetting("particlesEffect", c)}
                                    />
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                    )}
              </div>
                )}
                
                {/* Manage Sections Button - Show if any section is hidden */}
                {(!visibleSections.layout || !visibleSections.graphSettings) && (
                    <div className="pt-4 border-t border-border mt-4 text-center">
                        {!visibleSections.layout && !visibleSections.graphSettings && (
                            <p className="text-sm text-muted-foreground mb-3">All sections are currently hidden.</p>
                        )}
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full text-xs"
                            onClick={() => setVisibleSections({ layout: true, graphSettings: true })}
                        >
                            <Eye className="w-3.5 h-3.5 mr-2" />
                            Show Hidden Sections
                        </Button>
                    </div>
                )}
                </>
                )}
            </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="space-y-4">
                    <SectionHeader icon={Settings2} title="General Settings" />
                    
                    {/* Node Type Selection Mode */}
                    <div className="space-y-4">
                        <Label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Node Type Selection</Label>
                        <RadioGroup 
                            defaultValue={settings?.nodeSelectionMode || 'multi'} 
                            onValueChange={(v) => updateSetting("nodeSelectionMode", v)}
                            className="flex gap-4 pt-1"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="single" id="mode-single" />
                                <Label htmlFor="mode-single" className="text-xs font-normal">Single</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="multi" id="mode-multi" />
                                <Label htmlFor="mode-multi" className="text-xs font-normal">Multi-Select</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <Separator />

                    {/* Node Weight & Direction */}
                    <div className="space-y-3">
                         <div className="space-y-1">
                            <div className="flex justify-between">
                              <Label className="text-xs">Node Weight Threshold</Label>
                              <span className="text-xs text-muted-foreground">{settings?.nodeWeight || 50}%</span>
                            </div>
                            <Slider 
                                defaultValue={[settings?.nodeWeight || 50]} 
                                max={100} 
                                step={1} 
                                className="py-1" 
                                onValueChange={(v) => updateSetting("nodeWeight", v[0])}
                            />
                         </div>

                         <div className="flex items-center justify-between">
                            <Label className="text-xs">Edge Direction</Label>
                             <Select 
                                value={settings?.nodeDirection || 'directed'} 
                                onValueChange={(v) => updateSetting("nodeDirection", v)}
                             >
                                <SelectTrigger className="h-7 text-xs w-[120px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="directed">Directed</SelectItem>
                                  <SelectItem value="undirected">Undirected</SelectItem>
                                </SelectContent>
                             </Select>
                        </div>
                    </div>

                    <Separator />

                    {/* Visibility Toggles */}
                    <div className="space-y-3">
                        <Label className="text-xs font-semibold text-muted-foreground mb-2 block">Visibility</Label>
                        
                        <div className="flex items-center justify-between">
                            <Label className="text-xs">Timeline</Label>
                            <Switch 
                                checked={settings?.showTimeline ?? true}
                                onCheckedChange={(c) => updateSetting("showTimeline", c)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label className="text-xs">AI Briefing</Label>
                            <Switch 
                                checked={settings?.showAiBriefing ?? true}
                                onCheckedChange={(c) => updateSetting("showAiBriefing", c)}
                            />
                        </div>
                         <div className="flex items-center justify-between">
                            <Label className="text-xs">Legend</Label>
                            <Switch 
                                checked={settings?.showLegend ?? true}
                                onCheckedChange={(c) => updateSetting("showLegend", c)}
                            />
                        </div>
                    </div>

                    {/* Display section moved to View Options */}
                </div>
              </div>
            )}

            {/* Node Sizing Tab */}
            {activeTab === "sizing" && (
              <div className="space-y-4">
                <SectionHeader icon={Maximize2} title="Node Styling" />
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Sizing Method</Label>
                    <Select defaultValue="degree">
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Size</SelectItem>
                        <SelectItem value="degree">Degree Centrality</SelectItem>
                        <SelectItem value="pagerank">PageRank</SelectItem>
                        <SelectItem value="betweenness">Betweenness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <Label className="text-xs">Base Size</Label>
                      <span className="text-xs text-muted-foreground">45px</span>
                    </div>
                    <Slider defaultValue={[45]} max={100} step={1} className="py-1" />
                  </div>
                </div>
              </div>
            )}

            {/* Filters Tab */}
            {activeTab === "filters" && (
              <div className="space-y-4">
                <SectionHeader icon={Filter} title="Filters" />
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <Label className="text-xs">Min Degree</Label>
                      <span className="text-xs text-muted-foreground">1</span>
                    </div>
                    <Slider defaultValue={[1]} max={20} step={1} className="py-1" />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Edge Weight Threshold</Label>
                    <Slider defaultValue={[0.2]} max={1} step={0.1} className="py-1" />
                  </div>

                  <div className="pt-2">
                    <Label className="text-xs mb-2 block">Visible Types</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                         <Label htmlFor="filter-person" className="text-xs font-normal">Person</Label>
                         <Switch id="filter-person" defaultChecked className="scale-75" />
                      </div>
                      <div className="flex items-center justify-between">
                         <Label htmlFor="filter-org" className="text-xs font-normal">Organization</Label>
                         <Switch id="filter-org" defaultChecked className="scale-75" />
                      </div>
                      <div className="flex items-center justify-between">
                         <Label htmlFor="filter-loc" className="text-xs font-normal">Location</Label>
                         <Switch id="filter-loc" defaultChecked className="scale-75" />
                      </div>
                      <div className="flex items-center justify-between">
                         <Label htmlFor="filter-event" className="text-xs font-normal">Event</Label>
                         <Switch id="filter-event" defaultChecked className="scale-75" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Report Tab */}
            {activeTab === "report" && (
              <div className="space-y-3">
                <SectionHeader icon={BarChart3} title="Statistics" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-secondary/30 p-2 rounded border border-border/50">
                    <div className="text-[10px] text-muted-foreground">Nodes</div>
                    <div className="text-lg font-mono font-bold">{stats?.nodes ?? 0}</div>
                  </div>
                  <div className="bg-secondary/30 p-2 rounded border border-border/50">
                    <div className="text-[10px] text-muted-foreground">Edges</div>
                    <div className="text-lg font-mono font-bold">{stats?.edges ?? 0}</div>
                  </div>
                  <div className="bg-secondary/30 p-2 rounded border border-border/50">
                    <div className="text-[10px] text-muted-foreground">Node Types</div>
                    <div className="text-lg font-mono font-bold">{stats?.types ?? 0}</div>
                  </div>
                  <div className="bg-secondary/30 p-2 rounded border border-border/50">
                    <div className="text-[10px] text-muted-foreground">Density</div>
                    <div className="text-lg font-mono font-bold">{stats?.density ?? "0.00"}</div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="mb-4">
                    <SectionHeader icon={FileText} title="Export Report" />
                </div>
                <Button className="w-full" size="sm" variant="outline">
                    Download PDF Report
                </Button>
                <Button className="w-full mt-2" size="sm" variant="outline">
                    Export CSV Data
                </Button>
              </div>
            )}

          </div>
        </ScrollArea>
        </>
        )}
      </div>

      {/* Icon Navigation Rail (Always Visible) */}
      <div className="w-14 border-l border-border flex flex-col items-center py-4 gap-4 bg-card/80 backdrop-blur-sm z-20">
        <NavIcon 
          icon={<Box className="w-5 h-5" />} 
          label="View Type" 
          isActive={activeTab === "view"} 
          onClick={() => toggleTab("view")} 
        />
        <NavIcon 
          icon={<Sliders className="w-5 h-5" />} 
          label="Settings" 
          isActive={activeTab === "settings"} 
          onClick={() => toggleTab("settings")} 
          className="hidden" // Hide the old settings tab icon for now as content is moved
        />
        <NavIcon 
          icon={<CircleDot className="w-5 h-5" />} 
          label="Node Sizing" 
          isActive={activeTab === "sizing"} 
          onClick={() => toggleTab("sizing")} 
        />
        <NavIcon 
          icon={<Filter className="w-5 h-5" />} 
          label="Filters" 
          isActive={activeTab === "filters"} 
          onClick={() => toggleTab("filters")} 
        />
        <NavIcon 
          icon={<FileText className="w-5 h-5" />} 
          label="Report" 
          isActive={activeTab === "report"} 
          onClick={() => toggleTab("report")} 
        />
        
        <div className="flex-1" />
        
        {/* AI Copilot Toggle */}
        <div className="relative group flex justify-center w-full pb-2">
            <button 
                onClick={() => toggleTab("ai")}
                className={cn(
                  "relative p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110 overflow-hidden",
                  activeTab === "ai" 
                    ? "text-white shadow-lg shadow-purple-500/25 ring-2 ring-purple-500/20" 
                    : "text-muted-foreground hover:bg-secondary/50"
                )}
            >
                {/* Colorful Gradient Background */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-amber-400 opacity-90",
                     activeTab === "ai" ? "opacity-100" : "opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                )} />
                
                {/* Shine Effect */}
                {activeTab === "ai" && (
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                )}

                <Sparkles className={cn("w-5 h-5 relative z-10", activeTab === "ai" ? "text-white" : "text-purple-500 group-hover:text-purple-600")} />
                
                {activeTab !== "ai" && (
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-tr from-violet-500/10 to-fuchsia-500/10 animate-pulse" />
                )}
            </button>
            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2 py-1 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-500 text-white text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md">
                AI Copilot
                <div className="absolute top-1/2 right-[-4px] -translate-y-1/2 border-4 border-transparent border-l-amber-500"></div>
            </div>
        </div>
      </div>
    </div>
  );
}

function NavIcon({ icon, label, isActive, onClick, className }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void, className?: string }) {
  return (
    <div className={cn("relative group flex justify-center w-full", className)}>
      <button 
        onClick={onClick}
        className={cn(
          "p-2.5 rounded-xl transition-all duration-200 hover:bg-primary/10 hover:text-primary",
          isActive 
            ? "bg-primary text-primary-foreground shadow-md hover:bg-primary hover:text-primary-foreground" 
            : "text-muted-foreground"
        )}
      >
        {icon}
      </button>
      <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2 py-1 bg-popover text-popover-foreground text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md border border-border">
        {label}
        <div className="absolute top-1/2 right-[-4px] -translate-y-1/2 border-4 border-transparent border-l-popover"></div>
      </div>
    </div>
  )
}
