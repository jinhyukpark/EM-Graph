import { useCallback } from 'react';
import { ReactFlow, useNodesState, useEdgesState, Background, Controls, Handle, Position, MarkerType, BackgroundVariant } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Custom Table Node
const TableNode = ({ data, selected }: any) => {
  return (
    <Card className={cn("w-56 shadow-md border-2 transition-all bg-card", selected ? "border-primary ring-2 ring-primary/20" : "border-border")}>
      <CardHeader className="p-3 bg-muted/50 border-b flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground/80">{data.label}</CardTitle>
        <div className="w-2 h-2 rounded-full bg-primary/50" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
        {data.columns.map((col: string, i: number) => (
          <div key={i} className="flex items-center justify-between px-3 py-2 text-[11px] hover:bg-muted/30 transition-colors">
             <div className="flex items-center gap-2 text-foreground/70">
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                 {col}
             </div>
             <span className="text-[9px] text-muted-foreground font-mono">VARCHAR</span>
          </div>
        ))}
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
  { id: 'e1-2', source: 't1', target: 't2', label: 'Involved In', style: { strokeWidth: 2, stroke: '#94a3b8' }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e3-2', source: 't3', target: 't2', label: 'Occurred At', style: { strokeWidth: 2, stroke: '#94a3b8' }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e2-4', source: 't2', target: 't4', label: 'Yielded', style: { strokeWidth: 2, stroke: '#94a3b8' }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e3-5', source: 't3', target: 't5', label: 'Contains', style: { strokeWidth: 2, stroke: '#94a3b8' }, markerEnd: { type: MarkerType.ArrowClosed } },
];

export default function ERDGraphView({ onNodeSelect }: { onNodeSelect: (nodeId: string | null) => void }) {
  const [nodes, , onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, , onEdgesChange] = useEdgesState(INITIAL_EDGES);

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
        fitView
        className="bg-grid-slate-200/50 dark:bg-grid-slate-800/20"
      >
        <Background gap={20} color="#cbd5e1" variant={BackgroundVariant.Dots} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
