import { useState, useMemo } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Database, Network, ArrowRight, Plus, GripVertical, Trash2, Table as TableIcon, Eye, Image, MapPin, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  ReactFlow,
  Background,
  Handle,
  Position,
  type Node as FlowNode,
  type Edge as FlowEdge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface Link {
  id: string;
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
  labelField: string;
  weightField: string;
}

interface NodeConfig {
  id: string;
  table: string;
  labelField: string;
  imageField: string;
  latitudeField: string;
  longitudeField: string;
  sizeField: string;
  colorField: string;
  icon: string;
}

const nodeColors: Record<string, { bg: string; border: string; text: string }> = {
  "crime_incidents_2024": { bg: "#EEF2FF", border: "#818CF8", text: "#4338CA" },
  "suspect_profiles": { bg: "#F0FDF4", border: "#4ADE80", text: "#15803D" },
  "location_hotspots": { bg: "#FFF7ED", border: "#FB923C", text: "#C2410C" },
  "supply_chain_nodes": { bg: "#FDF2F8", border: "#F472B6", text: "#BE185D" },
};

const defaultColor = { bg: "#F8FAFC", border: "#94A3B8", text: "#475569" };

function CircleNode({ data }: { data: { label: string; field: string; color: { bg: string; border: string; text: string } } }) {
  return (
    <div
      className="flex items-center justify-center text-center"
      style={{
        width: 110,
        height: 110,
        borderRadius: "50%",
        background: data.color.bg,
        border: `3px solid ${data.color.border}`,
        boxShadow: `0 4px 12px ${data.color.border}30`,
      }}
    >
      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0 !w-0 !h-0" />
      <div className="px-2">
        <div className="text-[10px] font-bold leading-tight" style={{ color: data.color.text }}>
          {data.label}
        </div>
        {data.field && (
          <div className="text-[8px] mt-0.5 opacity-60 font-medium" style={{ color: data.color.text }}>
            {data.field}
          </div>
        )}
      </div>
    </div>
  );
}

const previewNodeTypes = { circle: CircleNode };

function DraggableNodeItem({ node, onRemove }: { node: NodeConfig; onRemove: (id: string) => void }) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={node}
      dragListener={false}
      dragControls={dragControls}
      className="border p-4 rounded-lg bg-card/50"
      whileDrag={{ scale: 1.02, boxShadow: "0 8px 25px rgba(0,0,0,0.12)", zIndex: 50 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center h-9 mt-[22px]">
          <div
            className="text-muted-foreground/40 cursor-grab active:cursor-grabbing hover:text-muted-foreground/70 transition-colors"
            onPointerDown={(e) => dragControls.start(e)}
            data-testid={`drag-handle-node-${node.id}`}
          >
            <GripVertical className="w-4 h-4" />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-[1fr_1fr_auto_1fr_1fr_1fr] gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Table Source</Label>
            <Select defaultValue={node.table}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select Table" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="crime_incidents_2024">crime_incidents_2024</SelectItem>
                <SelectItem value="suspect_profiles">suspect_profiles</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Node Field</Label>
            <Select defaultValue={node.labelField}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select Field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="type">type</SelectItem>
                <SelectItem value="name">name</SelectItem>
                <SelectItem value="id">id</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center h-9 mt-[22px]">
            <div className="w-px h-8 bg-border"></div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Image Field</Label>
            <Select defaultValue={node.imageField}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="photo_url">photo_url</SelectItem>
                <SelectItem value="image">image</SelectItem>
                <SelectItem value="thumbnail">thumbnail</SelectItem>
                <SelectItem value="avatar">avatar</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Latitude</Label>
            <Select defaultValue={node.latitudeField}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="latitude">latitude</SelectItem>
                <SelectItem value="lat">lat</SelectItem>
                <SelectItem value="y">y</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Longitude</Label>
            <Select defaultValue={node.longitudeField}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="longitude">longitude</SelectItem>
                <SelectItem value="lng">lng</SelectItem>
                <SelectItem value="x">x</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center h-9 mt-[22px]">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => onRemove(node.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Reorder.Item>
  );
}

