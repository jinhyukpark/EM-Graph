import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, Copy, CreditCard, Globe, Key, Lock, Mail, Plus, Server, Shield, Trash2, UserPlus, Users, Zap, Settings as SettingsIcon, Download, FileText, RefreshCw, Pencil, Activity, Database, LayoutGrid } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

export default function Settings() {
  const [inviteLink] = useState("https://em-graph.ai/join/x8d9f2k");
  const [activeTab, setActiveTab] = useState("account");
  
  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Link Copied",
      description: "Invitation link copied to clipboard",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account, team, billing, and system configurations.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-[800px]">
            <TabsTrigger value="account">Account & Security</TabsTrigger>
            <TabsTrigger value="team">Team & Roles</TabsTrigger>
            <TabsTrigger value="billing">Billing & License</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="mcp">MCP Integrations</TabsTrigger>
          </TabsList>

          {/* Account & Security Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and email address.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">JD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">Change Avatar</Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@emgraph.ai" />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>Save Profile</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Password & Security</CardTitle>
                <CardDescription>Manage your password and security settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input id="new" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm New Password</Label>
                  <Input id="confirm" type="password" />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4 flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Last changed: 3 months ago
                </div>
                <Button variant="outline">Update Password</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Team & Roles Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Invite your colleagues and manage permissions.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                         <Shield className="w-4 h-4" />
                         Role Guide
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Role Permissions Guide</DialogTitle>
                        <DialogDescription>Understanding access levels in your workspace.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                         <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                           <div className="font-semibold flex items-center gap-2 mb-2">
                             <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Owner</Badge>
                           </div>
                           <p className="text-sm text-muted-foreground">Full access to all features, billing, and team management. Can delete the workspace.</p>
                         </div>
                         <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                           <div className="font-semibold flex items-center gap-2 mb-2">
                             <Badge variant="outline" className="bg-secondary text-secondary-foreground border-secondary-foreground/20">Editor</Badge>
                           </div>
                           <p className="text-sm text-muted-foreground">Can create and edit projects, databases, and resources. Cannot manage billing or invite members.</p>
                         </div>
                         <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                           <div className="font-semibold flex items-center gap-2 mb-2">
                             <Badge variant="outline" className="text-muted-foreground border-border">Viewer</Badge>
                           </div>
                           <p className="text-sm text-muted-foreground">Read-only access to projects and dashboards. Cannot make any changes or export data.</p>
                         </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <UserPlus className="w-4 h-4" />
                        Invite Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Invite Team Member</DialogTitle>
                        <DialogDescription>
                          Send an invitation link or email to join your workspace.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label>Email Invitation</Label>
                          <div className="flex gap-2">
                            <Input placeholder="colleague@company.com" />
                            <Button>Send</Button>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or share link</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Invite Link</Label>
                          <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                              <Input
                                id="link"
                                defaultValue={inviteLink}
                                readOnly
                                className="bg-muted/50 font-mono text-xs"
                              />
                            </div>
                            <Button type="button" size="icon" variant="secondary" onClick={copyLink}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/20 text-primary text-xs">JD</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">John Doe</div>
                            <div className="text-xs text-muted-foreground">john@emgraph.ai</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Owner</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" disabled>Manage</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-orange-500/20 text-orange-600 text-xs">AS</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Alice Smith</div>
                            <div className="text-xs text-muted-foreground">alice@emgraph.ai</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select defaultValue="editor">
                          <SelectTrigger className="h-8 w-[110px] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Owner</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-slate-200 text-slate-500 text-xs">MK</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Mike Kim</div>
                            <div className="text-xs text-muted-foreground">mike@partner.com</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select defaultValue="viewer">
                          <SelectTrigger className="h-8 w-[110px] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Owner</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-amber-500 font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Pending
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Menu Access Permissions</CardTitle>
                <CardDescription>Configure menu visibility and access rights for each role.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[300px]">Feature / Menu</TableHead>
                      <TableHead className="text-center">Owner</TableHead>
                      <TableHead className="text-center">Editor</TableHead>
                      <TableHead className="text-center">Viewer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { feature: "Dashboard Access", owner: true, editor: true, viewer: true },
                      { feature: "Projects (Create/Edit)", owner: true, editor: true, viewer: false },
                      { feature: "Database (Write)", owner: true, editor: true, viewer: false },
                      { feature: "Resources (Upload)", owner: true, editor: true, viewer: false },
                      { feature: "Team Management", owner: true, editor: false, viewer: false },
                      { feature: "Billing & License", owner: true, editor: false, viewer: false },
                      { feature: "API Key Generation", owner: true, editor: true, viewer: false },
                    ].map((perm, i) => (
                      <TableRow key={i} className="hover:bg-transparent">
                        <TableCell className="font-medium">{perm.feature}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            {perm.owner ? <Check className="w-4 h-4 text-primary" /> : <div className="w-4 h-4 bg-secondary/50 rounded-sm mx-auto" />}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            {perm.editor ? <Check className="w-4 h-4 text-primary" /> : <div className="w-4 h-4 rounded-sm border border-border mx-auto" />}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            {perm.viewer ? <Check className="w-4 h-4 text-primary" /> : <div className="w-4 h-4 rounded-sm border border-border mx-auto" />}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing & License Tab */}
          <TabsContent value="billing" className="space-y-6">
             <div className="grid gap-6 lg:grid-cols-3">
               {/* Free Plan */}
               <Card className="border-border/50 relative overflow-hidden">
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                     <span className="text-xl">Free</span>
                   </CardTitle>
                   <CardDescription>Perfect for individuals starting out.</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="text-3xl font-bold mb-2">$0<span className="text-base font-normal text-muted-foreground">/mo</span></div>
                   <div className="space-y-3 mt-6">
                     <div className="flex items-center gap-2 text-sm">
                       <Check className="w-4 h-4 text-emerald-500" /> Up to 3 Projects
                     </div>
                     <div className="flex items-center gap-2 text-sm">
                       <Check className="w-4 h-4 text-emerald-500" /> Basic Analytics
                     </div>
                     <div className="flex items-center gap-2 text-sm">
                       <Check className="w-4 h-4 text-emerald-500" /> Community Support
                     </div>
                   </div>
                 </CardContent>
                 <CardFooter>
                   <Button variant="outline" className="w-full">Current Plan</Button>
                 </CardFooter>
               </Card>

               {/* Pro Plan */}
               <Card className="bg-primary/5 border-primary shadow-lg scale-105 relative z-10">
                 <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-bl-lg">
                   POPULAR
                 </div>
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2 text-primary">
                     <Zap className="w-5 h-5" />
                     <span className="text-xl">Pro</span>
                   </CardTitle>
                   <CardDescription>For professionals and small teams.</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="text-3xl font-bold mb-2">$49<span className="text-base font-normal text-muted-foreground">/mo</span></div>
                   <div className="space-y-3 mt-6">
                     <div className="flex items-center gap-2 text-sm">
                       <Check className="w-4 h-4 text-primary" /> Unlimited Projects
                     </div>
                     <div className="flex items-center gap-2 text-sm">
                       <Check className="w-4 h-4 text-primary" /> Advanced AI Analytics
                     </div>
                     <div className="flex items-center gap-2 text-sm">
                       <Check className="w-4 h-4 text-primary" /> 5 Team Members
                     </div>
                     <div className="flex items-center gap-2 text-sm">
                       <Check className="w-4 h-4 text-primary" /> Priority Support
                     </div>
                   </div>
                 </CardContent>
                 <CardFooter>
                   <Button className="w-full shadow-md">Upgrade to Pro</Button>
                 </CardFooter>
               </Card>

               {/* Enterprise Plan */}
               <Card className="border-border/50 bg-slate-900 text-slate-50 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none" />
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                     <Shield className="w-5 h-5 text-indigo-400" />
                     <span className="text-xl">Enterprise</span>
                   </CardTitle>
                   <CardDescription className="text-slate-400">For large organizations requiring scale.</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="text-3xl font-bold mb-2">Custom</div>
                   <div className="space-y-3 mt-6 text-slate-300">
                     <div className="flex items-center gap-2 text-sm">
                       <Check className="w-4 h-4 text-indigo-400" /> Unlimited Everything
                     </div>
                     <div className="flex items-center gap-2 text-sm">
                       <Check className="w-4 h-4 text-indigo-400" /> Dedicated Infrastructure
                     </div>
                     <div className="flex items-center gap-2 text-sm">
                       <Check className="w-4 h-4 text-indigo-400" /> SSO & Audit Logs
                     </div>
                     <div className="flex items-center gap-2 text-sm">
                       <Check className="w-4 h-4 text-indigo-400" /> 24/7 Dedicated Support
                     </div>
                   </div>
                 </CardContent>
                 <CardFooter>
                   <Button variant="secondary" className="w-full hover:bg-white hover:text-slate-900">Contact Sales</Button>
                 </CardFooter>
               </Card>
             </div>

             <Separator className="my-6" />

             <div className="grid gap-6 md:grid-cols-2">
               <Card>
                 <CardHeader>
                   <CardTitle>License Management</CardTitle>
                   <CardDescription>Enter your enterprise license key.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="space-y-2">
                     <Label>License Key</Label>
                     <div className="flex gap-2">
                       <Input className="font-mono" placeholder="XXXX-XXXX-XXXX-XXXX" defaultValue="" />
                       <Button variant="secondary">Verify</Button>
                     </div>
                   </div>
                 </CardContent>
               </Card>

               <Card>
                 <CardHeader>
                   <CardTitle>Payment Methods</CardTitle>
                   <CardDescription>Manage your payment details.</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="flex items-center justify-between p-4 border rounded-lg mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center text-white text-[10px] font-bold">VISA</div>
                        <div>
                          <div className="font-medium text-sm">Visa ending in 4242</div>
                          <div className="text-xs text-muted-foreground">Expires 12/28</div>
                        </div>
                      </div>
                      <Badge variant="secondary">Default</Badge>
                   </div>
                   <Button variant="outline" className="w-full">
                     <Plus className="w-4 h-4 mr-2" />
                     Add Payment Method
                   </Button>
                 </CardContent>
               </Card>
             </div>

             <Card>
               <CardHeader>
                 <CardTitle>Billing History</CardTitle>
                 <CardDescription>View and download your past invoices.</CardDescription>
               </CardHeader>
               <CardContent>
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>Invoice ID</TableHead>
                       <TableHead>Date</TableHead>
                       <TableHead>Amount</TableHead>
                       <TableHead>Status</TableHead>
                       <TableHead className="text-right">Action</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {[
                       { id: "INV-2024-001", date: "Dec 01, 2024", amount: "$49.00", status: "Paid" },
                       { id: "INV-2024-002", date: "Nov 01, 2024", amount: "$49.00", status: "Paid" },
                       { id: "INV-2024-003", date: "Oct 01, 2024", amount: "$49.00", status: "Paid" },
                     ].map((invoice) => (
                       <TableRow key={invoice.id}>
                         <TableCell className="font-medium flex items-center gap-2">
                           <FileText className="w-4 h-4 text-muted-foreground" />
                           {invoice.id}
                         </TableCell>
                         <TableCell>{invoice.date}</TableCell>
                         <TableCell>{invoice.amount}</TableCell>
                         <TableCell>
                           <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200">
                             {invoice.status}
                           </Badge>
                         </TableCell>
                         <TableCell className="text-right">
                           <Button variant="ghost" size="icon">
                             <Download className="w-4 h-4" />
                           </Button>
                         </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
               </CardContent>
             </Card>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="space-y-1">
                  <CardTitle className="text-lg text-primary flex items-center gap-2">
                    <Zap className="w-5 h-5" /> Pro Plan
                  </CardTitle>
                  <CardDescription className="text-primary/80">
                    You are currently on the Pro tier. Your plan renews on January 15, 2026.
                  </CardDescription>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="border-primary/20 hover:bg-primary/10 hover:text-primary">
                    Manage Subscription
                  </Button>
                  <Button onClick={() => setActiveTab("billing")}>
                    Upgrade Plan
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12 / 20</div>
                  <p className="text-xs text-muted-foreground mt-1">Projects created across all users</p>
                  <div className="mt-4 h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[60%]" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Data Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2 GB / 5.0 GB</div>
                  <p className="text-xs text-muted-foreground mt-1">Storage used by uploaded files and databases</p>
                  <div className="mt-4 h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[64%]" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>User Usage Statistics</CardTitle>
                <CardDescription>Breakdown of resource consumption by team member.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Projects Created</TableHead>
                      <TableHead className="text-right">Data Usage</TableHead>
                      <TableHead className="text-right">Last Active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: "John Doe", email: "john@emgraph.ai", role: "Owner", projects: 5, storage: "1.2 GB", lastActive: "Just now", avatar: "JD", color: "bg-primary/20 text-primary" },
                      { name: "Alice Smith", email: "alice@emgraph.ai", role: "Editor", projects: 4, storage: "1.5 GB", lastActive: "2 hours ago", avatar: "AS", color: "bg-orange-500/20 text-orange-600" },
                      { name: "Mike Kim", email: "mike@partner.com", role: "Viewer", projects: 0, storage: "0 GB", lastActive: "Pending", avatar: "MK", color: "bg-slate-200 text-slate-500" },
                      { name: "Sarah Lee", email: "sarah@emgraph.ai", role: "Editor", projects: 3, storage: "500 MB", lastActive: "1 day ago", avatar: "SL", color: "bg-green-500/20 text-green-600" },
                    ].map((user, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className={`${user.color} text-xs`}>{user.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">{user.projects}</TableCell>
                        <TableCell className="text-right font-medium">{user.storage}</TableCell>
                        <TableCell className="text-right text-muted-foreground text-sm">{user.lastActive}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MCP Integrations Tab */}
          <TabsContent value="mcp" className="space-y-6">
             <div className="flex items-center justify-between">
               <div>
                 <h3 className="text-lg font-medium">Model Context Protocol (MCP)</h3>
                 <p className="text-sm text-muted-foreground">Connect external data and tools to your AI context.</p>
               </div>
               <Dialog>
                 <DialogTrigger asChild>
                   <Button>
                     <Plus className="w-4 h-4 mr-2" />
                     Add MCP Server
                   </Button>
                 </DialogTrigger>
                 <DialogContent className="sm:max-w-[525px]">
                   <DialogHeader>
                     <DialogTitle>Add MCP Server</DialogTitle>
                     <DialogDescription>
                       Register a new Model Context Protocol server to extend your AI capabilities.
                     </DialogDescription>
                   </DialogHeader>
                   <div className="grid gap-4 py-4">
                     <div className="grid grid-cols-4 items-center gap-4">
                       <Label htmlFor="mcp-name" className="text-right">
                         Name
                       </Label>
                       <Input id="mcp-name" placeholder="e.g. Production DB" className="col-span-3" />
                     </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                       <Label htmlFor="mcp-url" className="text-right">
                         Endpoint URL
                       </Label>
                       <Input id="mcp-url" placeholder="https://mcp.example.com/v1" className="col-span-3 font-mono text-xs" />
                     </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                       <Label htmlFor="mcp-type" className="text-right">
                         Type
                       </Label>
                       <Select>
                         <SelectTrigger className="col-span-3">
                           <SelectValue placeholder="Select server type" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="db">Database</SelectItem>
                           <SelectItem value="vcs">Version Control</SelectItem>
                           <SelectItem value="communication">Communication</SelectItem>
                           <SelectItem value="knowledge">Knowledge Base</SelectItem>
                           <SelectItem value="other">Other</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                     <div className="grid grid-cols-4 items-start gap-4">
                       <Label htmlFor="mcp-token" className="text-right pt-2">
                         Auth Token
                       </Label>
                       <div className="col-span-3 space-y-2">
                          <Input id="mcp-token" type="password" placeholder="Optional access token" />
                          <p className="text-[10px] text-muted-foreground">Leave blank if the server is public or uses IP whitelisting.</p>
                       </div>
                     </div>
                   </div>
                   <DialogFooter>
                     <Button type="submit">Connect Server</Button>
                   </DialogFooter>
                 </DialogContent>
               </Dialog>
             </div>

             <div className="grid gap-4">
               {[
                 { name: "PostgreSQL Connector", url: "http://localhost:3000/mcp", status: "connected", type: "Database" },
                 { name: "Github Repo Loader", url: "https://mcp.github.com/v1", status: "connected", type: "VCS" },
                 { name: "Slack Context", url: "wss://slack-mcp.internal", status: "disconnected", type: "Communication" },
               ].map((mcp, i) => (
                 <Card key={i}>
                   <CardContent className="p-4 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                       <div className="p-2 bg-secondary/30 rounded-lg">
                         <Server className="w-5 h-5 text-indigo-500" />
                       </div>
                       <div>
                         <div className="font-medium flex items-center gap-2">
                           {mcp.name}
                           <Badge variant="outline" className="text-[10px] font-normal">{mcp.type}</Badge>
                         </div>
                         <div className="text-xs text-muted-foreground font-mono mt-0.5">{mcp.url}</div>
                       </div>
                     </div>
                     <div className="flex items-center gap-4">
                       <div className={`flex items-center gap-1.5 text-xs font-medium ${
                         mcp.status === 'connected' ? 'text-emerald-500' : 'text-muted-foreground'
                       }`}>
                         <div className={`w-2 h-2 rounded-full ${
                           mcp.status === 'connected' ? 'bg-emerald-500' : 'bg-muted-foreground'
                         }`} />
                         {mcp.status === 'connected' ? 'Connected' : 'Disconnected'}
                       </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <SettingsIcon className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="gap-2">
                            <Pencil className="w-4 h-4" /> Configure
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <RefreshCw className="w-4 h-4" /> Refresh Status
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                            <Trash2 className="w-4 h-4" /> Delete Server
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

// Need to update imports to include Settings icon if I missed it
// Actually I imported Settings in the Layout, but here I imported specific icons.
// Let's add Settings to the import list above.
