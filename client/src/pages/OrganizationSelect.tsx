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
import { Textarea } from "@/components/ui/textarea";
import { Building2, Plus, Search, Users, Trash2, Database, Send } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

// Mock Organizations
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
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [deleteOrgId, setDeleteOrgId] = useState<string | null>(null);
  const [orgs, setOrgs] = useState(MOCK_ORGS);
  
  // Contact Form State
  const [contactTitle, setContactTitle] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactContent, setContactContent] = useState("");

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
      // Optional: Auto-redirect to dashboard
      // setLocation("/dashboard"); 
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
      toast.success("조직이 삭제되었습니다.");
    }
  };

  const handleSelectOrg = (orgId: string) => {
    // In a real app, you'd set the active organization context here
    console.log("Selected Org:", orgId);
    setLocation("/dashboard");
  };

  const handleContactSubmit = () => {
    // Mock submission logic
    console.log("Contact Form Submitted:", { title: contactTitle, email: contactEmail, content: contactContent });
    
    // Reset form
    setContactTitle("");
    setContactEmail("");
    setContactContent("");
    setIsContactDialogOpen(false);

    // Show success message
    toast.success("문의가 접수되었습니다.", {
      description: "담당자가 확인 후 빠르게 연락드리겠습니다.",
    });
  };

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

        {/* Organization List */}
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
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {org.members}명</span>
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
                 <p className="text-slate-500 text-sm">참여중인 조직이 없습니다.</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t border-slate-100 pt-4 bg-slate-50/30 rounded-b-xl">
            
            <AlertDialog open={!!deleteOrgId} onOpenChange={(open) => !open && setDeleteOrgId(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>조직을 삭제하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription>
                    이 작업은 되돌릴 수 없습니다. 조직과 관련된 모든 데이터가 영구적으로 삭제됩니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
                    삭제 확인
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

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
                    <Label htmlFor="org-id">조직 아이디</Label>
                    <Input 
                      id="org-id" 
                      placeholder="예: security-team-01" 
                      value={newOrgId}
                      onChange={(e) => setNewOrgId(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">영문, 숫자, 하이픈(-)만 사용 가능합니다.</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>취소</Button>
                  <Button onClick={handleCreateOrg} disabled={!newOrgName || !newOrgId}>조직 생성</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        {/* Custom Solution Banner */}
        <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            
            <div className="p-3 bg-indigo-500/20 rounded-lg shrink-0">
                <Database className="w-6 h-6 text-indigo-400" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
                <h3 className="font-semibold text-lg mb-1">Need a custom solution?</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                    For large-scale deployments, on-premise requirements, or custom integrations beyond the Premium plan, our sales team can build a tailored package for your organization.
                </p>
            </div>
            
            <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="secondary" className="whitespace-nowrap font-medium shrink-0">
                        Contact Sales Team
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>영업팀 문의하기</DialogTitle>
                    <DialogDescription>
                    도입 문의나 파트너십 제안 등 궁금한 점을 남겨주세요.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                    <Label htmlFor="contact-title">제목</Label>
                    <Input 
                        id="contact-title" 
                        placeholder="문의 제목을 입력해주세요" 
                        value={contactTitle}
                        onChange={(e) => setContactTitle(e.target.value)}
                    />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="contact-email">담당자 이메일</Label>
                    <Input 
                        id="contact-email" 
                        type="email"
                        placeholder="contact@company.com" 
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                    />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="contact-content">문의 내용</Label>
                    <Textarea 
                        id="contact-content" 
                        placeholder="궁금하신 내용을 자세히 적어주세요." 
                        className="min-h-[120px] resize-none"
                        value={contactContent}
                        onChange={(e) => setContactContent(e.target.value)}
                    />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsContactDialogOpen(false)}>취소</Button>
                    <Button onClick={handleContactSubmit} disabled={!contactTitle || !contactEmail || !contactContent} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                    <Send className="w-4 h-4" /> 문의하기
                    </Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>

      </div>
    </div>
  );
}
