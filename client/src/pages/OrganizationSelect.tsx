import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Plus, ArrowRight, CheckCircle2, Search, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock Organizations
const MOCK_ORGS = [
  { id: "org-1", name: "Acme Corp", members: 12, role: "Admin", plan: "Enterprise" },
  { id: "org-2", name: "CyberSec Team", members: 5, role: "Member", plan: "Pro" },
  { id: "org-3", name: "Data Lab", members: 3, role: "Viewer", plan: "Free" }
];

export default function OrganizationSelect() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [newOrgName, setNewOrgName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orgs, setOrgs] = useState(MOCK_ORGS);

  const filteredOrgs = orgs.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateOrg = () => {
    if (newOrgName.trim()) {
      const newOrg = {
        id: `org-${Date.now()}`,
        name: newOrgName,
        members: 1,
        role: "Admin",
        plan: "Free"
      };
      setOrgs([...orgs, newOrg]);
      setNewOrgName("");
      setIsDialogOpen(false);
      // Optional: Auto-redirect to dashboard
      // setLocation("/dashboard"); 
    }
  };

  const handleSelectOrg = (orgId: string) => {
    // In a real app, you'd set the active organization context here
    console.log("Selected Org:", orgId);
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">조직 선택</h1>
          <p className="text-muted-foreground">분석을 시작할 조직을 선택하거나 새로운 조직을 생성하세요.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          
          {/* Organization List */}
          <Card className="md:col-span-1 shadow-lg border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg">내 조직</CardTitle>
              <CardDescription>
                현재 {orgs.length}개 조직의 멤버입니다.
              </CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="조직 검색..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="h-[300px] overflow-y-auto pr-2 space-y-3">
              {filteredOrgs.length > 0 ? (
                filteredOrgs.map((org) => (
                  <div 
                    key={org.id}
                    onClick={() => handleSelectOrg(org.id)}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-secondary/50 hover:border-primary/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {org.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium group-hover:text-primary transition-colors">{org.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>{org.role}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {org.members}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground text-sm">
                  "{searchTerm}"와(과) 일치하는 조직이 없습니다
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full gap-2" size="lg">
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
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>취소</Button>
                    <Button onClick={handleCreateOrg}>조직 생성</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>

          {/* Feature / Info Section */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-indigo-500/20">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">조직을 사용하는 이유</h3>
              <ul className="space-y-3">
                {[
                  "팀원들과 실시간 협업",
                  "그래프 프로젝트 및 분석 리포트 공유",
                  "권한 및 접근 제어 관리",
                  "중앙화된 결제 및 리소스 관리"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card/50">
               <h4 className="font-semibold mb-2">엔터프라이즈 기능이 필요하신가요?</h4>
               <p className="text-sm text-muted-foreground mb-4">
                 SSO, 고급 감사 로그, 대규모 조직을 위한 전담 지원을 받아보세요.
               </p>
               <Button variant="outline" size="sm" className="w-full">영업팀 문의</Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
