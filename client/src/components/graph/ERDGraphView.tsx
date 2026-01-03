import { useCallback, useState } from 'react';
import { ReactFlow, useNodesState, useEdgesState, Background, Controls, Handle, Position, MarkerType, BackgroundVariant, Panel, OnSelectionChangeParams } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Activity, Layout, Sparkles, Workflow, ArrowLeftRight, Grid, FileText, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Custom Table Node
const TableNode = ({ data, selected }: any) => {
  if (!data || !data.columns) {
    console.error("TableNode rendered with missing data:", data);
    return null;
  }
  return (
    <Card className={cn("w-56 shadow-md border-2 transition-all bg-card", selected ? "border-primary ring-2 ring-primary/20" : "border-border")}>
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
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-muted-foreground border-2 border-background" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-muted-foreground border-2 border-background" />
    </Card>
  );
};

const nodeTypes = { tableNode: TableNode };

const INITIAL_NODES = [
  { 
      id: 't1', 
      type: 'tableNode', 
      position: { x: 100, y: 150 }, 
      data: { label: 'Suspects_Profiles', columns: ['id', 'full_name', 'alias', 'status', 'last_seen'] } 
  },
  { 
      id: 't2', 
      type: 'tableNode', 
      position: { x: 500, y: 50 }, 
      data: { label: 'Crime_Incidents_2024', columns: ['incident_id', 'type', 'date_time', 'location_id', 'description'] } 
  },
  { 
      id: 't3', 
      type: 'tableNode', 
      position: { x: 500, y: 350 }, 
      data: { label: 'Location_Hotspots', columns: ['loc_id', 'address', 'district', 'risk_level'] } 
  },
  { 
      id: 't4', 
      type: 'tableNode', 
      position: { x: 900, y: 200 }, 
      data: { label: 'Evidence_Log', columns: ['evidence_id', 'incident_id', 'type', 'custody_chain'] } 
  },
  { 
      id: 't5', 
      type: 'tableNode', 
      position: { x: 900, y: 400 }, 
      data: { label: 'Supply_Chain_Nodes', columns: ['node_id', 'location_id', 'operator', 'capacity'] } 
  },
];

const INITIAL_EDGES = [
  { 
      id: 'e1-2', 
      source: 't1', 
      target: 't2', 
      label: 'Involved In', 
      style: { strokeWidth: 2, stroke: '#94a3b8' }, 
      markerEnd: { type: MarkerType.ArrowClosed },
      data: { sourceField: 'id', targetField: 'description' } // Mock relationship
  },
  { 
      id: 'e3-2', 
      source: 't3', 
      target: 't2', 
      label: 'Occurred At', 
      style: { strokeWidth: 2, stroke: '#94a3b8' }, 
      markerEnd: { type: MarkerType.ArrowClosed },
      data: { sourceField: 'loc_id', targetField: 'location_id' }
  },
  { 
      id: 'e2-4', 
      source: 't2', 
      target: 't4', 
      label: 'Yielded', 
      style: { strokeWidth: 2, stroke: '#94a3b8' }, 
      markerEnd: { type: MarkerType.ArrowClosed },
      data: { sourceField: 'incident_id', targetField: 'incident_id' }
  },
  { 
      id: 'e3-5', 
      source: 't3', 
      target: 't5', 
      label: 'Contains', 
      style: { strokeWidth: 2, stroke: '#94a3b8' }, 
      markerEnd: { type: MarkerType.ArrowClosed },
      data: { sourceField: 'loc_id', targetField: 'location_id' }
  },
];

export default function ERDGraphView({ onNodeSelect }: { onNodeSelect: (nodeId: string | null) => void }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [edgeType, setEdgeType] = useState('default');
  const [showAIExplanation, setShowAIExplanation] = useState(false);

  // Helper to highlight edge and fields based on an edge ID
  const highlightConnection = useCallback((edgeId: string | null) => {
    if (!edgeId) {
       // Reset
       setEdges((eds) =>
         eds.map((e) => ({
           ...e,
           style: { stroke: '#94a3b8', strokeWidth: 2 },
           animated: false,
         }))
       );
       setNodes((nds) =>
         nds.map((n) => ({
           ...n,
           data: { ...n.data, highlightedFields: [] },
         }))
       );
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
        highlightConnection(connectedEdge.id);
        return;
      }
    }
    
    // If we are not selecting exactly two connected nodes, and not hovering (handled separately), 
    // we might want to reset, OR just do nothing and let hover handle it.
    // For now, if selection is cleared or invalid for highlighting, we reset ONLY IF NOT HOVERING.
    // But since this event fires on selection, let's reset if selection count is not 2.
    // This is a simple implementation.
    
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
    highlightConnection(null);
  }, [highlightConnection]);

  const toggleEdgeType = () => {
    const types = ['default', 'straight', 'step', 'smoothstep'];
    const nextIndex = (types.indexOf(edgeType) + 1) % types.length;
    const nextType = types[nextIndex];
    setEdgeType(nextType);
    
    setEdges((eds) => eds.map(e => ({ ...e, type: nextType === 'default' ? undefined : nextType })));
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
    <div className="w-full h-full bg-slate-50/50 dark:bg-slate-950/30">
      <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm border rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
        ERD Schema View
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDoubleClick={(_, node) => onNodeSelect(node.id)}
        onPaneClick={() => onNodeSelect(null)}
        onEdgeMouseEnter={onEdgeMouseEnter}
        onEdgeMouseLeave={onEdgeMouseLeave}
        fitView
        className="bg-grid-slate-200/50 dark:bg-grid-slate-800/20"
      >
        <Background gap={20} color="#cbd5e1" variant={BackgroundVariant.Dots} />
        <Controls />
        <Panel position="top-right" className="bg-background/90 backdrop-blur-sm p-1.5 rounded-lg border shadow-sm flex gap-1.5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={toggleEdgeType}>
                  <Workflow className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Change Link Type ({edgeType})</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={organizeLayout}>
                  <Layout className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Organize Layout</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-950" onClick={() => setShowAIExplanation(true)}>
                  <Sparkles className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>AI Schema Explanation</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Panel>
      </ReactFlow>

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
