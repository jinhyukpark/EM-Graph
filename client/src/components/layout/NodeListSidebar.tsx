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
  { id: "1", name: "Kang Min-su", category: "Suspect", representative: "Male, 35", location: "Seoul", years: 2 },
  { id: "2", name: "Kim Ji-hyun", category: "Victim", representative: "Female, 28", location: "Busan", years: 0 },
  { id: "3", name: "Park Dong-wook", category: "Suspect", representative: "Male, 42", location: "Incheon", years: 5 },
  { id: "4", name: "Gangnam Station Exit 4", category: "Location", representative: "Public Area", location: "Seoul", years: 0 },
  { id: "5", name: "Stolen Vehicle (12ga 3456)", category: "Evidence", representative: "Hyundai Sonata", location: "Gyeonggi-do", years: 0 },
  { id: "6", name: "Lee Sang-ho", category: "Witness", representative: "Male, 31", location: "Seoul", years: 0 },
  { id: "7", name: "Choi Yu-jin", category: "Victim", representative: "Female, 24", location: "Seoul", years: 0 },
  { id: "8", name: "Incheon Port Warehouse", category: "Location", representative: "Industrial Zone", location: "Incheon", years: 10 },
  { id: "9", name: "Burner Phone (Samsung)", category: "Evidence", representative: "Galaxy A12", location: "Seongnam-si", years: 1 },
  { id: "10", name: "Jung Tae-soo", category: "Suspect", representative: "Male, 39", location: "Unknown", years: 8 },
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
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Network Search</h3>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input 
                placeholder="Enter entity name..." 
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
            <h3 className="font-bold text-sm">Related Entities</h3>
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
                "group rounded-md border cursor-pointer transition-all hover:shadow-sm overflow-hidden",
                selectedNodeId === node.id ? "bg-secondary/20 border-primary/50 ring-1 ring-primary/20" : "bg-card border-border hover:border-primary/30"
              )}
            >
              <div className="grid grid-cols-[60px_1fr] text-sm">
                 {/* Row 1: ID */}
                 <div className="bg-muted/30 px-2.5 py-1.5 border-b border-r border-border/60 text-[11px] font-medium text-muted-foreground flex items-center">
                   ID
                 </div>
                 <div className="px-2.5 py-1.5 border-b border-border/60 font-mono text-[11px] text-muted-foreground flex items-center bg-background/50">
                   #{node.id}
                 </div>

                 {/* Row 2: Type */}
                 <div className="bg-muted/30 px-2.5 py-1.5 border-b border-r border-border/60 text-[11px] font-medium text-muted-foreground flex items-center">
                   Type
                 </div>
                 <div className="px-2.5 py-1.5 border-b border-border/60 text-[11px] font-medium text-foreground/80 flex items-center bg-background/50">
                   {node.category}
                 </div>

                 {/* Row 3: Name */}
                 <div className="bg-muted/30 px-2.5 py-1.5 border-b border-r border-border/60 text-[11px] font-medium text-muted-foreground flex items-center">
                   Name
                 </div>
                 <div className={cn(
                   "px-2.5 py-1.5 border-b border-border/60 text-xs font-bold flex items-center bg-background/50",
                   selectedNodeId === node.id ? "text-primary" : "text-foreground"
                 )}>
                   {node.name}
                 </div>
                 
                 {/* Row 4: Info (Optional) */}
                 {node.representative && (
                   <>
                     <div className="bg-muted/30 px-2.5 py-1.5 border-r border-border/60 text-[11px] font-medium text-muted-foreground flex items-center">
                       Info
                     </div>
                     <div className="px-2.5 py-1.5 text-[11px] text-muted-foreground flex items-center bg-background/50">
                       {node.representative}
                     </div>
                   </>
                 )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
