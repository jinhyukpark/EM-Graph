import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Database, Play, Plus, Search, Table as TableIcon, MoreHorizontal, Save, RefreshCw, Trash2, FileCode, ChevronRight, ChevronDown, Network, X, Import, FileUp, LayoutTemplate, Signal, User, Workflow, ChevronLeft, ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "wouter";
import { QueryTemplateDialog } from "@/components/database/QueryTemplateDialog";
import DataPreprocessingBuilder from "@/components/database/DataPreprocessingBuilder";
import GraphBuilderForm from "@/components/graph/GraphBuilderForm";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

// Mock Database Schema & Data
const SIDEBAR_ITEMS = [
  {
    category: "Table",
    subcategories: [
      {
        name: "Original",
        items: [
          { id: "t1", name: "crime_incidents_2024", icon: TableIcon, type: "table" },
          { id: "t2", name: "suspect_profiles", icon: TableIcon, type: "table" },
        ]
      },
      {
        name: "Custom",
        items: [
          { id: "t3", name: "location_hotspots", icon: TableIcon, type: "table" },
          { id: "t4", name: "supply_chain_nodes", icon: TableIcon, type: "table" },
        ]
      }
    ]
  },
  {
    category: "Query",
    items: [
      { id: "q1", name: "High Severity Crimes", icon: FileCode, type: "query" },
      { id: "q2", name: "District Analysis", icon: FileCode, type: "query" },
    ]
  },
  {
    category: "Graph",
    items: [
      { id: "g1", name: "Crime Network 2024", icon: Network, type: "graph" },
      { id: "g2", name: "Supply Chain Risk", icon: Network, type: "graph" },
    ]
  },
  {
    category: "PREPROCESSING",
    isTool: true,
    items: [
      { id: "p1", name: "Pre-Process", icon: Workflow, type: "preprocessing" },
    ]
  }
];

const MOCK_TABLE_DATA = [
  { idx: 1, company_name: "illunex", age: 8, member: 40, regdate: "2025-09-27 16:16:12" },
  { idx: 2, company_name: "samsung", age: 50, member: 40000, regdate: "2025-09-27 16:16:52" },
  { idx: 3, company_name: "lg_electronics", age: 45, member: 35000, regdate: "2025-09-28 09:30:00" },
  { idx: 4, company_name: "sk_hynix", age: 38, member: 28000, regdate: "2025-09-28 10:15:22" },
  { idx: 5, company_name: "naver", age: 22, member: 5000, regdate: "2025-09-29 14:20:11" },
  { idx: 6, company_name: "kakao", age: 15, member: 4200, regdate: "2025-09-29 15:45:33" },
];

const MOCK_QUERY_DATA = [
  { id: 1, type: "Theft", location: "Downtown", time: "2024-03-10 14:30", severity: 4, status: "Open" },
  { id: 2, type: "Assault", location: "Sector 4", time: "2024-03-11 02:15", severity: 8, status: "Investigating" },
  { id: 3, type: "Vandalism", location: "North Park", time: "2024-03-11 09:45", severity: 2, status: "Closed" },
  { id: 4, type: "Burglary", location: "West End", time: "2024-03-12 11:20", severity: 6, status: "Open" },
  { id: 5, type: "Theft", location: "Mall District", time: "2024-03-12 16:10", severity: 3, status: "Open" },
];

interface Tab {
  id: string;
  type: 'table' | 'query' | 'graph' | 'preprocessing' | 'pipeline-result';
  title: string;
  data?: any[];
}

interface EditingCell {
  rowIdx: number;
  field: string;
  value: string | number;
}

