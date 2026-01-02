import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
  ArrowLeft,
  Waypoints
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
    <h4 className="text-[11px] font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <Icon className="w-3.5 h-3.5 text-primary" /> {title}
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

const ViewModeCard = ({ icon, label, description, active, onClick, topRight }: { icon: any, label: string, description: string, active: boolean, onClick?: () => void, topRight?: React.ReactNode }) => (
  <div 
    onClick={onClick}
    className={cn(
    "relative flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent/50",
    active ? "bg-primary/10 border-primary/50 text-primary" : "bg-card border-border text-muted-foreground"
  )}>
    {topRight && (
        <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
            {topRight}
        </div>
    )}
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

// New component for dismissible info box
const InfoBox = ({ title, description, icon: Icon }: { title: string, description: string, icon: any }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  if (!isVisible) return null;

  return (
    <div className="relative group bg-secondary/20 border border-border/50 rounded-md p-3 mb-4 transition-all hover:bg-secondary/30">
        <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
        >
            <X className="w-3.5 h-3.5" />
        </button>
        <div className="flex items-center gap-2 mb-1.5">
            <Icon className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed pl-6 pr-4">
            {description}
        </p>
    </div>
  );
};

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
  const [focusedLayout, setFocusedLayout] = useState('organic');
  const [layoutConfigs, setLayoutConfigs] = useState<Record<string, { enabled: boolean, tightness: number, orientation?: string }>>({
    organic: { enabled: true, tightness: 5 },
    sequential: { enabled: false, tightness: 5, orientation: 'down' },
    hierarchy: { enabled: false, tightness: 5, orientation: 'down' },
    lens: { enabled: true, tightness: 5 },
    radial: { enabled: false, tightness: 5 },
    structural: { enabled: false, tightness: 5 },
  });

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
                            <div>
                                <div className="bg-primary/5 border border-primary/20 rounded-md p-3 mb-6">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <Info className="w-4 h-4 text-primary" />
                                        <h4 className="text-sm font-semibold text-foreground">Select Layouts</h4>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                                      Please select the layout types you want to make available in the graph view. You can configure individual settings for each layout below.
                                    </p>
                                </div>
                                
                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 block">Layout Type</Label>
                                
                                <div className="grid grid-cols-2 gap-2 mb-6">
                                    <ViewModeCard 
                                        icon={<Share2 className="w-5 h-5" />}
                                        label="Organic"
                                        description="Natural clustering"
                                        active={focusedLayout === 'organic'}
                                        onClick={() => setFocusedLayout('organic')}
                                        topRight={
                                            <Checkbox 
                                                checked={layoutConfigs.organic.enabled}
                                                onCheckedChange={(c) => setLayoutConfigs(prev => ({...prev, organic: {...prev.organic, enabled: !!c}}))}
                                            />
                                        }
                                    />
                                    <ViewModeCard 
                                        icon={<ListEnd className="w-5 h-5" />}
                                        label="Sequential"
                                        description="Linear progression"
                                        active={focusedLayout === 'sequential'}
                                        onClick={() => setFocusedLayout('sequential')}
                                        topRight={
                                            <Checkbox 
                                                checked={layoutConfigs.sequential.enabled}
                                                onCheckedChange={(c) => setLayoutConfigs(prev => ({...prev, sequential: {...prev.sequential, enabled: !!c}}))}
                                            />
                                        }
                                    />
                                    <ViewModeCard 
                                        icon={<Workflow className="w-5 h-5" />}
                                        label="Hierarchy"
                                        description="Tree structure"
                                        active={focusedLayout === 'hierarchy'}
                                        onClick={() => setFocusedLayout('hierarchy')}
                                        topRight={
                                            <Checkbox 
                                                checked={layoutConfigs.hierarchy.enabled}
                                                onCheckedChange={(c) => setLayoutConfigs(prev => ({...prev, hierarchy: {...prev.hierarchy, enabled: !!c}}))}
                                            />
                                        }
                                    />
                                    <ViewModeCard 
                                        icon={<Maximize2 className="w-5 h-5" />}
                                        label="Lens"
                                        description="Focus context"
                                        active={focusedLayout === 'lens'}
                                        onClick={() => setFocusedLayout('lens')}
                                        topRight={
                                            <Checkbox 
                                                checked={layoutConfigs.lens.enabled}
                                                onCheckedChange={(c) => setLayoutConfigs(prev => ({...prev, lens: {...prev.lens, enabled: !!c}}))}
                                            />
                                        }
                                    />
                                    <ViewModeCard 
                                        icon={<CircleDashed className="w-5 h-5" />}
                                        label="Radial"
                                        description="Circular view"
                                        active={focusedLayout === 'radial'}
                                        onClick={() => setFocusedLayout('radial')}
                                        topRight={
                                            <Checkbox 
                                                checked={layoutConfigs.radial.enabled}
                                                onCheckedChange={(c) => setLayoutConfigs(prev => ({...prev, radial: {...prev.radial, enabled: !!c}}))}
                                            />
                                        }
                                    />
                                    <ViewModeCard 
                                        icon={<LayoutGridIcon className="w-5 h-5" />}
                                        label="Structural"
                                        description="Grid arrangement"
                                        active={focusedLayout === 'structural'}
                                        onClick={() => setFocusedLayout('structural')}
                                        topRight={
                                            <Checkbox 
                                                checked={layoutConfigs.structural.enabled}
                                                onCheckedChange={(c) => setLayoutConfigs(prev => ({...prev, structural: {...prev.structural, enabled: !!c}}))}
                                            />
                                        }
                                    />
                                </div>

                                <div className="rounded-lg border bg-card/50 p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Configuration</h4>
                                        <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full capitalize">{focusedLayout}</span>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-xs">Tightness</Label>
                                            <span className="text-xs font-medium bg-secondary px-2 py-0.5 rounded text-muted-foreground">
                                                {layoutConfigs[focusedLayout]?.tightness ?? 5}
                                            </span>
                                        </div>
                                        <Slider 
                                            value={[layoutConfigs[focusedLayout]?.tightness ?? 5]} 
                                            onValueChange={(v) => setLayoutConfigs(prev => ({...prev, [focusedLayout]: {...prev[focusedLayout], tightness: v[0]}}))}
                                            max={10} 
                                            step={1} 
                                            className="py-2" 
                                        />
                                        <p className="text-[10px] text-muted-foreground">Adjusts how closely nodes are packed together.</p>
                                    </div>

                                    {(focusedLayout === 'hierarchy' || focusedLayout === 'sequential') && (
                                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 mt-4 pt-4 border-t border-dashed">
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
                                                        onClick={() => setLayoutConfigs(prev => ({...prev, [focusedLayout]: {...prev[focusedLayout], orientation: opt.value}}))}
                                                        className={cn(
                                                            "flex flex-col items-center justify-center p-2 rounded border cursor-pointer transition-all",
                                                            layoutConfigs[focusedLayout]?.orientation === opt.value 
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
                    </div>
                ) : editingSection === 'graphSettings' ? (
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
                        {layoutConfigs.organic.enabled && (
                          <ViewModeCard 
                            icon={<Share2 className="w-5 h-5" />} 
                            label="Organic" 
                            description="Natural clustering" 
                            active={false}
                          />
                        )}
                        {layoutConfigs.sequential.enabled && (
                          <ViewModeCard 
                            icon={<ListEnd className="w-5 h-5" />} 
                            label="Sequential" 
                            description="Linear progression" 
                            active={false}
                          />
                        )}
                        {layoutConfigs.hierarchy.enabled && (
                          <ViewModeCard 
                            icon={<Workflow className="w-5 h-5" />} 
                            label="Hierarchy" 
                            description="Tree structure" 
                            active={false}
                          />
                        )}
                        {layoutConfigs.lens.enabled && (
                          <ViewModeCard 
                            icon={<Maximize2 className="w-5 h-5" />} 
                            label="Lens" 
                            description="Focus on context" 
                            active={true}
                          />
                        )}
                        {layoutConfigs.radial.enabled && (
                          <ViewModeCard 
                            icon={<CircleDashed className="w-5 h-5" />} 
                            label="Radial" 
                            description="Circular view" 
                            active={false}
                          />
                        )}
                        {layoutConfigs.structural.enabled && (
                          <ViewModeCard 
                            icon={<LayoutGridIcon className="w-5 h-5" />} 
                            label="Structural" 
                            description="Grid arrangement" 
                            active={false}
                          />
                        )}
                    </div>
                </div>
                )}

                {visibleSections.layout && visibleSections.graphSettings && <Separator />}

                {visibleSections.graphSettings && (
                <div className="space-y-6">
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
                <SectionHeader icon={Settings2} title="General Settings" />
                
                <div className="space-y-4">
                    {/* Node Type Selection Mode */}
                    <div className="bg-card/50 rounded-lg border p-3 hover:bg-accent/5 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                            <Layers className="w-3.5 h-3.5 text-primary" />
                            <Label className="text-xs font-semibold">Interaction Mode</Label>
                        </div>
                        <RadioGroup 
                            defaultValue={settings?.nodeSelectionMode || 'multi'} 
                            onValueChange={(v) => updateSetting("nodeSelectionMode", v)}
                            className="flex gap-4 pt-1"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="single" id="mode-single" />
                                <Label htmlFor="mode-single" className="text-xs font-normal cursor-pointer">Single Select</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="multi" id="mode-multi" />
                                <Label htmlFor="mode-multi" className="text-xs font-normal cursor-pointer">Multi Select</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Node Weight & Direction */}
                    <div className="bg-card/50 rounded-lg border p-3 hover:bg-accent/5 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                            <Network className="w-3.5 h-3.5 text-primary" />
                            <Label className="text-xs font-semibold">Graph Structure</Label>
                        </div>
                        <div className="space-y-4">
                             <div className="space-y-2">
                                <div className="flex justify-between">
                                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Node Weight Threshold</Label>
                                  <span className="text-xs font-mono text-muted-foreground">{settings?.nodeWeight || 50}%</span>
                                </div>
                                <Slider 
                                    defaultValue={[settings?.nodeWeight || 50]} 
                                    max={100} 
                                    step={1} 
                                    className="py-1" 
                                    onValueChange={(v) => updateSetting("nodeWeight", v[0])}
                                />
                             </div>

                             <div className="space-y-2">
                                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider block">Edge Direction</Label>
                                 <Select 
                                    value={settings?.nodeDirection || 'directed'} 
                                    onValueChange={(v) => updateSetting("nodeDirection", v)}
                                 >
                                    <SelectTrigger className="h-7 text-xs w-full">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="directed">Directed Edges</SelectItem>
                                      <SelectItem value="undirected">Undirected Edges</SelectItem>
                                    </SelectContent>
                                 </Select>
                            </div>
                        </div>
                    </div>

                    {/* Visibility Toggles */}
                    <div className="bg-card/50 rounded-lg border p-3 hover:bg-accent/5 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                            <Eye className="w-3.5 h-3.5 text-primary" />
                            <Label className="text-xs font-semibold">Visibility Controls</Label>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-normal">Show Timeline</Label>
                                <Switch 
                                    checked={settings?.showTimeline ?? true}
                                    onCheckedChange={(c) => updateSetting("showTimeline", c)}
                                    className="scale-75 origin-right"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-normal flex items-center gap-1.5">
                                    AI Briefing
                                    <Sparkles className="w-3 h-3 text-purple-500" />
                                </Label>
                                <Switch 
                                    checked={settings?.showAiBriefing ?? true}
                                    onCheckedChange={(c) => updateSetting("showAiBriefing", c)}
                                    className="scale-75 origin-right"
                                />
                            </div>
                             <div className="flex items-center justify-between">
                                <Label className="text-xs font-normal">Show Legend</Label>
                                <Switch 
                                    checked={settings?.showLegend ?? true}
                                    onCheckedChange={(c) => updateSetting("showLegend", c)}
                                    className="scale-75 origin-right"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Display Options */}
                     <div className="bg-card/50 rounded-lg border p-3 hover:bg-accent/5 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                            <Maximize2 className="w-3.5 h-3.5 text-primary" />
                            <Label className="text-xs font-semibold">Display Options</Label>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-normal">Show Node Labels</Label>
                                <Switch 
                                    checked={settings?.showNodeLabels ?? true}
                                    onCheckedChange={(c) => updateSetting("showNodeLabels", c)}
                                    className="scale-75 origin-right"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-normal">Show Edge Labels</Label>
                                <Switch 
                                    checked={settings?.showEdgeLabels ?? false}
                                    onCheckedChange={(c) => updateSetting("showEdgeLabels", c)}
                                    className="scale-75 origin-right"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-normal">Curved Edges</Label>
                                <Switch 
                                    checked={settings?.curvedEdges ?? true}
                                    onCheckedChange={(c) => updateSetting("curvedEdges", c)}
                                    className="scale-75 origin-right"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-normal">Particles Effect</Label>
                                <Switch 
                                    checked={settings?.particlesEffect ?? true}
                                    onCheckedChange={(c) => updateSetting("particlesEffect", c)}
                                    className="scale-75 origin-right"
                                />
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            )}

            {/* Node Sizing Tab */}
            {activeTab === "sizing" && (
              <div className="space-y-6">
                <SectionHeader icon={Maximize2} title="Node Sizing" />
                
                <div className="space-y-6">
                    {/* Field-based Sizing Configuration */}
                    <div>
                        <InfoBox 
                            title="Field-Based Sizing" 
                            description="Configure specific sizing fields for each node type based on their attributes."
                            icon={Info}
                        />

                        <div className="space-y-4">
                            {/* Criminal Nodes */}
                            <div className="p-3 rounded-lg border bg-card/50 hover:bg-accent/5 transition-colors">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    <span className="text-sm font-medium">Criminal</span>
                                </div>
                                <div className="pl-4 space-y-2">
                                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Sizing Field</Label>
                                    <Select defaultValue="risk_score">
                                        <SelectTrigger className="h-7 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="risk_score">Risk Score</SelectItem>
                                            <SelectItem value="crimes_count">Crimes Committed</SelectItem>
                                            <SelectItem value="sentence_years">Sentence Years</SelectItem>
                                            <SelectItem value="none">None (Fixed Size)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Detective Nodes */}
                            <div className="p-3 rounded-lg border bg-card/50 hover:bg-accent/5 transition-colors">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <span className="text-sm font-medium">Detective</span>
                                </div>
                                <div className="pl-4 space-y-2">
                                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Sizing Field</Label>
                                    <Select defaultValue="cases_solved">
                                        <SelectTrigger className="h-7 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cases_solved">Cases Solved</SelectItem>
                                            <SelectItem value="rank_level">Rank Level</SelectItem>
                                            <SelectItem value="years_active">Years Active</SelectItem>
                                            <SelectItem value="none">None (Fixed Size)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Prison/Location Nodes */}
                            <div className="p-3 rounded-lg border bg-card/50 hover:bg-accent/5 transition-colors">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-sm font-medium">Prison / Location</span>
                                </div>
                                <div className="pl-4 space-y-2">
                                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Sizing Field</Label>
                                    <Select defaultValue="capacity">
                                        <SelectTrigger className="h-7 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="capacity">Inmate Capacity</SelectItem>
                                            <SelectItem value="security_level">Security Level</SelectItem>
                                            <SelectItem value="staff_count">Staff Count</SelectItem>
                                            <SelectItem value="none">None (Fixed Size)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Victim Nodes */}
                            <div className="p-3 rounded-lg border bg-card/50 hover:bg-accent/5 transition-colors">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                                    <span className="text-sm font-medium">Victim</span>
                                </div>
                                <div className="pl-4 space-y-2">
                                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Sizing Field</Label>
                                    <Select defaultValue="damage_amount">
                                        <SelectTrigger className="h-7 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="damage_amount">Financial Damage</SelectItem>
                                            <SelectItem value="impact_score">Impact Score</SelectItem>
                                            <SelectItem value="none">None (Fixed Size)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Global Sizing Settings */}
                    <div className="space-y-4">
                        <SectionHeader icon={Network} title="Graph Theory" />
                        <InfoBox 
                            title="Graph Theory" 
                            description="Apply graph theoretical metrics to visualize node importance and centrality."
                            icon={Info}
                        />
                        
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium">Graph Analysis Model</Label>
                            <Select defaultValue="centrality">
                                <SelectTrigger className="h-10 text-xs">
                                    <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="centrality" className="py-2">
                                        <div className="flex flex-col gap-0.5 text-left">
                                            <div className="flex items-center gap-2 font-medium">
                                                <Network className="w-3 h-3 text-primary" />
                                                <span>Degree Centrality</span>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground pl-5">
                                                Measures direct connections
                                            </span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="pagerank" className="py-2">
                                        <div className="flex flex-col gap-0.5 text-left">
                                            <div className="flex items-center gap-2 font-medium">
                                                <Share2 className="w-3 h-3 text-primary" />
                                                <span>PageRank Score</span>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground pl-5">
                                                Measures node importance via links
                                            </span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="betweenness" className="py-2">
                                        <div className="flex flex-col gap-0.5 text-left">
                                            <div className="flex items-center gap-2 font-medium">
                                                <Waypoints className="w-3 h-3 text-primary" />
                                                <span>Betweenness</span>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground pl-5">
                                                Measures bridge role in shortest paths
                                            </span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="manual" className="py-2">
                                        <div className="flex flex-col gap-0.5 text-left">
                                            <div className="flex items-center gap-2 font-medium">
                                                <Edit className="w-3 h-3 text-primary" />
                                                <span>Manual Override</span>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground pl-5">
                                                Manually set node sizes
                                            </span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-xs font-medium">Base Size</Label>
                                <span className="text-xs text-muted-foreground">45px</span>
                            </div>
                            <Slider 
                                defaultValue={[45]} 
                                max={100} 
                                step={1} 
                                className="py-2"
                            />
                        </div>
                    </div>
                </div>
              </div>
            )}

            {/* Filters Tab */}
            {activeTab === "filters" && (
              <div className="space-y-4">
                <SectionHeader icon={Filter} title="Node Type Filters" />
                <div className="space-y-4">

                  {/* Criminal Filter */}
                  <div className="p-3 rounded-lg border bg-card/50 hover:bg-accent/5 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-red-500" />
                              <span className="text-sm font-medium">Criminal</span>
                          </div>
                          <Switch defaultChecked className="scale-75" />
                      </div>
                      
                      <div className="pl-4 space-y-4 pt-1">
                          {/* Range Filter */}
                          <div className="space-y-2">
                              <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                                  <span>Risk Score</span>
                                  <span>0 - 100</span>
                              </div>
                              <Slider defaultValue={[0, 100]} max={100} step={1} className="py-1" />
                          </div>

                          {/* Checkbox Filter */}
                          <div className="space-y-2">
                             <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1.5">Status</div>
                             <div className="space-y-1.5">
                                 <div className="flex items-center gap-2">
                                     <Checkbox id="status-incarcerated" defaultChecked className="h-3.5 w-3.5" />
                                     <Label htmlFor="status-incarcerated" className="text-xs font-normal cursor-pointer">Incarcerated</Label>
                                 </div>
                                 <div className="flex items-center gap-2">
                                     <Checkbox id="status-atlarge" defaultChecked className="h-3.5 w-3.5" />
                                     <Label htmlFor="status-atlarge" className="text-xs font-normal cursor-pointer">At Large</Label>
                                 </div>
                                 <div className="flex items-center gap-2">
                                     <Checkbox id="status-suspect" defaultChecked className="h-3.5 w-3.5" />
                                     <Label htmlFor="status-suspect" className="text-xs font-normal cursor-pointer">Suspect</Label>
                                 </div>
                             </div>
                          </div>
                      </div>
                  </div>

                  {/* Detective Filter */}
                  <div className="p-3 rounded-lg border bg-card/50 hover:bg-accent/5 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                              <span className="text-sm font-medium">Detective</span>
                          </div>
                          <Switch defaultChecked className="scale-75" />
                      </div>
                      
                      <div className="pl-4 space-y-4 pt-1">
                          {/* Range Filter */}
                          <div className="space-y-2">
                              <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                                  <span>Clearance Rate</span>
                                  <span>50% - 100%</span>
                              </div>
                              <Slider defaultValue={[50, 100]} max={100} step={1} className="py-1" />
                          </div>

                          {/* Checkbox Filter */}
                          <div className="space-y-2">
                             <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1.5">Unit</div>
                             <div className="space-y-1.5">
                                 <div className="flex items-center gap-2">
                                     <Checkbox id="unit-homicide" defaultChecked className="h-3.5 w-3.5" />
                                     <Label htmlFor="unit-homicide" className="text-xs font-normal cursor-pointer">Homicide</Label>
                                 </div>
                                 <div className="flex items-center gap-2">
                                     <Checkbox id="unit-cyber" defaultChecked className="h-3.5 w-3.5" />
                                     <Label htmlFor="unit-cyber" className="text-xs font-normal cursor-pointer">Cyber Crimes</Label>
                                 </div>
                                 <div className="flex items-center gap-2">
                                     <Checkbox id="unit-narcotics" defaultChecked className="h-3.5 w-3.5" />
                                     <Label htmlFor="unit-narcotics" className="text-xs font-normal cursor-pointer">Narcotics</Label>
                                 </div>
                             </div>
                          </div>
                      </div>
                  </div>

                  {/* Prison Filter */}
                  <div className="p-3 rounded-lg border bg-card/50 hover:bg-accent/5 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span className="text-sm font-medium">Prison / Location</span>
                          </div>
                          <Switch defaultChecked className="scale-75" />
                      </div>
                      
                      <div className="pl-4 space-y-4 pt-1">
                          {/* Range Filter */}
                          <div className="space-y-2">
                              <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                                  <span>Occupancy</span>
                                  <span>0% - 100%</span>
                              </div>
                              <Slider defaultValue={[0, 90]} max={100} step={1} className="py-1" />
                          </div>

                          {/* Checkbox Filter */}
                          <div className="space-y-2">
                             <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1.5">Security Level</div>
                             <div className="space-y-1.5">
                                 <div className="flex items-center gap-2">
                                     <Checkbox id="sec-max" defaultChecked className="h-3.5 w-3.5" />
                                     <Label htmlFor="sec-max" className="text-xs font-normal cursor-pointer">Maximum</Label>
                                 </div>
                                 <div className="flex items-center gap-2">
                                     <Checkbox id="sec-med" defaultChecked className="h-3.5 w-3.5" />
                                     <Label htmlFor="sec-med" className="text-xs font-normal cursor-pointer">Medium</Label>
                                 </div>
                             </div>
                          </div>
                      </div>
                  </div>

                  {/* Victim Filter */}
                  <div className="p-3 rounded-lg border bg-card/50 hover:bg-accent/5 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-amber-500" />
                              <span className="text-sm font-medium">Victim</span>
                          </div>
                          <Switch defaultChecked className="scale-75" />
                      </div>
                      
                      <div className="pl-4 space-y-4 pt-1">
                          {/* Range Filter */}
                          <div className="space-y-2">
                              <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                                  <span>Damage Amount</span>
                                  <span>$10k - $500k+</span>
                              </div>
                              <Slider defaultValue={[10]} max={100} step={1} className="py-1" />
                          </div>

                           {/* Checkbox Filter */}
                          <div className="space-y-2">
                             <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1.5">Type</div>
                             <div className="space-y-1.5">
                                 <div className="flex items-center gap-2">
                                     <Checkbox id="vic-individual" defaultChecked className="h-3.5 w-3.5" />
                                     <Label htmlFor="vic-individual" className="text-xs font-normal cursor-pointer">Individual</Label>
                                 </div>
                                 <div className="flex items-center gap-2">
                                     <Checkbox id="vic-corporate" defaultChecked className="h-3.5 w-3.5" />
                                     <Label htmlFor="vic-corporate" className="text-xs font-normal cursor-pointer">Corporate</Label>
                                 </div>
                             </div>
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
