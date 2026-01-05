import { useState, useRef } from "react";
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
  Download, Trash2, ExternalLink, Clock, HardDrive, X, CloudUpload
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import heroBanner from "@assets/generated_images/modern_abstract_hero_banner_for_marketing.png";
import userAvatar from "@assets/generated_images/user_avatar_professional_headshot.png";

// Mock Data
const INITIAL_RESOURCES = [
  { id: 1, name: "logo-white.svg", type: "image", ext: "svg", size: "12 KB", date: "2024-03-15", folder: "Branding", url: null },
  { id: 2, name: "hero-banner.jpg", type: "image", ext: "jpg", size: "2.4 MB", date: "2024-03-14", folder: "Marketing", url: heroBanner },
  { id: 3, name: "Q1_Report.pdf", type: "document", ext: "pdf", size: "4.1 MB", date: "2024-03-10", folder: "Reports", url: null },
  { id: 4, name: "dataset_v1.csv", type: "document", ext: "csv", size: "850 KB", date: "2024-03-08", folder: "Data", url: null },
  { id: 5, name: "intro_video.mp4", type: "media", ext: "mp4", size: "45.2 MB", date: "2024-03-05", folder: "Marketing", url: null },
  { id: 6, name: "crime_stats_2023.xlsx", type: "document", ext: "xlsx", size: "1.2 MB", date: "2024-03-01", folder: "Data", url: null },
  { id: 7, name: "user_avatar_01.png", type: "image", ext: "png", size: "450 KB", date: "2024-02-28", folder: "Users", url: userAvatar },
  { id: 8, name: "meeting_notes.txt", type: "document", ext: "txt", size: "2 KB", date: "2024-02-28", folder: "Notes", url: null },
  { id: 9, name: "background_texture.png", type: "image", ext: "png", size: "3.5 MB", date: "2024-02-25", folder: "Assets", url: heroBanner }, // Using hero banner as placeholder for failed generation
  { id: 10, name: "system_config.json", type: "code", ext: "json", size: "4 KB", date: "2024-02-20", folder: "Config", url: null },
  { id: 11, name: "chart_style.css", type: "code", ext: "css", size: "8 KB", date: "2024-02-18", folder: "Styles", url: null },
  { id: 12, name: "alert_sound.mp3", type: "media", ext: "mp3", size: "1.2 MB", date: "2024-02-15", folder: "Assets", url: null },
];

const INITIAL_CATEGORIES = [
  { id: "all", label: "All Resources", icon: Folder, count: 12 },
  { id: "image", label: "Images", icon: FileImage, count: 4 },
  { id: "document", label: "Documents", icon: FileText, count: 4 },
  { id: "media", label: "Media", icon: FileVideo, count: 2 },
  { id: "code", label: "Code & Config", icon: File, count: 2 },
];

