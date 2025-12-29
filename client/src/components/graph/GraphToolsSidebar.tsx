import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  BarChart3, 
  Settings2, 
  Filter, 
  Share2, 
  Network, 
  Maximize2,
  ZoomIn,
  Move,
  Layers,
  CircleDot
} from "lucide-react";

export default function GraphToolsSidebar({ className }: { className?: string }) {
  return (
    <div className={`w-80 border-l border-border bg-card/50 backdrop-blur-sm flex flex-col h-full ${className}`}>
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Settings2 className="w-4 h-4" />
          Graph Tools
        </h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          
          {/* Statistics Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5" /> Statistics
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-secondary/30 p-2 rounded border border-border/50">
                <div className="text-[10px] text-muted-foreground">Nodes</div>
                <div className="text-lg font-mono font-bold">24</div>
              </div>
              <div className="bg-secondary/30 p-2 rounded border border-border/50">
                <div className="text-[10px] text-muted-foreground">Edges</div>
                <div className="text-lg font-mono font-bold">48</div>
              </div>
              <div className="bg-secondary/30 p-2 rounded border border-border/50">
                <div className="text-[10px] text-muted-foreground">Density</div>
                <div className="text-lg font-mono font-bold">0.18</div>
              </div>
              <div className="bg-secondary/30 p-2 rounded border border-border/50">
                <div className="text-[10px] text-muted-foreground">Modularity</div>
                <div className="text-lg font-mono font-bold">0.42</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Node Sizing & Styling */}
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

              <div className="flex items-center justify-between">
                <Label className="text-xs">Show Labels</Label>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <Separator />

          {/* Clustering */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Network className="w-3.5 h-3.5" /> Clustering
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
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" size="sm" className="w-full text-xs h-8">
                Run Clustering
              </Button>
            </div>
          </div>

          <Separator />

          {/* Filters */}
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
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                     <Switch id="filter-person" defaultChecked className="scale-75" />
                     <Label htmlFor="filter-person" className="text-xs font-normal">Person</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                     <Switch id="filter-org" defaultChecked className="scale-75" />
                     <Label htmlFor="filter-org" className="text-xs font-normal">Organization</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                     <Switch id="filter-loc" defaultChecked className="scale-75" />
                     <Label htmlFor="filter-loc" className="text-xs font-normal">Location</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                     <Switch id="filter-event" defaultChecked className="scale-75" />
                     <Label htmlFor="filter-event" className="text-xs font-normal">Event</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </ScrollArea>
    </div>
  );
}
