import { Link, useLocation, useRoute } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutGrid, Share2, Database, FolderOpen, Settings, LogOut, AlertCircle, Table as TableIcon, Play, ChevronRight, ArrowLeft, Plus, Circle, CircleDot, Network, FileText, GitBranch, Workflow, Library, Sprout, Menu, ChevronsUpDown, Check, Building2, MoreVertical, MoreHorizontal, Search } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
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

// Mock Organizations (duplicated for mockup)
const MOCK_ORGS = [
  { id: "org-1", name: "Acme Corp", members: 12, role: "Admin", plan: "Enterprise" },
  { id: "org-2", name: "CyberSec Team", members: 5, role: "Member", plan: "Pro" },
  { id: "org-3", name: "Data Lab", members: 3, role: "Viewer", plan: "Free" }
];

export default function Layout({ children, sidebar, sidebarControls }: { children: React.ReactNode, sidebar?: React.ReactNode, sidebarControls?: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [match, params] = useRoute("/project/:id/*?");
  const isProjectView = match;
  const projectId = params?.id;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertAction, setAlertAction] = useState<'switch-org' | 'logout' | null>(null);
  const [selectedOrg, setSelectedOrg] = useState(MOCK_ORGS[0]);
  const [pendingOrg, setPendingOrg] = useState<typeof MOCK_ORGS[0] | null>(null);

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
      <Link href={href}>
        <a className={cn(
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
        </a>
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
      "flex items-center gap-3 px-3 py-2 rounded-md text-xs transition-colors mb-0.5 cursor-pointer group",
      active 
        ? "bg-primary/5 text-primary font-medium" 
        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
      isCollapsed && "justify-center px-2"
    )}>
      <Icon className="w-3.5 h-3.5" />
      {!isCollapsed && <span className="truncate flex-1">{label}</span>}
      {count !== undefined && !isCollapsed && (
        <span className="text-[9px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-full group-hover:bg-secondary/80 transition-colors">
          {count}
        </span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans selection:bg-primary/20 selection:text-primary">
      
      {/* Sidebar */}
      <aside className={cn(
        "border-r border-border bg-card/50 backdrop-blur-xl flex-col hidden md:flex sticky top-0 h-screen transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Workspace Switcher / Logo Area */}
        <div className={cn("h-16 flex items-center border-b border-border/50 gap-1", isCollapsed ? "justify-center px-0" : "px-3 justify-between")}>
          {!isCollapsed && (
            <Link href="/dashboard">
              <a className="flex items-center gap-2 px-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-md shrink-0">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold tracking-tight">EM-Graph</span>
              </a>
            </Link>
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

        {/* Navigation */}
        <nav className="flex-1 p-0 overflow-hidden flex flex-col">
          
          {(!isCollapsed || (!isCollapsed && !isProjectView)) && !isProjectView && (
            <div className={cn("px-3 pt-6 pb-2", isCollapsed && "px-0 text-center")}>
               {!isCollapsed && (
                 <div className="flex items-center mb-2 px-1">
                   <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Workspace</span>
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
                     <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Switch Workspace</DropdownMenuLabel>
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
          
          {isProjectView && (
            <div className={cn("pt-4 pb-2 shrink-0", isCollapsed ? "px-2 text-center" : "px-6")}>
              <Link href="/projects">
                <Button variant="ghost" size="sm" className={cn(
                  "text-muted-foreground hover:text-foreground gap-1",
                  isCollapsed ? "p-0 h-8 w-8 justify-center" : "-ml-2 mb-2 pl-2 pr-4"
                )}>
                  <ArrowLeft className="w-4 h-4" />
                  {!isCollapsed && "Back to Projects"}
                </Button>
              </Link>
              
              {!isCollapsed && sidebarControls && (
                 <div className="mb-2">
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
                <div>
                  <div className="px-1 mb-6">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Active Project</div>
                    <h2 className="font-semibold text-lg leading-tight text-foreground">City Crime Analysis 2024</h2>
                  </div>
                </div>
              )}

              {/* Project Structure Tree */}
              <div className="space-y-4">
                {/* Original Tables */}
                <div>
                  {!isCollapsed && (
                    <div className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center justify-between group cursor-pointer">
                      <span>Table (Original)</span>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                  <div className="space-y-0.5">
                    <ProjectNavItem icon={TableIcon} label="crime_incidents_2024" />
                    <ProjectNavItem icon={TableIcon} label="suspect_profiles" />
                  </div>
                </div>

                {/* Pre-processed Tables */}
                <div>
                  {!isCollapsed && (
                    <div className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center justify-between group cursor-pointer">
                      <span>Table (Pre-processing)</span>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                  <div className="space-y-0.5">
                    <ProjectNavItem icon={TableIcon} label="location_hotspots" />
                    <ProjectNavItem icon={TableIcon} label="supply_chain_nodes" />
                  </div>
                </div>

                {/* Queries */}
                <div>
                  {!isCollapsed && (
                    <div className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center justify-between group cursor-pointer">
                      <span>Query</span>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                  <div className="space-y-0.5">
                    <ProjectNavItem icon={FileText} label="High Severity Crimes" />
                    <ProjectNavItem icon={FileText} label="District Analysis" />
                  </div>
                </div>

                {/* Graphs */}
                <div>
                  {!isCollapsed && (
                    <div className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center justify-between group cursor-pointer">
                      <span>Graph</span>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                  <div className="space-y-0.5">
                    <ProjectNavItem icon={Network} label="Crime Network 2024" active />
                    <ProjectNavItem icon={Network} label="Supply Chain Risk" />
                  </div>
                </div>

                {/* Pre-process Diagrams (NEW) */}
                <div>
                  {!isCollapsed && (
                    <div className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center justify-between group cursor-pointer">
                      <span>Pre-process</span>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                  <div className="space-y-0.5">
                    <ProjectNavItem icon={Workflow} label="Data Pipeline v1" />
                    <ProjectNavItem icon={Workflow} label="Suspect Linkage Flow" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={cn("space-y-1 animate-in fade-in duration-300", isCollapsed ? "p-2" : "p-4")}>
              {!isCollapsed && <div className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 mt-2">Work</div>}
              <NavItem href="/dashboard" icon={LayoutGrid} label="Dashboard" />
              <NavItem href="/projects" icon={FolderOpen} label="Projects" />
              <NavItem href="/database" icon={Database} label="Database" />
              <NavItem href="/resources" icon={Library} label="Resources" />
            </div>
          )}
          
          {!isProjectView && (
            <div className={cn("pt-0 mt-4", isCollapsed ? "p-2 border-t border-border/50" : "p-4")}>
              {!isCollapsed && <div className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Ontology</div>}
              <NavItem href="/knowledge-garden" icon={Sprout} label="Knowledge Garden" />
            </div>
          )}
        </nav>

        {/* Bottom Section: Storage & User */}
        <div className={cn("border-t border-border/50 space-y-4 bg-secondary/10", isCollapsed ? "p-2" : "p-4")}>
          
          {/* Storage Widget */}
          {!isCollapsed && (
            <div className="bg-background rounded-lg p-3 border border-border shadow-sm">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-xs font-medium flex items-center gap-1">
                   <Database className="w-3 h-3 text-primary" /> Storage
                 </span>
                 <span className="text-[10px] text-muted-foreground">{usage.used}GB / {usage.total}GB</span>
              </div>
              <Progress value={usage.percent} className="h-1.5 mb-2" />
               <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {(usage.total - usage.used).toFixed(1)}GB remaining
               </div>
            </div>
          )}

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
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
                onClick={handleLogoutClick}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header (Visible only on small screens) */}
        <header className="md:hidden h-16 border-b border-border bg-background/90 backdrop-blur-md flex items-center px-4 justify-between sticky top-0 z-50">
           <Link href="/dashboard">
            <a className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight">EM-Graph</span>
            </a>
          </Link>
          <Button variant="ghost" size="icon">
            <LayoutGrid className="w-5 h-5" />
          </Button>
        </header>

        <main className="flex-1 overflow-hidden relative">
           {children}
        </main>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              {alertAction === 'switch-org' 
                ? "If you switch organizations, any unsaved changes will be lost. Are you sure you want to continue?"
                : "If you log out, any unsaved changes will be lost. Are you sure you want to log out?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertAction(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAlertConfirm}>
              {alertAction === 'switch-org' ? "Switch Organization" : "Log Out"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
