import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Database, Network, ArrowRight, X, Plus, GripVertical, Trash2, Settings, Circle, Info } from "lucide-react";
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

  return (
    <div className="flex-1 flex flex-col w-full h-full overflow-hidden bg-secondary/5">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                <Network className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold">Graph Builder</h1>
            </div>
            <p className="text-sm text-muted-foreground">Define relationships between your data tables to generate graph structures.</p>
          </div>

          <div className="space-y-6">
            {/* Node Definitions Section */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3 border-b border-border/50 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Circle className="w-4 h-4 text-muted-foreground" />
                    <CardTitle className="text-sm font-semibold">Node Configuration</CardTitle>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 gap-1 text-xs">
                    <Plus className="w-3 h-3" /> Add Node
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <div className="grid gap-6">
                  {nodes.map((node, index) => (
                    <div key={node.id} className="grid grid-cols-12 gap-4 items-end border p-4 rounded-lg bg-card/50">
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
                      
                      <div className="col-span-8 grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-muted-foreground">Label Field</Label>
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
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-muted-foreground">Size Metric</Label>
                          <Select defaultValue={node.sizeField}>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select Metric" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="severity">severity</SelectItem>
                              <SelectItem value="age">age</SelectItem>
                              <SelectItem value="none">None (Fixed)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-muted-foreground">Color Metric</Label>
                          <Select defaultValue={node.colorField}>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select Metric" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="severity">severity</SelectItem>
                              <SelectItem value="status">status</SelectItem>
                              <SelectItem value="age">age</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="col-span-1 flex justify-end pb-1">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Link Definitions Section */}
            <Card className="border-border shadow-sm overflow-hidden">
               <div className="p-4 border-b border-border bg-white flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2 text-sm">
                    <Database className="w-4 h-4 text-muted-foreground" />
                    Data Links
                  </h3>
                  <Button size="sm" onClick={addLink} className="gap-1 bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-xs">
                    <Plus className="w-3 h-3" /> Add Link
                  </Button>
               </div>
               
               <div className="p-6 space-y-3 bg-white min-h-[200px]">
                 {links.map((link, index) => (
                   <div key={link.id} className="flex items-center p-4 rounded-lg border border-border bg-slate-50/50 shadow-sm">
                      <div className="mr-4 text-muted-foreground/30 cursor-grab active:cursor-grabbing">
                         <GripVertical className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1 flex items-center gap-4">
                         {/* Source Group */}
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

                         {/* Target Group */}
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
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => removeLink(link.id)}>
                           <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                   </div>
                 ))}

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
        </div>
      </div>
    </div>
  );
}