function DraggableLinkItem({ link, onRemove }: { link: Link; onRemove: (id: string) => void }) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={link}
      dragListener={false}
      dragControls={dragControls}
      className="p-4 rounded-lg border border-border bg-slate-50/50 shadow-sm"
      whileDrag={{ scale: 1.02, boxShadow: "0 8px 25px rgba(0,0,0,0.12)", zIndex: 50 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center h-9 mt-[22px]">
          <div
            className="text-muted-foreground/30 cursor-grab active:cursor-grabbing hover:text-muted-foreground/60 transition-colors"
            onPointerDown={(e) => dragControls.start(e)}
            data-testid={`drag-handle-link-${link.id}`}
          >
            <GripVertical className="w-4 h-4" />
          </div>
        </div>
        
        <div className="flex-1 grid grid-cols-[1fr_1fr_auto_1fr_1fr_auto_1fr_1fr] gap-3 items-end">
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Source Table</div>
            <Select defaultValue={link.sourceTable}>
              <SelectTrigger className="bg-white h-9"><SelectValue placeholder="Table" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="crime_incidents_2024">crime_incidents_2024</SelectItem>
                <SelectItem value="suspect_profiles">suspect_profiles</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Source Column</div>
            <Select defaultValue={link.sourceColumn}>
              <SelectTrigger className="bg-white h-9"><SelectValue placeholder="Column" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="id">id</SelectItem>
                <SelectItem value="suspect_id">suspect_id</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center h-9 text-muted-foreground">
            <ArrowRight className="w-4 h-4" />
          </div>

          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Target Table</div>
            <Select defaultValue={link.targetTable}>
              <SelectTrigger className="bg-white h-9"><SelectValue placeholder="Table" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="crime_incidents_2024">crime_incidents_2024</SelectItem>
                <SelectItem value="suspect_profiles">suspect_profiles</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Target Column</div>
            <Select defaultValue={link.targetColumn}>
              <SelectTrigger className="bg-white h-9"><SelectValue placeholder="Column" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="id">id</SelectItem>
                <SelectItem value="suspect_id">suspect_id</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center h-9">
            <div className="w-px h-8 bg-border"></div>
          </div>

          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Label</div>
            <Select defaultValue={link.labelField}>
              <SelectTrigger className="bg-white h-9"><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="type">type</SelectItem>
                <SelectItem value="relationship">relationship</SelectItem>
                <SelectItem value="status">status</SelectItem>
                <SelectItem value="category">category</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Weight</div>
            <Select defaultValue={link.weightField}>
              <SelectTrigger className="bg-white h-9"><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="weight">weight</SelectItem>
                <SelectItem value="severity">severity</SelectItem>
                <SelectItem value="count">count</SelectItem>
                <SelectItem value="score">score</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center h-9 mt-[22px]">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => onRemove(link.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Reorder.Item>
  );
}

