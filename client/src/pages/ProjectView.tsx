import { useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import NodeListSidebar, { MOCK_COMPANY_NODES } from "@/components/layout/NodeListSidebar";
import ImageNode from "@/components/graph/ImageNode";
import { ReactFlow, Background, Controls, useNodesState, useEdgesState, MiniMap, BackgroundVariant, NodeTypes } from "@xyflow/react";
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

// Define custom node types
const nodeTypes: NodeTypes = {
  imageNode: ImageNode,
};

// Radial Layout Helper
const createRadialLayout = () => {
  const center = { x: 0, y: 0 };
  const radius1 = 250;
  const radius2 = 450;
  
  // Central Hubs
  const nodes = [
    { 
      id: 'center-1', 
      type: 'imageNode',
      position: { x: 0, y: 0 }, 
      data: { label: 'K-Sports Foundation', type: 'Foundation', image: 'https://github.com/shadcn.png', highlight: true, borderColor: '#8b5cf6' },
      style: { width: 80, height: 80 }
    },
    { 
      id: 'center-2', 
      type: 'imageNode',
      position: { x: 0, y: 150 }, 
      data: { label: 'Mir Foundation', type: 'Foundation', image: 'https://github.com/shadcn.png', highlight: true, borderColor: '#8b5cf6' },
      style: { width: 80, height: 80 }
    }
  ];

  // Inner Circle Entities (Companies)
  const innerEntities = [
    { label: 'Samsung Group', sub: '7.9B Won', color: '#3b82f6' },
    { label: 'Hyundai Motor', sub: '4.8B Won', color: '#22c55e' },
    { label: 'SK Group', sub: '4.3B Won', color: '#ef4444' },
    { label: 'LG Group', sub: '3.0B Won', color: '#ec4899' },
    { label: 'Lotte Group', sub: '1.5B Won', color: '#eab308' },
    { label: 'POSCO', sub: '1.9B Won', color: '#06b6d4' },
    { label: 'KT', sub: '1.1B Won', color: '#f97316' },
    { label: 'CJ Group', sub: '0.8B Won', color: '#8b5cf6' },
  ];

  innerEntities.forEach((entity, i) => {
    const angle = (i / innerEntities.length) * 2 * Math.PI;
    nodes.push({
      id: `c1-${i}`,
      type: 'imageNode',
      position: {
        x: center.x + radius1 * Math.cos(angle),
        y: center.y + radius1 * Math.sin(angle)
      },
      data: { 
        label: entity.label, 
        subLabel: entity.sub,
        type: 'Corporation',
        borderColor: entity.color 
      },
      style: { width: 60, height: 60 }
    });
  });

  // Outer Circle Entities (People/Gov)
  const outerEntities = [
    { label: 'President Park', sub: 'Impeached', type: 'Government', image: 'https://github.com/shadcn.png' },
    { label: 'Choi Soon-sil', sub: 'Key Suspect', type: 'Suspect', image: 'https://github.com/shadcn.png' },
    { label: 'An Chong-bum', sub: 'Policy Advisor', type: 'Government', image: 'https://github.com/shadcn.png' },
    { label: 'Cha Eun-taek', sub: 'Director', type: 'Suspect', image: 'https://github.com/shadcn.png' },
    { label: 'Lee Jae-yong', sub: 'Samsung Vice', type: 'Suspect', image: 'https://github.com/shadcn.png' },
    { label: 'Blue House', sub: 'Government', type: 'Location' },
    { label: 'FKI', sub: 'Federation', type: 'Organization' },
  ];

  outerEntities.forEach((entity, i) => {
    // Place them in specific spots or distribute
    const angle = (i / outerEntities.length) * 2 * Math.PI + (Math.PI / 4); // Offset
    nodes.push({
      id: `c2-${i}`,
      type: 'imageNode',
      position: {
        x: center.x + radius2 * Math.cos(angle),
        y: center.y + radius2 * Math.sin(angle)
      },
      data: { 
        label: entity.label, 
        subLabel: entity.sub,
        type: entity.type,
        image: entity.image,
        borderColor: entity.type === 'Suspect' ? '#ef4444' : '#64748b'
      },
      style: { width: 70, height: 70 }
    });
  });

  return nodes;
};

const INITIAL_NODES = createRadialLayout();

const INITIAL_EDGES = [
  // Links to Center 1 (K-Sports)
  { id: 'e-c1-0', source: 'c1-0', target: 'center-1', label: 'Funding', type: 'straight', style: { stroke: '#3b82f6', strokeWidth: 2 } },
  { id: 'e-c1-1', source: 'c1-1', target: 'center-1', type: 'straight', style: { stroke: '#22c55e', strokeWidth: 1.5 } },
  { id: 'e-c1-2', source: 'c1-2', target: 'center-1', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 1.5 } },
  { id: 'e-c1-6', source: 'c1-6', target: 'center-1', type: 'straight', style: { stroke: '#f97316', strokeWidth: 1.5 } },

  // Links to Center 2 (Mir)
  { id: 'e-c1-3', source: 'c1-3', target: 'center-2', type: 'straight', style: { stroke: '#ec4899', strokeWidth: 1.5 } },
  { id: 'e-c1-4', source: 'c1-4', target: 'center-2', type: 'straight', style: { stroke: '#eab308', strokeWidth: 1.5 } },
  { id: 'e-c1-5', source: 'c1-5', target: 'center-2', type: 'straight', style: { stroke: '#06b6d4', strokeWidth: 1.5 } },
  { id: 'e-c1-7', source: 'c1-7', target: 'center-2', type: 'straight', style: { stroke: '#8b5cf6', strokeWidth: 1.5 } },

  // Center connection
  { id: 'e-centers', source: 'center-1', target: 'center-2', type: 'straight', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 4, strokeDasharray: '5,5' } },

  // Outer Connections (People to Centers/Companies)
  { id: 'e-p-1', source: 'c2-1', target: 'center-1', label: 'Control', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '4' } }, // Choi to K-Sports
  { id: 'e-p-2', source: 'c2-1', target: 'center-2', label: 'Control', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '4' } }, // Choi to Mir
  
  { id: 'e-p-0', source: 'c2-0', target: 'c2-1', label: 'Associate', type: 'straight', style: { stroke: '#64748b', strokeWidth: 1 } }, // Park to Choi
  { id: 'e-p-2-0', source: 'c2-2', target: 'c2-0', label: 'Advisor', type: 'straight', style: { stroke: '#64748b', strokeWidth: 1 } }, // An to Park
  
  { id: 'e-sam-lee', source: 'c1-0', target: 'c2-4', type: 'straight', style: { stroke: '#3b82f6', strokeWidth: 2 } }, // Samsung to Lee Jae-yong
  
  { id: 'e-bh', source: 'c2-5', target: 'c2-0', type: 'straight', style: { stroke: '#64748b', strokeWidth: 1 } }, // Blue House to Park
  { id: 'e-fki', source: 'c2-6', target: 'center-2', label: 'Support', type: 'straight', style: { stroke: '#eab308', strokeWidth: 1 } }, // FKI to Mir
];