export default function DatabaseManager() {
  const [location, setLocation] = useLocation();
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 't1', type: 'table', title: 'crime_incidents_2024' }
  ]);
  const [activeTabId, setActiveTabId] = useState('t1');
  const [queryBlocks, setQueryBlocks] = useState<{id: string, sql: string, title?: string, description?: string, type?: 'template' | 'custom'}[]>([
    { id: '1', sql: "crime_incidents_2024 테이블에서 severity가 5보다 큰 데이터를 조회해줘", title: "자연어 쿼리 예시", type: 'custom' }
  ]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [tableData, setTableData] = useState(MOCK_TABLE_DATA);
  const [queryData, setQueryData] = useState(MOCK_QUERY_DATA);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([]);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const mockTableData = [
    { idx: 1, company_name: "illunex", age: 8, member: 40, regdate: "2025-09-27 16:16:12" },
    { idx: 2, company_name: "samsung", age: 50, member: 40000, regdate: "2025-09-27 16:16:52" },
    { idx: 3, company_name: "lg_electronics", age: 45, member: 35000, regdate: "2025-09-28 09:30:00" },
    { idx: 4, company_name: "sk_hynix", age: 38, member: 28000, regdate: "2025-09-28 10:15:22" },
    { idx: 5, company_name: "naver", age: 22, member: 5000, regdate: "2025-09-29 14:20:11" },
    { idx: 6, company_name: "kakao", age: 15, member: 4200, regdate: "2025-09-29 15:45:33" },
  ];

  const TableDetailView = ({ tableName }: { tableName: string }) => (
    <div className="flex flex-col h-full bg-background animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSelectedTable(null)}
            className="hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium uppercase tracking-tight italic">Pipeline Result</div>
            <span className="text-sm text-muted-foreground">{mockTableData.length} rows generated</span>
          </div>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-9 shadow-sm">
          <Save className="h-4 w-4" />
          Save to Table
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-muted/20">
              <th className="text-left p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 w-16">IDX</th>
              <th className="text-left p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">COMPANY_NAME</th>
              <th className="text-left p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">AGE</th>
              <th className="text-left p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">MEMBER</th>
              <th className="text-left p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">REGDATE</th>
            </tr>
          </thead>
          <tbody>
            {mockTableData.map((row) => (
              <tr key={row.idx} className="border-b hover:bg-muted/10 transition-colors group">
                <td className="p-4 text-sm font-mono text-muted-foreground/50">{row.idx}</td>
                <td className="p-4 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{row.company_name}</td>
                <td className="p-4 text-sm text-foreground/80">{row.age}</td>
                <td className="p-4 text-sm text-foreground/80">{row.member.toLocaleString()}</td>
                <td className="p-4 text-sm text-muted-foreground tabular-nums">{row.regdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const activeTab = tabs.find(t => t.id === activeTabId);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const toggleSubcategory = (subName: string) => {
    setExpandedSubcategories(prev => 
      prev.includes(subName) 
        ? prev.filter(s => s !== subName)
        : [...prev, subName]
    );
  };


  const handleInsert = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Record Added",
      description: "New row successfully inserted into 'crime_incidents_2024'",
    });
  };

  const openTab = (item: any) => {
    // If it's a generic table type (from the main TABLE view), we might not have a specific data table to show yet,
    // but typically this item will be a specific table object.
    if (!tabs.find(t => t.id === item.id)) {
      setTabs([...tabs, { id: item.id, type: item.type === 'table' ? 'pipeline-result' : item.type, title: item.name, data: item.type === 'table' ? MOCK_TABLE_DATA : undefined }]);
    }
    setActiveTabId(item.id);
    if (item.type === 'graph') {
      setIsGraphBuilderOpen(true);
    }
  };

  const closeTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId && newTabs.length > 0) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const createNew = (type: 'table' | 'query' | 'graph' | 'preprocessing') => {
    const id = `new-${Date.now()}`;
    const title = type === 'preprocessing' ? 'Data Pipeline' : `New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    setTabs([...tabs, { id, type, title }]);
    setActiveTabId(id);
  };

  const handleCellDoubleClick = (rowIdx: number, field: string, value: string | number) => {
    setEditingCell({ rowIdx, field, value });
  };

  const handleCellChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingCell) {
      setEditingCell({ ...editingCell, value: e.target.value });
    }
  };

  const handleCellBlur = () => {
    if (editingCell) {
      const newData = tableData.map(row => {
        if (row.idx === editingCell.rowIdx) {
          return { ...row, [editingCell.field]: editingCell.value };
        }
        return row;
      });
      setTableData(newData);
      setEditingCell(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellBlur();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const handleTemplateQuery = (generatedQuery: string, description?: string) => {
    const newBlock = {
      id: Date.now().toString(),
      sql: generatedQuery,
      title: description || "Template Query",
      description: description,
      type: 'template' as const
    };
    setQueryBlocks([...queryBlocks, newBlock]);
    toast({
      title: "Template Applied",
      description: "New query block has been added to the editor.",
    });
  };

  const removeQueryBlock = (id: string) => {
    if (queryBlocks.length > 1) {
      setQueryBlocks(queryBlocks.filter(b => b.id !== id));
    } else {
      // If it's the last one, just clear text but keep block? Or remove?
      // Let's just clear text if last one to avoid empty editor state issues if we want
      // But user asked for "list of boxes", so removing is fine if we handle empty state.
      // Let's prevent removing the last one for now, or just reset it.
      setQueryBlocks([{ id: Date.now().toString(), sql: "", title: "New Query", type: 'custom' }]);
    }
  };

  const updateQueryBlock = (id: string, newSql: string) => {
    setQueryBlocks(queryBlocks.map(b => b.id === id ? { ...b, sql: newSql } : b));
  };

  const [sidebarItems, setSidebarItems] = useState(SIDEBAR_ITEMS);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isSaveResultDialogOpen, setIsSaveResultDialogOpen] = useState(false);
  const [newQueryName, setNewQueryName] = useState("");
  const [newTableName, setNewTableName] = useState("");

  // Project Management State
  const [projects, setProjects] = useState([
    { id: "project-alpha", name: "Project Alpha" },
    { id: "project-beta", name: "Supply Chain Analysis" },
    { id: "project-gamma", name: "Social Network Study" }
  ]);
  const [selectedProjectId, setSelectedProjectId] = useState("project-alpha");
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [isGraphBuilderOpen, setIsGraphBuilderOpen] = useState(false);

  const handleProjectChange = (value: string) => {
    if (value === "create_new") {
        setIsCreateProjectDialogOpen(true);
        // Reset select value to current project to prevent "create_new" from showing as selected
        // In a controlled component this is handled by not updating selectedProjectId
    } else {
        setSelectedProjectId(value);
        toast({
            title: "Project Switched",
            description: `Switched to ${projects.find(p => p.id === value)?.name}`,
        });
    }
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    const newId = `project-${Date.now()}`;
    const newProject = { id: newId, name: newProjectName };
    setProjects([...projects, newProject]);
    setSelectedProjectId(newId);
    setNewProjectName("");
    setIsCreateProjectDialogOpen(false);
    toast({
        title: "Project Created",
        description: `Project '${newProject.name}' has been successfully created.`,
    });
  };

  const handleRunPipeline = (data: any[]) => {
    const newTabId = `result-${Date.now()}`;
    setTabs([...tabs, { 
      id: newTabId, 
      type: 'pipeline-result', 
      title: 'Pipeline Result', 
      data 
    }]);
    setActiveTabId(newTabId);
  };

  const handleSaveResult = () => {
    if (!newTableName.trim()) return;

    // 1. Add to Sidebar Items under Custom
    const newSidebarItems = [...sidebarItems];
    const tableCategory = newSidebarItems.find(c => c.category === "Table");
    if (tableCategory && tableCategory.subcategories) {
      const customSub = tableCategory.subcategories.find(s => s.name === "Custom");
      if (customSub) {
        customSub.items.push({
          id: `t-${Date.now()}`,
          name: newTableName,
          icon: TableIcon,
          type: "table"
        });
      }
    }
    setSidebarItems(newSidebarItems);

    // 2. Close Tab or Rename it? Let's just toast and close dialog.
    setIsSaveResultDialogOpen(false);
    setNewTableName("");
    
    toast({
      title: "Table Saved",
      description: `Result saved as '${newTableName}' in Custom tables.`,
    });
  };

  const handleSaveQuery = () => {
    if (!newQueryName.trim()) return;

    // 1. Update Tab Title
    const newTabs = tabs.map(t => t.id === activeTabId ? { ...t, title: newQueryName } : t);
    setTabs(newTabs);

    // 2. Update Sidebar Items
    const newSidebarItems = [...sidebarItems];
    const queryCategory = newSidebarItems.find(c => c.category === "Query");
    if (queryCategory) {
      const existingItem = queryCategory.items.find(i => i.name === newQueryName);
      if (!existingItem) {
        queryCategory.items.push({
          id: `q-${Date.now()}`,
          name: newQueryName,
          icon: FileCode,
          type: "query"
        });
      }
    }
    setSidebarItems(newSidebarItems);

    // 3. Close Dialog & Toast
    setIsSaveDialogOpen(false);
    setNewQueryName("");
    
    toast({
      title: "Query Saved",
      description: `Query '${newQueryName}' has been saved to your project.`,
    });
  };

  const handleRunQuery = (sql: string) => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      toast({
        title: "Query Executed Successfully",
        description: `Fetched ${queryData.length} rows in 45ms`,
      });
    }, 800);
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background">
        
        {/* Sidebar: Navigation */}
        <div className="w-64 border-r border-border bg-card/30 flex flex-col">
          <div className="h-16 flex items-center px-4 border-b border-border shrink-0">
            <Select value={selectedProjectId} onValueChange={handleProjectChange}>
              <SelectTrigger className="w-full bg-background/50 h-9 text-sm">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                        {project.name}
                    </SelectItem>
                ))}
                <SelectSeparator />
                <SelectItem value="create_new" className="text-primary font-medium focus:text-primary cursor-pointer">
                    <div className="flex items-center gap-2">
                        <Plus className="w-3.5 h-3.5" />
                        Create New Project
                    </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {sidebarItems.map((category, idx) => (
                <div key={idx} className={`space-y-1 ${category.isTool ? "mt-8 pt-6 border-t border-border/50" : ""}`}>
                  {category.isTool && (
                    <div className="px-4 mb-2">
                      <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">External Tools</span>
                    </div>
                  )}
                  <div 
                    className={`w-full flex items-center gap-2 px-3 py-1.5 transition-colors rounded-md group ${
                      activeTabId === category.category
                        ? "bg-primary/10" 
                        : "hover:bg-secondary/50"
                    }`}
                  >
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategory(category.category);
                      }}
                      className="p-1 hover:bg-primary/20 rounded transition-colors"
                    >
                      {expandedCategories.includes(category.category) ? (
                        <ChevronDown className={`w-3 h-3 ${activeTabId === category.category ? 'text-primary' : 'text-muted-foreground'}`} />
                      ) : (
                        <ChevronRight className={`w-3 h-3 ${activeTabId === category.category ? 'text-primary' : 'text-muted-foreground'}`} />
                      )}
                    </button>
                    
                    <button 
                      onClick={() => {
                        const id = category.category;
                        if (!tabs.find(t => t.id === id)) {
                          const type = category.category.toLowerCase() as any;
                          setTabs([...tabs, { id, type, title: category.category }]);
                        }
                        setActiveTabId(id);
                      }}
                      className={`flex-1 text-left text-xs font-bold uppercase tracking-wider ${
                        activeTabId === category.category
                          ? "text-primary" 
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {category.category}
                    </button>
                  </div>
                  
                  {expandedCategories.includes(category.category) && (
                    <div className="space-y-0.5 animate-in slide-in-from-top-2 duration-200 pl-2">
                      {category.subcategories ? (
                        category.subcategories.map((sub, sIdx) => (
                          <div key={sIdx} className="space-y-0.5">
                            <div className={`w-full flex items-center gap-2 px-3 py-1 rounded-md group ${activeTabId === sub.name ? "bg-primary/10" : "hover:bg-secondary/30"}`}>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSubcategory(sub.name);
                                }}
                                className="p-0.5 hover:bg-primary/20 rounded transition-colors"
                              >
                                {expandedSubcategories.includes(sub.name) ? (
                                  <ChevronDown className={`w-2.5 h-2.5 ${activeTabId === sub.name ? "text-primary" : "text-muted-foreground"}`} />
                                ) : (
                                  <ChevronRight className={`w-2.5 h-2.5 ${activeTabId === sub.name ? "text-primary" : "text-muted-foreground"}`} />
                                )}
                              </button>
                              
                              <button 
                                onClick={() => {
                                  if (!tabs.find(t => t.id === sub.name)) {
                                    setTabs([...tabs, { id: sub.name, type: 'table', title: sub.name }]);
                                  }
                                  setActiveTabId(sub.name);
                                }}
                                className={`flex-1 text-left text-[11px] font-semibold uppercase tracking-tight ${
                                  activeTabId === sub.name ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground"
                                }`}
                              >
                                {sub.name}
                              </button>
                            </div>
                            {expandedSubcategories.includes(sub.name) && (
                              <div className="pl-3 space-y-0.5">
                                {sub.items.map((item) => (
                                  <button
                                    key={item.id}
                                    onClick={() => openTab(item)}
                                    className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors ${
                                      activeTabId === item.id 
                                        ? "bg-primary/10 text-primary font-medium" 
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    }`}
                                  >
                                    <item.icon className="w-4 h-4" />
                                    <div className="flex-1 text-left truncate">{item.name}</div>
                                    {activeTabId === item.id && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        category.items?.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => openTab(item)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                              activeTabId === item.id 
                                ? "bg-primary/10 text-primary font-medium" 
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            }`}
                          >
                            <item.icon className="w-4 h-4" />
                            <div className="flex-1 text-left truncate">{item.name}</div>
                            {activeTabId === item.id && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-border bg-secondary/10">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Connection Status</span>
              <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Connected
              </span>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground/70">
              PostgreSQL 15.4 (Local)
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-background">
          
          {/* Tab Bar & Toolbar */}
          <div className="flex flex-col bg-background">
             {/* Action Toolbar - Styled like the screenshot - Aligned to h-16 */}
             <div className="h-16 flex items-center gap-1 px-4 border-b border-border shrink-0">
                <Button variant="default" size="sm" className="h-9 px-3 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm mr-2" onClick={() => createNew('query')}>
                  <Plus className="w-4 h-4" />
                  <span className="font-medium">New Query</span>
                </Button>

                <div className="h-4 w-px bg-border mx-2" />

                <Button 
                  variant={activeTabId === 'Table' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className={`h-9 px-3 gap-2 ${activeTabId === 'Table' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`} 
                  onClick={() => {
                    if (!tabs.find(t => t.id === 'Table')) {
                      setTabs([...tabs, { id: 'Table', type: 'table', title: 'Table' }]);
                    }
                    setActiveTabId('Table');
                  }}
                >
                  <TableIcon className="w-4 h-4" />
                  <span className="font-medium">Table</span>
                </Button>
                
                <Button 
                  variant={activeTabId === 'Query' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className={`h-9 px-3 gap-2 ${activeTabId === 'Query' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`} 
                  onClick={() => {
                    if (!tabs.find(t => t.id === 'Query')) {
                      setTabs([...tabs, { id: 'Query', type: 'query', title: 'Query' }]);
                    }
                    setActiveTabId('Query');
                  }}
                >
                  <FileCode className="w-4 h-4" />
                  <span className="font-medium">Query</span>
                </Button>

                <Button 
                  variant={activeTabId === 'Graph' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className={`h-9 px-3 gap-2 ${activeTabId === 'Graph' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`} 
                  onClick={() => {
                    if (!tabs.find(t => t.id === 'Graph')) {
                      setTabs([...tabs, { id: 'Graph', type: 'graph', title: 'Graph' }]);
                    }
                    setActiveTabId('Graph');
                  }}
                >
                  <Network className="w-4 h-4" />
                  <span className="font-medium">Graph</span>
                </Button>

                <div className="h-4 w-px bg-border mx-2" />

                <Button variant="ghost" size="sm" className="h-9 px-3 text-muted-foreground/50 gap-2" disabled>
                  <Import className="w-4 h-4" />
                  <span className="font-medium">Import</span>
                </Button>

                <Button variant="ghost" size="sm" className="h-9 px-3 text-muted-foreground/50 gap-2" disabled>
                  <FileUp className="w-4 h-4" />
                  <span className="font-medium">Export</span>
                </Button>
             </div>

             {/* Tabs */}
             <div className="flex items-center overflow-x-auto no-scrollbar px-2 pt-2 bg-secondary/5 border-b border-border">
               {tabs.map((tab) => (
                 <div 
                   key={tab.id}
                   onClick={() => setActiveTabId(tab.id)}
                   className={`
                     group flex items-center gap-2 px-4 py-2 text-sm border-t border-l border-r rounded-t-md cursor-pointer min-w-[120px] max-w-[200px] select-none
                     ${activeTabId === tab.id 
                       ? "bg-background border-border border-b-transparent -mb-px font-medium text-primary z-10" 
                       : "bg-secondary/40 border-transparent text-muted-foreground hover:bg-secondary/60 border-b-border"}
                   `}
                 >
                   {tab.type === 'table' && <TableIcon className="w-3 h-3 shrink-0" />}
                   {tab.type === 'query' && <FileCode className="w-3 h-3 shrink-0" />}
                   {tab.type === 'graph' && <Network className="w-3 h-3 shrink-0" />}
                   {tab.type === 'preprocessing' && <Workflow className="w-3 h-3 shrink-0" />}
                  {tab.type === 'pipeline-result' && <TableIcon className="w-3 h-3 shrink-0 text-indigo-500" />}
                  <span className="truncate flex-1">{tab.title}</span>
                  <button 
                     onClick={(e) => closeTab(e, tab.id)}
                     className={`opacity-0 group-hover:opacity-100 p-0.5 rounded-full hover:bg-muted-foreground/20 ${activeTabId === tab.id ? "opacity-100" : ""}`}
                   >
                     <X className="w-3 h-3" />
                   </button>
                 </div>
               ))}
             </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden relative">
            {activeTab ? (
              activeTab.type === 'preprocessing' ? (
                <div className="flex flex-col h-full bg-background">
                  {activeTabId === 'PREPROCESSING' ? (
                    <div className="flex-1 overflow-auto p-6">
                      <div className="space-y-8">
                        <section>
                          <div className="flex items-center gap-2 mb-6">
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/70">Data Pipelines</h3>
                            <Badge variant="outline" className="ml-2 text-[10px] py-0 h-4 uppercase bg-indigo-500/10 text-indigo-600 border-indigo-200">Processing</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {SIDEBAR_ITEMS.find(c => c.category === "PREPROCESSING")?.items.map((tool) => (
                              <Card key={tool.id} className="group hover:border-indigo-500/50 cursor-pointer transition-all hover:shadow-md" onClick={() => openTab(tool)}>
                                <CardContent className="p-4 flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <Workflow className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold truncate">{tool.name}</div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                      <span>Active Pipeline</span>
                                      <span className="w-1 h-1 rounded-full bg-border" />
                                      <span>Ready</span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                            <Card 
                              className="border-dashed flex items-center justify-center p-4 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all"
                              onClick={() => createNew('preprocessing')}
                            >
                              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                <Plus className="w-5 h-5" />
                                <span className="text-xs font-medium">New Pipeline</span>
                              </div>
                            </Card>
                          </div>
                        </section>
                      </div>
                    </div>
                  ) : (
                    <DataPreprocessingBuilder onRun={handleRunPipeline} />
                  )}
                </div>
              ) : activeTab.type === 'pipeline-result' ? (
                <div className="flex flex-col h-full bg-background border-t-4 border-indigo-500/20">
                  <div className="h-12 border-b border-border bg-indigo-50/10 flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-indigo-500/10 text-indigo-600 border-indigo-200">Pipeline Result</Badge>
                      <span className="text-xs text-muted-foreground font-mono">
                        {activeTab.data?.length || 0} rows generated
                      </span>
                    </div>
                    <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setIsSaveResultDialogOpen(true)}>
                      <Save className="w-4 h-4" />
                      Save to Table
                    </Button>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <Table>
                      <TableHeader className="bg-secondary/20 sticky top-0 z-10">
                        <TableRow>
                          {activeTab.data && activeTab.data.length > 0 && Object.keys(activeTab.data[0]).map((key) => (
                            <TableHead key={key} className="h-8 text-xs font-semibold uppercase tracking-wider">{key}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeTab.data?.map((row, i) => (
                          <TableRow key={i} className="hover:bg-indigo-50/10 border-b border-border/50">
                            {Object.values(row).map((val: any, j) => (
                              <TableCell key={j} className="py-2 text-xs">{val}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : activeTab.type === 'graph' ? (
                <div className="flex flex-col h-full bg-background">
                  {activeTabId === 'Graph' ? (
                    <div className="flex-1 overflow-auto p-6">
                      <div className="space-y-8">
                        <section>
                          <div className="flex items-center gap-2 mb-6">
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/70">Knowledge Graphs</h3>
                            <Badge variant="outline" className="ml-2 text-[10px] py-0 h-4 uppercase bg-emerald-500/10 text-emerald-600 border-emerald-200">Visualization</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {SIDEBAR_ITEMS.find(c => c.category === "Graph")?.items.map((graph) => (
                              <Card key={graph.id} className="group hover:border-emerald-500/50 cursor-pointer transition-all hover:shadow-md" onClick={() => openTab(graph)}>
                                <CardContent className="p-4 flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    <Network className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold truncate">{graph.name}</div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                      <span>12 nodes</span>
                                      <span className="w-1 h-1 rounded-full bg-border" />
                                      <span>8 edges</span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                            <Card 
                              className="border-dashed flex items-center justify-center p-4 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all"
                              onClick={() => {
                                const id = `graph-builder-${Date.now()}`;
                                setTabs([...tabs, { id, type: 'graph', title: 'New Graph' }]);
                                setActiveTabId(id);
                                setIsGraphBuilderOpen(true);
                              }}
                            >
                              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                <Plus className="w-5 h-5" />
                                <span className="text-xs font-medium">New Graph</span>
                              </div>
                            </Card>
                          </div>
                        </section>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full overflow-hidden bg-secondary/5">
                      <div className="flex-1 overflow-auto">
                        <div className="p-8">
                          {/* Back Button and Title Area */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-4">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-full transition-colors -ml-1"
                                onClick={() => setActiveTabId('Graph')}
                                title="Back to List"
                              >
                                <ArrowLeft className="w-5 h-5" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Live Draft</span>
                              </div>
                              <Button variant="outline" size="sm" className="h-9 gap-2 bg-background border-border shadow-sm hover:bg-secondary/50">
                                <Save className="w-4 h-4" />
                                <span className="font-semibold">Save Changes</span>
                              </Button>
                            </div>
                          </div>

                          <div className="mb-4 ml-0">
                            <textarea 
                              defaultValue={activeTab.title}
                              className="bg-transparent border-none focus:ring-0 text-3xl font-bold text-foreground p-0 w-full resize-none overflow-hidden"
                              rows={1}
                              placeholder="Enter Graph Name..."
                              onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = target.scrollHeight + 'px';
                                
                                const newTabs = tabs.map(t => 
                                  t.id === activeTabId ? { ...t, title: target.value } : t
                                );
                                setTabs(newTabs);
                              }}
                              ref={(el) => {
                                if (el) {
                                  el.style.height = 'auto';
                                  el.style.height = el.scrollHeight + 'px';
                                }
                              }}
                            />
                            <textarea 
                              defaultValue="Define relationships between your data tables to generate complex graph structures."
                              className="bg-transparent border-none focus:ring-0 text-sm text-muted-foreground p-0 w-full mt-1 resize-none overflow-hidden"
                              rows={1}
                              placeholder="Enter description..."
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  // Allow standard Enter behavior (new line) 
                                  // but ensure textarea expands
                                }
                              }}
                              onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = target.scrollHeight + 'px';
                              }}
                              ref={(el) => {
                                if (el) {
                                  el.style.height = 'auto';
                                  el.style.height = el.scrollHeight + 'px';
                                }
                              }}
                            />
                          </div>

                          {isGraphBuilderOpen ? (
                            <GraphBuilderForm />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-secondary/5">
                               <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                                 <Network className="w-8 h-8 text-primary/50" />
                               </div>
                               <h3 className="text-lg font-medium text-foreground">Graph Visualization</h3>
                               <p className="max-w-md text-center mt-2 mb-6 text-sm">
                                 Configure your graph settings in the Graph view to visualize relationships between tables.
                               </p>
                               <Button onClick={() => setIsGraphBuilderOpen(true)}>Open Graph Builder</Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : activeTab.type === 'table' ? (
                <div className="flex flex-col h-full bg-background">
                  {selectedTable ? (
                    <TableDetailView tableName={selectedTable} />
                  ) : (
                    <div className="flex-1 overflow-auto p-6">
                      <div className="space-y-8">
                        {/* Original Tables Section */}
                        {(activeTabId === 'Table' || activeTabId === 'Original') && (
                          <section id="Original">
                            <div className="flex items-center gap-2 mb-4">
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/70">Original</h3>
                              <Badge variant="outline" className="ml-2 text-[10px] py-0 h-4 uppercase bg-secondary/30">Source</Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {sidebarItems.find(c => c.category === "Table")?.subcategories?.find(s => s.name === "Original")?.items.map((table) => (
                                <Card key={table.id} className={`group hover:border-primary/50 cursor-pointer transition-all hover:shadow-md ${activeTabId === table.id ? "border-primary ring-1 ring-primary/20 shadow-sm" : ""}`} onClick={() => setSelectedTable(table.name)}>
                                  <CardContent className="p-4 flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${activeTabId === table.id ? "bg-primary text-white" : "bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white"}`}>
                                      <TableIcon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-semibold truncate">{table.name}</div>
                                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                        <span>1,420 rows</span>
                                        <span className="w-1 h-1 rounded-full bg-border" />
                                        <span>Read-Write</span>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </section>
                        )}

                        {/* Custom Tables Section */}
                        {(activeTabId === 'Table' || activeTabId === 'Custom') && (
                          <section id="Custom">
                            <div className="flex items-center gap-2 mb-4">
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/70">Custom</h3>
                              <Badge variant="outline" className="ml-2 text-[10px] py-0 h-4 uppercase bg-indigo-500/10 text-indigo-600 border-indigo-200">Processed</Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {sidebarItems.find(c => c.category === "Table")?.subcategories?.find(s => s.name === "Custom")?.items.map((table) => (
                                <Card key={table.id} className={`group hover:border-indigo-500/50 cursor-pointer transition-all hover:shadow-md ${activeTabId === table.id ? "border-indigo-500 ring-1 ring-indigo-500/20 shadow-sm" : ""}`} onClick={() => setSelectedTable(table.name)}>
                                  <CardContent className="p-4 flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${activeTabId === table.id ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"}`}>
                                      <TableIcon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-semibold truncate">{table.name}</div>
                                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                        <span>582 rows</span>
                                        <span className="w-1 h-1 rounded-full bg-border" />
                                        <span>Derived</span>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </section>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : activeTab.type === 'query' ? (
                <div className="flex flex-col h-full bg-background">
                  {activeTabId === 'Query' ? (
                    <div className="flex-1 overflow-auto p-6">
                      <div className="space-y-8">
                        <section>
                          <div className="flex items-center gap-2 mb-6">
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/70">Saved Queries</h3>
                            <Badge variant="outline" className="ml-2 text-[10px] py-0 h-4 uppercase bg-indigo-500/10 text-indigo-600 border-indigo-200">Repository</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sidebarItems.find(c => c.category === "Query")?.items.map((query) => (
                              <Card key={query.id} className="group hover:border-indigo-500/50 cursor-pointer transition-all hover:shadow-md" onClick={() => openTab(query)}>
                                <CardContent className="p-4 flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <FileCode className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold truncate">{query.name}</div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                      <span>1 month ago</span>
                                      <span className="w-1 h-1 rounded-full bg-border" />
                                      <div className="flex items-center gap-1">
                                        <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center">
                                          <User className="w-2.5 h-2.5 text-indigo-600" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                            <Card 
                              className="border-dashed flex items-center justify-center p-4 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all"
                              onClick={() => createNew('query')}
                            >
                              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                <Plus className="w-5 h-5" />
                                <span className="text-xs font-medium">New Query</span>
                              </div>
                            </Card>
                          </div>
                        </section>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full">
                      {/* Query Editor Toolbar */}
                      <div className="h-12 border-b border-border bg-background/50 flex items-center justify-between px-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-[10px] bg-secondary/50">Read-Write</Badge>
                          <span className="text-xs text-muted-foreground">Last synced: Just now</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                            <Plus className="w-3 h-3" />
                            Insert Row
                          </Button>
                          <div className="h-4 w-px bg-border mx-1" />
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1 mr-2" onClick={() => setIsSaveDialogOpen(true)}>
                            <Save className="w-3 h-3" />
                            Save
                          </Button>
                          <QueryTemplateDialog 
                            onSelectQuery={handleTemplateQuery} 
                            trigger={
                              <Button size="sm" className="h-7 text-xs gap-1 bg-indigo-600 hover:bg-indigo-700 text-white">
                                <LayoutTemplate className="w-3 h-3" />
                                Template
                              </Button>
                            }
                          />
                        </div>
                      </div>

                      {/* Split View: Editor & Results */}
                      <ResizablePanelGroup direction="vertical" className="flex-1 flex flex-col overflow-hidden">
                        {/* SQL Editor Area */}
                        <ResizablePanel defaultSize={30} minSize={10}>
                          <div className="h-full border-b border-border bg-card/20 flex flex-col">
                            <ScrollArea className="flex-1 bg-secondary/5">
                              <div className="p-4 space-y-4">
                                {queryBlocks.map((block) => (
                                  <div key={block.id} className="group relative border border-border rounded-lg bg-card shadow-sm hover:border-primary/30 transition-all overflow-hidden mb-3">
                                    <div className="flex items-center justify-between px-3 py-2 bg-background">
                                      <div className="flex-1 flex items-center gap-2">
                                        <span className="text-sm font-medium text-foreground leading-none">
                                           {block.title || "Query"}
                                        </span>
                                      </div>
                                      <div className="flex items-center">
                                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground mr-3">
                                           <span>업데이트됨 1개월 전</span>
                                           <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                                             <User className="w-3.5 h-3.5 text-indigo-600" />
                                           </div>
                                        </div>
                                        <div className="h-3 w-px bg-border mr-1" />
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => handleRunQuery(block.sql)}>
                                          <Play className="w-3 h-3" /> 
                                        </Button>
                                        <div className="w-px h-3 bg-border mx-1" />
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeQueryBlock(block.id)}>
                                          <Trash2 className="w-3 h-3" /> 
                                        </Button>
                                      </div>
                                    </div>
                                    <div className="border-t border-border/50 bg-muted/20">
                                       <textarea 
                                         value={block.sql}
                                         onChange={(e) => updateQueryBlock(block.id, e.target.value)}
                                         className="w-full p-3 bg-transparent font-mono text-sm resize-none focus:outline-none text-foreground/80 min-h-[60px]"
                                         spellCheck={false}
                                         placeholder="원하는 데이터를 자연어로 설명해주세요..."
                                       />
                                    </div>
                                  </div>
                                ))}
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="w-full border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                                  onClick={() => setQueryBlocks([...queryBlocks, { id: Date.now().toString(), sql: "", title: "New Query", type: 'custom' }])}
                                >
                                  <Plus className="w-4 h-4 mr-2" /> Add Query Block
                                </Button>
                              </div>
                            </ScrollArea>
                          </div>
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        {/* Results Table */}
                        <ResizablePanel defaultSize={70} minSize={10}>
                          <div className="h-full flex flex-col bg-background overflow-hidden">
                            <div className="px-4 py-2 border-b border-border bg-secondary/10 flex justify-between items-center">
                              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Query Results</div>
                              <div className="text-xs text-muted-foreground">{queryData.length} rows found</div>
                            </div>
                            <div className="flex-1 overflow-auto">
                              <Table>
                                <TableHeader className="bg-secondary/20 sticky top-0">
                                  <TableRow>
                                    <TableHead className="w-[60px]">ID</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Severity</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {queryData.map((row) => (
                                    <TableRow key={row.id} className="hover:bg-secondary/30">
                                      <TableCell className="font-mono text-xs text-muted-foreground">{row.id}</TableCell>
                                      <TableCell className="font-medium">{row.type}</TableCell>
                                      <TableCell>{row.location}</TableCell>
                                      <TableCell className="text-muted-foreground text-xs">{row.time}</TableCell>
                                      <TableCell>
                                        <Badge variant={row.severity > 5 ? "destructive" : "secondary"} className="text-[10px]">
                                          Level {row.severity}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                         <Badge variant="outline" className="text-[10px]">{row.status}</Badge>
                                      </TableCell>
                                      <TableCell>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive">
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </ResizablePanel>
                      </ResizablePanelGroup>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <Database className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Select an item from the sidebar or create a new one</p>
                  </div>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Database className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Select an item from the sidebar or create a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog open={isSaveResultDialogOpen} onOpenChange={setIsSaveResultDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Result Table</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
               <Label>Table Name</Label>
               <Input 
                 placeholder="e.g. processed_crime_data_v1" 
                 value={newTableName}
                 onChange={(e) => setNewTableName(e.target.value)}
                 autoFocus
               />
               <p className="text-xs text-muted-foreground">
                 This table will be saved to the "Table &gt; Custom" category.
               </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveResultDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveResult} disabled={!newTableName.trim()}>Save Table</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isCreateProjectDialogOpen} onOpenChange={setIsCreateProjectDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input 
                        id="project-name" 
                        placeholder="Enter project name..." 
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCreateProject();
                        }}
                        autoFocus
                    />
                    <p className="text-xs text-muted-foreground">
                        Create a new project workspace to organize your data and analysis.
                    </p>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateProjectDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateProject} disabled={!newProjectName.trim()}>Create Project</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
