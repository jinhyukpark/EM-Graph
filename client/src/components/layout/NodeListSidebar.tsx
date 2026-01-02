import { useState } from "react";
import { Search, Settings, Filter, MoreHorizontal, MapPin, Calendar, User, Briefcase, ArrowLeft, Network } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface NodeData {
  id: string;
  name: string;
  category: string;
  representative: string;
  location: string;
  years: number;
  description?: string;
  image?: string;
}

// Mock Data matching the screenshot style
export const MOCK_COMPANY_NODES: NodeData[] = [
  { id: "1", name: "Mind AI", category: "System Software Development", representative: "Yoo Tae-jun", location: "Seongnam-si", years: 13, image: "https://github.com/shadcn.png" },
  { id: "2", name: "Blocko", category: "System Software Development", representative: "Kim Won-beom", location: "Seongnam-si", years: 13 },
  { id: "3", name: "Snow", category: "App Software Development", representative: "Kim Chang-wook", location: "Seongnam-si", years: 11 },
  { id: "4", name: "Qpix", category: "System Software Development", representative: "Bae Seok-hoon", location: "Seongnam-si", years: 12 },
  { id: "5", name: "Life Lab", category: "System Software Development", representative: "Yeon Hyun-ju", location: "Seongnam-si", years: 11 },
  { id: "6", name: "Cloudike", category: "App Software Development", representative: "Lee Sun-woong", location: "Seongnam-si", years: 14 },
  { id: "7", name: "Carrot Games", category: "System Software Development", representative: "Kim Mi-sun", location: "Seongnam-si", years: 12 },
  { id: "8", name: "Wine Soft", category: "App Software Development", representative: "Lee Bong-gu", location: "Seongnam-si", years: 17 },
  { id: "9", name: "Inflearn", category: "System Software Development", representative: "Lee Hyung-ju", location: "Seongnam-si", years: 10 },
  { id: "10", name: "Exosystems", category: "App Software Development", representative: "Lee Hoo-man", location: "Seongnam-si", years: 10 },
];

interface NodeListSidebarProps {
  onNodeSelect?: (node: NodeData) => void;
  selectedNodeId?: string;
  selectedNode?: any;
}