export default function GraphBuilderForm() {
  const [links, setLinks] = useState<Link[]>([
    { id: "1", sourceTable: "crime_incidents_2024", sourceColumn: "suspect_id", targetTable: "suspect_profiles", targetColumn: "id", labelField: "none", weightField: "none" }
  ]);

  const [nodes, setNodes] = useState<NodeConfig[]>([
    { id: "1", table: "crime_incidents_2024", labelField: "type", imageField: "none", latitudeField: "none", longitudeField: "none", sizeField: "severity", colorField: "severity", icon: "Circle" },
    { id: "2", table: "suspect_profiles", labelField: "name", imageField: "none", latitudeField: "none", longitudeField: "none", sizeField: "age", colorField: "age", icon: "User" }
  ]);


  const addLink = () => {
    setLinks([...links, { 
      id: Date.now().toString(), 
      sourceTable: "", 
      sourceColumn: "", 
      targetTable: "", 
      targetColumn: "",
      labelField: "none",
      weightField: "none"
    }]);
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const addNode = () => {
    setNodes([...nodes, { 
      id: Date.now().toString(), 
      table: "", 
      labelField: "", 
      imageField: "none",
      latitudeField: "none",
      longitudeField: "none",
      sizeField: "", 
      colorField: "", 
      icon: "Circle" 
    }]);
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
  };

  const { flowNodes, flowEdges } = useMemo(() => {
    const validNodes = nodes.filter(n => n.table);
    const tableToNodeId = new Map<string, string>();
    validNodes.forEach(n => {
      if (!tableToNodeId.has(n.table)) {
        tableToNodeId.set(n.table, n.id);
      }
    });

    const uniqueTables = Array.from(tableToNodeId.keys());
    const spacing = 250;
    const startX = 50;
    const centerY = 80;

    const fNodes: FlowNode[] = uniqueTables.map((table, i) => {
      const nodeConfig = validNodes.find(n => n.table === table);
      const color = nodeColors[table] || defaultColor;
      return {
        id: tableToNodeId.get(table)!,
        type: "circle",
        position: {
          x: startX + i * spacing,
          y: centerY,
        },
        data: {
          label: table,
          field: nodeConfig?.labelField || "",
          color,
        },
      };
    });

    const fEdges: FlowEdge[] = links
      .filter(l => l.sourceTable && l.targetTable && tableToNodeId.has(l.sourceTable) && tableToNodeId.has(l.targetTable))
      .map((l, idx) => ({
        id: `edge-${l.id}`,
        source: tableToNodeId.get(l.sourceTable)!,
        target: tableToNodeId.get(l.targetTable)!,
        sourceHandle: null,
        targetHandle: null,
        label: `${l.sourceColumn} → ${l.targetColumn}`,
        labelStyle: { fontSize: 10, fill: "#64748B", fontWeight: 500 },
        labelBgStyle: { fill: "#FFFFFF", fillOpacity: 0.95 },
        labelBgPadding: [8, 4] as [number, number],
        labelBgBorderRadius: 6,
        style: { stroke: "#334155", strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#334155", width: 18, height: 18 },
        type: "default",
      }));

    return { flowNodes: fNodes, flowEdges: fEdges };
  }, [nodes, links]);

  return (
    <div className="space-y-6 pb-20">
      <Card className="border-none shadow-sm overflow-hidden">
        <div className="bg-indigo-600/5 px-6 py-4 border-b border-indigo-100/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
              <TableIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-tight">Node Configuration</h3>
              <p className="text-[10px] text-indigo-600/70 font-medium">Select source tables and display fields</p>
            </div>
          </div>
          <Button size="sm" onClick={addNode} className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm">
            <Plus className="w-3.5 h-3.5" />
            Add Node
          </Button>
        </div>
        <CardContent className="p-6">
          <Reorder.Group axis="y" values={nodes} onReorder={setNodes} className="space-y-4">
            {nodes.map((node) => (
              <DraggableNodeItem key={node.id} node={node} onRemove={removeNode} />
            ))}
          </Reorder.Group>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm overflow-hidden">
         <div className="bg-indigo-600/5 px-6 py-4 border-b border-indigo-100/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-tight">Data Links</h3>
                <p className="text-[10px] text-indigo-600/70 font-medium">Define connections between source tables</p>
              </div>
            </div>
            <Button size="sm" onClick={addLink} className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm">
              <Plus className="w-3.5 h-3.5" />
              Add Link
            </Button>
         </div>
         
         <div className="p-6 bg-white min-h-[200px]">
           <Reorder.Group axis="y" values={links} onReorder={setLinks} className="space-y-3">
             {links.map((link) => (
               <DraggableLinkItem key={link.id} link={link} onRemove={removeLink} />
             ))}
           </Reorder.Group>

           {links.length === 0 && (
             <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-lg bg-slate-50/50">
                <Network className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No links defined. Add a link to connect your data.</p>
             </div>
           )}
         </div>
      </Card>

      {flowNodes.length > 0 && (
        <Card className="border-none shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Graph Preview</h3>
              <span className="text-[10px] text-slate-400 font-medium ml-2">
                {flowNodes.length} node{flowNodes.length !== 1 ? "s" : ""} · {flowEdges.length} link{flowEdges.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <div className="bg-white h-[280px]" data-testid="graph-preview">
            <ReactFlow
              key="default-preview"
              nodes={flowNodes}
              edges={flowEdges}
              nodeTypes={previewNodeTypes}
              fitView
              fitViewOptions={{ padding: 0.5 }}
              proOptions={{ hideAttribution: true }}
              nodesDraggable={true}
              nodesConnectable={false}
              elementsSelectable={false}
              panOnDrag={true}
              zoomOnScroll={true}
              minZoom={0.3}
              maxZoom={2}
            >
              <Background color="#E2E8F0" gap={20} size={1} />
            </ReactFlow>
          </div>
        </Card>
      )}

      <div className="flex justify-end gap-3 pt-4 pb-10">
         <Button variant="outline" size="lg" className="h-10">Reset</Button>
         <Button size="lg" className="bg-black hover:bg-black/90 text-white px-8 h-10">Generate Graph</Button>
      </div>
    </div>
  );
}
