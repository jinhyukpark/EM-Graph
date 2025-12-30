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
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Plus, Users, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { organizations as orgsAPI, auth as authAPI } from "@/lib/api";
import { type Organization } from "@shared/schema";

export default function OrganizationSelect() {
  const [, setLocation] = useLocation();
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgDescription, setNewOrgDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      const data = await orgsAPI.list();
      setOrgs(data);
    } catch (error) {
      toast.error("Failed to load organizations");
      // Check if user is authenticated
      try {
        await authAPI.me();
      } catch {
        setLocation("/");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateOrg = async () => {
    if (!newOrgName.trim()) {
      toast.error("조직 이름을 입력해주세요");
      return;
    }

    setCreating(true);
    try {
      const newOrg = await orgsAPI.create({
        name: newOrgName,
        description: newOrgDescription || undefined,
      });
      
      setOrgs([...orgs, newOrg]);
      setNewOrgName("");
      setNewOrgDescription("");
      setIsDialogOpen(false);
      toast.success("조직이 생성되었습니다");
      
      // Auto-redirect to dashboard with new organization
      localStorage.setItem("selectedOrgId", newOrg.id);
      setLocation("/dashboard");
    } catch (error) {
      toast.error("조직 생성에 실패했습니다");
    } finally {
      setCreating(false);
    }
  };

  const handleSelectOrg = (orgId: string) => {
    localStorage.setItem("selectedOrgId", orgId);
    setLocation("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      <div className="w-full max-w-lg space-y-8 relative z-10">
        
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">워크스페이스 선택</h1>
          <p className="text-slate-500">
            협업 중인 조직을 선택하여 분석을 시작하세요.<br />
            또는 새로운 팀을 만들어보세요.
          </p>
        </div>

        <Card className="shadow-sm border-slate-200 bg-white/80 backdrop-blur-sm flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-500" />
              내 조직
            </CardTitle>
            <CardDescription>
              현재 <span className="text-indigo-600 font-bold text-base">{orgs.length}개</span> 조직에 참여중입니다.
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
                      <AvatarFallback className="font-bold bg-indigo-100 text-indigo-600">
                        {org.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">{org.name}</div>
                      {org.description && (
                        <div className="text-xs text-slate-500 mt-0.5">{org.description}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                 <p className="text-slate-500 text-sm">참여중인 조직이 없습니다.</p>
                 <p className="text-slate-400 text-xs mt-1">새 조직을 만들어 시작하세요.</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t border-slate-100 pt-4 bg-slate-50/30 rounded-b-xl">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700" size="lg">
                  <Plus className="w-4 h-4" /> 새 조직 만들기
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>조직 생성</DialogTitle>
                  <DialogDescription>
                    팀원들과 함께 그래프 분석을 협업할 새로운 워크스페이스를 만듭니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">조직 이름</Label>
                    <Input 
                      id="org-name" 
                      placeholder="예: 보안 분석 팀" 
                      value={newOrgName}
                      onChange={(e) => setNewOrgName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-description">설명 (선택사항)</Label>
                    <Input 
                      id="org-description" 
                      placeholder="조직에 대한 간단한 설명" 
                      value={newOrgDescription}
                      onChange={(e) => setNewOrgDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>취소</Button>
                  <Button onClick={handleCreateOrg} disabled={!newOrgName || creating}>
                    {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    조직 생성
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}
