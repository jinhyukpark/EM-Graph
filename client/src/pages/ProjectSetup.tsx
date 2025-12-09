import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, addEdge, Connection, Edge, MarkerType, Node, BackgroundVariant } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, Database, Settings2, Save, GripVertical, Trash2, Sliders } from "lucide-react";
import { MOCK_FIELDS } from "@/lib/mockData";

// Custom Node Component for the Schema Builder
function SchemaNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 rounded-lg bg-card border-2 border-primary/50 shadow-md min-w-[180px]">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-1.5 rounded bg-primary/10 text-primary">
          {data.icon && <data.icon className="w-4 h-4" />}
        </div>
        <div className="font-semibold text-sm">{data.label}</div>
      </div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
        {data.type} Field
      </div>
      {data.isPrimary && (
        <div className="mt-2 text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full w-fit font-medium">
          Primary Key
        </div>
      )}
    </div>
  );
}

const nodeTypes = { schema: SchemaNode };

export default function ProjectSetup() {
  const [_, setLocation] = useLocation();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedField, setSelectedField] = useState<any>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: 'hsl(var(--primary))' }, markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--primary))' } }, eds)),
    [setEdges],
  );

  const handleDragStart = (event: React.DragEvent, field: any) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(field));
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const data = JSON.parse(event.dataTransfer.getData("application/reactflow"));
      
      // Get bounds for relative positioning
      const reactFlowBounds = document.querySelector(".react-flow")?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 25,
      };

      const newNode: Node = {
        id: `${data.id}-${nodes.length + 1}`,
        type: 'schema',
        position,
        data: { label: data.name, type: data.type, icon: MOCK_FIELDS.crime.find(f => f.id === data.id)?.icon || Database },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes],
  );

  const handleSave = () => {
    setLocation("/project/new/view");
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-64px)] flex overflow-hidden">
        {/* Left Sidebar: Data Source & Fields */}
        <div className="w-80 border-r border-border bg-card flex flex-col z-20">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" />
              Data Sources
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Drag fields to canvas to define nodes</p>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Imported Data</h3>
                <div className="space-y-2">
                  {MOCK_FIELDS.crime.map((field) => (
                    <div
                      key={field.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, field)}
                      className="p-3 rounded-md bg-secondary/50 border border-border hover:border-primary/50 cursor-grab active:cursor-grabbing flex items-center gap-3 transition-colors group hover:bg-secondary"
                    >
                      <div className="text-muted-foreground group-hover:text-primary transition-colors">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{field.name}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{field.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 relative bg-background/50">
          <div className="absolute top-4 left-4 z-10 bg-card/90 backdrop-blur p-2 rounded-md border border-border shadow-sm">
             <h3 className="text-sm font-medium">Schema Builder</h3>
             <p className="text-xs text-muted-foreground">Define Node & Edge Logic</p>
          </div>
          
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            className="bg-background"
          >
            <Background color="hsl(var(--foreground))" gap={20} size={1} variant={BackgroundVariant.Dots} className="opacity-10" />
            <Controls className="!bg-card !border-border !fill-foreground !shadow-sm" />
          </ReactFlow>
        </div>

        {/* Right Sidebar: Configuration */}
        <div className="w-80 border-l border-border bg-card flex flex-col z-20">
           <div className="p-4 border-b border-border flex justify-between items-center">
            <h2 className="font-semibold flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-primary" />
              Configuration
            </h2>
            <Button size="sm" onClick={handleSave} className="h-8 gap-1 text-xs">
              <Save className="w-3 h-3" />
              Save & View
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {/* Global Graph Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium border-b border-border pb-2">Node Appearance</h3>
                
                <div className="space-y-3">
                  <Label className="text-xs">Default Node Size</Label>
                  <Slider defaultValue={[33]} max={100} step={1} className="[&_.range-slider-thumb]:border-primary" />
                </div>

                 <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Dynamic Sizing</Label>
                    <Switch />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Scale nodes based on connection count (degree centrality).</p>
                </div>
              </div>

              <div className="space-y-4">
                 <h3 className="text-sm font-medium border-b border-border pb-2">Filtering Rules</h3>
                 <div className="space-y-3">
                    <Label className="text-xs">Visible Filters</Label>
                    <div className="flex flex-wrap gap-2">
                      {['Date Range', 'Category', 'Severity'].map(tag => (
                        <div key={tag} className="px-2 py-1 rounded-md bg-primary/10 border border-primary/20 text-[10px] text-primary flex items-center gap-1">
                          {tag}
                          <button className="hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      ))}
                      <Button variant="outline" size="icon" className="h-6 w-6 rounded-full">
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                 </div>
              </div>

              <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                <div className="flex items-center gap-2 text-accent mb-1">
                  <Sliders className="w-4 h-4" />
                  <span className="text-xs font-bold">AI Recommendations</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Nexus suggests using "Location" as the primary clustering key for this dataset.
                </p>
                <Button variant="link" className="h-auto p-0 text-[10px] text-accent mt-2">Apply Recommendation</Button>
              </div>

            </div>
          </ScrollArea>
        </div>
      </div>
    </Layout>
  );
}

import { Plus } from "lucide-react";
