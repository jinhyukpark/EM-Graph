import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Settings2, 
  Filter, 
  Maximize2,
  Network,
  FileText,
  Box,
  Sliders,
  CircleDot,
  X
} from "lucide-react";

export default function GraphToolsSidebar({ className, stats }: { className?: string, stats?: { nodes: number, edges: number, types: number, density: string } }) {
  const [activeTab, setActiveTab] = useState<"view" | "settings" | "sizing" | "filters" | "report" | null>(null);

  const toggleTab = (tab: "view" | "settings" | "sizing" | "filters" | "report") => {
    if (activeTab === tab) {
      setActiveTab(null);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className={cn("relative flex h-full z-40", className)}>
      
      {/* Content Panel (Flyout) */}
      <div 
        className={cn(
          "absolute top-0 right-full h-full w-80 bg-card/95 backdrop-blur-md border-l border-y border-border shadow-2xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col",
          activeTab ? "translate-x-0 opacity-100 mr-2 rounded-l-xl my-2 max-h-[calc(100%-16px)]" : "translate-x-10 opacity-0 pointer-events-none"
        )}
      >
        <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-secondary/10 shrink-0">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            {activeTab === "view" && <><Box className="w-4 h-4" /> View Options</>}
            {activeTab === "settings" && <><Sliders className="w-4 h-4" /> General Settings</>}
            {activeTab === "sizing" && <><CircleDot className="w-4 h-4" /> Node Sizing</>}
            {activeTab === "filters" && <><Filter className="w-4 h-4" /> Graph Filters</>}
            {activeTab === "report" && <><FileText className="w-4 h-4" /> Analysis Report</>}
          </h3>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setActiveTab(null)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            
            {/* View / Clustering Tab */}
            {activeTab === "view" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Network className="w-3.5 h-3.5" /> Layout & Clustering
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Auto-Clustering</Label>
                      <Switch />
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs">Algorithm</Label>
                      <Select defaultValue="louvain">
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select algorithm" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="louvain">Louvain</SelectItem>
                          <SelectItem value="leiden">Leiden</SelectItem>
                          <SelectItem value="kmeans">K-Means</SelectItem>
                          <SelectItem value="force">Force Atlas 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button variant="outline" size="sm" className="w-full text-xs h-8">
                      Run Layout
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <Box className="w-3.5 h-3.5" /> View Mode
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="text-xs justify-start h-8 px-2 bg-primary/10 border-primary/20 text-primary">
                            2D View
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs justify-start h-8 px-2">
                            3D View
                        </Button>
                    </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <Settings2 className="w-3.5 h-3.5" /> Display Settings
                    </h4>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs">Show Node Labels</Label>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label className="text-xs">Show Edge Labels</Label>
                            <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label className="text-xs">Curved Edges</Label>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label className="text-xs">Particles Effect</Label>
                            <Switch defaultChecked />
                        </div>
                    </div>
                </div>
              </div>
            )}

            {/* Node Sizing Tab */}
            {activeTab === "sizing" && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Maximize2 className="w-3.5 h-3.5" /> Node Styling
                </h4>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Sizing Method</Label>
                    <Select defaultValue="degree">
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Size</SelectItem>
                        <SelectItem value="degree">Degree Centrality</SelectItem>
                        <SelectItem value="pagerank">PageRank</SelectItem>
                        <SelectItem value="betweenness">Betweenness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <Label className="text-xs">Base Size</Label>
                      <span className="text-xs text-muted-foreground">45px</span>
                    </div>
                    <Slider defaultValue={[45]} max={100} step={1} className="py-1" />
                  </div>
                </div>
              </div>
            )}

            {/* Filters Tab */}
            {activeTab === "filters" && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5" /> Filters
                </h4>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <Label className="text-xs">Min Degree</Label>
                      <span className="text-xs text-muted-foreground">1</span>
                    </div>
                    <Slider defaultValue={[1]} max={20} step={1} className="py-1" />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Edge Weight Threshold</Label>
                    <Slider defaultValue={[0.2]} max={1} step={0.1} className="py-1" />
                  </div>

                  <div className="pt-2">
                    <Label className="text-xs mb-2 block">Visible Types</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                         <Label htmlFor="filter-person" className="text-xs font-normal">Person</Label>
                         <Switch id="filter-person" defaultChecked className="scale-75" />
                      </div>
                      <div className="flex items-center justify-between">
                         <Label htmlFor="filter-org" className="text-xs font-normal">Organization</Label>
                         <Switch id="filter-org" defaultChecked className="scale-75" />
                      </div>
                      <div className="flex items-center justify-between">
                         <Label htmlFor="filter-loc" className="text-xs font-normal">Location</Label>
                         <Switch id="filter-loc" defaultChecked className="scale-75" />
                      </div>
                      <div className="flex items-center justify-between">
                         <Label htmlFor="filter-event" className="text-xs font-normal">Event</Label>
                         <Switch id="filter-event" defaultChecked className="scale-75" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Report Tab */}
            {activeTab === "report" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5" /> Statistics
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-secondary/30 p-2 rounded border border-border/50">
                    <div className="text-[10px] text-muted-foreground">Nodes</div>
                    <div className="text-lg font-mono font-bold">{stats?.nodes ?? 0}</div>
                  </div>
                  <div className="bg-secondary/30 p-2 rounded border border-border/50">
                    <div className="text-[10px] text-muted-foreground">Edges</div>
                    <div className="text-lg font-mono font-bold">{stats?.edges ?? 0}</div>
                  </div>
                  <div className="bg-secondary/30 p-2 rounded border border-border/50">
                    <div className="text-[10px] text-muted-foreground">Node Types</div>
                    <div className="text-lg font-mono font-bold">{stats?.types ?? 0}</div>
                  </div>
                  <div className="bg-secondary/30 p-2 rounded border border-border/50">
                    <div className="text-[10px] text-muted-foreground">Density</div>
                    <div className="text-lg font-mono font-bold">{stats?.density ?? "0.00"}</div>
                  </div>
                </div>

                <Separator className="my-4" />

                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-3">
                    <FileText className="w-3.5 h-3.5" /> Export Report
                </h4>
                <Button className="w-full" size="sm" variant="outline">
                    Download PDF Report
                </Button>
                <Button className="w-full mt-2" size="sm" variant="outline">
                    Export CSV Data
                </Button>
              </div>
            )}

          </div>
        </ScrollArea>
      </div>

      {/* Icon Navigation Rail (Always Visible) */}
      <div className="w-14 border-l border-border flex flex-col items-center py-4 gap-4 bg-card/80 backdrop-blur-sm z-20">
        <NavIcon 
          icon={<Box className="w-5 h-5" />} 
          label="View Type" 
          isActive={activeTab === "view"} 
          onClick={() => toggleTab("view")} 
        />
        <NavIcon 
          icon={<Sliders className="w-5 h-5" />} 
          label="Settings" 
          isActive={activeTab === "settings"} 
          onClick={() => toggleTab("settings")} 
        />
        <NavIcon 
          icon={<CircleDot className="w-5 h-5" />} 
          label="Node Sizing" 
          isActive={activeTab === "sizing"} 
          onClick={() => toggleTab("sizing")} 
        />
        <NavIcon 
          icon={<Filter className="w-5 h-5" />} 
          label="Filters" 
          isActive={activeTab === "filters"} 
          onClick={() => toggleTab("filters")} 
        />
        <NavIcon 
          icon={<FileText className="w-5 h-5" />} 
          label="Report" 
          isActive={activeTab === "report"} 
          onClick={() => toggleTab("report")} 
        />
      </div>
    </div>
  );
}

function NavIcon({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <div className="relative group flex justify-center w-full">
      <button 
        onClick={onClick}
        className={cn(
          "p-2.5 rounded-xl transition-all duration-200 hover:bg-primary/10 hover:text-primary",
          isActive 
            ? "bg-primary text-primary-foreground shadow-md hover:bg-primary hover:text-primary-foreground" 
            : "text-muted-foreground"
        )}
      >
        {icon}
      </button>
      <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2 py-1 bg-popover text-popover-foreground text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md border border-border">
        {label}
        <div className="absolute top-1/2 right-[-4px] -translate-y-1/2 border-4 border-transparent border-l-popover"></div>
      </div>
    </div>
  )
}
