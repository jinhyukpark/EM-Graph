import { Link, useLocation, useRoute } from "wouter";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { LayoutGrid, Share2, Database, FolderOpen, Settings, LogOut, AlertCircle, Table as TableIcon, Play, ChevronRight, ArrowLeft, Plus, Circle, CircleDot, Network, FileText, GitBranch, Workflow, Library, Sprout, Menu, ChevronsUpDown, Check, Building2, MoreVertical, MoreHorizontal, Search, Brain, ShoppingBag, Hash, Calendar, Type, MapPin, AlignLeft, Activity, Globe, MessageSquare, BookOpen, Puzzle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button, buttonVariants } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect, useCallback, useRef } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock Organizations (duplicated for mockup)
const MOCK_ORGS = [
  { id: "org-1", name: "코오롱베니트", members: 12, role: "Admin", plan: "Enterprise" },
  { id: "org-2", name: "CyberSec Team", members: 5, role: "Member", plan: "Pro" },
  { id: "org-3", name: "Data Lab", members: 3, role: "Viewer", plan: "Free" }
];

export default function Layout({ children, sidebar, sidebarControls }: { children: React.ReactNode, sidebar?: React.ReactNode, sidebarControls?: React.ReactNode }) {
  const { t, language, setLanguage } = useLanguage();
  const [location, setLocation] = useLocation();
  const [match, params] = useRoute("/project/:id/*?");
  const isProjectView = match;
  const projectId = params?.id;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertAction, setAlertAction] = useState<'switch-org' | 'logout' | null>(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(MOCK_ORGS[0]);
  const [pendingOrg, setPendingOrg] = useState<typeof MOCK_ORGS[0] | null>(null);
  
  // Sidebar resizing
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const newWidth = mouseMoveEvent.clientX;
        if (newWidth > 240 && newWidth < 480) {
          setSidebarWidth(newWidth);
        }
      }
    },
    [isResizing]
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  useEffect(() => {
    if (location === '/knowledge-garden' || location.startsWith('/knowledge-garden/')) {
      setIsCollapsed(true);
    }
  }, [location]);

  // Mock Usage Data for Sidebar
  const usage = {
    used: 3.2, // GB
    total: 5.0, // GB
    percent: 64
  };

  const handleAlertConfirm = () => {
    setIsAlertOpen(false);
    if (alertAction === 'switch-org' && pendingOrg) {
      setSelectedOrg(pendingOrg);
      setPendingOrg(null);
    } else if (alertAction === 'logout') {
      setLocation("/");
    }
    setAlertAction(null);
  };

  const handleOrgSelect = (org: typeof MOCK_ORGS[0]) => {
    if (org.id === selectedOrg.id) return;
    setPendingOrg(org);
    setAlertAction('switch-org');
    setIsAlertOpen(true);
  };

  const handleLogoutClick = () => {
    setAlertAction('logout');
    setIsAlertOpen(true);
  };

  const NavItem = ({ href, icon: Icon, label, special }: { href: string, icon: any, label: string, special?: boolean }) => {
    const content = (
      <Link href={href} className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors mb-1",
          special 
            ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-700 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/50 shadow-sm font-bold" 
            : location === href 
              ? "bg-primary/10 text-primary" 
              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          isCollapsed && "justify-center px-2"
        )}>
          <Icon className={cn("w-4 h-4", special ? "text-emerald-600 stroke-[2.5px]" : "")} />
          {!isCollapsed && label}
      </Link>
    );

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      );
    }
    return content;
  };

  const ProjectNavItem = ({ icon: Icon, label, active, count }: { icon: any, label: string, active?: boolean, count?: number }) => (
    <div className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors mb-0.5 cursor-pointer group",
      active 
        ? "bg-primary/5 text-primary" 
        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
      isCollapsed && "justify-center px-2"
    )}>
      <Icon className="w-4 h-4" />
      {!isCollapsed && <span className="truncate flex-1">{label}</span>}
      {count !== undefined && !isCollapsed && (
        <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-full group-hover:bg-secondary/80 transition-colors">
          {count}
        </span>
      )}
    </div>
  );

  const ExpandableNavItem = ({ icon: Icon, label, fields }: { icon: any, label: string, fields?: { name: string, type: any, alias?: string }[] }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-0.5">
            <div 
                className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer group",
                    isOpen ? "bg-secondary/50 text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                    isCollapsed && "justify-center px-2"
                )}
                onClick={() => !isCollapsed && setIsOpen(!isOpen)}
            >
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span className="truncate flex-1">{label}</span>}
                {!isCollapsed && fields && (
                    <ChevronRight className={cn("w-3 h-3 transition-transform opacity-50 group-hover:opacity-100", isOpen && "rotate-90")} />
                )}
            </div>
            {!isCollapsed && isOpen && fields && (
                <div className="pl-9 pr-2 py-1 space-y-0.5 animate-in slide-in-from-top-1 duration-200">
                    {fields.map((field, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm text-muted-foreground py-1 px-2 rounded hover:bg-muted/50 transition-colors cursor-pointer group/field">
                           <div className="flex items-center gap-2 overflow-hidden">
                             <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40 group-hover/field:opacity-100 transition-opacity shrink-0" />
                             <span className="truncate opacity-80 group-hover/field:opacity-100 transition-opacity">{field.name}</span>
                           </div>
                           {field.alias && (
                             <span className="text-[10px] text-muted-foreground/60 ml-2 shrink-0">{field.alias}</span>
                           )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
  };

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground flex font-sans selection:bg-primary/20 selection:text-primary">
      
      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={cn(
          "border-r border-border bg-card/50 backdrop-blur-xl flex-col hidden md:flex sticky top-0 h-screen group relative",
          isCollapsed && isProjectView ? "w-10 transition-all duration-300" : isCollapsed ? "w-16 transition-all duration-300" : isResizing ? "transition-none" : "transition-all duration-300"
        )}
        style={{ width: isCollapsed ? undefined : sidebarWidth }}
      >
        {/* Resize Handle */}
        {!isCollapsed && (
          <div
            className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-primary/50 transition-colors z-50 opacity-0 group-hover:opacity-100"
            onMouseDown={startResizing}
          />
        )}

        {/* Workspace Switcher / Logo Area */}
        {isCollapsed && isProjectView ? (
          <div className="flex flex-col items-center py-2 gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setIsCollapsed(false)}
            >
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Button>
          </div>
        ) : (
        <div className={cn("h-16 flex items-center border-b border-border/50 gap-1", isCollapsed ? "justify-center px-0" : "px-4 justify-between")}>
          {!isCollapsed && !isProjectView && (
            <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-md shrink-0">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold tracking-tight">EM-Graph</span>
            </Link>
          )}

          {!isCollapsed && isProjectView && (
             <div className="flex items-center gap-2 flex-1 overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-8 w-8 -ml-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowLeaveConfirm(true)}
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <span className="text-base font-bold tracking-tight truncate flex-1" title="City Crime Analysis 2024">
                  City Crime Analysis 2024
                </span>
             </div>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-foreground hidden md:flex shrink-0"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
             {isCollapsed ? <Menu className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
        )}

        {/* Navigation */}
        <nav className={cn("flex-1 p-0 overflow-hidden flex flex-col", isCollapsed && isProjectView && "hidden")}>
          
          {(!isCollapsed || (!isCollapsed && !isProjectView)) && !isProjectView && (
            <div className={cn("px-3 pt-6 pb-2", isCollapsed && "px-0 text-center")}>
               {!isCollapsed && (
                 <div className="flex items-center mb-2 px-1">
                   <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("workspace")}</span>
                 </div>
               )}
               <div className={cn("flex items-center gap-2", isCollapsed && "justify-center")}>
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     {isCollapsed ? (
                       <Button variant="ghost" size="icon" className="w-10 h-10 p-0 rounded-lg hover:bg-accent/50">
                          <div className="w-8 h-8 rounded bg-rose-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                             {selectedOrg.name.substring(0,1)}
                          </div>
                       </Button>
                     ) : (
                       <Button variant="outline" className="w-full justify-between px-2 h-10 text-left font-normal border-input shadow-sm bg-background hover:bg-accent/50">
                         <div className="flex items-center gap-2 truncate min-w-0">
                           <div className="w-6 h-6 rounded bg-rose-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                             {selectedOrg.name.substring(0,1)}
                           </div>
                           <span className="truncate text-sm font-medium">{selectedOrg.name}</span>
                         </div>
                         <ChevronsUpDown className="w-3 h-3 opacity-50 shrink-0" />
                       </Button>
                     )}
                   </DropdownMenuTrigger>
                   <DropdownMenuContent className="w-[200px]" align="start">
                     <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{t("switchWorkspace")}</DropdownMenuLabel>
                     {MOCK_ORGS.map((org) => (
                       <DropdownMenuItem key={org.id} onClick={() => handleOrgSelect(org)} className="flex items-center justify-between gap-2 cursor-pointer">
                         <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                             {org.name.substring(0, 1)}
                           </div>
                           <span>{org.name}</span>
                         </div>
                         {selectedOrg.id === org.id && <Check className="w-4 h-4 text-primary" />}
                       </DropdownMenuItem>
                     ))}
                   </DropdownMenuContent>
                 </DropdownMenu>
               </div>
            </div>
          )}
          
          {isProjectView && !isCollapsed && !sidebar && (
            <div className="h-px bg-border/50 w-full mb-2" />
          )}

          {isProjectView && (
            <div className={cn("shrink-0", sidebar ? "p-0" : "pt-0 pb-2", isCollapsed ? "px-2 text-center" : sidebar ? "px-0" : "px-4")}>
              {isCollapsed && (
                 <Link href="/projects" className={cn(
                     buttonVariants({ variant: "ghost", size: "sm" }),
                     "text-muted-foreground hover:text-foreground gap-1 p-0 h-8 w-8 justify-center mb-2"
                   )}>
                     <ArrowLeft className="w-4 h-4" />
                 </Link>
              )}
              
              {!isCollapsed && sidebarControls && (
                 <div className="mt-2 mb-2">
                   {sidebarControls}
                 </div>
              )}
            </div>
          )}

          {sidebar && !isCollapsed ? (
            <div className="flex-1 overflow-hidden flex flex-col">
              {sidebar}
            </div>
          ) : isProjectView ? (
            <div className={cn("overflow-y-auto space-y-6 animate-in slide-in-from-left-5 duration-300 flex-1", isCollapsed ? "px-2 py-4" : "px-4 pb-4")}>
              
              {!isCollapsed && (
                <div className="mb-6 mt-1">
                   <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5 opacity-80">
                      <Database className="w-3 h-3" />
                      {t("graphDatabase")}
                   </div>
                   <Select>
                      <SelectTrigger className="h-9 text-xs bg-card hover:bg-accent/50 border-input shadow-sm transition-colors text-muted-foreground data-[placeholder]:text-muted-foreground">
                         <div className="flex items-center gap-2 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                            <SelectValue placeholder={t("selectDatabase")} />
                         </div>
                      </SelectTrigger>
                      <SelectContent>
                         <SelectItem value="db1">Criminal Network 2024</SelectItem>
                         <SelectItem value="db2">Supply Chain V2</SelectItem>
                         <div className="p-1 border-t border-border mt-1 pt-1">
                             <Button variant="ghost" className="w-full justify-start h-8 text-xs font-medium text-primary gap-2 px-2 hover:bg-primary/5 hover:text-primary">
                                <Plus className="w-3 h-3" /> {t("createNewDatabase")}
                             </Button>
                         </div>
                      </SelectContent>
                   </Select>
                </div>
              )}

              {/* Project Structure Tree */}
              <div className="space-y-4">
                {/* Nodes */}
                <div>
                  {!isCollapsed && (
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center justify-between group cursor-pointer">
                      <span>{t("nodes")}</span>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                  <div className="space-y-0.5">
                    <ExpandableNavItem 
                        icon={CircleDot} 
                        label="crime_incidents_2024" 
                        fields={[
                            { name: "incident_id", type: Hash, alias: "ID" },
                            { name: "date_time", type: Calendar, alias: "Timestamp" },
                            { name: "type", type: Type, alias: "Category" },
                            { name: "location_lat", type: MapPin, alias: "Latitude" },
                            { name: "description", type: AlignLeft, alias: "Details" },
                            { name: "status", type: Activity, alias: "State" }
                        ]}
                    />
                    <ExpandableNavItem 
                        icon={CircleDot} 
                        label="suspect_profiles" 
                        fields={[
                             { name: "suspect_id", type: Hash, alias: "Suspect ID" },
                             { name: "full_name", type: Type, alias: "Name" },
                             { name: "alias", type: Type, alias: "Known As" },
                             { name: "date_of_birth", type: Calendar, alias: "DOB" },
                             { name: "risk_level", type: Activity, alias: "Risk Score" }
                        ]}
                    />
                  </div>
                </div>

                {/* Links */}
                <div>
                  {!isCollapsed && (
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center justify-between group cursor-pointer">
                      <span>{t("links")}</span>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                  <div className="space-y-0.5">
                    <ExpandableNavItem 
                        icon={Network} 
                        label="location_hotspots" 
                        fields={[
                            { name: "location_id", type: Hash, alias: "Loc ID" },
                            { name: "latitude", type: MapPin, alias: "Lat" },
                            { name: "longitude", type: MapPin, alias: "Long" },
                            { name: "intensity", type: Activity, alias: "Heat Level" },
                            { name: "last_updated", type: Calendar, alias: "Modified" }
                        ]}
                    />
                    <ExpandableNavItem 
                        icon={Network} 
                        label="supply_chain_nodes" 
                        fields={[
                            { name: "node_id", type: Hash, alias: "Node ID" },
                            { name: "node_type", type: Type, alias: "Type" },
                            { name: "capacity", type: Activity, alias: "Max Cap" },
                            { name: "location_name", type: AlignLeft, alias: "Location" },
                            { name: "status", type: Activity, alias: "Status" }
                        ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={cn("space-y-1 animate-in fade-in duration-300", isCollapsed ? "p-2" : "p-4")}>
              {!isCollapsed && <div className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 mt-2">{t("work")}</div>}
              <NavItem href="/dashboard" icon={LayoutGrid} label={t("dashboard")} />
              <NavItem href="/database" icon={Database} label={t("database")} />
              <NavItem href="/resources" icon={Library} label={t("resources")} />
              <NavItem href="/projects" icon={FolderOpen} label={t("graphAnalysis")} />
            </div>
          )}
          
          {!isProjectView && (
            <div className={cn("pt-0 mt-4", isCollapsed ? "p-2 border-t border-border/50" : "p-4")}>
              {!isCollapsed && <div className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t("ontology")}</div>}
              <NavItem href="/knowledge-garden" icon={Sprout} label={t("knowledgeGarden")} />
              <NavItem href="/brain-market" icon={Brain} label={t("brainMarket")} />
              <NavItem href="/business-glossary" icon={BookOpen} label={t("businessGlossary")} />
            </div>
          )}

          {!isProjectView && (
            <div className={cn("pt-0 mt-4", isCollapsed ? "p-2 border-t border-border/50" : "p-4")}>
              {!isCollapsed && <div className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t("intelligence")}</div>}
              <NavItem href="/intelligence/search" icon={Search} label={t("intelliSearch")} />
              <NavItem href="/intelligence/chatbot" icon={MessageSquare} label={t("intelliChatbot")} />
            </div>
          )}

          {!isProjectView && (
            <div className={cn("pt-0 mt-4", isCollapsed ? "p-2 border-t border-border/50" : "p-4")}>
              {!isCollapsed && <div className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t("extensions")}</div>}
              <NavItem href="/plugins" icon={Puzzle} label={t("plugins")} />
            </div>
          )}
        </nav>

        {/* Bottom Section: Storage & User */}
        {!isProjectView && (
        <div className={cn("border-t border-border/50 space-y-4 bg-secondary/10", isCollapsed ? "p-2" : "p-4")}>
          
          {/* Storage Widget */}
          {!isCollapsed && (
            <div className="bg-background rounded-lg p-3 border border-border shadow-sm">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-xs font-medium flex items-center gap-1">
                   <Database className="w-3 h-3 text-primary" /> {t("storage")}
                 </span>
                 <span className="text-[10px] text-muted-foreground">{usage.used}GB / {usage.total}GB</span>
              </div>
              <Progress value={usage.percent} className="h-1.5 mb-2" />
               <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {(usage.total - usage.used).toFixed(1)}GB {t("remaining")}
               </div>
            </div>
          )}

          {/* Language Toggle */}
          <div className={cn("flex items-center", isCollapsed ? "justify-center" : "px-1")}>
            <button
              onClick={() => setLanguage(language === "en" ? "ko" : "en")}
              className={cn(
                "flex items-center gap-1.5 rounded-md text-xs font-medium transition-colors hover:bg-secondary",
                isCollapsed ? "p-1.5" : "px-2 py-1.5 w-full justify-center"
              )}
              data-testid="button-language-toggle"
            >
              <Globe className="w-3.5 h-3.5 text-muted-foreground" />
              {!isCollapsed && (
                <span className="text-muted-foreground">
                  {language === "en" ? "EN" : "KR"} → {language === "en" ? "KR" : "EN"}
                </span>
              )}
            </button>
          </div>

          {/* User Profile */}
          <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3 px-1")}>
            <div 
              className={cn(
                "flex items-center cursor-pointer group",
                isCollapsed ? "justify-center" : "gap-3 flex-1 min-w-0"
              )}
              onClick={() => setLocation("/settings")}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-background shadow-sm shrink-0 group-hover:ring-primary/50 transition-all">
                JD
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">John Doe</div>
                  <div className="text-xs text-muted-foreground truncate">john@emgraph.ai</div>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <div className="flex items-center gap-0.5 shrink-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
                      onClick={() => setLanguage(language === "en" ? "ko" : "en")}
                      data-testid="button-language-toggle"
                    >
                      <Globe className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">{language === "en" ? "한국어" : "ENG"}</TooltipContent>
                </Tooltip>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
                  onClick={handleLogoutClick}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
            {isCollapsed && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
                    onClick={() => setLanguage(language === "en" ? "ko" : "en")}
                    data-testid="button-language-toggle-collapsed"
                  >
                    <Globe className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{language === "en" ? "한국어" : "ENG"}</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header (Visible only on small screens) */}
        <header className="md:hidden h-16 border-b border-border bg-background/90 backdrop-blur-md flex items-center px-4 justify-between sticky top-0 z-50">
           <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight">EM-Graph</span>
          </Link>
          <Button variant="ghost" size="icon">
            <LayoutGrid className="w-5 h-5" />
          </Button>
        </header>

        <main className="flex-1 overflow-hidden relative">
           {children}
        </main>
      </div>

      <AlertDialog open={showLeaveConfirm} onOpenChange={setShowLeaveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("leaveWorkspace")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("leaveWorkspaceDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setShowLeaveConfirm(false); setLocation("/projects"); }}>
              {t("leave")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("unsavedChanges")}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertAction === 'switch-org' 
                ? t("switchOrgWarning")
                : t("logoutWarning")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertAction(null)}>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleAlertConfirm}>
              {alertAction === 'switch-org' ? t("switchOrganization") : t("logOut")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
