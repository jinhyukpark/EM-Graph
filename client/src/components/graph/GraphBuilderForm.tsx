import { useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Database, Network, ArrowRight, X, Plus, GripVertical, Trash2, Settings, Circle, Info, Table as TableIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Link {
  id: string;
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
}

interface NodeConfig {
  id: string;
  table: string;
  labelField: string;
  sizeField: string;
  colorField: string;
  icon: string;
}

function DraggableNodeItem({ node, onRemove }: { node: NodeConfig; onRemove: (id: string) => void }) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={node}
      dragListener={false}
      dragControls={dragControls}
      className="grid grid-cols-12 gap-4 items-end border p-4 rounded-lg bg-card/50"
      whileDrag={{ scale: 1.02, boxShadow: "0 8px 25px rgba(0,0,0,0.12)", zIndex: 50 }}
      transition={{ duration: 0.2 }}
    >
      <div className="col-span-1 flex items-center justify-center pb-1">
        <div
          className="text-muted-foreground/40 cursor-grab active:cursor-grabbing hover:text-muted-foreground/70 transition-colors"
          onPointerDown={(e) => dragControls.start(e)}
          data-testid={`drag-handle-node-${node.id}`}
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>
      <div className="col-span-3 space-y-2">
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
      
      <div className="col-span-7">
        <div className="space-y-2">
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
      </div>

      <div className="col-span-1 flex justify-end pb-1">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => onRemove(node.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
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
      className="flex items-center p-4 rounded-lg border border-border bg-slate-50/50 shadow-sm"
      whileDrag={{ scale: 1.02, boxShadow: "0 8px 25px rgba(0,0,0,0.12)", zIndex: 50 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="mr-4 text-muted-foreground/30 cursor-grab active:cursor-grabbing hover:text-muted-foreground/60 transition-colors"
        onPointerDown={(e) => dragControls.start(e)}
        data-testid={`drag-handle-link-${link.id}`}
      >
        <GripVertical className="w-4 h-4" />
      </div>
      
      <div className="flex-1 flex items-center gap-4">
        <div className="flex-1">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1">Source</div>
          <div className="flex gap-2">
            <Select defaultValue={link.sourceTable}>
              <SelectTrigger className="bg-white h-9"><SelectValue placeholder="Select Table" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="crime_incidents_2024">crime_incidents_2024</SelectItem>
                <SelectItem value="suspect_profiles">suspect_profiles</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue={link.sourceColumn}>
              <SelectTrigger className="bg-white h-9"><SelectValue placeholder="Column" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="id">id</SelectItem>
                <SelectItem value="suspect_id">suspect_id</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-5 text-muted-foreground">
          <ArrowRight className="w-4 h-4" />
        </div>

        <div className="flex-1">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1">Target</div>
          <div className="flex gap-2">
            <Select defaultValue={link.targetTable}>
              <SelectTrigger className="bg-white h-9"><SelectValue placeholder="Select Table" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="crime_incidents_2024">crime_incidents_2024</SelectItem>
                <SelectItem value="suspect_profiles">suspect_profiles</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue={link.targetColumn}>
              <SelectTrigger className="bg-white h-9"><SelectValue placeholder="Column" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="id">id</SelectItem>
                <SelectItem value="suspect_id">suspect_id</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="ml-4 pt-5">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => onRemove(link.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Reorder.Item>
  );
}

export default function GraphBuilderForm() {
  const [links, setLinks] = useState<Link[]>([
    { id: "1", sourceTable: "crime_incidents_2024", sourceColumn: "suspect_id", targetTable: "suspect_profiles", targetColumn: "id" }
  ]);

  const [nodes, setNodes] = useState<NodeConfig[]>([
    { id: "1", table: "crime_incidents_2024", labelField: "type", sizeField: "severity", colorField: "severity", icon: "Circle" },
    { id: "2", table: "suspect_profiles", labelField: "name", sizeField: "age", colorField: "age", icon: "User" }
  ]);

  const addLink = () => {
    setLinks([...links, { 
      id: Date.now().toString(), 
      sourceTable: "", 
      sourceColumn: "", 
      targetTable: "", 
      targetColumn: "" 
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
      sizeField: "", 
      colorField: "", 
      icon: "Circle" 
    }]);
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
  };

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

      <div className="flex justify-end gap-3 pt-4 pb-10">
         <Button variant="outline" size="lg" className="h-10">Reset</Button>
         <Button size="lg" className="bg-black hover:bg-black/90 text-white px-8 h-10">Generate Graph</Button>
      </div>
    </div>
  );
}
