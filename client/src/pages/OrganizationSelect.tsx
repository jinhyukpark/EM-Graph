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
          <h1 className="text-3xl font-bold tracking-tight">Select Organization</h1>
          <p className="text-muted-foreground">Choose an organization to start analyzing or create a new one.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          
          {/* Organization List */}
          <Card className="md:col-span-1 shadow-lg border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg">Your Organizations</CardTitle>
              <CardDescription>
                You are a member of {orgs.length} organizations.
              </CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search organizations..."
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
                  No organizations found matching "{searchTerm}"
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full gap-2" size="lg">
                    <Plus className="w-4 h-4" /> Create New Organization
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Organization</DialogTitle>
                    <DialogDescription>
                      Create a new workspace for your team to collaborate on graph analysis.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="org-name">Organization Name</Label>
                      <Input 
                        id="org-name" 
                        placeholder="e.g. Acme Security Team" 
                        value={newOrgName}
                        onChange={(e) => setNewOrgName(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateOrg}>Create Organization</Button>
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
              <h3 className="text-xl font-bold mb-2">Why Organizations?</h3>
              <ul className="space-y-3">
                {[
                  "Collaborate with your team in real-time",
                  "Share graph projects and analysis reports",
                  "Manage permissions and access controls",
                  "Centralized billing and resource usage"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card/50">
               <h4 className="font-semibold mb-2">Need Enterprise features?</h4>
               <p className="text-sm text-muted-foreground mb-4">
                 Get SSO, advanced audit logs, and dedicated support for your large organization.
               </p>
               <Button variant="outline" size="sm" className="w-full">Contact Sales</Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