// Mock Legend Data
const LEGEND_DATA = [
  { label: "Foundation", color: "bg-violet-500", count: 2, percent: "10%" },
  { label: "Corporation", color: "bg-blue-500", count: 8, percent: "40%" },
  { label: "Suspect", color: "bg-red-500", count: 3, percent: "15%" },
  { label: "Government", color: "bg-slate-500", count: 3, percent: "15%" },
];

export default function ProjectView() {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [legendOpen, setLegendOpen] = useState(true);
  const [sidebarMode, setSidebarMode] = useState<"nav" | "list">("nav");
  
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

  return (
    <Layout sidebar={sidebarMode === "list" ? <NodeListSidebar onNodeSelect={handleSidebarNodeSelect} selectedNodeId={selectedNode?.id} /> : undefined}>
      <div className="relative h-[calc(100vh-64px)] bg-background">
        
        {/* Toolbar Overlay */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between pointer-events-none">
          <div className="flex gap-2 pointer-events-auto">
            {/* Sidebar Toggle */}
            <div className="bg-card/90 backdrop-blur border border-border p-1 rounded-md flex items-center shadow-sm">
               <div className="flex items-center gap-1 bg-secondary/20 rounded p-0.5">
                  <Button 
                    variant={sidebarMode === "nav" ? "secondary" : "ghost"} 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={() => setSidebarMode("nav")}
                    title="Project Navigation"
                  >
                    <LayoutTemplate className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant={sidebarMode === "list" ? "secondary" : "ghost"} 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={() => setSidebarMode("list")}
                    title="Node List View"
                  >
                    <List className="w-4 h-4" />
                  </Button>
               </div>
            </div>

            <div className="bg-card/90 backdrop-blur border border-border p-1 rounded-md flex items-center shadow-sm ml-2">
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
          fitView
          className="bg-background"
          minZoom={0.5}
          maxZoom={2}
        >
          <Background color="hsl(var(--foreground))" gap={30} size={1} variant={BackgroundVariant.Dots} className="opacity-10" />
          <Controls className="!bg-card !border-border !fill-foreground !shadow-md" />
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
          <div className="absolute bottom-4 left-4 w-64 bg-card/95 backdrop-blur border border-border shadow-lg rounded-lg overflow-hidden z-10 animate-in slide-in-from-left-5 duration-300">
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
                    <th className="px-3 py-2 text-left font-medium w-6"></th>
                    <th className="px-2 py-2 text-left font-medium">Category</th>
                    <th className="px-3 py-2 text-right font-medium">Count</th>
                    <th className="px-3 py-2 text-right font-medium">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {LEGEND_DATA.map((item, i) => (
                    <tr key={i} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-3 py-1.5">
                        <div className={`w-3 h-3 rounded border border-muted-foreground/30 flex items-center justify-center cursor-pointer`}>
                          {/* Simulated Checkbox */}
                        </div>
                      </td>
                      <td className="px-2 py-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${item.color}`} />
                          <span className="font-medium truncate max-w-[100px]">{item.label}</span>
                        </div>
                      </td>
                      <td className="px-3 py-1.5 text-right text-muted-foreground">{item.count}</td>
                      <td className="px-3 py-1.5 text-right text-muted-foreground">{item.percent}</td>
                    </tr>
                  ))}
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
