import { useCallback, useState } from 'react';
import { ReactFlow, useNodesState, useEdgesState, Background, Controls, Handle, Position, MarkerType, BackgroundVariant, Panel, OnSelectionChangeParams } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Activity, Layout, Sparkles, Workflow, ArrowLeftRight, Grid, FileText, X, Check, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Custom Table Node
const TableNode = ({ data, selected }: any) => {
  if (!data || !data.columns) {
    console.error("TableNode rendered with missing data:", data);
    return null;
  }
  return (
    <Card className={cn("w-56 shadow-md border-2 transition-all bg-card group", selected ? "border-primary ring-2 ring-primary/20" : "border-border")}>
      <CardHeader className="p-3 bg-muted/50 border-b flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground/80">{data.label}</CardTitle>
        <div className="w-2 h-2 rounded-full bg-primary/50" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
        {data.columns.map((col: string, i: number) => {
           const isHighlighted = data.highlightedFields?.includes(col);
           return (
            <div key={i} className={cn("flex items-center justify-between px-3 py-2 text-[11px] transition-colors", isHighlighted ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/30")}>
               <div className="flex items-center gap-2 text-foreground/70">
                   <div className={cn("w-1.5 h-1.5 rounded-full", isHighlighted ? "bg-primary" : "bg-slate-400")} />
                   {col}
               </div>
               <span className="text-[9px] text-muted-foreground font-mono">VARCHAR</span>
            </div>
          );
        })}
        </div>
      </CardContent>
      <Handle 
        type="target" 
        position={Position.Left} 
        className={cn(
            "w-3 h-3 bg-muted-foreground border-2 border-background transition-opacity", 
            data.isTarget ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )} 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className={cn(
            "w-3 h-3 bg-muted-foreground border-2 border-background transition-opacity", 
            data.isSource ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )} 
      />
    </Card>
  );
};

const nodeTypes = { tableNode: TableNode };

// Calculate initial connection status
const connectedSources = new Set<string>();
const connectedTargets = new Set<string>();

const INITIAL_EDGES = [
  { 
      id: 'e1-2', 
      source: 't1', 
      target: 't2', 
      label: 'Involved In', 
      type: 'step',
      style: { strokeWidth: 2, stroke: '#94a3b8' }, 
      markerEnd: { type: MarkerType.ArrowClosed },
      data: { sourceField: 'id', targetField: 'description' } // Mock relationship
  },
  { 
      id: 'e3-2', 
      source: 't3', 
      target: 't2', 
      label: 'Occurred At', 
      type: 'step',
      style: { strokeWidth: 2, stroke: '#94a3b8' }, 
      markerEnd: { type: MarkerType.ArrowClosed },
      data: { sourceField: 'loc_id', targetField: 'location_id' }
  },
  { 
      id: 'e2-4', 
      source: 't2', 
      target: 't4', 
      label: 'Yielded', 
      type: 'step',
      style: { strokeWidth: 2, stroke: '#94a3b8' }, 
      markerEnd: { type: MarkerType.ArrowClosed },
      data: { sourceField: 'incident_id', targetField: 'incident_id' }
  },
  { 
      id: 'e3-5', 
      source: 't3', 
      target: 't5', 
      label: 'Contains', 
      type: 'step',
      style: { strokeWidth: 2, stroke: '#94a3b8' }, 
      markerEnd: { type: MarkerType.ArrowClosed },
      data: { sourceField: 'loc_id', targetField: 'location_id' }
  },
];

// Populate connection sets
INITIAL_EDGES.forEach(e => {
    connectedSources.add(e.source);
    connectedTargets.add(e.target);
});

const INITIAL_NODES = [
  { 
      id: 't1', 
      type: 'tableNode', 
      position: { x: 100, y: 150 }, 
      data: { 
          label: 'Suspects_Profiles', 
          columns: ['id', 'full_name', 'alias', 'status', 'last_seen'],
          isSource: connectedSources.has('t1'),
          isTarget: connectedTargets.has('t1')
      } 
  },
  { 
      id: 't2', 
      type: 'tableNode', 
      position: { x: 500, y: 50 }, 
      data: { 
          label: 'Crime_Incidents_2024', 
          columns: ['incident_id', 'type', 'date_time', 'location_id', 'description'],
          isSource: connectedSources.has('t2'),
          isTarget: connectedTargets.has('t2')
      } 
  },
  { 
      id: 't3', 
      type: 'tableNode', 
      position: { x: 500, y: 350 }, 
      data: { 
          label: 'Location_Hotspots', 
          columns: ['loc_id', 'address', 'district', 'risk_level'],
          isSource: connectedSources.has('t3'),
          isTarget: connectedTargets.has('t3')
      } 
  },
  { 
      id: 't4', 
      type: 'tableNode', 
      position: { x: 900, y: 200 }, 
      data: { 
          label: 'Evidence_Log', 
          columns: ['evidence_id', 'incident_id', 'type', 'custody_chain'],
          isSource: connectedSources.has('t4'),
          isTarget: connectedTargets.has('t4')
      } 
  },
  { 
      id: 't5', 
      type: 'tableNode', 
      position: { x: 900, y: 400 }, 
      data: { 
          label: 'Supply_Chain_Nodes', 
          columns: ['node_id', 'location_id', 'operator', 'capacity'],
          isSource: connectedSources.has('t5'),
          isTarget: connectedTargets.has('t5')
      } 
  },
];

export default function ERDGraphView({ onNodeSelect }: { onNodeSelect: (nodeId: string | null) => void }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [edgeType, setEdgeType] = useState('step');
  const [showAIExplanation, setShowAIExplanation] = useState(false);

  // Helper to highlight edge and fields based on an edge ID
  const highlightConnection = useCallback((edgeId: string | null) => {
    if (edgeId === null) {
       // Reset
       setEdges((eds) => {
           // Only update if there are animated edges to clean up to avoid loop
           const needsUpdate = eds.some(e => (e as any).animated);
           if (!needsUpdate) return eds;
           
           return eds.map((e) => ({
             ...e,
             style: { stroke: '#94a3b8', strokeWidth: 2 },
             animated: false,
           }));
       });

       setNodes((nds) => {
           // Only update if there are highlighted fields to clean up
           const needsUpdate = nds.some(n => (n.data as any).highlightedFields && (n.data as any).highlightedFields.length > 0);
           if (!needsUpdate) return nds;

           return nds.map((n) => ({
             ...n,
             data: { ...n.data, highlightedFields: [] },
           }));
       });
       return;
    }

    setEdges((eds) =>
      eds.map((e) => {
        if (e.id === edgeId) {
           return { ...e, style: { ...e.style, stroke: '#3b82f6', strokeWidth: 3 }, animated: true };
        }
        return { ...e, style: { ...e.style, stroke: '#e2e8f0', strokeWidth: 1 }, animated: false };
      })
    );
    
    // Find the edge to get fields
    setEdges(eds => {
       const edge = eds.find(e => e.id === edgeId);
       if (edge && edge.data) {
          setNodes((nds) =>
            nds.map((n) => {
              if (n.id === edge.source) {
                return {
                  ...n,
                  data: { ...n.data, highlightedFields: [edge.data.sourceField] },
                };
              }
              if (n.id === edge.target) {
                return {
                  ...n,
                  data: { ...n.data, highlightedFields: [edge.data.targetField] },
                };
              }
              return { ...n, data: { ...n.data, highlightedFields: [] } };
            })
          );
       }
       return eds;
    });

  }, [setEdges, setNodes]);


  const onSelectionChange = useCallback(({ nodes: selectedNodes }: OnSelectionChangeParams) => {
    if (selectedNodes.length === 2) {
      // Check if there is an edge connecting these two nodes
      const sourceId = selectedNodes[0].id;
      const targetId = selectedNodes[1].id;
      
      const connectedEdge = edges.find(
        (e) => (e.source === sourceId && e.target === targetId) || (e.source === targetId && e.target === sourceId)
      );

      if (connectedEdge) {
        // Only highlight if not already highlighted
        if (!(connectedEdge as any).animated) {
            highlightConnection(connectedEdge.id);
        }
        return;
      }
    }
    
    // Only clear if no nodes selected
    if (selectedNodes.length === 0) {
       highlightConnection(null);
    }
  }, [edges, highlightConnection]);

  const onEdgeMouseEnter = useCallback(
    (_: React.MouseEvent, edge: any) => {
      if (!edge.data?.sourceField || !edge.data?.targetField) return;
      highlightConnection(edge.id);
    },
    [highlightConnection]
  );

  const onEdgeMouseLeave = useCallback(() => {
    // Only clear highlight if we don't have a selection that should keep it highlighted
    // But for simplicity, let's just clear it on mouse leave, assuming selection will re-trigger or user will re-select
    // A better way is to check if we are in a selection state.
    // However, hover usually overrides selection visualization temporarily or vice versa.
    // Let's allow hover to clear for now to avoid stuck states.
    highlightConnection(null);
  }, [highlightConnection]);

  const changeEdgeType = (type: string) => {
    setEdgeType(type);
    setEdges((eds) => eds.map(e => ({ ...e, type: type === 'default' ? undefined : type })));
  };

  const organizeLayout = () => {
    // Simple mock layout reorganization
    // In a real app, this would use dagre or elkjs
    const newNodes = [
       { id: 't1', position: { x: 50, y: 100 } },
       { id: 't2', position: { x: 400, y: 100 } },
       { id: 't4', position: { x: 750, y: 100 } },
       { id: 't3', position: { x: 400, y: 400 } },
       { id: 't5', position: { x: 750, y: 400 } },
    ];
    
    setNodes((nds) => 
      nds.map(n => {
        const newPos = newNodes.find(nn => nn.id === n.id);
        return newPos ? { ...n, position: newPos.position } : n;
      })
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50/50 dark:bg-slate-950/30">
      <div className="flex-1 relative w-full h-full overflow-hidden flex">
        <div className="flex-1 relative">
          <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onSelectionChange={onSelectionChange}
              onNodeDoubleClick={(_, node) => onNodeSelect(node.id)}
              onPaneClick={() => onNodeSelect(null)}
              onEdgeMouseEnter={onEdgeMouseEnter}
              onEdgeMouseLeave={onEdgeMouseLeave}
              fitView
              className="bg-grid-slate-200/50 dark:bg-grid-slate-800/20"
          >
              <Background gap={20} color="#cbd5e1" variant={BackgroundVariant.Dots} />
              <Controls />
              
              <Panel position="top-left" className="bg-background/80 backdrop-blur-md p-1.5 rounded-full border shadow-lg flex items-center gap-1.5">
              <TooltipProvider delayDuration={0}>
                  <DropdownMenu>
                      <Tooltip>
                      <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                              <Workflow className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                          </Button>
                          </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">Change Link Type ({edgeType})</TooltipContent>
                      </Tooltip>
                      
                      <DropdownMenuContent align="start" sideOffset={5}>
                          <DropdownMenuItem onClick={() => changeEdgeType('default')} className="text-xs gap-2">
                              {edgeType === 'default' && <Check className="w-3 h-3" />}
                              <span className={edgeType !== 'default' ? 'pl-5' : ''}>Bezier (Default)</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => changeEdgeType('straight')} className="text-xs gap-2">
                              {edgeType === 'straight' && <Check className="w-3 h-3" />}
                              <span className={edgeType !== 'straight' ? 'pl-5' : ''}>Straight</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => changeEdgeType('step')} className="text-xs gap-2">
                              {edgeType === 'step' && <Check className="w-3 h-3" />}
                              <span className={edgeType !== 'step' ? 'pl-5' : ''}>Step (Orthogonal)</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => changeEdgeType('smoothstep')} className="text-xs gap-2">
                              {edgeType === 'smoothstep' && <Check className="w-3 h-3" />}
                              <span className={edgeType !== 'smoothstep' ? 'pl-5' : ''}>Smooth Step</span>
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />

                  <Tooltip>
                  <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" onClick={organizeLayout}>
                      <Layout className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                      </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">Organize Layout</TooltipContent>
                  </Tooltip>

                  <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />

                  <Tooltip>
                  <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className={cn("h-9 w-9 rounded-full transition-all", showAIExplanation ? "bg-indigo-600 text-white shadow-indigo-200" : "bg-indigo-50/50 text-indigo-600 hover:bg-indigo-100")} onClick={() => setShowAIExplanation(!showAIExplanation)}>
                      <Sparkles className="h-4 w-4" />
                      </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">AI Schema Explanation</TooltipContent>
                  </Tooltip>
              </TooltipProvider>
              </Panel>

              <Panel position="top-right" className="m-6">
                <Card className="w-72 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-2 border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden animate-in fade-in slide-in-from-right-6 duration-500">
                  <div className="h-1.5 bg-indigo-500/80" />
                  <CardHeader className="p-4 pb-2 flex flex-row items-center gap-3 space-y-0">
                    <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40">
                      <AlertTriangle className="w-4 h-4 text-indigo-500" />
                    </div>
                    <CardTitle className="text-sm font-bold">Mode Info</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 space-y-4">
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      Currently in <span className="text-indigo-600 dark:text-indigo-400 font-bold">Limited Functionality Mode</span>. Simple modifications available.
                    </p>
                    <Button variant="default" size="sm" className="w-full text-xs h-8 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100 dark:shadow-none transition-all group rounded-lg">
                      Go to DB Settings
                      <ArrowLeftRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Panel>
          </ReactFlow>
        </div>

        {/* Side Analysis Panel */}
        <div className={cn(
          "h-full bg-background border-l border-border transition-all duration-300 ease-in-out overflow-hidden flex flex-col shadow-2xl z-50",
          showAIExplanation ? "w-80 opacity-100" : "w-0 opacity-0"
        )}>
          <div className="p-4 border-b flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm">AI Schema Analysis</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setShowAIExplanation(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
            <section className="space-y-3">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Entity Statistics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 transition-all hover:border-indigo-200">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Node Tables</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-indigo-600 italic">5</span>
                    <span className="text-[10px] text-muted-foreground font-medium underline decoration-indigo-200 decoration-2 underline-offset-2">entities</span>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 transition-all hover:border-indigo-200">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Link Edges</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-indigo-600 italic">4</span>
                    <span className="text-[10px] text-muted-foreground font-medium underline decoration-indigo-200 decoration-2 underline-offset-2">relationships</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Relationship Overview</h3>
              <p className="text-sm text-foreground/80 leading-relaxed bg-indigo-50/30 dark:bg-indigo-950/10 p-3 rounded-lg border border-indigo-100/50 dark:border-indigo-900/30">
                The schema connects criminal profiles with incidents and evidence. The central hub is <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded border font-mono">Crime_Incidents_2024</code>, which links suspects, locations, and evidence together.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Key Data Flow</h3>
              <div className="space-y-2">
                {[
                  { title: "Suspects", desc: "Linked to incidents via 'Involved In'" },
                  { title: "Incidents", desc: "Occur at 'Location_Hotspots'" },
                  { title: "Evidence", desc: "Yielded from incident sites" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-start group">
                    <div className="w-1 h-1 rounded-full bg-indigo-400 mt-2 group-hover:scale-150 transition-transform" />
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold">{item.title}</div>
                      <div className="text-[11px] text-muted-foreground">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Supply Chain Context</h3>
              <p className="text-sm text-foreground/80 leading-relaxed italic bg-muted/20 p-3 rounded-lg border border-dashed">
                Locations also contain "Supply_Chain_Nodes", suggesting a possible correlation between logistics hubs and high-risk activity areas.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Schema Definitions</h3>
              <div className="space-y-3">
                <div className="p-3 bg-indigo-50/20 dark:bg-indigo-950/10 rounded-lg border border-indigo-100/50 space-y-1">
                  <div className="text-xs font-bold flex items-center gap-2 text-indigo-600">
                    <Grid className="w-3 h-3" />
                    Node Tables
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Primary entities representing actors (Suspects), locations, and physical assets. Each node acts as a central point for property data.
                  </p>
                </div>
                <div className="p-3 bg-indigo-50/20 dark:bg-indigo-950/10 rounded-lg border border-indigo-100/50 space-y-1">
                  <div className="text-xs font-bold flex items-center gap-2 text-indigo-600">
                    <Workflow className="w-3 h-3" />
                    Link Relationships
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Connective logic defining how entities interact (e.g., "Involved In", "Occurred At"). These are the "Links" that map the crime network.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="p-4 border-t bg-muted/10">
            <Button size="sm" className="w-full gap-2" variant="outline" onClick={() => setShowAIExplanation(false)}>
              <Check className="w-3 h-3" />
              Acknowledge Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}