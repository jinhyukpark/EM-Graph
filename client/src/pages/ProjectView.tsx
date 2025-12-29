import { useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import NodeListSidebar, { MOCK_COMPANY_NODES } from "@/components/layout/NodeListSidebar";
import ImageNode from "@/components/graph/ImageNode";
import { ReactFlow, Background, Controls, useNodesState, useEdgesState, MiniMap, BackgroundVariant, NodeTypes, MarkerType } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Bot, Layers, ZoomIn, ZoomOut, Maximize2, Share2, Info, Settings, Palette, Zap, Sparkles, ArrowRight, Plus, Minus, Circle, Network, List, LayoutTemplate } from "lucide-react";
import { MOCK_FIELDS } from "@/lib/mockData";
import "@xyflow/react/dist/style.css";
import { Checkbox } from "@/components/ui/checkbox";

import CenterEdge from "@/components/graph/CenterEdge";

import { cn } from "@/lib/utils";

// Define custom node types
const nodeTypes: NodeTypes = {
  imageNode: ImageNode,
};

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
    { id: 'lt-1', label: 'Park "Razor"', sub: 'Enforcer', type: 'Criminal', color: '#ef4444', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop' },
    { id: 'lt-2', label: 'Kim "ledger"', sub: 'Money Launderer', type: 'Criminal', color: '#ef4444', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
    { id: 'vc-1', label: 'Victim A', sub: 'Assault', type: 'Victim', color: '#fbbf24', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop' },
    { id: 'vc-2', label: 'Victim B', sub: 'Fraud', type: 'Victim', color: '#fbbf24', img: 'https://images.unsplash.com/photo-1554151228-14d9def656ec?w=150&h=150&fit=crop' },
    { id: 'dt-1', label: 'Det. Choi', sub: 'Lead Investigator', type: 'Detective', color: '#3b82f6', img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop' },
    { id: 'lw-1', label: 'Lawyer Han', sub: 'Defense Attorney', type: 'Lawyer', color: '#8b5cf6', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
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
    { id: 'loc-1', label: 'Warehouse 4', sub: 'Crime Scene', type: 'Location', color: '#10b981' },
    { id: 'loc-2', label: 'Offshore Account', sub: 'Asset', type: 'Asset', color: '#10b981' },
    { id: 'case-1', label: 'Case #22-004', sub: 'Lawsuit', type: 'Lawsuit', color: '#8b5cf6' },
    { id: 'asn-1', label: 'Thug A', sub: 'Associate', type: 'Criminal', color: '#ef4444', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop' },
    { id: 'wit-1', label: 'Witness Kim', sub: 'Observer', type: 'Witness', color: '#fbbf24', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop' },
    { id: 'dt-2', label: 'Det. Lee', sub: 'Partner', type: 'Detective', color: '#3b82f6', img: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop' },
    { id: 'vic-3', label: 'Company X', sub: 'Fraud Victim', type: 'Victim', color: '#fbbf24' },
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
const LEGEND_DATA = [
  { label: "Criminal", color: "bg-red-500", count: 4, percent: "25%" },
  { label: "Detective", color: "bg-blue-500", count: 2, percent: "12%" },
  { label: "Victim/Witness", color: "bg-amber-400", count: 4, percent: "25%" },
  { label: "Legal/Lawsuit", color: "bg-violet-500", count: 2, percent: "12%" },
  { label: "Asset/Location", color: "bg-emerald-500", count: 3, percent: "18%" },
  { label: "Evidence", color: "bg-slate-500", count: 1, percent: "6%" },
];

export default function ProjectView() {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [legendOpen, setLegendOpen] = useState(true);
  const [sidebarMode, setSidebarMode] = useState<"nav" | "list">("nav");
  // Multi-select state for legend items - initialize with all selected
  const [selectedCategories, setSelectedCategories] = useState<string[]>(LEGEND_DATA.map(d => d.label));
  
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
    setSelectedNode({ 
      id: node.id, 
      data: { label: node.name, type: node.category }, 
      position: { x: 0, y: 0 } // dummy position
    });
  };

  const SidebarToggle = (
    <Tabs value={sidebarMode} onValueChange={(v) => setSidebarMode(v as "nav" | "list")} className="w-full mb-6">
      <TabsList className="w-full grid grid-cols-2 bg-secondary/50 h-10 p-1 rounded-full border border-border/50">
        <TabsTrigger 
          value="nav" 
          className="rounded-full flex items-center justify-center gap-2 text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          Navigation
        </TabsTrigger>
        <TabsTrigger 
          value="list" 
          className="rounded-full flex items-center justify-center gap-2 text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
        >
          <List className="w-3.5 h-3.5" />
          Node List
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );

  return (
    <Layout 
      sidebar={
        sidebarMode === "list" 
          ? <NodeListSidebar onNodeSelect={handleSidebarNodeSelect} selectedNodeId={selectedNode?.id} /> 
          : undefined
      }
      sidebarControls={SidebarToggle}
    >
      <div className="relative h-[calc(100vh-64px)] bg-background">
        
        {/* Toolbar Overlay */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between pointer-events-none">
          <div className="flex gap-2 pointer-events-auto">
            
            <div className="bg-card/90 backdrop-blur border border-border p-1 rounded-md flex items-center shadow-sm">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-2 top-2.5 text-muted-foreground" />
                <Input placeholder="Search nodes in graph..." className="pl-8 w-64 border-none bg-transparent focus-visible:ring-0 h-9" />
              </div>
            </div>
            
            <div className="bg-card/90 backdrop-blur border border-border p-1 rounded-md flex items-center shadow-sm ml-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary" onClick={() => setSettingsOpen(true)}>
                <Settings className="w-4 h-4 text-muted-foreground" />
              </Button>
              <div className="h-4 w-px bg-border mx-1" />
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary" onClick={() => setLegendOpen(!legendOpen)}>
                <Layers className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2 pointer-events-auto">
            <Button 
              onClick={() => setAiDrawerOpen(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-purple-500/20 border-none"
            >
              <Bot className="w-4 h-4 mr-2" />
              Nexus AI
            </Button>
            <Button variant="outline" className="bg-card/90 backdrop-blur shadow-sm">
              <Share2 className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Graph Visualization */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          className="bg-background"
          minZoom={0.5}
          maxZoom={2}
        >
          <Background color="hsl(var(--foreground))" gap={30} size={1} variant={BackgroundVariant.Dots} className="opacity-10" />
          <Controls position="top-left" className="!bg-card !border-border !fill-foreground !shadow-md !ml-4 !mt-20" />
          <MiniMap 
            nodeColor={(n) => {
              if (n.type === 'Core') return 'hsl(var(--primary))';
              if (n.type === 'Event') return 'hsl(var(--accent))';
              return 'hsl(var(--secondary))';
            }}
            className="!bg-card !border-border !shadow-md"
            maskColor="hsl(var(--background) / 0.8)"
          />
        </ReactFlow>

        {/* Legend Panel */}
        {legendOpen && (
          <div className="absolute bottom-4 left-4 w-80 bg-card/95 backdrop-blur border border-border shadow-lg rounded-lg overflow-hidden z-10 animate-in slide-in-from-left-5 duration-300">
            <div className="px-4 py-3 border-b border-border bg-secondary/10 flex justify-between items-center">
               <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Legend</h3>
               <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setLegendOpen(false)}>
                 <span className="sr-only">Close</span>
                 <span className="text-lg leading-none">×</span>
               </Button>
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
                  {LEGEND_DATA.map((item, i) => {
                    const isSelected = selectedCategories.includes(item.label);
                    return (
                      <tr key={i} className="hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => toggleCategory(item.label)}>
                        <td className="px-3 py-1.5">
                          <Checkbox 
                            checked={isSelected}
                            onCheckedChange={() => toggleCategory(item.label)}
                            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-muted-foreground/50"
                          />
                        </td>
                        <td className="px-2 py-1.5">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${item.color}`} />
                            <span className={cn("font-medium truncate max-w-[120px]", !isSelected && "text-muted-foreground line-through decoration-muted-foreground/50")}>{item.label}</span>
                          </div>
                        </td>
                        <td className={cn("px-3 py-1.5 text-right font-mono", isSelected ? "text-muted-foreground" : "text-muted-foreground/50")}>{item.count}</td>
                        <td className={cn("px-3 py-1.5 text-right font-mono", isSelected ? "text-muted-foreground" : "text-muted-foreground/50")}>{item.percent}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Node Details Panel (Floating) */}
        {selectedNode && (
          <div className="absolute top-20 right-4 w-80 bg-card/95 backdrop-blur border border-border shadow-xl rounded-lg overflow-hidden z-20 animate-in slide-in-from-right-10 duration-300">
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
      </div>
    </Layout>
  );
}
