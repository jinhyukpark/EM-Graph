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
      <div className="w-full bg-slate-100/80 border-b border-slate-200 px-4 py-2 text-xs text-slate-600 flex items-center justify-between backdrop-blur-sm z-50">
         <div className="flex items-center">
            <AlertTriangle className="w-3.5 h-3.5 mr-2 text-slate-500" />
            <span>Limited Functionality Mode: Only simple data modification and relationship analysis are available.</span>
         </div>
         <Button variant="ghost" size="sm" className="h-6 text-xs text-primary hover:text-primary/80 hover:bg-primary/5 px-2 gap-1">
            Go to Data Menu
            <ArrowLeftRight className="w-3 h-3 ml-0.5" />
         </Button>
      </div>
      
      <div className="flex-1 relative w-full h-full">
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
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-indigo-50/50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 transition-all" onClick={() => setShowAIExplanation(true)}>
                    <Sparkles className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">AI Schema Explanation</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            </Panel>
        </ReactFlow>
      </div>

      <Dialog open={showAIExplanation} onOpenChange={setShowAIExplanation}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-indigo-600">
               <Sparkles className="h-5 w-5" />
               AI Schema Analysis
            </DialogTitle>
            <DialogDescription>
              Analysis of the current entity relationships and data flow.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="bg-muted/30 p-4 rounded-lg text-sm leading-relaxed border space-y-3">
                <p>
                  <strong className="text-foreground">Relationship Overview:</strong><br/>
                  The schema connects criminal profiles with incidents and evidence. The central hub is <code className="text-xs bg-muted px-1 py-0.5 rounded border">Crime_Incidents_2024</code>, which links suspects, locations, and evidence together.
                </p>
                <p>
                  <strong className="text-foreground">Key Data Flow:</strong><br/>
                  Suspects are linked to incidents via "Involved In". Incidents occur at specific "Location_Hotspots" and yield items in the "Evidence_Log".
                </p>
                <p>
                  <strong className="text-foreground">Supply Chain Context:</strong><br/>
                  Locations also contain "Supply_Chain_Nodes", suggesting a possible correlation between logistics hubs and high-risk activity areas.
                </p>
             </div>
             <div className="flex justify-end">
                <Button size="sm" onClick={() => setShowAIExplanation(false)}>Close Analysis</Button>
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
