import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  X,
  Sparkles,
  MoreHorizontal,
  PlusCircle,
  Edit,
  Trash2,
  GripVertical,
  Map as MapIcon,
  Eye,
  Info,
  Layers,
  Share2,
  ListEnd,
  Workflow,
  CircleDashed,
  LayoutGrid as LayoutGridIcon,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowLeft,
  Waypoints,
  EyeOff,
  MessageSquareText,
  Search,
  User,
  Clock,
  MessageCircle,
  Hash,
  Calendar as CalendarIcon,
  Camera,
  Check,
  ChevronsUpDown
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import AICopilotPanel from "./AICopilotPanel";

const SectionHeader = ({ icon: Icon, title, onHide, onEditControl }: { icon: any, title: string, onHide?: () => void, onEditControl?: () => void }) => (
  <div className="flex items-center justify-between mb-3">
    <h4 className="text-xs font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <Icon className="w-4 h-4 text-primary" /> {title}
    </h4>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-secondary text-muted-foreground">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs">Configure Section</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xs" onClick={onEditControl}>
          <Edit className="w-3.5 h-3.5 mr-2" /> Edit Control
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xs text-destructive focus:text-destructive" onClick={onHide}>
          <EyeOff className="w-3.5 h-3.5 mr-2" /> Hide Section
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

const FieldCombobox = ({ 
  value, 
  options, 
  onChange, 
  placeholder = "Select field...",
  className,
  variant = "default"
}: { 
  value?: string, 
  options: string[], 
  onChange: (value: string) => void,
  placeholder?: string,
  className?: string,
  variant?: "default" | "add"
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between text-xs font-normal",
            variant === "add" 
              ? "bg-secondary/20 border-dashed text-muted-foreground hover:text-foreground hover:bg-secondary/40" 
              : "bg-muted/50 border hover:bg-muted/80",
            className
          )}
        >
          {variant === "add" ? (
             <div className="flex items-center gap-2">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{placeholder}</span>
             </div>
          ) : (
             value && value !== "none" ? value : placeholder
          )}
          {variant !== "add" && <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search field..." className="h-8 text-xs" />
          <CommandList>
            <CommandEmpty>No field found.</CommandEmpty>
            <CommandGroup>
              {variant !== "add" && (
                  <CommandItem
                     value="none"
                     onSelect={() => {
                       onChange("none");
                       setOpen(false);
                     }}
                     className="text-xs"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-3 w-3",
                        value === "none" ? "opacity-100" : "opacity-0"
                      )}
                    />
                    None (Fixed Size)
                  </CommandItem>
              )}
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={(currentValue) => {
                    // CommandItem value is normalized to lowercase by default in some versions, 
                    // but we want the original option string if possible, or we rely on the value being the key.
                    // To be safe with case sensitivity if options are mixed case:
                    onChange(option); 
                    setOpen(false);
                  }}
                  className="text-xs"
                >
                  <Check
                    className={cn(
                      "mr-2 h-3 w-3",
                      value === option ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const ViewModeCard = ({ icon, label, description, active, onClick, topRight }: { icon: any, label: string, description: string, active: boolean, onClick?: () => void, topRight?: React.ReactNode }) => (
  <div 
    onClick={onClick}
    className={cn(
    "relative flex flex-col items-center justify-center p-4 rounded-lg border cursor-pointer transition-all hover:bg-accent/50",
    active ? "bg-primary/10 border-primary/50 text-primary" : "bg-card border-border text-muted-foreground"
  )}>
    {topRight && (
        <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
            {topRight}
        </div>
    )}
    <div className={cn("mb-3 p-2.5 rounded-full", active ? "bg-primary/20" : "bg-secondary")}>
      {icon}
    </div>
    <div className="text-sm font-semibold mb-1">{label}</div>
    <div className="text-xs opacity-70 text-center leading-tight">{description}</div>
  </div>
);

export interface Snapshot {
    id: string;
    title: string;
    date: string;
    description: string;
    thumbnail: string;
}

export interface GraphSettings {
  nodeSelectionMode: 'single' | 'multi';
  nodeWeight: number;
  nodeDirection: 'directed' | 'undirected';
  showTimeline: boolean;
  showAiBriefing: boolean;
  showLegend: boolean;
  showNodeLabels: boolean;
  showEdgeLabels: boolean;
  curvedEdges: boolean;
  particlesEffect: boolean;
}

interface GraphToolsSidebarProps {
  className?: string;
  stats?: { nodes: number, edges: number, types: number, density: string };
  settings?: GraphSettings;
  onSettingsChange?: (settings: GraphSettings) => void;
  nodes?: any[];
  edges?: any[];
  snapshots?: Snapshot[];
  onDeleteSnapshot?: (id: string) => void;
  onOpenCreateSnapshot?: () => void;
}

// New component for dismissible info box
const InfoBox = ({ title, description, icon: Icon }: { title: string, description: string, icon: any }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  if (!isVisible) return null;

  return (
    <div className="relative group bg-secondary/20 border border-border/50 rounded-md p-4 mb-5 transition-all hover:bg-secondary/30">
        <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
        >
            <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2.5 mb-2">
            <Icon className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed pl-6 pr-4">
            {description}
        </p>
    </div>
  );
};

export default function GraphToolsSidebar({ className, stats, settings, onSettingsChange, nodes = [], edges = [], snapshots = [], onDeleteSnapshot, onOpenCreateSnapshot }: GraphToolsSidebarProps) {
  const [activeTab, setActiveTab] = useState<"view" | "settings" | "sizing" | "filters" | "report" | "ai" | "notes" | "snapshots" | null>(null);
  const [panelWidth, setPanelWidth] = useState(384); // Default 96 (384px)
  const [isResizing, setIsResizing] = useState(false);
  const [showLayoutDescription, setShowLayoutDescription] = useState(true);
  const [showGraphSettingsDescription, setShowGraphSettingsDescription] = useState(true);
  const [visibleSections, setVisibleSections] = useState({ layout: true, graphSettings: true });
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [controlVisibility, setControlVisibility] = useState({
    nodeTypeSelection: true,
    nodeWeight: true,
    edgeDirection: true,
    visibilityGroup: true,
    displayGroup: true,
  });
  
  // Layout Edit State
  const [focusedLayout, setFocusedLayout] = useState('organic');
  const [layoutConfigs, setLayoutConfigs] = useState<Record<string, { enabled: boolean, tightness: number, orientation?: string }>>({
    organic: { enabled: true, tightness: 5 },
    sequential: { enabled: false, tightness: 5, orientation: 'down' },
    hierarchy: { enabled: false, tightness: 5, orientation: 'down' },
    lens: { enabled: true, tightness: 5 },
    radial: { enabled: false, tightness: 5 },
    structural: { enabled: false, tightness: 5 },
  });

  // Node Sizing Configuration State
  const [nodeSizingConfig, setNodeSizingConfig] = useState<Record<string, { type: string, color: string, fields: { id: string, field: string, alias: string, min?: number, max?: number }[], availableFields: string[] }>>({
    criminal: {
      type: "Criminal",
      color: "bg-red-500",
      fields: [
        { id: "1", field: "risk_score", alias: "Risk Score", min: 0, max: 100 },
        { id: "2", field: "crimes_count", alias: "Crimes Committed", min: 0, max: 50 },
        { id: "3", field: "sentence_years", alias: "Sentence Years", min: 0, max: 200 }
      ],
      availableFields: ["risk_score", "crimes_count", "sentence_years", "age", "weight", "height"]
    },
    detective: {
      type: "Detective",
      color: "bg-blue-500",
      fields: [
        { id: "1", field: "cases_solved", alias: "Cases Solved", min: 0, max: 500 },
        { id: "2", field: "years_active", alias: "Years Active", min: 0, max: 40 }
      ],
      availableFields: ["cases_solved", "years_active", "rank_level", "commendations"]
    },
    prison: {
      type: "Prison / Location",
      color: "bg-emerald-500",
      fields: [
        { id: "1", field: "capacity", alias: "Inmate Capacity", min: 100, max: 5000 },
        { id: "2", field: "staff_count", alias: "Staff Count", min: 10, max: 1000 }
      ],
      availableFields: ["capacity", "security_level", "staff_count", "budget"]
    },
    victim: {
      type: "Victim",
      color: "bg-amber-500",
      fields: [
        { id: "1", field: "damage_amount", alias: "Financial Damage", min: 0, max: 1000000 },
        { id: "2", field: "impact_score", alias: "Impact Score", min: 0, max: 10 }
      ],
      availableFields: ["damage_amount", "impact_score", "recovery_time", "age"]
    }
  });

  // Graph Theory Configuration State
  const [graphTheoryConfig, setGraphTheoryConfig] = useState([
    { id: 'degree', label: 'Degree', description: 'Measures direct connections', icon: Network, enabled: true },
    { id: 'centrality', label: 'Centrality', description: 'Measures node importance via links', icon: Share2, enabled: true },
    { id: 'closeness', label: 'Closeness', description: 'Measures average distance to others', icon: CircleDot, enabled: false },
    { id: 'betweenness', label: 'Betweenness', description: 'Measures bridge role in shortest paths', icon: Waypoints, enabled: true },
  ]);

  // Notes/Memos State
  const [notesSearch, setNotesSearch] = useState('');
  const [notesFilterAuthor, setNotesFilterAuthor] = useState<string>('all');
  const [date, setDate] = useState<DateRange | undefined>();
  
  // New state for adding notes
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTags, setNewNoteTags] = useState('');
  
  // New state for adding comments
  const [activeCommentNoteId, setActiveCommentNoteId] = useState<string | null>(null);
  const [newCommentContent, setNewCommentContent] = useState('');

  const [notes, setNotes] = useState([
    { 
      id: '1', 
      author: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah' },
      content: 'Investigate the connection between the offshore accounts and the shell company "Oceanic Holdings". The transaction dates align perfectly.',
      timestamp: '2 hours ago',
      comments: [
        { id: 'c1', author: { name: 'Mike Ross', avatar: 'https://i.pravatar.cc/150?u=mike' }, content: 'Good catch. I will pull the bank records.' }
      ],
      tags: ['investigation', 'finance']
    },
    { 
      id: '2', 
      author: { name: 'David Kim', avatar: 'https://i.pravatar.cc/150?u=david' },
      content: 'The suspect node #42 seems to have unusually high betweenness centrality. Might be a key broker in the network.',
      timestamp: 'Yesterday',
      comments: [],
      tags: ['analysis', 'network']
    },
    { 
      id: '3', 
      author: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah' },
      content: 'Updated the risk scores for the primary targets based on the new intelligence report.',
      timestamp: '2 days ago',
      comments: [],
      tags: ['update']
    }
  ]);

  const handleAddNote = () => {
    if (!newNoteContent.trim()) return;
    
    const newNote = {
      id: editingNoteId || Date.now().toString(),
      author: { name: 'Current User', avatar: 'https://i.pravatar.cc/150?u=me' }, // Mock current user
      content: newNoteContent,
      timestamp: editingNoteId ? 'Edited just now' : 'Just now',
      comments: editingNoteId ? (notes.find(n => n.id === editingNoteId)?.comments || []) : [],
      tags: newNoteTags.split(',').map(t => t.trim()).filter(Boolean)
    };
    
    if (editingNoteId) {
      setNotes(notes.map(n => n.id === editingNoteId ? newNote : n));
    } else {
      setNotes([newNote, ...notes]);
    }
    
    setNewNoteContent('');
    setNewNoteTags('');
    setIsAddingNote(false);
    setEditingNoteId(null);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(n => n.id !== noteId));
  };

  const handleAddComment = (noteId: string) => {
    if (!newCommentContent.trim()) return;

    setNotes(notes.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          comments: [
            ...note.comments,
            { 
              id: Date.now().toString(), 
              author: { name: 'Current User', avatar: 'https://i.pravatar.cc/150?u=me' }, 
              content: newCommentContent 
            }
          ]
        };
      }
      return note;
    }));
    
    setNewCommentContent('');
    setActiveCommentNoteId(null);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.content.toLowerCase().includes(notesSearch.toLowerCase()) || 
                          note.tags.some(tag => tag.toLowerCase().includes(notesSearch.toLowerCase()));
    const matchesAuthor = notesFilterAuthor === 'all' || note.author.name === notesFilterAuthor;
    return matchesSearch && matchesAuthor;
  });

  const uniqueAuthors = Array.from(new Set(notes.map(n => n.author.name)));

  const updateFieldRange = (typeKey: string, fieldId: string, rangeType: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    setNodeSizingConfig(prev => ({
      ...prev,
      [typeKey]: {
        ...prev[typeKey],
        fields: prev[typeKey].fields.map(f => f.id === fieldId ? { ...f, [rangeType]: numValue } : f)
      }
    }));
  };

  const addCategory = () => {
    const newId = `custom_${Date.now()}`;
    setNodeSizingConfig(prev => ({
      ...prev,
      [newId]: {
        type: "New Category",
        color: "bg-gray-500",
        fields: [],
        availableFields: ["custom_field_1", "custom_field_2"]
      }
    }));
  };

  const removeCategory = (key: string) => {
    const { [key]: removed, ...rest } = nodeSizingConfig;
    setNodeSizingConfig(rest);
  };

  const updateFieldAlias = (typeKey: string, fieldId: string, newAlias: string) => {
    setNodeSizingConfig(prev => ({
      ...prev,
      [typeKey]: {
        ...prev[typeKey],
        fields: prev[typeKey].fields.map(f => f.id === fieldId ? { ...f, alias: newAlias } : f)
      }
    }));
  };

  const updateField = (typeKey: string, fieldId: string, newField: string) => {
    setNodeSizingConfig(prev => ({
      ...prev,
      [typeKey]: {
        ...prev[typeKey],
        fields: prev[typeKey].fields.map(f => f.id === fieldId ? { ...f, field: newField } : f)
      }
    }));
  };

  const updateFieldType = (typeKey: string, newType: string) => {
    setNodeSizingConfig(prev => ({
      ...prev,
      [typeKey]: {
        ...prev[typeKey],
        type: newType
      }
    }));
  };

  const addField = (typeKey: string, field: string) => {
    if (!field) return;
    setNodeSizingConfig(prev => ({
      ...prev,
      [typeKey]: {
        ...prev[typeKey],
        fields: [
          ...prev[typeKey].fields,
          { 
            id: Date.now().toString(), 
            field, 
            alias: field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) 
          }
        ]
      }
    }));
  };

  const removeField = (typeKey: string, fieldId: string) => {
    setNodeSizingConfig(prev => ({
      ...prev,
      [typeKey]: {
        ...prev[typeKey],
        fields: prev[typeKey].fields.filter(f => f.id !== fieldId)
      }
    }));
  };

  const sidebarRef = useRef<HTMLDivElement>(null);

  const updateSetting = (key: keyof GraphSettings, value: any) => {
    if (onSettingsChange && settings) {
      onSettingsChange({ ...settings, [key]: value });
    }
  };

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !sidebarRef.current) return;
      
      // Calculate new width: We are resizing from the left edge.
      // The sidebar is anchored to the right. 
      // The mouse position relative to the viewport determines the new width.
      // The right edge of the panel is fixed at `sidebarRef.current.getBoundingClientRect().right`.
      const rightEdge = sidebarRef.current.getBoundingClientRect().right;
      const newWidth = rightEdge - e.clientX;
      
      // Min width 300px, Max width 800px
      if (newWidth >= 300 && newWidth <= 800) {
        setPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const toggleTab = (tab: "view" | "settings" | "sizing" | "filters" | "report" | "ai" | "notes" | "snapshots") => {
    if (activeTab === tab) {
      setActiveTab(null);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div ref={sidebarRef} className={cn("relative flex h-full z-40", className)}>
      
      {/* Content Panel (Flyout) */}
      <div 
        style={{ width: activeTab ? panelWidth : 0 }}
        className={cn(
          "absolute top-0 right-full h-full bg-card border-l border-y border-border shadow-2xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col z-50",
          activeTab ? "opacity-100 border-r" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Resize Handle */}
        <div 
            className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-primary/50 z-50 flex items-center justify-center group"
            onMouseDown={startResizing}
        >
            <div className="h-8 w-1 bg-border group-hover:bg-primary rounded-full transition-colors" />
        </div>
        {activeTab === "ai" ? (
            <AICopilotPanel onClose={() => setActiveTab(null)} />
        ) : (
            <>
        <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-secondary/10 shrink-0">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            {activeTab === "view" && <><Box className="w-4 h-4" /> View Options</>}
            {activeTab === "settings" && <><Sliders className="w-4 h-4" /> General Settings</>}
            {activeTab === "sizing" && <><CircleDot className="w-4 h-4" /> Node Sizing</>}
            {activeTab === "filters" && <><Filter className="w-4 h-4" /> Graph Filters</>}
            {activeTab === "report" && <><FileText className="w-4 h-4" /> Analysis Report</>}
            {activeTab === "notes" && <><MessageSquareText className="w-4 h-4" /> Project Notes</>}
            {activeTab === "snapshots" && <><Camera className="w-4 h-4" /> Snapshots</>}
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
                
                {editingSection === 'layout' ? (
                    <div className="space-y-6 animate-in slide-in-from-right-5 duration-200">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <h4 className="text-sm font-semibold flex items-center gap-2">
                                <Edit className="w-4 h-4 text-primary" />
                                Edit Layout Control
                            </h4>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}>Cancel</Button>
                                <Button size="sm" onClick={() => setEditingSection(null)}>Done</Button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="bg-primary/5 border border-primary/20 rounded-md p-3 mb-6">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <Info className="w-4 h-4 text-primary" />
                                        <h4 className="text-sm font-semibold text-foreground">Select Layouts</h4>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                                      Please select the layout types you want to make available in the graph view. You can configure individual settings for each layout below.
                                    </p>
                                </div>
                                
                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 block">Layout Type</Label>
                                
                                <div className="grid grid-cols-2 gap-2 mb-6">
                                    <ViewModeCard 
                                        icon={<Share2 className="w-5 h-5" />}
                                        label="Organic"
                                        description="Natural clustering"
                                        active={focusedLayout === 'organic'}
                                        onClick={() => setFocusedLayout('organic')}
                                        topRight={
                                            <Checkbox 
                                                checked={layoutConfigs.organic.enabled}
                                                onCheckedChange={(c) => setLayoutConfigs(prev => ({...prev, organic: {...prev.organic, enabled: !!c}}))}
                                            />
                                        }
                                    />
                                    <ViewModeCard 
                                        icon={<ListEnd className="w-5 h-5" />}
                                        label="Sequential"
                                        description="Linear progression"
                                        active={focusedLayout === 'sequential'}
                                        onClick={() => setFocusedLayout('sequential')}
                                        topRight={
                                            <Checkbox 
                                                checked={layoutConfigs.sequential.enabled}
                                                onCheckedChange={(c) => setLayoutConfigs(prev => ({...prev, sequential: {...prev.sequential, enabled: !!c}}))}
                                            />
                                        }
                                    />
                                    <ViewModeCard 
                                        icon={<Workflow className="w-5 h-5" />}
                                        label="Hierarchy"
                                        description="Tree structure"
                                        active={focusedLayout === 'hierarchy'}
                                        onClick={() => setFocusedLayout('hierarchy')}
                                        topRight={
                                            <Checkbox 
                                                checked={layoutConfigs.hierarchy.enabled}
                                                onCheckedChange={(c) => setLayoutConfigs(prev => ({...prev, hierarchy: {...prev.hierarchy, enabled: !!c}}))}
                                            />
                                        }
                                    />
                                    <ViewModeCard 
                                        icon={<Maximize2 className="w-5 h-5" />}
                                        label="Lens"
                                        description="Focus context"
                                        active={focusedLayout === 'lens'}
                                        onClick={() => setFocusedLayout('lens')}
                                        topRight={
                                            <Checkbox 
                                                checked={layoutConfigs.lens.enabled}
                                                onCheckedChange={(c) => setLayoutConfigs(prev => ({...prev, lens: {...prev.lens, enabled: !!c}}))}
                                            />
                                        }
                                    />
                                    <ViewModeCard 
                                        icon={<CircleDashed className="w-5 h-5" />}
                                        label="Radial"
                                        description="Circular view"
                                        active={focusedLayout === 'radial'}
                                        onClick={() => setFocusedLayout('radial')}
                                        topRight={
                                            <Checkbox 
                                                checked={layoutConfigs.radial.enabled}
                                                onCheckedChange={(c) => setLayoutConfigs(prev => ({...prev, radial: {...prev.radial, enabled: !!c}}))}
                                            />
                                        }
                                    />
                                    <ViewModeCard 
                                        icon={<LayoutGridIcon className="w-5 h-5" />}
                                        label="Structural"
                                        description="Grid arrangement"
                                        active={focusedLayout === 'structural'}
                                        onClick={() => setFocusedLayout('structural')}
                                        topRight={
                                            <Checkbox 
                                                checked={layoutConfigs.structural.enabled}
                                                onCheckedChange={(c) => setLayoutConfigs(prev => ({...prev, structural: {...prev.structural, enabled: !!c}}))}
                                            />
                                        }
                                    />
                                </div>

                                <div className="rounded-lg border bg-card/50 p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Configuration</h4>
                                        <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full capitalize">{focusedLayout}</span>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-xs">Tightness</Label>
                                            <span className="text-xs font-medium bg-secondary px-2 py-0.5 rounded text-muted-foreground">
                                                {layoutConfigs[focusedLayout]?.tightness ?? 5}
                                            </span>
                                        </div>
                                        <Slider 
                                            value={[layoutConfigs[focusedLayout]?.tightness ?? 5]} 
                                            onValueChange={(v) => setLayoutConfigs(prev => ({...prev, [focusedLayout]: {...prev[focusedLayout], tightness: v[0]}}))}
                                            max={10} 
                                            step={1} 
                                            className="py-2" 
                                        />
                                        <p className="text-[10px] text-muted-foreground">Adjusts how closely nodes are packed together.</p>
                                    </div>

                                    {(focusedLayout === 'hierarchy' || focusedLayout === 'sequential') && (
                                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 mt-4 pt-4 border-t border-dashed">
                                            <Label className="text-xs">Orientation</Label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {[
                                                    { value: 'down', icon: ArrowDown, label: 'Down' },
                                                    { value: 'up', icon: ArrowUp, label: 'Up' },
                                                    { value: 'left', icon: ArrowLeft, label: 'Left' },
                                                    { value: 'right', icon: ArrowRight, label: 'Right' }
                                                ].map((opt) => (
                                                    <div 
                                                        key={opt.value}
                                                        onClick={() => setLayoutConfigs(prev => ({...prev, [focusedLayout]: {...prev[focusedLayout], orientation: opt.value}}))}
                                                        className={cn(
                                                            "flex flex-col items-center justify-center p-2 rounded border cursor-pointer transition-all",
                                                            layoutConfigs[focusedLayout]?.orientation === opt.value 
                                                                ? "bg-primary/10 border-primary/50 text-primary" 
                                                                : "bg-card border-border text-muted-foreground hover:bg-accent"
                                                        )}
                                                    >
                                                        <opt.icon className="w-4 h-4 mb-1" />
                                                        <span className="text-[10px]">{opt.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : editingSection === 'graphSettings' ? (
                        <div className="space-y-6 animate-in slide-in-from-right-5 duration-200">
                             <div className="flex items-center justify-between border-b border-border pb-4">
                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                    <Edit className="w-4 h-4 text-primary" />
                                    Edit Control
                                </h4>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}>Cancel</Button>
                                    <Button size="sm" onClick={() => setEditingSection(null)}>Done</Button>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">Visible Controls</Label>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 rounded-md border bg-card/50">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/10 p-2 rounded-full">
                                                <CircleDot className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="text-sm font-medium">Node Type Selection</span>
                                        </div>
                                        <Switch 
                                            checked={controlVisibility.nodeTypeSelection}
                                            onCheckedChange={(c) => setControlVisibility(prev => ({ ...prev, nodeTypeSelection: c }))}
                                        />
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 rounded-md border bg-card/50">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/10 p-2 rounded-full">
                                                <Sliders className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="text-sm font-medium">Node Weight</span>
                                        </div>
                                        <Switch 
                                            checked={controlVisibility.nodeWeight}
                                            onCheckedChange={(c) => setControlVisibility(prev => ({ ...prev, nodeWeight: c }))}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-md border bg-card/50">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/10 p-2 rounded-full">
                                                <ArrowRight className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="text-sm font-medium">Edge Direction</span>
                                        </div>
                                        <Switch 
                                            checked={controlVisibility.edgeDirection}
                                            onCheckedChange={(c) => setControlVisibility(prev => ({ ...prev, edgeDirection: c }))}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-md border bg-card/50">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/10 p-2 rounded-full">
                                                <Eye className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="text-sm font-medium">Visibility Options</span>
                                        </div>
                                        <Switch 
                                            checked={controlVisibility.visibilityGroup}
                                            onCheckedChange={(c) => setControlVisibility(prev => ({ ...prev, visibilityGroup: c }))}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-md border bg-card/50">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/10 p-2 rounded-full">
                                                <Maximize2 className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="text-sm font-medium">Display Options</span>
                                        </div>
                                        <Switch 
                                            checked={controlVisibility.displayGroup}
                                            onCheckedChange={(c) => setControlVisibility(prev => ({ ...prev, displayGroup: c }))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                ) : (
                <>
                {visibleSections.layout && (
                <div className="space-y-4">
                    <SectionHeader 
                        icon={Box} 
                        title="Layout Type" 
                        onHide={() => setVisibleSections(prev => ({...prev, layout: false}))} 
                        onEditControl={() => setEditingSection('layout')}
                    />
                    {showLayoutDescription && (
                        <div className="group relative bg-primary/5 border border-primary/20 rounded-md p-3 mb-3 flex gap-2.5 items-start">
                            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <p className="text-xs text-muted-foreground leading-snug pr-4">
                                Customize the graph structure layout view.
                            </p>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10"
                                onClick={() => setShowLayoutDescription(false)}
                            >
                                <X className="w-3 h-3 text-muted-foreground" />
                            </Button>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2 pl-3">
                        {layoutConfigs.organic.enabled && (
                          <ViewModeCard 
                            icon={<Share2 className="w-5 h-5" />} 
                            label="Organic" 
                            description="Natural clustering" 
                            active={false}
                          />
                        )}
                        {layoutConfigs.sequential.enabled && (
                          <ViewModeCard 
                            icon={<ListEnd className="w-5 h-5" />} 
                            label="Sequential" 
                            description="Linear progression" 
                            active={false}
                          />
                        )}
                        {layoutConfigs.hierarchy.enabled && (
                          <ViewModeCard 
                            icon={<Workflow className="w-5 h-5" />} 
                            label="Hierarchy" 
                            description="Tree structure" 
                            active={false}
                          />
                        )}
                        {layoutConfigs.lens.enabled && (
                          <ViewModeCard 
                            icon={<Maximize2 className="w-5 h-5" />} 
                            label="Lens" 
                            description="Focus on context" 
                            active={true}
                          />
                        )}
                        {layoutConfigs.radial.enabled && (
                          <ViewModeCard 
                            icon={<CircleDashed className="w-5 h-5" />} 
                            label="Radial" 
                            description="Circular view" 
                            active={false}
                          />
                        )}
                        {layoutConfigs.structural.enabled && (
                          <ViewModeCard 
                            icon={<LayoutGridIcon className="w-5 h-5" />} 
                            label="Structural" 
                            description="Grid arrangement" 
                            active={false}
                          />
                        )}
                    </div>
                </div>
                )}

                {visibleSections.layout && visibleSections.graphSettings && <Separator />}

                {visibleSections.graphSettings && (
                <div className="space-y-6">
                    <div>
                        <SectionHeader 
                            icon={Settings2} 
                            title="Graph Settings" 
                            onHide={() => setVisibleSections(prev => ({...prev, graphSettings: false}))}
                            onEditControl={() => setEditingSection('graphSettings')}
                        />
                        {showGraphSettingsDescription && (
                            <div className="group relative bg-primary/5 border border-primary/20 rounded-md p-3 mb-4 flex gap-2.5 items-start">
                                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <p className="text-xs text-muted-foreground leading-snug pr-4">
                                    Configure visual elements and interactive features.
                                </p>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10"
                                    onClick={() => setShowGraphSettingsDescription(false)}
                                >
                                    <X className="w-3 h-3 text-muted-foreground" />
                                </Button>
                            </div>
                        )}
                    
                        {/* Node Type Selection Mode */}
                        {controlVisibility.nodeTypeSelection && (
                        <div className="space-y-3 mb-6">
                            <Label className="text-xs font-bold text-muted-foreground/80 mb-2 block uppercase tracking-widest">Node Type Selection</Label>
                            <RadioGroup 
                                defaultValue={settings?.nodeSelectionMode || 'multi'} 
                                onValueChange={(v) => updateSetting("nodeSelectionMode", v)}
                                className="flex gap-4 pt-1 pl-3"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="single" id="mode-single" />
                                    <Label htmlFor="mode-single" className="text-sm font-medium">Single</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="multi" id="mode-multi" />
                                    <Label htmlFor="mode-multi" className="text-sm font-medium">Multi-Select</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        )}

                        {/* Node Weight & Direction */}
                        <div className="space-y-6">
                             {controlVisibility.nodeWeight && (
                             <div className="space-y-3">
                                <div className="flex justify-between">
                                  <Label className="text-xs font-bold text-muted-foreground/80 uppercase tracking-widest">Node Weight Threshold</Label>
                                  <span className="text-sm font-medium text-muted-foreground">{settings?.nodeWeight || 50}%</span>
                                </div>
                                <div className="pl-3">
                                    <Slider 
                                        defaultValue={[settings?.nodeWeight || 50]} 
                                        max={100} 
                                        step={1} 
                                        className="py-1" 
                                        onValueChange={(v) => updateSetting("nodeWeight", v[0])}
                                    />
                                </div>
                             </div>
                             )}

                             {controlVisibility.edgeDirection && (
                             <div className="space-y-3">
                                <Label className="text-xs font-bold text-muted-foreground/80 uppercase tracking-widest block">Edge Direction</Label>
                                <div className="pl-3">
                                     <Select 
                                        value={settings?.nodeDirection || 'directed'} 
                                        onValueChange={(v) => updateSetting("nodeDirection", v)}
                                     >
                                        <SelectTrigger className="h-9 text-sm w-full">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="directed">Directed</SelectItem>
                                          <SelectItem value="undirected">Undirected</SelectItem>
                                        </SelectContent>
                                     </Select>
                                </div>
                            </div>
                            )}
                        </div>

                        {/* Visibility Toggles */}
                        {controlVisibility.visibilityGroup && (
                        <div className="space-y-3 pt-5">
                            <Label className="text-xs font-bold text-muted-foreground/80 mb-3 block uppercase tracking-widest">Visibility</Label>
                            
                            <div className="space-y-3.5 pl-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">Timeline</Label>
                                    <Switch 
                                        checked={settings?.showTimeline ?? true}
                                        onCheckedChange={(c) => updateSetting("showTimeline", c)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium flex items-center gap-1.5">
                                        AI Briefing
                                        <svg width="0" height="0" className="absolute">
                                            <linearGradient id="ai-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#3b82f6" />
                                                <stop offset="50%" stopColor="#8b5cf6" />
                                                <stop offset="100%" stopColor="#ec4899" />
                                            </linearGradient>
                                        </svg>
                                        <Sparkles 
                                            className="w-3.5 h-3.5 animate-pulse" 
                                            style={{ 
                                                stroke: "url(#ai-gradient)", 
                                                fill: "url(#ai-gradient)",
                                                fillOpacity: 0.2
                                            }} 
                                        />
                                    </Label>
                                    <Switch 
                                        checked={settings?.showAiBriefing ?? true}
                                        onCheckedChange={(c) => updateSetting("showAiBriefing", c)}
                                    />
                                </div>
                                 <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">Legend</Label>
                                    <Switch 
                                        checked={settings?.showLegend ?? true}
                                        onCheckedChange={(c) => updateSetting("showLegend", c)}
                                    />
                                </div>
                            </div>
                        </div>
                        )}

                        {/* Display */}
                        {controlVisibility.displayGroup && (
                        <div className="space-y-3 pt-5">
                            <Label className="text-xs font-bold text-muted-foreground/80 mb-3 block uppercase tracking-widest">Display</Label>
                            <div className="space-y-3.5 pl-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">Show Node Labels</Label>
                                    <Switch 
                                        checked={settings?.showNodeLabels ?? true}
                                        onCheckedChange={(c) => updateSetting("showNodeLabels", c)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">Show Edge Labels</Label>
                                    <Switch 
                                        checked={settings?.showEdgeLabels ?? false}
                                        onCheckedChange={(c) => updateSetting("showEdgeLabels", c)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">Curved Edges</Label>
                                    <Switch 
                                        checked={settings?.curvedEdges ?? true}
                                        onCheckedChange={(c) => updateSetting("curvedEdges", c)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">Particles Effect</Label>
                                    <Switch 
                                        checked={settings?.particlesEffect ?? true}
                                        onCheckedChange={(c) => updateSetting("particlesEffect", c)}
                                    />
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
              </div>
                )}
                
                {/* Manage Sections Button - Show if any section is hidden */}
                {(!visibleSections.layout || !visibleSections.graphSettings) && (
                    <div className="pt-4 border-t border-border mt-4 text-center">
                        {!visibleSections.layout && !visibleSections.graphSettings && (
                            <p className="text-sm text-muted-foreground mb-3">All sections are currently hidden.</p>
                        )}
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full text-xs"
                            onClick={() => setVisibleSections({ layout: true, graphSettings: true })}
                        >
                            <Eye className="w-3.5 h-3.5 mr-2" />
                            Show Hidden Sections
                        </Button>
                    </div>
                )}
                </>
                )}
            </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <SectionHeader icon={Settings2} title="General Settings" />
                
                <div className="space-y-4">
                    {/* Node Type Selection Mode */}
                    <div className="bg-card/50 rounded-lg border p-3 hover:bg-accent/5 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                            <Layers className="w-3.5 h-3.5 text-primary" />
                            <Label className="text-xs font-semibold">Interaction Mode</Label>
                        </div>
                        <RadioGroup 
                            defaultValue={settings?.nodeSelectionMode || 'multi'} 
                            onValueChange={(v) => updateSetting("nodeSelectionMode", v)}
                            className="flex gap-4 pt-1"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="single" id="mode-single" />
                                <Label htmlFor="mode-single" className="text-xs font-normal cursor-pointer">Single Select</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="multi" id="mode-multi" />
                                <Label htmlFor="mode-multi" className="text-xs font-normal cursor-pointer">Multi Select</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Node Weight & Direction */}
                    <div className="bg-card/50 rounded-lg border p-3 hover:bg-accent/5 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                            <Network className="w-3.5 h-3.5 text-primary" />
                            <Label className="text-xs font-semibold">Graph Structure</Label>
                        </div>
                        <div className="space-y-4">
                             <div className="space-y-2">
                                <div className="flex justify-between">
                                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Node Weight Threshold</Label>
                                  <span className="text-xs font-mono text-muted-foreground">{settings?.nodeWeight || 50}%</span>
                                </div>
                                <Slider 
                                    defaultValue={[settings?.nodeWeight || 50]} 
                                    max={100} 
                                    step={1} 
                                    className="py-1" 
                                    onValueChange={(v) => updateSetting("nodeWeight", v[0])}
                                />
                             </div>

                             <div className="space-y-2">
                                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider block">Edge Direction</Label>
                                 <Select 
                                    value={settings?.nodeDirection || 'directed'} 
                                    onValueChange={(v) => updateSetting("nodeDirection", v)}
                                 >
                                    <SelectTrigger className="h-7 text-xs w-full">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="directed">Directed Edges</SelectItem>
                                      <SelectItem value="undirected">Undirected Edges</SelectItem>
                                    </SelectContent>
                                 </Select>
                            </div>
                        </div>
                    </div>

                    {/* Visibility Toggles */}
                    <div className="bg-card/50 rounded-lg border p-3 hover:bg-accent/5 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                            <Eye className="w-3.5 h-3.5 text-primary" />
                            <Label className="text-xs font-semibold">Visibility Controls</Label>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-normal">Show Timeline</Label>
                                <Switch 
                                    checked={settings?.showTimeline ?? true}
                                    onCheckedChange={(c) => updateSetting("showTimeline", c)}
                                    className="scale-75 origin-right"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-normal flex items-center gap-1.5">
                                    AI Briefing
                                    <Sparkles className="w-3 h-3 text-purple-500" />
                                </Label>
                                <Switch 
                                    checked={settings?.showAiBriefing ?? true}
                                    onCheckedChange={(c) => updateSetting("showAiBriefing", c)}
                                    className="scale-75 origin-right"
                                />
                            </div>
                             <div className="flex items-center justify-between">
                                <Label className="text-xs font-normal">Show Legend</Label>
                                <Switch 
                                    checked={settings?.showLegend ?? true}
                                    onCheckedChange={(c) => updateSetting("showLegend", c)}
                                    className="scale-75 origin-right"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Display Options */}
                     <div className="bg-card/50 rounded-lg border p-3 hover:bg-accent/5 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                            <Maximize2 className="w-3.5 h-3.5 text-primary" />
                            <Label className="text-xs font-semibold">Display Options</Label>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-normal">Show Node Labels</Label>
                                <Switch 
                                    checked={settings?.showNodeLabels ?? true}
                                    onCheckedChange={(c) => updateSetting("showNodeLabels", c)}
                                    className="scale-75 origin-right"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-normal">Show Edge Labels</Label>
                                <Switch 
                                    checked={settings?.showEdgeLabels ?? false}
                                    onCheckedChange={(c) => updateSetting("showEdgeLabels", c)}
                                    className="scale-75 origin-right"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-normal">Curved Edges</Label>
                                <Switch 
                                    checked={settings?.curvedEdges ?? true}
                                    onCheckedChange={(c) => updateSetting("curvedEdges", c)}
                                    className="scale-75 origin-right"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-normal">Particles Effect</Label>
                                <Switch 
                                    checked={settings?.particlesEffect ?? true}
                                    onCheckedChange={(c) => updateSetting("particlesEffect", c)}
                                    className="scale-75 origin-right"
                                />
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            )}

            {/* Node Sizing Tab */}
            {activeTab === "sizing" && (
              <div className="space-y-6">
                
                {editingSection === 'sizing' ? (
                    <div className="space-y-6 animate-in slide-in-from-right-5 duration-200">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <h4 className="text-sm font-semibold flex items-center gap-2">
                                <Edit className="w-4 h-4 text-primary" />
                                Edit Sizing Control
                            </h4>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}>Cancel</Button>
                                <Button size="sm" onClick={() => setEditingSection(null)}>Done</Button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-primary/5 border border-primary/20 rounded-md p-3">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <Info className="w-4 h-4 text-primary" />
                                    <h4 className="text-sm font-semibold text-foreground">Configure Sizing Fields</h4>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                                  Select the data fields that should be available for controlling node sizes for each entity type.
                                </p>
                            </div>

                            {Object.entries(nodeSizingConfig).map(([key, config], index, arr) => (
                                <div key={key} className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${config.color}`} />
                                        <div className="flex-1 flex items-center gap-2">
                                           <Input 
                                               value={config.type}
                                               onChange={(e) => updateFieldType(key, e.target.value)}
                                               className="h-7 text-sm font-medium border-transparent hover:border-border focus:border-border px-1 -ml-1 w-auto inline-block min-w-[120px]"
                                           />
                                           <div className="h-4 w-px bg-border" />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => removeCategory(key)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                    <div className="grid gap-3 pl-4">
                                        {config.fields.map((field) => (
                                            <div key={field.id} className="space-y-2">
                                                <div className="flex items-end gap-2">
                                                    <div className="flex-1 grid gap-1.5">
                                                        <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Field</Label>
                                                        <FieldCombobox 
                                                            value={field.field} 
                                                            onChange={(val) => updateField(key, field.id, val)} 
                                                            options={[field.field, ...config.availableFields.filter(f => !config.fields.some(existing => existing.field === f))]}
                                                            className="h-8"
                                                        />
                                                    </div>
                                                    <div className="flex-[1.5] grid gap-1.5">
                                                        <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Display Alias</Label>
                                                        <Input 
                                                            value={field.alias}
                                                            onChange={(e) => updateFieldAlias(key, field.id, e.target.value)}
                                                            className="h-8 text-xs"
                                                        />
                                                    </div>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                                                        onClick={() => removeField(key, field.id)}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                                <div className="flex items-center gap-2 pl-1">
                                                    <div className="flex items-center gap-2">
                                                        <Label className="text-[10px] text-muted-foreground uppercase tracking-wider whitespace-nowrap">Value Range:</Label>
                                                        <Input 
                                                            type="number"
                                                            placeholder="Min"
                                                            value={field.min ?? ''}
                                                            onChange={(e) => updateFieldRange(key, field.id, 'min', e.target.value)}
                                                            className="h-6 w-16 text-xs"
                                                        />
                                                        <span className="text-muted-foreground text-xs">-</span>
                                                        <Input 
                                                            type="number"
                                                            placeholder="Max"
                                                            value={field.max ?? ''}
                                                            onChange={(e) => updateFieldRange(key, field.id, 'max', e.target.value)}
                                                            className="h-6 w-16 text-xs"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        <div className="flex items-end gap-2">
                                            <div className="flex-1">
                                                <FieldCombobox 
                                                    onChange={(val) => addField(key, val)} 
                                                    options={config.availableFields.filter(f => !config.fields.some(existing => existing.field === f))}
                                                    variant="add"
                                                    placeholder="Add Field..."
                                                    className="h-9 w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {index < arr.length - 1 && <Separator className="mt-2" />}
                                </div>
                            ))}
                            
                            <Button 
                                variant="outline" 
                                className="w-full border-dashed text-muted-foreground hover:text-primary hover:border-primary"
                                onClick={addCategory}
                            >
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Add New Category
                            </Button>
                        </div>
                    </div>
                ) : editingSection === 'graphTheory' ? (
                    <div className="space-y-6 animate-in slide-in-from-right-5 duration-200">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <h4 className="text-sm font-semibold flex items-center gap-2">
                                <Edit className="w-4 h-4 text-primary" />
                                Edit Graph Theory Control
                            </h4>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}>Cancel</Button>
                                <Button size="sm" onClick={() => setEditingSection(null)}>Done</Button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-primary/5 border border-primary/20 rounded-md p-3">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <Info className="w-4 h-4 text-primary" />
                                    <h4 className="text-sm font-semibold text-foreground">Select Metrics</h4>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                                  Select the graph theoretical metrics you want to make available in the sidebar.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                                {graphTheoryConfig.map((metric) => (
                                    <ViewModeCard 
                                        key={metric.id}
                                        icon={<metric.icon className="w-5 h-5" />}
                                        label={metric.label}
                                        description={metric.description}
                                        active={metric.enabled}
                                        onClick={() => setGraphTheoryConfig(prev => prev.map(p => p.id === metric.id ? {...p, enabled: !p.enabled} : p))}
                                        topRight={
                                            <Checkbox 
                                                checked={metric.enabled}
                                                onCheckedChange={(c) => setGraphTheoryConfig(prev => prev.map(p => p.id === metric.id ? {...p, enabled: !!c} : p))}
                                            />
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <SectionHeader 
                        icon={Maximize2} 
                        title="Node Sizing" 
                        onEditControl={() => setEditingSection('sizing')}
                    />
                    
                    <div className="space-y-6">
                    {/* Field-based Sizing Configuration */}
                    <div>
                        <InfoBox 
                            title="Field-Based Sizing" 
                            description="Configure specific sizing fields for each node type based on their attributes."
                            icon={Info}
                        />

                        <div className="space-y-4">
                            {Object.entries(nodeSizingConfig).map(([key, config]) => (
                                <div key={key} className="p-3 rounded-lg border bg-card/50 hover:bg-accent/5 transition-colors">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className={`w-2 h-2 rounded-full ${config.color}`} />
                                        <span className="text-sm font-medium">{config.type}</span>
                                    </div>
                                    <div className="pl-4 space-y-2">
                                        <Select defaultValue={config.fields[0]?.field || "none"}>
                                            <SelectTrigger className="h-7 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {config.fields.map(field => (
                                                    <SelectItem key={field.id} value={field.field}>{field.alias}</SelectItem>
                                                ))}
                                                <SelectItem value="none">None (Fixed Size)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Global Sizing Settings */}
                    <div className="space-y-4">
                        <SectionHeader 
                            icon={Network} 
                            title="Graph Theory" 
                            onEditControl={() => setEditingSection('graphTheory')}
                        />
                        <InfoBox 
                            title="Graph Theory" 
                            description="Apply graph theoretical metrics to visualize node importance and centrality."
                            icon={Info}
                        />
                        
                        <div className="space-y-3">
                            <Label className="text-xs font-medium">Graph Analysis Model</Label>
                            <div className="space-y-2">
                                {graphTheoryConfig.filter(m => m.enabled).map((metric, i) => (
                                <div key={metric.id} className={cn(
                                    "flex items-start gap-3 p-2.5 rounded-md border cursor-pointer transition-colors",
                                    i === 0 ? "border-primary/50 bg-primary/5" : "bg-card hover:bg-accent/5"
                                )}>
                                    <div className={cn(
                                        "mt-0.5 relative flex h-4 w-4 shrink-0 overflow-hidden rounded-full border",
                                        i === 0 ? "border-primary" : "border-muted-foreground/30"
                                    )}>
                                        {i === 0 && (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-primary" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className={cn(
                                            "flex items-center gap-2 font-medium text-sm",
                                            i === 0 ? "text-foreground" : "text-muted-foreground"
                                        )}>
                                            <metric.icon className={cn("w-3.5 h-3.5", i === 0 && "text-primary")} />
                                            <span>{metric.label}</span>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground">
                                            {metric.description}
                                        </span>
                                    </div>
                                </div>
                                ))}

                                {/* Manual Override */}
                                <div className="flex items-start gap-3 p-2.5 rounded-md border bg-card hover:bg-accent/5 cursor-pointer transition-colors">
                                    <div className="mt-0.5 relative flex h-4 w-4 shrink-0 overflow-hidden rounded-full border border-muted-foreground/30" />
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 font-medium text-sm text-muted-foreground">
                                            <Edit className="w-3.5 h-3.5" />
                                            <span>Manual Override</span>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground">
                                            Manually set node sizes
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                  </div>
                )}
              </div>
            )}

            {/* Filters Tab */}
            {activeTab === "filters" && (
              <div className="space-y-4">
                <SectionHeader icon={Filter} title="Node Type Filters" />
                <div className="space-y-4">

                  {/* Criminal Filter */}
                  <div className="p-3 rounded-lg border bg-card/50 hover:bg-accent/5 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-red-500" />
                              <span className="text-sm font-medium">Criminal</span>
                          </div>
                          <Switch defaultChecked className="scale-75" />
                      </div>
                      
                      <div className="pl-4 space-y-4 pt-1">
                          {/* Range Filter */}
                          <div className="space-y-2">
                              <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                                  <span>Risk Score</span>
                                  <span>0 - 100</span>
                              </div>
                              <Slider defaultValue={[0, 100]} max={100} step={1} className="py-1" />
                          </div>

                          {/* Checkbox Filter */}
                          <div className="space-y-2">
                             <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1.5">Status</div>
                             <div className="space-y-1.5">
                                 <div className="flex items-center gap-2">
                                     <Checkbox id="status-incarcerated" defaultChecked className="h-3.5 w-3.5" />
                                     <Label htmlFor="status-incarcerated" className="text-xs font-normal cursor-pointer">Incarcerated</Label>
                                 </div>
                                 <div className="flex items-center gap-2">
                                     <Checkbox id="status-atlarge" defaultChecked className="h-3.5 w-3.5" />
                                     <Label htmlFor="status-atlarge" className="text-xs font-normal cursor-pointer">At Large</Label>
                                 </div>
                                 <div className="flex items-center gap-2">
                                     <Checkbox id="status-suspect" defaultChecked className="h-3.5 w-3.5" />
                                     <Label htmlFor="status-suspect" className="text-xs font-normal cursor-pointer">Suspect</Label>
                                 </div>
                             </div>
                          </div>
                      </div>
                  </div>

                  {/* Detective Filter */}
                  <div className="p-3 rounded-lg border bg-card/50 hover:bg-accent/5 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                              <span className="text-sm font-medium">Detective</span>
                          </div>
                          <Switch defaultChecked className="scale-75" />
                      </div>
                      
                      <div className="pl-4 space-y-4 pt-1">
                          {/* Range Filter */}
                          <div className="space-y-2">
                              <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                                  <span>Clearance Rate</span>
                                  <span>50% - 100%</span>
                              </div>
                              <Slider defaultValue={[50, 100]} max={100} step={1} className="py-1" />
                          </div>

                          {/* Checkbox Filter */}
                          <div className="space-y-2">
                             <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1.5">Unit</div>
                             <div className="space-y-1.5">
                                 <div className="flex items-center gap-2">
                                     <Checkbox id="unit-homicide" defaultChecked className="h-3.5 w-3.5" />
                                     <Label htmlFor="unit-homicide" className="text-xs font-normal cursor-pointer">Homicide</Label>
                                 </div>
                                 <div className="flex items-center gap-2">
                                     <Checkbox id="unit-cyber" defaultChecked className="h-3.5 w-3.5" />
                                     <Label htmlFor="unit-cyber" className="text-xs font-normal cursor-pointer">Cyber Crimes</Label>
                                 </div>
                                 <div className="flex items-center gap-2">
                                     <Checkbox id="unit-narcotics" defaultChecked className="h-3.5 w-3.5" />
                                     <Label htmlFor="unit-narcotics" className="text-xs font-normal cursor-pointer">Narcotics</Label>
                                 </div>
                             </div>
                          </div>
                      </div>
                  </div>

                  {/* Prison Filter */}
                  <div className="p-3 rounded-lg border bg-card/50 hover:bg-accent/5 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span className="text-sm font-medium">Prison / Location</span>
                          </div>
                          <Switch defaultChecked className="scale-75" />
                      </div>
                      
                      <div className="pl-4 space-y-4 pt-1">
                          {/* Range Filter */}
                          <div className="space-y-2">
                              <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                                  <span>Occupancy</span>
                                  <span>0% - 100%</span>
                              </div>
                              <Slider defaultValue={[0, 90]} max={100} step={1} className="py-1" />
                          </div>

                          {/* Checkbox Filter */}
                          <div className="space-y-2">
                             <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1.5">Security Level</div>
                             <div className="space-y-1.5">
                                 <div className="flex items-center gap-2">
                                     <Checkbox id="sec-max" defaultChecked className="h-3.5 w-3.5" />
                                     <Label htmlFor="sec-max" className="text-xs font-normal cursor-pointer">Maximum</Label>
                                 </div>
                                 <div className="flex items-center gap-2">
                                     <Checkbox id="sec-med" defaultChecked className="h-3.5 w-3.5" />
                                     <Label htmlFor="sec-med" className="text-xs font-normal cursor-pointer">Medium</Label>
                                 </div>
                             </div>
                          </div>
                      </div>
                  </div>

                  {/* Victim Filter */}
                  <div className="p-3 rounded-lg border bg-card/50 hover:bg-accent/5 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-amber-500" />
                              <span className="text-sm font-medium">Victim</span>
                          </div>
                          <Switch defaultChecked className="scale-75" />
                      </div>
                      
                      <div className="pl-4 space-y-4 pt-1">
                          {/* Range Filter */}
                          <div className="space-y-2">
                              <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                                  <span>Damage Amount</span>
                                  <span>$10k - $500k+</span>
                              </div>
                              <Slider defaultValue={[10]} max={100} step={1} className="py-1" />
                          </div>

                           {/* Checkbox Filter */}
                          <div className="space-y-2">
                             <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1.5">Type</div>
                             <div className="space-y-1.5">
                                 <div className="flex items-center gap-2">
                                     <Checkbox id="vic-individual" defaultChecked className="h-3.5 w-3.5" />
                                     <Label htmlFor="vic-individual" className="text-xs font-normal cursor-pointer">Individual</Label>
                                 </div>
                                 <div className="flex items-center gap-2">
                                     <Checkbox id="vic-corporate" defaultChecked className="h-3.5 w-3.5" />
                                     <Label htmlFor="vic-corporate" className="text-xs font-normal cursor-pointer">Corporate</Label>
                                 </div>
                             </div>
                          </div>
                      </div>
                  </div>

                </div>
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === "notes" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-2">
                  <SectionHeader icon={MessageSquareText} title="Project Notes" />
                  <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                    {notes.length}
                  </span>
                </div>

                {/* Search & Filter */}
                {!isAddingNote && (
                <div className="space-y-3 mb-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <Input 
                      placeholder="Search notes or tags..." 
                      className="h-9 pl-8 text-xs bg-secondary/20"
                      value={notesSearch}
                      onChange={(e) => setNotesSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={notesFilterAuthor} onValueChange={setNotesFilterAuthor}>
                      <SelectTrigger className="h-8 text-xs w-full bg-secondary/20 flex-1">
                        <div className="flex items-center gap-2">
                           <User className="w-3 h-3" />
                           <span className="truncate">{notesFilterAuthor === 'all' ? 'All Authors' : notesFilterAuthor}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Authors</SelectItem>
                        {uniqueAuthors.map(author => (
                          <SelectItem key={author} value={author}>{author}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant={"outline"}
                          size="sm"
                          className={cn(
                            "h-8 text-xs justify-start text-left font-normal bg-secondary/20 border-border flex-1 px-2",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-3 w-3 shrink-0" />
                          <span className="truncate">
                            {date?.from ? (
                              date.to ? (
                                <>
                                  {format(date.from, "LLL dd, y")} -{" "}
                                  {format(date.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(date.from, "LLL dd, y")
                              )
                            ) : (
                              "Pick a date"
                            )}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={date?.from}
                          selected={date}
                          onSelect={setDate}
                          numberOfMonths={1}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                )}

                {/* Add Note Form */}
                {isAddingNote && (
                    <div className="bg-card border border-primary/50 rounded-lg p-3 shadow-sm mb-4 animate-in slide-in-from-bottom-2">
                        <div className="space-y-3">
                            <textarea 
                                className="w-full min-h-[80px] p-2 text-xs bg-secondary/20 rounded border border-border resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="Write your note here..."
                                value={newNoteContent}
                                onChange={(e) => setNewNoteContent(e.target.value)}
                                autoFocus
                            />
                            <Input 
                                placeholder="Tags (comma separated)..." 
                                className="h-8 text-xs bg-secondary/20"
                                value={newNoteTags}
                                onChange={(e) => setNewNoteTags(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                <Button size="sm" variant="ghost" onClick={() => setIsAddingNote(false)}>Cancel</Button>
                                <Button size="sm" onClick={handleAddNote}>Save Note</Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notes List */}
                <div className="space-y-3">
                  {filteredNotes.length === 0 && !isAddingNote ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquareText className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p className="text-xs">No notes found matching your criteria.</p>
                    </div>
                  ) : (
                    filteredNotes.map(note => (
                      <div key={note.id} className="group bg-card border border-border/50 rounded-lg p-3 hover:shadow-md hover:border-border transition-all duration-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full overflow-hidden bg-secondary">
                              <img src={note.author.avatar} alt={note.author.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold">{note.author.name}</span>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" /> {note.timestamp}
                              </span>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 -mr-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="w-3.5 h-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setNewNoteContent(note.content);
                                setNewNoteTags(note.tags.join(', '));
                                setEditingNoteId(note.id);
                                setIsAddingNote(true);
                              }}>
                                <Edit className="w-3.5 h-3.5 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDeleteNote(note.id)}>
                                <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <p className="text-xs text-foreground/90 leading-relaxed mb-3">
                          {note.content}
                        </p>
                        
                        {note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {note.tags.map(tag => (
                              <span key={tag} className="flex items-center text-[10px] bg-secondary/50 text-secondary-foreground px-1.5 py-0.5 rounded-sm">
                                <Hash className="w-2.5 h-2.5 mr-0.5 opacity-50" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-2 border-t border-border/30">
                          <button 
                            className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => setActiveCommentNoteId(activeCommentNoteId === note.id ? null : note.id)}
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>{note.comments.length > 0 ? `${note.comments.length} Comments` : 'Add Comment'}</span>
                          </button>
                        </div>
                        
                        {/* Comments View */}
                        {(note.comments.length > 0 || activeCommentNoteId === note.id) && (
                           <div className="mt-2 pl-3 border-l-2 border-border/30 space-y-2">
                             {note.comments.map(comment => (
                               <div key={comment.id} className="text-[10px]">
                                 <div className="flex items-center gap-1.5 mb-0.5">
                                   <span className="font-semibold">{comment.author.name}</span>
                                 </div>
                                 <p className="text-muted-foreground">{comment.content}</p>
                               </div>
                             ))}

                             {/* Add Comment Input */}
                             {activeCommentNoteId === note.id && (
                                <div className="pt-2 animate-in fade-in">
                                    <textarea 
                                        className="w-full min-h-[60px] p-2 text-xs bg-secondary/20 rounded border border-border resize-none focus:outline-none focus:ring-1 focus:ring-primary mb-2"
                                        placeholder="Write a comment..."
                                        value={newCommentContent}
                                        onChange={(e) => setNewCommentContent(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="flex justify-end gap-2">
                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setActiveCommentNoteId(null)}>
                                            <X className="w-3 h-3" />
                                        </Button>
                                        <Button size="sm" className="h-6 text-[10px]" onClick={() => handleAddComment(note.id)}>Post</Button>
                                    </div>
                                </div>
                             )}
                           </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Snapshots Tab */}
            {activeTab === "snapshots" && (
                <div className="space-y-6 animate-in slide-in-from-right-5 duration-200">
                    <SectionHeader icon={Camera} title="Saved Snapshots" />
                    
                    <div className="bg-primary/5 border border-primary/20 rounded-md p-3 mb-6">
                        <div className="flex items-center gap-2 mb-1.5">
                            <Info className="w-4 h-4 text-primary" />
                            <h4 className="text-sm font-semibold text-foreground">Graph Snapshots</h4>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                            Save and restore different states of your graph visualization. Snapshots capture layout, filters, and styling settings.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {snapshots.map((snapshot) => (
                            <div key={snapshot.id} className="group relative bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all shadow-sm hover:shadow-md cursor-pointer">
                                <div className="flex">
                                    {/* Thumbnail Placeholder */}
                                    <div className={cn("w-24 h-auto bg-secondary flex items-center justify-center shrink-0", snapshot.thumbnail)}>
                                        <Network className="w-8 h-8 text-muted-foreground/50" />
                                    </div>
                                    
                                    <div className="flex-1 p-3">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{snapshot.title}</h4>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                                                    <Edit className="w-3 h-3" />
                                                </Button>
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDeleteSnapshot?.(snapshot.id);
                                                    }}
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center text-[10px] text-muted-foreground mb-2">
                                            <CalendarIcon className="w-3 h-3 mr-1" />
                                            {snapshot.date}
                                        </div>
                                        
                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                            {snapshot.description}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Restore Overlay */}
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                        ))}
                    </div>

                    <Button className="w-full gap-2 mt-4" variant="outline" onClick={onOpenCreateSnapshot}>
                        <PlusCircle className="w-4 h-4" />
                        Create New Snapshot
                    </Button>
                </div>
            )}

            {/* Report Tab */}
            {activeTab === "report" && (() => {
               // Calculations
               const nodeDegree = new Map<string, number>();
               nodes.forEach(n => nodeDegree.set(n.id, 0));
               edges.forEach(e => {
                   nodeDegree.set(e.source, (nodeDegree.get(e.source) || 0) + 1);
                   nodeDegree.set(e.target, (nodeDegree.get(e.target) || 0) + 1);
               });
               
               const sortedByDegree = [...nodes].sort((a, b) => (nodeDegree.get(b.id) || 0) - (nodeDegree.get(a.id) || 0));
               const topConnected = sortedByDegree.slice(0, 5);
               
               // Mocking "Largest" as "Highest Value" based on type-specific field
               const getNodeValue = (n: any) => {
                   // Try to find numeric fields in data
                   const values = Object.values(n.data).filter(v => typeof v === 'number') as number[];
                   return values.length > 0 ? Math.max(...values) : 0;
               };
               const sortedByValue = [...nodes].sort((a, b) => getNodeValue(b) - getNodeValue(a));
               const topLargest = sortedByValue.slice(0, 5);

               const isolatesCount = nodes.filter(n => (nodeDegree.get(n.id) || 0) === 0).length;

               return (
              <div className="space-y-6 animate-in fade-in duration-300">
                <SectionHeader icon={BarChart3} title="Network Statistics" />
                
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-card border border-border/50 p-3 rounded-lg">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Nodes</div>
                    <div className="text-2xl font-bold font-mono text-primary">{stats?.nodes ?? 0}</div>
                  </div>
                  <div className="bg-card border border-border/50 p-3 rounded-lg">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Edges</div>
                    <div className="text-2xl font-bold font-mono text-primary">{stats?.edges ?? 0}</div>
                  </div>
                  <div className="bg-card border border-border/50 p-3 rounded-lg">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Node Types</div>
                    <div className="text-2xl font-bold font-mono text-foreground">{stats?.types ?? 0}</div>
                  </div>
                  <div className="bg-card border border-border/50 p-3 rounded-lg">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Density</div>
                    <div className="text-2xl font-bold font-mono text-foreground">{stats?.density ?? "0.00"}</div>
                  </div>
                </div>

                <Separator />

                {/* Top Connected Nodes */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                        <Share2 className="w-3.5 h-3.5" /> Top 5 Connected Nodes
                    </h4>
                    <div className="space-y-2">
                        {topConnected.map((node, i) => (
                            <div key={node.id} className="flex items-center justify-between p-2 rounded bg-secondary/20 border border-border/30">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <span className="text-[10px] font-mono w-4 h-4 flex items-center justify-center bg-primary/10 rounded-full text-primary shrink-0">{i+1}</span>
                                    <div className="truncate text-xs font-medium">{node.data.label}</div>
                                </div>
                                <div className="text-xs font-mono font-bold bg-secondary px-1.5 rounded">{nodeDegree.get(node.id)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Largest Nodes */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                        <Maximize2 className="w-3.5 h-3.5" /> Top 5 Largest Nodes
                    </h4>
                    <div className="space-y-2">
                        {topLargest.map((node, i) => (
                            <div key={node.id} className="flex items-center justify-between p-2 rounded bg-secondary/20 border border-border/30">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <span className="text-[10px] font-mono w-4 h-4 flex items-center justify-center bg-emerald-500/10 rounded-full text-emerald-600 shrink-0">{i+1}</span>
                                    <div className="truncate text-xs font-medium">{node.data.label}</div>
                                </div>
                                <div className="text-xs font-mono font-bold text-muted-foreground">{getNodeValue(node)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Other Metrics */}
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
                    <h4 className="text-xs font-bold text-amber-600 mb-2 flex items-center gap-2">
                        <Info className="w-3.5 h-3.5" /> Network Health
                    </h4>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Isolated Nodes (Isolates)</span>
                        <span className="font-mono font-bold">{isolatesCount}</span>
                    </div>
                </div>
              </div>
               );
            })()}

          </div>
        </ScrollArea>

        {/* Fixed Footer for Notes Tab */}
        {activeTab === "notes" && !isAddingNote && (
            <div className="p-4 border-t border-border bg-card sticky bottom-0 z-10">
                <Button className="w-full gap-2 shadow-sm" size="sm" onClick={() => setIsAddingNote(true)}>
                    <PlusCircle className="w-4 h-4" />
                    Add New Note
                </Button>
            </div>
        )}

        </>
        )}
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
          className="hidden" // Hide the old settings tab icon for now as content is moved
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
          icon={<BarChart3 className="w-5 h-5" />} 
          label="Report" 
          isActive={activeTab === "report"} 
          onClick={() => toggleTab("report")} 
        />
        <NavIcon 
          icon={<Camera className="w-5 h-5" />} 
          label="Snapshots" 
          isActive={activeTab === "snapshots"} 
          onClick={() => toggleTab("snapshots")} 
        />
        <NavIcon 
          icon={<MessageSquareText className="w-5 h-5" />} 
          label="Notes" 
          isActive={activeTab === "notes"} 
          onClick={() => toggleTab("notes")} 
        />
        
        <div className="flex-1" />
        
        {/* AI Copilot Toggle */}
        <div className="relative group flex justify-center w-full pb-2">
            <button 
                onClick={() => toggleTab("ai")}
                className={cn(
                  "relative p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110 overflow-hidden",
                  activeTab === "ai" 
                    ? "text-white shadow-lg shadow-purple-500/25 ring-2 ring-purple-500/20" 
                    : "text-muted-foreground hover:bg-secondary/50"
                )}
            >
                {/* Colorful Gradient Background */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-amber-400 opacity-90",
                     activeTab === "ai" ? "opacity-100" : "opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                )} />
                
                {/* Shine Effect */}
                {activeTab === "ai" && (
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                )}

                <Sparkles className={cn("w-5 h-5 relative z-10", activeTab === "ai" ? "text-white" : "text-purple-500 group-hover:text-purple-600")} />
                
                {activeTab !== "ai" && (
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-tr from-violet-500/10 to-fuchsia-500/10 animate-pulse" />
                )}
            </button>
            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2 py-1 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-500 text-white text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md">
                AI Copilot
                <div className="absolute top-1/2 right-[-4px] -translate-y-1/2 border-4 border-transparent border-l-amber-500"></div>
            </div>
        </div>
      </div>
    </div>
  );
}

function NavIcon({ icon, label, isActive, onClick, className }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void, className?: string }) {
  return (
    <div className={cn("relative group flex justify-center w-full", className)}>
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
