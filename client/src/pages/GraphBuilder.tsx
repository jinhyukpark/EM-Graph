import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Database, Network, ArrowRight, Plus, GripVertical, Trash2, Circle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TableSelect } from "@/components/common";
import { COLUMN_OPTIONS, FIELD_OPTIONS, SIZE_METRIC_OPTIONS, COLOR_METRIC_OPTIONS } from "@/constants";
import { generateId, removeItemById } from "@/lib/arrayUtils";

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

export default function GraphBuilder() {
  const [links, setLinks] = useState<Link[]>([
    { id: "1", sourceTable: "crime_incidents_2024", sourceColumn: "suspect_id", targetTable: "suspect_profiles", targetColumn: "id" }
  ]);

  const [nodes, setNodes] = useState<NodeConfig[]>([
    { id: "1", table: "crime_incidents_2024", labelField: "type", sizeField: "severity", colorField: "severity", icon: "Circle" },
    { id: "2", table: "suspect_profiles", labelField: "name", sizeField: "age", colorField: "age", icon: "User" }
  ]);

  const addLink = () => {
    setLinks([...links, {
      id: generateId(),
      sourceTable: "",
      sourceColumn: "",
      targetTable: "",
      targetColumn: ""
    }]);
  };

  const removeLink = (id: string) => {
    setLinks(removeItemById(links, id));
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background">
        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-8 overflow-y-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Network className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold">Graph Builder</h1>
            </div>
            <p className="text-muted-foreground">Define relationships between your data tables to generate graph structures.</p>
          </div>

          <div className="space-y-6">
            {/* Node Definitions Section */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3 border-b border-border/50 bg-secondary/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Circle className="w-4 h-4 text-muted-foreground" />
                    <CardTitle className="text-base font-semibold">Node Configuration</CardTitle>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 gap-1">
                    <Plus className="w-3 h-3" /> Add Node
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  {nodes.map((node) => (
                    <div key={node.id} className="grid grid-cols-12 gap-4 items-end border p-4 rounded-lg bg-card/50">
                      <div className="col-span-3 space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">Table Source</Label>
                        <TableSelect defaultValue={node.table} />
                      </div>

                      <div className="col-span-8 grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-muted-foreground">Label Field</Label>
                          <Select defaultValue={node.labelField}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Field" />
                            </SelectTrigger>
                            <SelectContent>
                              {FIELD_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-muted-foreground">Size Metric</Label>
                          <Select defaultValue={node.sizeField}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Metric" />
                            </SelectTrigger>
                            <SelectContent>
                              {SIZE_METRIC_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-muted-foreground">Color Metric</Label>
                          <Select defaultValue={node.colorField}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Metric" />
                            </SelectTrigger>
                            <SelectContent>
                              {COLOR_METRIC_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="col-span-1 flex justify-end">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
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
                  <h3 className="font-semibold flex items-center gap-2">
                    <Database className="w-4 h-4 text-muted-foreground" />
                    Data Links
                  </h3>
                  <Button size="sm" onClick={addLink} className="gap-1 bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4" /> Add Link
                  </Button>
               </div>

               <div className="p-6 space-y-3 bg-secondary/5 min-h-[200px]">
                 {links.map((link) => (
                   <div key={link.id} className="flex items-center p-4 rounded-lg border border-border bg-white shadow-sm">
                      <div className="mr-4 text-muted-foreground/30">
                         <GripVertical className="w-4 h-4" />
                      </div>

                      <div className="flex-1 flex items-center gap-4">
                         {/* Source Group */}
                         <div className="flex-1">
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1">Source</div>
                            <div className="flex gap-2">
                               <TableSelect defaultValue={link.sourceTable} />
                               <Select defaultValue={link.sourceColumn}>
                                 <SelectTrigger className="bg-background"><SelectValue placeholder="Column" /></SelectTrigger>
                                 <SelectContent>
                                   {COLUMN_OPTIONS.map((option) => (
                                     <SelectItem key={option.value} value={option.value}>
                                       {option.label}
                                     </SelectItem>
                                   ))}
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
                               <TableSelect defaultValue={link.targetTable} />
                               <Select defaultValue={link.targetColumn}>
                                 <SelectTrigger className="bg-background"><SelectValue placeholder="Column" /></SelectTrigger>
                                 <SelectContent>
                                   {COLUMN_OPTIONS.map((option) => (
                                     <SelectItem key={option.value} value={option.value}>
                                       {option.label}
                                     </SelectItem>
                                   ))}
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
                   <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-lg bg-background/50">
                      <Network className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p>No links defined. Add a link to connect your data.</p>
                   </div>
                 )}
               </div>
            </Card>

            <div className="flex justify-end gap-3 pt-4">
               <Button variant="outline" size="lg">Reset</Button>
               <Button size="lg" className="bg-black hover:bg-black/90 text-white px-8">Generate Graph</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