export default function ResourcesManager() {
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Upload State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Category Management State
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [selectedResource, setSelectedResource] = useState<any>(null);

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const id = newCategoryName.toLowerCase().replace(/\s+/g, '-');
    
    // Check if category already exists
    if (categories.some(c => c.id === id)) {
      toast({
        title: "Category exists",
        description: "A category with this name already exists.",
        variant: "destructive"
      });
      return;
    }

    const newCategory = {
      id,
      label: newCategoryName,
      icon: Folder, // Default icon for user created categories
      count: 0
    };

    setCategories(prev => [...prev, newCategory]);
    setNewCategoryName("");
    setIsCreateCategoryOpen(false);
    toast({
      title: "Category Created",
      description: `Category "${newCategoryName}" has been created.`
    });
  };

  const handleDeleteCategory = (id: string) => {
    if (id === 'all') return;
    
    setCategories(prev => prev.filter(c => c.id !== id));
    if (activeCategory === id) {
      setActiveCategory('all');
    }
    
    toast({
      title: "Category Deleted",
      description: "Category has been removed."
    });
  };

  const filteredResources = resources.filter(resource => {
    const matchesCategory = activeCategory === "all" || resource.type === activeCategory;
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getIcon = (type: string, className = "w-8 h-8") => {
    switch (type) {
      case "image": return <FileImage className={`${className} text-blue-500`} />;
      case "document": return <FileText className={`${className} text-orange-500`} />;
      case "media": return <FileVideo className={`${className} text-purple-500`} />;
      case "code": return <File className={`${className} text-slate-500`} />;
      default: return <File className={`${className} text-gray-500`} />;
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadConfirm = () => {
    if (selectedFiles.length === 0) return;

    const newResources = selectedFiles.map((file, i) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      let type = 'document';
      
      // Basic type detection
      if (['jpg', 'jpeg', 'png', 'svg', 'gif', 'webp'].includes(ext)) type = 'image';
      else if (['mp4', 'mov', 'avi', 'mp3', 'wav', 'mkv'].includes(ext)) type = 'media';
      else if (['json', 'css', 'js', 'ts', 'html', 'py', 'sql'].includes(ext)) type = 'code';
      
      return {
        id: Date.now() + i,
        name: file.name,
        type: type,
        ext: ext,
        size: (file.size / 1024 < 1024) ? `${(file.size / 1024).toFixed(1)} KB` : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        date: new Date().toISOString().split('T')[0],
        folder: selectedCategory === 'all' ? (activeCategory === 'all' ? 'Uploads' : categories.find(c => c.id === activeCategory)?.label || 'Uploads') : categories.find(c => c.id === selectedCategory)?.label || 'Uploads'
      };
    });

    setResources(prev => [...newResources, ...prev]);
    setIsUploadOpen(false);
    setSelectedFiles([]);
    setSelectedCategory("all"); // Reset category selection
    
    toast({
      title: "Upload Successful",
      description: `${newResources.length} file(s) have been added.`,
    });
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-64px)] bg-background">
        {/* Sidebar */}
        <div className="w-64 border-r border-border bg-card/30 flex flex-col">
          <div className="h-16 flex items-center px-4 border-b border-border shrink-0">
            <Button 
              className="w-full bg-primary text-primary-foreground shadow-sm"
              onClick={() => {
                setIsUploadOpen(true);
                setSelectedCategory(activeCategory === 'all' ? 'all' : activeCategory);
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload New
            </Button>
          </div>
          
          <ScrollArea className="flex-1 py-4">
            <div className="px-3 space-y-1">
              <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between group">
                Categories
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity -mr-1"
                    >
                      <MoreVertical className="w-3 h-3 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsCreateCategoryOpen(true)}>
                      <Plus className="w-3.5 h-3.5 mr-2" />
                      Create Category
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem className="text-destructive" disabled>
                      <Trash2 className="w-3.5 h-3.5 mr-2" />
                      Delete Category
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {categories.map(category => (
                <div key={category.id} className={category.id === 'all' ? 'mb-2' : 'ml-4'}>
                  <button
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors group ${
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
                    {category.id !== 'all' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-3 h-3 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); /* Rename logic */ }}>Rename</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive" 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              handleDeleteCategory(category.id);
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </button>
                  {category.id === 'all' && (
                    <div className="ml-5 mt-2 border-l border-border/60 pl-2">
                       {/* This empty div acts as a visual connector guide, though the mapping below handles the items. 
                           Since we're mapping flat, we just use the ml-4 on the container div above for indentation. 
                           If we want a strict tree, we might change the CATEGORIES structure, but visual indentation works for now. 
                       */}
                    </div>
                  )}
                </div>
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
          <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/10 shrink-0">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-2.5 top-3 text-muted-foreground" />
                <Input 
                  placeholder="Search resources..." 
                  className="pl-9 h-10 bg-background/50 border-border focus-visible:ring-primary/20" 
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
                  className={`h-8 w-8 rounded-sm ${viewMode === 'grid' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:bg-secondary/50'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-8 w-8 rounded-sm ${viewMode === 'list' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:bg-secondary/50'}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" className="h-10">
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
                  <Card 
                    key={resource.id} 
                    className="group hover:border-primary/50 transition-all hover:shadow-md cursor-pointer overflow-hidden"
                    onDoubleClick={() => {
                      if (resource.url || resource.type === 'image' || resource.type === 'media') {
                        setSelectedResource(resource);
                      }
                    }}
                  >
                    <CardContent className="p-0">
                      <div className="aspect-square bg-secondary/10 flex items-center justify-center relative group-hover:bg-secondary/20 transition-colors overflow-hidden">
                        {resource.type === 'image' && resource.url ? (
                          <img 
                            src={resource.url} 
                            alt={resource.name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          getIcon(resource.type)
                        )}
                        
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
                            <p className="text-[10px] text-muted-foreground/80 truncate mt-0.5" title={`https://em-graph.app/assets/${resource.folder.toLowerCase()}/${resource.name}`}>
                              https://em-graph.app/assets/{resource.folder.toLowerCase()}/{resource.name}
                            </p>
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
                            {getIcon(resource.type, "w-5 h-5")}
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

      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload New Resource</DialogTitle>
            <DialogDescription>
              Add files to your project library.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-2 mb-4">
             <Label htmlFor="category-select" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target Category</Label>
             <Select value={selectedCategory} onValueChange={setSelectedCategory}>
               <SelectTrigger id="category-select" className="h-9">
                 <SelectValue placeholder="Select a category" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">Auto-detect / General</SelectItem>
                 {categories.filter(c => c.id !== 'all').map(category => (
                   <SelectItem key={category.id} value={category.id}>
                     <div className="flex items-center gap-2">
                       <category.icon className="w-4 h-4 text-muted-foreground" />
                       {category.label}
                     </div>
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
          </div>

          <div 
            className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-secondary/30 hover:border-primary/50 transition-all cursor-pointer bg-secondary/5 gap-3"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
              <CloudUpload className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">SVG, PNG, JPG, PDF or MP4 (max. 10MB)</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              multiple 
            />
          </div>

          {selectedFiles.length > 0 && (
            <ScrollArea className="max-h-[200px] w-full pr-4">
              <div className="space-y-2">
                {selectedFiles.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-secondary/30 rounded-md border border-border/50 text-sm group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded bg-background border flex items-center justify-center shrink-0">
                        <File className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); removeFile(i); }}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          <DialogFooter className="sm:justify-between flex-row items-center gap-2">
            <div className="text-xs text-muted-foreground">
              {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'No files selected'}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={handleUploadConfirm} disabled={selectedFiles.length === 0}>
                Upload Files
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Create a new folder to organize your resources.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Project Assets"
                className="col-span-3"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateCategory();
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateCategoryOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateCategory} disabled={!newCategoryName.trim()}>Create Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedResource} onOpenChange={(open) => !open && setSelectedResource(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-none text-white">
          <div className="relative w-full h-full min-h-[50vh] flex items-center justify-center">
             <Button 
               variant="ghost" 
               size="icon" 
               className="absolute top-2 right-2 text-white/70 hover:text-white hover:bg-white/10 z-50"
               onClick={() => setSelectedResource(null)}
             >
               <X className="w-5 h-5" />
             </Button>
             
             {selectedResource && (
               <div className="w-full h-full flex flex-col items-center justify-center">
                  {selectedResource.type === 'image' && selectedResource.url ? (
                    <img 
                      src={selectedResource.url} 
                      alt={selectedResource.name}
                      className="max-w-full max-h-[80vh] object-contain"
                    />
                  ) : selectedResource.type === 'media' ? (
                     <div className="text-center p-12">
                       <FileVideo className="w-24 h-24 mx-auto mb-4 text-white/50" />
                       <p className="text-xl font-medium">Video Preview Unavailable</p>
                       <p className="text-sm text-white/50 mt-2">{selectedResource.name}</p>
                     </div>
                  ) : (
                    <div className="text-center p-12">
                       <File className="w-24 h-24 mx-auto mb-4 text-white/50" />
                       <p className="text-xl font-medium">Preview Unavailable</p>
                       <p className="text-sm text-white/50 mt-2">{selectedResource.name}</p>
                     </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-lg font-medium">{selectedResource.name}</h3>
                    <p className="text-sm text-white/60">
                      {selectedResource.size} • {selectedResource.ext.toUpperCase()} • {selectedResource.date}
                    </p>
                  </div>
               </div>
             )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}