import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Folder, FileImage, FileText, FileVideo, FileAudio, File, 
  Search, Plus, Upload, MoreVertical, Grid, List, Filter,
  Download, Trash2, ExternalLink, Clock, HardDrive
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock Data
const RESOURCES = [
  { id: 1, name: "logo-white.svg", type: "image", ext: "svg", size: "12 KB", date: "2024-03-15", folder: "Branding" },
  { id: 2, name: "hero-banner.jpg", type: "image", ext: "jpg", size: "2.4 MB", date: "2024-03-14", folder: "Marketing" },
  { id: 3, name: "Q1_Report.pdf", type: "document", ext: "pdf", size: "4.1 MB", date: "2024-03-10", folder: "Reports" },
  { id: 4, name: "dataset_v1.csv", type: "document", ext: "csv", size: "850 KB", date: "2024-03-08", folder: "Data" },
  { id: 5, name: "intro_video.mp4", type: "media", ext: "mp4", size: "45.2 MB", date: "2024-03-05", folder: "Marketing" },
  { id: 6, name: "crime_stats_2023.xlsx", type: "document", ext: "xlsx", size: "1.2 MB", date: "2024-03-01", folder: "Data" },
  { id: 7, name: "user_avatar_01.png", type: "image", ext: "png", size: "450 KB", date: "2024-02-28", folder: "Users" },
  { id: 8, name: "meeting_notes.txt", type: "document", ext: "txt", size: "2 KB", date: "2024-02-28", folder: "Notes" },
  { id: 9, name: "background_texture.png", type: "image", ext: "png", size: "3.5 MB", date: "2024-02-25", folder: "Assets" },
  { id: 10, name: "system_config.json", type: "code", ext: "json", size: "4 KB", date: "2024-02-20", folder: "Config" },
  { id: 11, name: "chart_style.css", type: "code", ext: "css", size: "8 KB", date: "2024-02-18", folder: "Styles" },
  { id: 12, name: "alert_sound.mp3", type: "media", ext: "mp3", size: "1.2 MB", date: "2024-02-15", folder: "Assets" },
];

const CATEGORIES = [
  { id: "all", label: "All Resources", icon: Folder, count: 12 },
  { id: "image", label: "Images", icon: FileImage, count: 4 },
  { id: "document", label: "Documents", icon: FileText, count: 4 },
  { id: "media", label: "Media", icon: FileVideo, count: 2 },
  { id: "code", label: "Code & Config", icon: File, count: 2 },
];

export default function ResourcesManager() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = RESOURCES.filter(resource => {
    const matchesCategory = activeCategory === "all" || resource.type === activeCategory;
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "image": return <FileImage className="w-8 h-8 text-blue-500" />;
      case "document": return <FileText className="w-8 h-8 text-orange-500" />;
      case "media": return <FileVideo className="w-8 h-8 text-purple-500" />;
      case "code": return <File className="w-8 h-8 text-slate-500" />;
      default: return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-64px)] bg-background">
        {/* Sidebar */}
        <div className="w-64 border-r border-border bg-card/30 flex flex-col">
          <div className="p-4 border-b border-border">
            <Button className="w-full bg-primary text-primary-foreground shadow-sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload New
            </Button>
          </div>
          
          <ScrollArea className="flex-1 py-4">
            <div className="px-3 space-y-1">
              <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Categories
              </div>
              {CATEGORIES.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                    activeCategory === category.id 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <category.icon className="w-4 h-4" />
                    {category.label}
                  </div>
                  <span className="text-xs bg-secondary/50 px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>

            <Separator className="my-4 mx-3 w-auto" />

            <div className="px-3 space-y-1">
              <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Storage
              </div>
              <div className="px-3 py-2">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <HardDrive className="w-4 h-4" /> Used
                  </span>
                  <span className="font-medium">6.2 GB / 10 GB</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[62%]" />
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-background">
          {/* Toolbar */}
          <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/10">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                <Input 
                  placeholder="Search resources..." 
                  className="pl-9 h-9 bg-background/50 border-border focus-visible:ring-primary/20" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{filteredResources.length}</span> items found
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-secondary/20 p-1 rounded-md flex border border-border/50">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-7 w-7 rounded-sm ${viewMode === 'grid' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:bg-secondary/50'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-7 w-7 rounded-sm ${viewMode === 'list' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:bg-secondary/50'}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <ScrollArea className="flex-1 p-6">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredResources.map((resource) => (
                  <Card key={resource.id} className="group hover:border-primary/50 transition-all hover:shadow-md cursor-pointer overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-secondary/10 flex items-center justify-center relative group-hover:bg-secondary/20 transition-colors">
                        {getIcon(resource.type)}
                        
                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px]">
                           <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
                             <Download className="w-4 h-4" />
                           </Button>
                           <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full">
                             <Trash2 className="w-4 h-4" />
                           </Button>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="font-medium text-sm truncate" title={resource.name}>{resource.name}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{resource.size} • {resource.ext.toUpperCase()}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 -mr-1 text-muted-foreground">
                                <MoreVertical className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Rename</DropdownMenuItem>
                              <DropdownMenuItem>Move to...</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="border border-border rounded-lg bg-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/10 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 text-left w-10"></th>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Date Added</th>
                      <th className="px-4 py-3 text-left">Size</th>
                      <th className="px-4 py-3 text-left">Folder</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filteredResources.map((resource) => (
                      <tr key={resource.id} className="group hover:bg-secondary/10 transition-colors">
                        <td className="px-4 py-3 text-center">
                          <div className="w-8 h-8 flex items-center justify-center">
                            {getIcon(resource.type).props.className = "w-5 h-5"}
                            {getIcon(resource.type)}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">{resource.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{resource.date}</td>
                        <td className="px-4 py-3 text-muted-foreground">{resource.size}</td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="font-normal text-xs">{resource.folder}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </Layout>
  );
}