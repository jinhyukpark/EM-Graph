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
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Plus, Search, Users, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n";

const MOCK_ORGS = [
  { id: "org-1", name: "Acme Corp", members: 12, role: "Admin", plan: "Enterprise" },
  { id: "org-2", name: "CyberSec Team", members: 5, role: "Member", plan: "Pro" },
  { id: "org-3", name: "Data Lab", members: 3, role: "Viewer", plan: "Free" }
];

export default function OrganizationSelect() {
  const [, setLocation] = useLocation();
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgId, setNewOrgId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteOrgId, setDeleteOrgId] = useState<string | null>(null);
  const [orgs, setOrgs] = useState(MOCK_ORGS);
  const { t } = useLanguage();
  
  const handleCreateOrg = () => {
    if (newOrgName.trim() && newOrgId.trim()) {
      const newOrg = {
        id: newOrgId,
        name: newOrgName,
        members: 1,
        role: "Admin",
        plan: "Free"
      };
      setOrgs([...orgs, newOrg]);
      setNewOrgName("");
      setNewOrgId("");
      setIsDialogOpen(false);
    }
  };

  const handleDeleteOrg = (e: React.MouseEvent, orgId: string) => {
    e.stopPropagation();
    setDeleteOrgId(orgId);
  };

  const confirmDelete = () => {
    if (deleteOrgId) {
      setOrgs(orgs.filter(org => org.id !== deleteOrgId));
      setDeleteOrgId(null);
      toast.success(t("orgDeleted"));
    }
  };

  const handleSelectOrg = (orgId: string) => {
    console.log("Selected Org:", orgId);
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      <div className="w-full max-w-lg space-y-8 relative z-10">
        
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t("selectWorkspace")}</h1>
          <p className="text-slate-500 whitespace-pre-line">
            {t("selectWorkspaceDesc")}
          </p>
        </div>

        <Card className="shadow-sm border-slate-200 bg-white/80 backdrop-blur-sm flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-500" />
              {t("myOrganizations")}
            </CardTitle>
            <CardDescription>
              {t("participatingIn")} <span className="text-indigo-600 font-bold text-base">{orgs.length}</span> {t("orgCount")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 max-h-[400px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {orgs.length > 0 ? (
              orgs.map((org) => (
                <div 
                  key={org.id}
                  onClick={() => handleSelectOrg(org.id)}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:bg-indigo-50/30 hover:border-indigo-200 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarFallback className={`font-bold ${
                        org.plan === 'Enterprise' ? 'bg-indigo-100 text-indigo-600' : 
                        org.plan === 'Pro' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {org.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">{org.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">{org.role}</span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {org.members}{t("members")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                        onClick={(e) => handleDeleteOrg(e, org.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                 <p className="text-slate-500 text-sm">{t("noOrganizations")}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t border-slate-100 pt-4 bg-slate-50/30 rounded-b-xl">
            
            <AlertDialog open={!!deleteOrgId} onOpenChange={(open) => !open && setDeleteOrgId(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("deleteOrgConfirm")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("deleteOrgWarning")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
                    {t("confirmDelete")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700" size="lg">
                  <Plus className="w-4 h-4" /> {t("createNewOrg")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("createOrg")}</DialogTitle>
                  <DialogDescription>
                    {t("createOrgDesc")}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">{t("orgName")}</Label>
                    <Input 
                      id="org-name" 
                      placeholder={t("orgNamePlaceholder")} 
                      value={newOrgName}
                      onChange={(e) => setNewOrgName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-id">{t("orgId")}</Label>
                    <Input 
                      id="org-id" 
                      placeholder={t("orgIdPlaceholder")} 
                      value={newOrgId}
                      onChange={(e) => setNewOrgId(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">{t("orgIdHint")}</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t("cancel")}</Button>
                  <Button onClick={handleCreateOrg} disabled={!newOrgName || !newOrgId}>{t("createOrg")}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}
