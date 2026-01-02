import { useState, useEffect } from "react";
import { Search, Settings, Filter, MoreHorizontal, MapPin, Calendar, User, Briefcase, ArrowLeft, Network, Maximize2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

// Stock images for mock data
import imgKang from '@assets/stock_images/asian_man_portrait_s_c2051204.jpg';
import imgKim from '@assets/stock_images/asian_woman_portrait_8e05b02c.jpg';
import imgPark from '@assets/stock_images/asian_man_portrait_s_8e97e0a5.jpg';
import imgStation from '@assets/stock_images/subway_station_entra_fd329c94.jpg';
import imgCar from '@assets/stock_images/hyundai_sonata_silve_5f184276.jpg';
import imgLee from '@assets/stock_images/asian_man_portrait_s_874ea05d.jpg';
import imgChoi from '@assets/stock_images/asian_woman_portrait_5bef3717.jpg';
import imgWarehouse from '@assets/stock_images/warehouse_building_i_2038a214.jpg';
import imgPhone from '@assets/stock_images/smartphone_generic_7f33ffa4.jpg';

interface NodeData {
  id: string;
  name: string;
  category: string;
  representative: string;
  location: string;
  years: number;
  description?: string;
  image?: string;
  images?: string[];
}

// Mock Data matching the screenshot style
export const MOCK_COMPANY_NODES: NodeData[] = [
  { 
    id: "1", 
    name: "Kang Min-su", 
    category: "Suspect", 
    representative: "Male, 35", 
    location: "Seoul", 
    years: 2, 
    image: imgKang,
    images: [imgKang, imgStation, imgPhone] 
  },
  { id: "2", name: "Kim Ji-hyun", category: "Victim", representative: "Female, 28", location: "Busan", years: 0, image: imgKim },
  { id: "3", name: "Park Dong-wook", category: "Suspect", representative: "Male, 42", location: "Incheon", years: 5, image: imgPark },
  { 
    id: "4", 
    name: "Gangnam Station Exit 4", 
    category: "Location", 
    representative: "Public Area", 
    location: "Seoul", 
    years: 0, 
    image: imgStation,
    images: [imgStation, imgWarehouse]
  },
  { id: "5", name: "Stolen Vehicle (12ga 3456)", category: "Evidence", representative: "Hyundai Sonata", location: "Gyeonggi-do", years: 0, image: imgCar },
  { id: "6", name: "Lee Sang-ho", category: "Witness", representative: "Male, 31", location: "Seoul", years: 0, image: imgLee },
  { id: "7", name: "Choi Yu-jin", category: "Victim", representative: "Female, 24", location: "Seoul", years: 0, image: imgChoi },
  { id: "8", name: "Incheon Port Warehouse", category: "Location", representative: "Industrial Zone", location: "Incheon", years: 10, image: imgWarehouse },
  { id: "9", name: "Burner Phone (Samsung)", category: "Evidence", representative: "Galaxy A12", location: "Seongnam-si", years: 1, image: imgPhone },
  { id: "10", name: "Jung Tae-soo", category: "Suspect", representative: "Male, 39", location: "Unknown", years: 8, image: imgKang }, // Reuse first image for now
];

function NodeImageCarousel({ images, name }: { images: string[], name: string }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (images.length === 0) {
    return (
      <div className="w-full aspect-video flex items-center justify-center bg-secondary/20 text-muted-foreground">
        <span className="text-xs">No Image</span>
      </div>
    );
  }

  return (
    <Carousel setApi={setApi} className="w-full">
      <CarouselContent>
        {images.map((img, idx) => (
          <CarouselItem key={idx}>
            <Dialog>
              <DialogTrigger asChild>
                <div className="aspect-video w-full relative cursor-zoom-in group/image">
                  <img 
                    src={img} 
                    alt={`${name} - ${idx + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/image:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover/image:opacity-100">
                    <Maximize2 className="w-8 h-8 text-white drop-shadow-md" />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent shadow-none flex items-center justify-center overflow-hidden">
                <img 
                  src={img} 
                  alt={`${name} - Fullscreen`} 
                  className="w-full h-full max-h-[90vh] object-contain rounded-md"
                />
              </DialogContent>
            </Dialog>
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && (
        <>
          <CarouselPrevious className="left-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity" />
          <CarouselNext className="right-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity" />
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
            {current} / {count}
          </div>
        </>
      )}
    </Carousel>
  );
}

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
    // Handle multiple images
    const rawImages = isGraphNode ? (nodeData.images || [nodeData.image]) : (nodeData.images || [nodeData.image]);
    const displayImages = rawImages.filter(Boolean);
    
    return (
      <div className="flex flex-col h-full animate-in slide-in-from-left-5 duration-300">
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
             <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2" onClick={() => onNodeSelect?.(null as any)}>
               <ArrowLeft className="w-4 h-4" />
             </Button>
             <h3 className="text-sm font-semibold uppercase tracking-wider">Component Details</h3>
          </div>
          
          <div className="w-full bg-muted rounded-lg border border-border/50 overflow-hidden mb-0 relative group/carousel">
             <NodeImageCarousel images={displayImages} name={displayName} />
          </div>
        </div>

        <ScrollArea className="flex-1 p-0">
           <div className="space-y-0 pb-4">
              {/* Properties Section */}
              <div className="px-4 py-3 border-b border-border/50">
                 <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-3">
                   <Settings className="w-3.5 h-3.5" /> Properties
                 </h4>
                 <div className="grid gap-2 text-sm bg-card rounded-md border p-3">
                    <div className="grid grid-cols-2 py-1 border-b border-border/50 pb-1">
                       <span className="text-muted-foreground">ID</span>
                       <span className="font-mono text-xs text-right">{selectedNode.id}</span>
                    </div>
                    <div className="grid grid-cols-2 py-1 border-b border-border/50 pb-1">
                       <span className="text-muted-foreground">Name</span>
                       <span className="text-right font-medium">{displayName}</span>
                    </div>
                    <div className="grid grid-cols-2 py-1 border-b border-border/50 pb-1">
                       <span className="text-muted-foreground">Type</span>
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
              <div className="px-4 py-3 border-b border-border/50">
                 <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-3">
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

              <div className="p-4">
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
        <div className="py-2">
          {filteredNodes.map((node) => (
            <div 
              key={node.id}
              onClick={() => onNodeSelect?.(node)}
              className={cn(
                "group py-3 px-4 border-b border-slate-300 dark:border-slate-700 cursor-pointer transition-colors",
                selectedNodeId === node.id 
                  ? "bg-primary/20 ring-1 ring-inset ring-primary/20" 
                  : "hover:bg-muted/50"
              )}
            >
              <div className="grid grid-cols-[40px_1fr] gap-x-2 gap-y-1.5 text-sm">
                 {/* ID */}
                 <div className="text-[11px] font-normal text-muted-foreground flex items-center">
                   ID
                 </div>
                 <div className="font-mono text-[12px] text-foreground/70 flex items-center">
                   #{node.id}
                 </div>

                 {/* Type */}
                 <div className="text-[11px] font-normal text-muted-foreground flex items-center">
                   Type
                 </div>
                 <div className="text-[12px] font-normal text-foreground/90 flex items-center">
                   {node.category}
                 </div>

                 {/* Name */}
                 <div className="text-[11px] font-normal text-muted-foreground flex items-center pt-0.5">
                   Name
                 </div>
                 <div className={cn(
                   "text-[12px] font-normal flex items-center leading-none pt-0.5",
                   selectedNodeId === node.id ? "text-primary" : "text-foreground"
                 )}>
                   {node.name}
                 </div>
                 
                 {/* Info */}
                 {node.representative && (
                   <>
                     <div className="text-[11px] font-normal text-muted-foreground flex items-center">
                       Info
                     </div>
                     <div className="text-[12px] font-normal text-muted-foreground flex items-center">
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