export default function NodeListSidebar({ onNodeSelect, selectedNodeId, selectedNode }: NodeListSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [displayFields, setDisplayFields] = useState({
    category: true,
    representative: true,
    location: true,
    years: true,
    image: true
  });

  // If a node is selected (passed from parent), show detail view
  if (selectedNode) {
    const nodeData = selectedNode.data || selectedNode;
    const isGraphNode = !!selectedNode.data;
    
    // Normalize data for display
    const displayName = isGraphNode ? nodeData.label : nodeData.name;
    const displayType = isGraphNode ? nodeData.type : nodeData.category;
    const displaySub = isGraphNode ? nodeData.subLabel : nodeData.representative;
    const displayImage = isGraphNode ? nodeData.image : nodeData.image;
    
    return (
      <div className="flex flex-col h-full animate-in slide-in-from-left-5 duration-300">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
             <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2" onClick={() => onNodeSelect?.(null as any)}>
               <ArrowLeft className="w-4 h-4" />
             </Button>
             <h3 className="text-sm font-bold uppercase tracking-wider">Component Details</h3>
          </div>
          
          <div className="flex flex-col items-center text-center p-4 bg-secondary/20 rounded-lg border border-border/50">
             <Avatar className="h-20 w-20 mb-3 border-2 border-background shadow-md">
                <AvatarImage src={displayImage} />
                <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                  {displayName?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
             </Avatar>
             <h2 className="text-lg font-bold leading-tight mb-1">{displayName}</h2>
             <Badge variant="outline" className="mb-2 bg-background/50">{displayType}</Badge>
             {displaySub && <p className="text-sm text-muted-foreground">{displaySub}</p>}
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
           <div className="space-y-6">
              {/* Properties Section */}
              <div className="space-y-3">
                 <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                   <Settings className="w-3.5 h-3.5" /> Properties
                 </h4>
                 <div className="grid gap-2 text-sm bg-card rounded-md border p-3">
                    <div className="grid grid-cols-2 py-1 border-b border-border/50 pb-1">
                       <span className="text-muted-foreground">ID</span>
                       <span className="font-mono text-xs text-right">{selectedNode.id}</span>
                    </div>
                    <div className="grid grid-cols-2 py-1 border-b border-border/50 pb-1">
                       <span className="text-muted-foreground">Category</span>
                       <span className="text-right font-medium">{displayType}</span>
                    </div>
                    {isGraphNode && (
                      <>
                        <div className="grid grid-cols-2 py-1 border-b border-border/50 pb-1">
                           <span className="text-muted-foreground">Role</span>
                           <span className="text-right font-medium">{displaySub}</span>
                        </div>
                        <div className="grid grid-cols-2 py-1 pt-1">
                           <span className="text-muted-foreground">Status</span>
                           <span className="text-right text-emerald-500 font-medium">Active</span>
                        </div>
                      </>
                    )}
                    {!isGraphNode && (
                       <div className="grid grid-cols-2 py-1 pt-1">
                           <span className="text-muted-foreground">Location</span>
                           <span className="text-right">{nodeData.location}</span>
                       </div>
                    )}
                 </div>
              </div>

              {/* Connected Links (Mock for now) */}
              <div className="space-y-3">
                 <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                   <Network className="w-3.5 h-3.5" /> Connections
                 </h4>
                 <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                       <div key={i} className="flex items-center gap-3 p-2 rounded-md border bg-card/50 text-sm">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="flex-1">Linked to <span className="font-medium">Node-{Math.floor(Math.random() * 100)}</span></span>
                          <Badge variant="secondary" className="text-[10px] h-5">Strong</Badge>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="pt-4">
                 <Button className="w-full gap-2" variant="secondary">
                    <Filter className="w-4 h-4" /> Filter by this Node
                 </Button>
              </div>
           </div>
        </ScrollArea>
      </div>
    );
  }

  const filteredNodes = MOCK_COMPANY_NODES.filter(node => 
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-left-5 duration-300">
      {/* Search Header */}
      <div className="p-4 border-b border-border space-y-4">
        <div>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Corporate Search</h3>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input 
                placeholder="Enter company name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <Button size="icon" variant="outline" className="h-9 w-9 shrink-0">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <h3 className="font-bold text-sm">Related Companies</h3>
            <span className="text-xs font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
              {filteredNodes.length.toLocaleString()}
            </span>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Settings className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="end">
              <div className="space-y-2">
                <h4 className="font-medium text-xs text-muted-foreground uppercase mb-2">Display Options</h4>
                <div className="flex items-center space-x-2">
                  <Checkbox id="show-image" checked={displayFields.image} onCheckedChange={(c) => setDisplayFields(prev => ({...prev, image: !!c}))} />
                  <Label htmlFor="show-image" className="text-sm font-normal">Show Image</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="show-category" checked={displayFields.category} onCheckedChange={(c) => setDisplayFields(prev => ({...prev, category: !!c}))} />
                  <Label htmlFor="show-category" className="text-sm font-normal">Category</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="show-rep" checked={displayFields.representative} onCheckedChange={(c) => setDisplayFields(prev => ({...prev, representative: !!c}))} />
                  <Label htmlFor="show-rep" className="text-sm font-normal">Representative</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="show-loc" checked={displayFields.location} onCheckedChange={(c) => setDisplayFields(prev => ({...prev, location: !!c}))} />
                  <Label htmlFor="show-loc" className="text-sm font-normal">Location</Label>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* List Content */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredNodes.map((node) => (
            <div 
              key={node.id}
              onClick={() => onNodeSelect?.(node)}
              className={cn(
                "group flex gap-3 p-3 rounded-lg border border-transparent cursor-pointer transition-all hover:bg-secondary/50",
                selectedNodeId === node.id ? "bg-secondary border-primary/20 shadow-sm" : "border-border/0"
              )}
            >
              {displayFields.image && (
                <div className="shrink-0 mt-0.5">
                   {node.image ? (
                     <Avatar className="h-10 w-10 rounded-md border border-border">
                       <AvatarImage src={node.image} />
                       <AvatarFallback className="rounded-md bg-primary/5 text-primary text-xs font-bold">
                         {node.name.substring(0, 2).toUpperCase()}
                       </AvatarFallback>
                     </Avatar>
                   ) : (
                     <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center text-muted-foreground">
                        <Briefcase className="w-5 h-5 opacity-50" />
                     </div>
                   )}
                </div>
              )}
              
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between">
                  <h4 className={cn("font-semibold text-sm truncate", selectedNodeId === node.id ? "text-primary" : "text-foreground")}>
                    {node.name}
                  </h4>
                </div>
                
                {displayFields.category && (
                  <p className="text-xs text-muted-foreground truncate">
                    {node.category}
                  </p>
                )}
                
                <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground/80 mt-1.5">
                  {displayFields.representative && (
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 opacity-70" />
                      <span>{node.representative}</span>
                    </div>
                  )}
                  {displayFields.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 opacity-70" />
                      <span>{node.location}</span>
                    </div>
                  )}
                  {displayFields.years && (
                     <div className="flex items-center gap-1 pl-1 border-l border-border">
                       <span>{node.years}th year</span>
                     </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
