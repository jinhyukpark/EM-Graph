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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Check, Copy, CreditCard, Globe, Key, Lock, Mail, Plus, Server, Shield, Trash2, UserPlus, Users, Zap, Settings as SettingsIcon, Download, FileText, RefreshCw, Pencil, Activity, Database, LayoutGrid, Bot, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { useLanguage, type Language } from "@/lib/i18n";
import { useOrgLogo } from "@/lib/orgLogo";
import { useRef } from "react";
import { Building2, Upload, X as XIcon } from "lucide-react";

export default function Settings() {
  const { language, setLanguage, t } = useLanguage();
  const [orgLogo, setOrgLogo] = useOrgLogo();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: t("orgLogoInvalidType"), variant: "destructive" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: t("orgLogoTooLarge"), variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setOrgLogo(reader.result as string);
      toast({ title: t("orgLogoUpdated") });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  const [inviteLink] = useState("https://em-graph.ai/join/x8d9f2k");
  const [activeTab, setActiveTab] = useState("account");
  const [subscribedPlugins, setSubscribedPlugins] = useState([
    { id: "p1", name: "Graph AI Copilot", desc: "그래프 패턴 자동 발견 및 자연어 질의 응답 AI 어시스턴트", price: 29, Icon: Bot, iconColor: "text-violet-600 bg-violet-50", canceled: false },
    { id: "p2", name: "Snowflake Connector", desc: "Snowflake 웨어하우스 실시간 데이터 동기화", price: 49, Icon: Database, iconColor: "text-sky-600 bg-sky-50", canceled: false },
    { id: "p6", name: "Slack Alerts", desc: "그래프 변동을 실시간으로 슬랙 채널에 알림", price: 9, Icon: Zap, iconColor: "text-fuchsia-600 bg-fuchsia-50", canceled: false },
    { id: "p10", name: "Audit & Compliance", desc: "그래프 변경 이력 추적 및 감사 보고서 생성", price: 39, Icon: Shield, iconColor: "text-red-600 bg-red-50", canceled: false },
  ]);
  const cancelPluginSub = (id: string) => {
    setSubscribedPlugins((prev) => prev.map((p) => (p.id === id ? { ...p, canceled: true } : p)));
    toast({ title: t("stPluginCanceledToast"), description: t("stPluginCanceledToastDesc") });
  };

  const [coupons, setCoupons] = useState([
    { id: "c1", code: "WELCOME10", discount: 10, expiresAt: "2026-05-22", used: false },
    { id: "c2", code: "FLASH5", discount: 5, expiresAt: "2026-05-20", used: true },
    { id: "c3", code: "SPRING15", discount: 15, expiresAt: "2026-06-10", used: false },
    { id: "c4", code: "KOLON2026", discount: 15, expiresAt: "2026-08-15", used: false },
    { id: "c5", code: "ANNIVERSARY20", discount: 20, expiresAt: "2026-06-30", used: true },
    { id: "c6", code: "LOYAL25", discount: 25, expiresAt: "2026-12-31", used: false },
    { id: "c7", code: "VIP30", discount: 30, expiresAt: "2027-03-15", used: false },
  ]);
  const [couponInput, setCouponInput] = useState("");
  const [couponFilter, setCouponFilter] = useState<"1w" | "1m" | "6m" | "1y">("1y");
  const filteredCoupons = (() => {
    const now = new Date();
    const days = { "1w": 7, "1m": 30, "6m": 180, "1y": 365 }[couponFilter];
    const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return coupons.filter((c) => {
      const exp = new Date(c.expiresAt);
      return exp >= now && exp <= cutoff;
    });
  })();
  const registerCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (coupons.some((c) => c.code === code)) {
      toast({ title: t("stCouponDuplicate"), description: t("stCouponDuplicateDesc") });
      return;
    }
    const newCoupon = {
      id: `c${Date.now()}`,
      code,
      discount: 10,
      expiresAt: "2026-12-31",
      used: false,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    setCouponInput("");
    toast({ title: t("stCouponRegistered"), description: t("stCouponRegisteredDesc") });
  };
  const removeCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast({ title: t("stCouponRemoved") });
  };

  const [paymentMethods, setPaymentMethods] = useState([
    { id: "pm1", brand: "VISA", last4: "4242", expires: "12/2027", isDefault: true },
  ]);
  const [addPmOpen, setAddPmOpen] = useState(false);
  const [newCardBrand, setNewCardBrand] = useState("VISA");
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");
  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.map((p) => ({ ...p, isDefault: p.id === id })));
    toast({ title: t("stDefaultPmUpdated") });
  };
  const removePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (filtered.length > 0 && !filtered.some((p) => p.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
    toast({ title: t("stPmRemoved") });
  };
  const addPaymentMethod = () => {
    const digits = newCardNumber.replace(/\s/g, "");
    if (digits.length < 4 || !newCardExpiry) {
      toast({ title: t("stPmInvalid"), description: t("stPmInvalidDesc") });
      return;
    }
    const last4 = digits.slice(-4);
    setPaymentMethods((prev) => [
      ...prev,
      { id: `pm${Date.now()}`, brand: newCardBrand, last4, expires: newCardExpiry, isDefault: prev.length === 0 },
    ]);
    setNewCardNumber("");
    setNewCardExpiry("");
    setNewCardBrand("VISA");
    setAddPmOpen(false);
    toast({ title: t("stPmAdded") });
  };
  
  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: t("stLinkCopied"),
      description: t("stLinkCopiedDesc"),
    });
  };

  return (
    <Layout>
      <div className="h-full flex flex-col bg-background overflow-hidden">
        <div className="flex-1 overflow-y-auto">
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("myPage")}</h1>
          <p className="text-muted-foreground mt-2">{t("myPageDesc")}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 lg:w-[1000px]">
            <TabsTrigger value="account">{t("accountSecurity")}</TabsTrigger>
            <TabsTrigger value="team">{t("teamRoles")}</TabsTrigger>
            <TabsTrigger value="license">{t("billingLicense")}</TabsTrigger>
            <TabsTrigger value="billing">{t("billingTab")}</TabsTrigger>
            <TabsTrigger value="usage">{t("usage")}</TabsTrigger>
            <TabsTrigger value="ai-settings">{t("aiSettings")}</TabsTrigger>
            <TabsTrigger value="mcp">{t("mcpIntegrations")}</TabsTrigger>
          </TabsList>

          {/* AI Settings Tab */}
          <TabsContent value="ai-settings" className="space-y-6">
            <Card className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border-indigo-100 dark:from-indigo-950/20 dark:to-purple-950/20 dark:border-indigo-900">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                            <Bot className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <CardTitle>{t("aiModelConfig")}</CardTitle>
                            <CardDescription>{t("aiModelConfigDesc")}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {t("aiModelConfigInfo")}
                    </p>
                </CardContent>
            </Card>

            <div className="grid gap-6">
                {/* Claude (Anthropic) */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-[#F0EFEA] flex items-center justify-center border border-[#D9D9D9]">
                                <svg role="img" viewBox="0 0 24 24" className="w-6 h-6 text-[#D97757]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.92 5h3.603L24 20.306h-3.604l-1.04-2.887h-5.698l-1.04 2.887H9L16.92 5.001zm2.748 9.387L17.756 8.78l-1.91 5.606h3.822zM2.4 9.076h3.603L9.606 20.306H6.002l-1.04-2.887H-0.736L-1.776 20.306H-5.38L2.4 9.076zm2.748 5.485L3.236 10.158l-1.91 4.403h3.822z"/>
                                    <path d="M13.83 2h3.603L24 19.48h-3.604l-1.343-3.797H9.25L7.907 19.48H4.303L13.83 2.001zM17.38 12.8L15.42 7.167 13.46 12.8h3.92z"/>
                                </svg>
                            </div>
                            <div>
                                <CardTitle className="text-lg">Anthropic Claude</CardTitle>
                                <CardDescription>{t("stClaudeDesc")}</CardDescription>
                            </div>
                        </div>
                        <Badge variant="outline" className="bg-slate-100 text-slate-500">{t("notConnected")}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="claude-key">{t("apiKey")}</Label>
                            <div className="flex gap-2">
                                <Input id="claude-key" type="password" placeholder="sk-ant-..." className="font-mono" />
                                <Button>{t("connect")}</Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                {t("stClaudeKeyHelp")}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Gemini (Google) */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                                <svg role="img" viewBox="0 0 24 24" className="w-6 h-6 text-[#1a73e8]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.876.64a.89.89 0 0 0-1.752 0 17.068 17.068 0 0 1-7.79 9.873A16.924 16.924 0 0 1 .639 11.124a.89.89 0 0 0 0 1.752 16.924 16.924 0 0 1 2.695.611 17.068 17.068 0 0 1 7.79 9.873.89.89 0 0 0 1.752 0 17.068 17.068 0 0 1 7.79-9.873 16.924 16.924 0 0 1 2.695-.611.89.89 0 0 0 0-1.752 16.924 16.924 0 0 1-2.695-.611 17.068 17.068 0 0 1-7.79-9.873Z"/>
                                </svg>
                            </div>
                            <div>
                                <CardTitle className="text-lg">Google Gemini</CardTitle>
                                <CardDescription>{t("stGeminiDesc")}</CardDescription>
                            </div>
                        </div>
                        <Badge variant="outline" className="bg-slate-100 text-slate-500">{t("notConnected")}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="gemini-key">{t("apiKey")}</Label>
                            <div className="flex gap-2">
                                <Input id="gemini-key" type="password" placeholder="AIza..." className="font-mono" />
                                <Button>{t("connect")}</Button>
                            </div>
                             <p className="text-xs text-muted-foreground mt-2">
                                {t("stGeminiKeyHelp")}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* OpenAI */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                                <svg role="img" viewBox="0 0 24 24" className="w-6 h-6 text-[#10a37f]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.3829a.7712.7712 0 0 0-.7806 0L6.4803 11.7514V9.419a.0804.0804 0 0 1 .0332-.0615l4.854-2.7912a4.4944 4.4944 0 0 1 7.8016 1.9102l-.1326.0474zm6.5098-1.8001v5.6773a.0757.0757 0 0 1-.0379.052l-4.8303 2.7865a4.485 4.485 0 0 1-2.8622 1.0503l.161-.09 4.7594-2.7582a.7664.7664 0 0 0 .3879-.6765V6.7456l2.0201-1.1685a.0757.0757 0 0 1 .071 0 4.504 4.504 0 0 1 .331 4.3739zM8.38 12.0123l3.6052-2.0673v4.1683l-3.6052 2.0673z"/>
                                </svg>
                            </div>
                            <div>
                                <CardTitle className="text-lg">OpenAI GPT-4</CardTitle>
                                <CardDescription>{t("stOpenAIDesc")}</CardDescription>
                            </div>
                        </div>
                         <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">{t("connected")}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="openai-key">{t("apiKey")}</Label>
                            <div className="flex gap-2">
                                <Input id="openai-key" type="password" value="sk-proj-****************************" disabled className="font-mono bg-muted" />
                                <Button variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10">{t("disconnect")}</Button>
                            </div>
                             <p className="text-xs text-muted-foreground mt-2">
                                {t("stOpenAIKeyHelp")}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
          </TabsContent>

          {/* Account & Security Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("profileInfo")}</CardTitle>
                <CardDescription>{t("profileInfoDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">JD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">{t("changeAvatar")}</Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("firstName")}</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("lastName")}</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input id="email" type="email" defaultValue="john@kolon.com" />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>{t("saveProfile")}</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  {t("orgLogoTitle")}
                </CardTitle>
                <CardDescription>{t("orgLogoDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl border border-border bg-secondary/40 flex items-center justify-center overflow-hidden shrink-0">
                    {orgLogo ? (
                      <img src={orgLogo} alt="조직 로고" className="w-full h-full object-cover" data-testid="img-org-logo-preview" />
                    ) : (
                      <Building2 className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground mb-3">{t("orgLogoHint")}</p>
                    <div className="flex gap-2 flex-wrap">
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                        data-testid="input-org-logo"
                      />
                      <Button variant="outline" size="sm" onClick={() => logoInputRef.current?.click()} data-testid="button-upload-org-logo">
                        <Upload className="w-4 h-4 mr-2" />
                        {orgLogo ? t("orgLogoChange") : t("orgLogoUpload")}
                      </Button>
                      {orgLogo && (
                        <Button variant="outline" size="sm" onClick={() => { setOrgLogo(null); toast({ title: t("orgLogoRemoved") }); }} data-testid="button-remove-org-logo">
                          <XIcon className="w-4 h-4 mr-2" />
                          {t("orgLogoRemove")}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("passwordSecurity")}</CardTitle>
                <CardDescription>{t("passwordSecurityDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current">{t("currentPassword")}</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">{t("newPassword")}</Label>
                  <Input id="new" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">{t("confirmNewPassword")}</Label>
                  <Input id="confirm" type="password" />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4 flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {t("lastChanged")}: 3 {t("monthsAgo")}
                </div>
                <Button variant="outline">{t("updatePassword")}</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  {t("language")}
                </CardTitle>
                <CardDescription>{t("languageDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button
                    variant={language === "en" ? "default" : "outline"}
                    size="sm"
                    className="gap-2"
                    onClick={() => setLanguage("en")}
                    data-testid="button-lang-en"
                  >
                    {language === "en" && <Check className="w-4 h-4" />}
                    {t("english")}
                  </Button>
                  <Button
                    variant={language === "ko" ? "default" : "outline"}
                    size="sm"
                    className="gap-2"
                    onClick={() => setLanguage("ko")}
                    data-testid="button-lang-ko"
                  >
                    {language === "ko" && <Check className="w-4 h-4" />}
                    {t("korean")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team & Roles Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle>{t("teamMembers")}</CardTitle>
                  <CardDescription>{t("teamMembersDesc")}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                         <Shield className="w-4 h-4" />
                         {t("roleGuide")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t("rolePermissionsGuide")}</DialogTitle>
                        <DialogDescription>{t("rolePermissionsGuideDesc")}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                         <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                           <div className="font-semibold flex items-center gap-2 mb-2">
                             <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{t("stOwner")}</Badge>
                           </div>
                           <p className="text-sm text-muted-foreground">{t("ownerDesc")}</p>
                         </div>
                         <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                           <div className="font-semibold flex items-center gap-2 mb-2">
                             <Badge variant="outline" className="bg-secondary text-secondary-foreground border-secondary-foreground/20">{t("stEditor")}</Badge>
                           </div>
                           <p className="text-sm text-muted-foreground">{t("editorDesc")}</p>
                         </div>
                         <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                           <div className="font-semibold flex items-center gap-2 mb-2">
                             <Badge variant="outline" className="text-muted-foreground border-border">{t("stViewer")}</Badge>
                           </div>
                           <p className="text-sm text-muted-foreground">{t("viewerDesc")}</p>
                         </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <UserPlus className="w-4 h-4" />
                        {t("inviteMember")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>{t("stInviteTeamMember")}</DialogTitle>
                        <DialogDescription>
                          {t("stInviteTeamMemberDesc")}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label>{t("stEmailInvitation")}</Label>
                          <div className="flex gap-2">
                            <Input placeholder="colleague@company.com" />
                            <Button>{t("stSend")}</Button>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">{t("stOrShareLink")}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>{t("stInviteLink")}</Label>
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
                      <TableHead>{t("stMember")}</TableHead>
                      <TableHead>{t("stRole")}</TableHead>
                      <TableHead>{t("stStatus")}</TableHead>
                      <TableHead className="text-right">{t("stActions")}</TableHead>
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
                            <div className="text-xs text-muted-foreground">john@kolon.com</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{t("stOwner")}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {t("stActive")}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" disabled>{t("stManage")}</Button>
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
                            <div className="text-xs text-muted-foreground">alice@kolon.com</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select defaultValue="editor">
                          <SelectTrigger className="h-8 w-[110px] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">{t("stOwner")}</SelectItem>
                            <SelectItem value="editor">{t("stEditor")}</SelectItem>
                            <SelectItem value="viewer">{t("stViewer")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {t("stActive")}
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
                            <div className="text-xs text-muted-foreground">mike@kolon.com</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select defaultValue="viewer">
                          <SelectTrigger className="h-8 w-[110px] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">{t("stOwner")}</SelectItem>
                            <SelectItem value="editor">{t("stEditor")}</SelectItem>
                            <SelectItem value="viewer">{t("stViewer")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-amber-500 font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          {t("stPending")}
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
                <CardTitle>{t("stMenuAccessPermissions")}</CardTitle>
                <CardDescription>{t("stMenuAccessPermissionsDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[300px]">{t("stFeatureMenu")}</TableHead>
                      <TableHead className="text-center">{t("stOwner")}</TableHead>
                      <TableHead className="text-center">{t("stEditor")}</TableHead>
                      <TableHead className="text-center">{t("stViewer")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { feature: t("stDashboardAccess"), owner: true, editor: true, viewer: true },
                      { feature: t("stProjectsCreateEdit"), owner: true, editor: true, viewer: false },
                      { feature: t("stDatabaseWrite"), owner: true, editor: true, viewer: false },
                      { feature: t("stResourcesUpload"), owner: true, editor: true, viewer: false },
                      { feature: t("stTeamManagement"), owner: true, editor: false, viewer: false },
                      { feature: t("stBillingLicenseAccess"), owner: true, editor: false, viewer: false },
                      { feature: t("stApiKeyGeneration"), owner: true, editor: true, viewer: false },
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

          {/* License Tab */}
          <TabsContent value="license" className="space-y-6">
             <div className="space-y-1">
               <h2 className="text-2xl font-bold tracking-tight" data-testid="text-license-title">{t("stLicenseTitle")}</h2>
               <p className="text-sm text-muted-foreground">{t("stLicenseSubtitle")}</p>
             </div>
             <div className="grid gap-6 lg:grid-cols-3">
               {/* Free Plan */}
               <Card className="border-border/50 relative overflow-hidden">
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                     <span className="text-xl">{t("stFree")}</span>
                   </CardTitle>
                   <CardDescription>{t("stFreeDesc")}</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="text-3xl font-bold mb-2">$0<span className="text-base font-normal text-muted-foreground">/user/mo</span></div>
                   <div className="space-y-3 mt-6">
                     <div className="flex items-start gap-2 text-sm">
                       <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> <span>{t("stFreeFeature1")}</span>
                     </div>
                     <div className="flex items-start gap-2 text-sm">
                       <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> <span>{t("stFreeFeature3")}</span>
                     </div>
                     <div className="flex items-start gap-2 text-sm">
                       <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> <span>{t("stFreeFeature4")}</span>
                     </div>
                     <div className="flex items-start gap-2 text-sm">
                       <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> <span>{t("stFreeFeature6")}</span>
                     </div>
                     <div className="flex items-start gap-2 text-sm">
                       <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> <span>{t("stFreeFeature8")}</span>
                     </div>
                   </div>
                 </CardContent>
                 <CardFooter>
                   <Button variant="outline" className="w-full" onClick={() => {
                     toast({
                       variant: "destructive",
                       title: t("stDowngradeFailed"),
                       description: t("stDowngradeFailedDesc"),
                     });
                   }}>{t("stSelectFreePlan")}</Button>
                 </CardFooter>
               </Card>

               {/* Pro Plan */}
               <Card className="bg-primary/5 border-primary shadow-lg scale-105 relative z-10">
                 <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-bl-lg">
                   {t("stPopular")}
                 </div>
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2 text-primary">
                     <Zap className="w-5 h-5" />
                     <span className="text-xl">{t("stPro")}</span>
                   </CardTitle>
                   <CardDescription>{t("stProDesc")}</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="text-3xl font-bold mb-2">$5<span className="text-base font-normal text-muted-foreground">/user/mo</span></div>
                   <div className="space-y-3 mt-6">
                     <div className="flex items-start gap-2 text-sm">
                       <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> <span>{t("stProFeature1")}</span>
                     </div>
                     <div className="flex items-start gap-2 text-sm">
                       <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> <span>{t("stProFeature3")}</span>
                     </div>
                     <div className="flex items-start gap-2 text-sm">
                       <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> <span>{t("stProFeature4")}</span>
                     </div>
                     <div className="flex items-start gap-2 text-sm">
                       <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> <span>{t("stProFeature5")}</span>
                     </div>
                     <div className="flex items-start gap-2 text-sm">
                       <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> <span>{t("stProFeature7")}</span>
                     </div>
                     <div className="flex items-start gap-2 text-sm">
                       <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> <span>{t("stProFeature8")}</span>
                     </div>
                   </div>
                 </CardContent>
                 <CardFooter>
                   <Button className="w-full shadow-md" disabled>{t("stCurrentPlan")}</Button>
                 </CardFooter>
               </Card>

               {/* Premium Plan */}
               <Card className="border-border/50 bg-slate-900 text-slate-50 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none" />
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                     <Shield className="w-5 h-5 text-indigo-400" />
                     <span className="text-xl">{t("stPremium")}</span>
                   </CardTitle>
                   <CardDescription className="text-slate-400">{t("stPremiumDesc")}</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="text-3xl font-bold mb-2">$15<span className="text-base font-normal text-slate-400">/user/mo</span></div>
                   <div className="space-y-3 mt-6 text-slate-300">
                     <div className="flex items-start gap-2 text-sm">
                       <Check className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" /> <span>{t("stPremiumFeature1")}</span>
                     </div>
                     <div className="flex items-start gap-2 text-sm">
                       <Check className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" /> <span>{t("stPremiumFeature3")}</span>
                     </div>
                     <div className="flex items-start gap-2 text-sm">
                       <Check className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" /> <span>{t("stPremiumFeature4")}</span>
                     </div>
                     <div className="flex items-start gap-2 text-sm">
                       <Check className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" /> <span>{t("stPremiumFeature5")}</span>
                     </div>
                     <div className="flex items-start gap-2 text-sm">
                       <Check className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" /> <span>{t("stProFeature7")}</span>
                     </div>
                     <div className="flex items-start gap-2 text-sm">
                       <Check className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" /> <span>{t("stPremiumFeature8")}</span>
                     </div>
                   </div>
                 </CardContent>
                 <CardFooter>
                   <Button 
                     variant="secondary" 
                     className="w-full hover:bg-white hover:text-slate-900"
                     onClick={() => {
                       toast({
                         title: t("stUpgradeInitiated"),
                         description: t("stUpgradeInitiatedDesc"),
                       });
                     }}
                   >
                     {t("stUpgradeToPremium")}
                   </Button>
                 </CardFooter>
               </Card>
             </div>

             {/* Custom Solutions Section */}
             <Card className="mt-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-slate-50 border-indigo-500/30">
               <CardContent className="flex items-center justify-between p-6">
                 <div className="space-y-1">
                   <h3 className="text-lg font-semibold flex items-center gap-2">
                     <Server className="w-5 h-5 text-indigo-400" />
                     {t("stCustomSolution")}
                   </h3>
                   <p className="text-slate-400 text-sm max-w-2xl">
                     {t("stCustomSolutionDesc")}
                   </p>
                 </div>
                 <Button className="bg-white text-slate-900 hover:bg-slate-100 shrink-0 ml-4">
                   {t("stContactSales")}
                 </Button>
               </CardContent>
             </Card>

             <Separator className="my-6" />

             <div className="space-y-1 mb-4">
               <h2 className="text-2xl font-bold tracking-tight" data-testid="text-plugin-license-title">{t("stPluginLicenseTitle")}</h2>
               <p className="text-sm text-muted-foreground">{t("stPluginLicenseSubtitle")}</p>
             </div>

             <Card className="mb-6">
               <CardHeader>
                 <CardTitle className="text-lg" data-testid="text-active-plugins-title">{t("stActivePlugins")}</CardTitle>
                 <CardDescription>{t("stActivePluginsDesc")}</CardDescription>
               </CardHeader>
               <CardContent>
                 {subscribedPlugins.length === 0 ? (
                   <p className="text-sm text-muted-foreground py-6 text-center">{t("stPluginNoneActive")}</p>
                 ) : (
                   <div className="space-y-3">
                     {subscribedPlugins.map((p) => (
                       <div
                         key={p.id}
                         className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                         data-testid={`card-plugin-sub-${p.id}`}
                       >
                         <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${p.iconColor}`}>
                           <p.Icon className="w-5 h-5" />
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2 flex-wrap">
                             <span className="font-medium" data-testid={`text-plugin-name-${p.id}`}>{p.name}</span>
                             {p.canceled && (
                               <Badge variant="outline" className="text-xs text-muted-foreground">{t("stPluginStatusCanceled")}</Badge>
                             )}
                           </div>
                           <p className="text-sm text-muted-foreground truncate">{p.desc}</p>
                         </div>
                         <div className="text-right shrink-0">
                           <div className="font-semibold">
                             ${p.price}
                             <span className="text-xs font-normal text-muted-foreground">{t("stPluginPerMonth")}</span>
                           </div>
                         </div>
                         {p.canceled ? (
                           <Button variant="ghost" size="icon" disabled className="shrink-0 h-8 w-8">
                             <MoreHorizontal className="w-4 h-4" />
                           </Button>
                         ) : (
                           <AlertDialog>
                             <DropdownMenu>
                               <DropdownMenuTrigger asChild>
                                 <Button
                                   variant="ghost"
                                   size="icon"
                                   className="shrink-0 h-8 w-8 text-muted-foreground hover:text-foreground"
                                   data-testid={`button-plugin-menu-${p.id}`}
                                 >
                                   <MoreHorizontal className="w-4 h-4" />
                                 </Button>
                               </DropdownMenuTrigger>
                               <DropdownMenuContent align="end">
                                 <AlertDialogTrigger asChild>
                                   <DropdownMenuItem
                                     className="text-destructive focus:text-destructive gap-2"
                                     onSelect={(e) => e.preventDefault()}
                                     data-testid={`menuitem-cancel-plugin-${p.id}`}
                                   >
                                     <Trash2 className="w-4 h-4" /> {t("stPluginCancel")}
                                   </DropdownMenuItem>
                                 </AlertDialogTrigger>
                               </DropdownMenuContent>
                             </DropdownMenu>
                             <AlertDialogContent>
                               <AlertDialogHeader>
                                 <AlertDialogTitle>{t("stPluginCancelConfirmTitle")}</AlertDialogTitle>
                                 <AlertDialogDescription>{t("stPluginCancelConfirmDesc")}</AlertDialogDescription>
                               </AlertDialogHeader>
                               <AlertDialogFooter>
                                 <AlertDialogCancel>{t("stPluginKeepActive")}</AlertDialogCancel>
                                 <AlertDialogAction
                                   onClick={() => cancelPluginSub(p.id)}
                                   className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                   data-testid={`button-confirm-cancel-plugin-${p.id}`}
                                 >
                                   {t("stPluginCancelConfirm")}
                                 </AlertDialogAction>
                               </AlertDialogFooter>
                             </AlertDialogContent>
                           </AlertDialog>
                         )}
                       </div>
                     ))}
                   </div>
                 )}
               </CardContent>
             </Card>

          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
             <div className="space-y-1 mb-4">
               <h2 className="text-2xl font-bold tracking-tight" data-testid="text-billing-info-title">{t("stBillingInfoTitle")}</h2>
               <p className="text-sm text-muted-foreground">{t("stBillingInfoSubtitle")}</p>
             </div>

             <div className="grid gap-6 md:grid-cols-2">
               <Card>
                 <CardHeader>
                   <CardTitle>{t("stCouponRegistration")}</CardTitle>
                   <CardDescription>{t("stCouponRegistrationDesc")}</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="space-y-2">
                     <Label>{t("stCouponCode")}</Label>
                     <div className="flex gap-2">
                       <Input
                         className="font-mono uppercase"
                         placeholder="XXXX-XXXX"
                         value={couponInput}
                         onChange={(e) => setCouponInput(e.target.value)}
                         onKeyDown={(e) => { if (e.key === "Enter") registerCoupon(); }}
                         data-testid="input-coupon-code"
                       />
                       <Button variant="secondary" onClick={registerCoupon} data-testid="button-register-coupon">
                         {t("stRegister")}
                       </Button>
                     </div>
                   </div>

                   <div className="space-y-3">
                     <div className="flex items-center justify-between gap-2 flex-wrap">
                       <div className="text-sm font-medium">{t("stRegisteredCoupons")}</div>
                       <div className="inline-flex rounded-md border bg-muted/40 p-0.5">
                         {([
                           { key: "1w", label: t("stFilter1w") },
                           { key: "1m", label: t("stFilter1m") },
                           { key: "6m", label: t("stFilter6m") },
                           { key: "1y", label: t("stFilter1y") },
                         ] as const).map((opt) => (
                           <button
                             key={opt.key}
                             type="button"
                             onClick={() => setCouponFilter(opt.key)}
                             className={`px-2.5 py-1 text-xs rounded transition-colors ${
                               couponFilter === opt.key
                                 ? "bg-background shadow-sm font-medium"
                                 : "text-muted-foreground hover:text-foreground"
                             }`}
                             data-testid={`filter-coupon-${opt.key}`}
                           >
                             {opt.label}
                           </button>
                         ))}
                       </div>
                     </div>
                     {filteredCoupons.length === 0 ? (
                       <div className="text-xs text-muted-foreground py-4 text-center border rounded-lg">
                         {t("stNoCoupons")}
                       </div>
                     ) : (
                       <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1" data-testid="list-coupons">
                         {filteredCoupons.map((coupon) => (
                           <div
                             key={coupon.id}
                             className={`flex items-center justify-between p-3 border rounded-lg ${coupon.used ? "opacity-60" : ""}`}
                             data-testid={`coupon-${coupon.id}`}
                           >
                             <div className="flex items-center gap-3 min-w-0">
                               <Badge variant="secondary" className="font-mono text-xs shrink-0">{coupon.code}</Badge>
                               <div className="flex flex-col min-w-0">
                                 <span className={`text-sm font-medium ${coupon.used ? "text-muted-foreground line-through" : "text-emerald-600"}`}>
                                   {coupon.discount}% {t("stDiscount")}
                                 </span>
                                 <span className="text-xs text-muted-foreground">~ {coupon.expiresAt}</span>
                               </div>
                             </div>
                             <div className="flex items-center gap-1 shrink-0">
                               {coupon.used && (
                                 <Badge variant="outline" className="bg-muted text-muted-foreground border-muted-foreground/20 text-[10px]">
                                   {t("stCouponUsed")}
                                 </Badge>
                               )}
                               <Button
                                 variant="ghost"
                                 size="icon"
                                 className="h-8 w-8"
                                 onClick={() => removeCoupon(coupon.id)}
                                 data-testid={`button-remove-coupon-${coupon.id}`}
                               >
                                 <Trash2 className="w-4 h-4 text-muted-foreground" />
                               </Button>
                             </div>
                           </div>
                         ))}
                       </div>
                     )}
                   </div>
                 </CardContent>
               </Card>

               <Card>
                 <CardHeader>
                   <CardTitle>{t("stPaymentMethods")}</CardTitle>
                   <CardDescription>{t("stPaymentMethodsDesc")}</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-2 mb-4">
                     {paymentMethods.map((pm) => (
                       <div
                         key={pm.id}
                         className="flex items-center justify-between p-4 border rounded-lg"
                         data-testid={`payment-method-${pm.id}`}
                       >
                         <div className="flex items-center gap-4 min-w-0">
                           <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                             {pm.brand}
                           </div>
                           <div className="min-w-0">
                             <div className="font-medium text-sm">{t("stCardEnding")} {pm.last4}</div>
                             <div className="text-xs text-muted-foreground">{t("stExpiresLabel")} {pm.expires}</div>
                           </div>
                         </div>
                         <div className="flex items-center gap-2 shrink-0">
                           {pm.isDefault ? (
                             <Badge variant="secondary">{t("stDefault")}</Badge>
                           ) : (
                             <Button
                               variant="ghost"
                               size="sm"
                               onClick={() => setDefaultPaymentMethod(pm.id)}
                               data-testid={`button-set-default-${pm.id}`}
                             >
                               {t("stSetAsDefault")}
                             </Button>
                           )}
                           {paymentMethods.length > 1 && (
                             <Button
                               variant="ghost"
                               size="icon"
                               className="h-8 w-8"
                               onClick={() => removePaymentMethod(pm.id)}
                               data-testid={`button-remove-pm-${pm.id}`}
                             >
                               <Trash2 className="w-4 h-4 text-muted-foreground" />
                             </Button>
                           )}
                         </div>
                       </div>
                     ))}
                   </div>
                   <Dialog open={addPmOpen} onOpenChange={setAddPmOpen}>
                     <DialogTrigger asChild>
                       <Button variant="outline" className="w-full" data-testid="button-open-add-pm">
                         <Plus className="w-4 h-4 mr-2" />
                         {t("stAddPaymentMethod")}
                       </Button>
                     </DialogTrigger>
                     <DialogContent className="sm:max-w-[425px]">
                       <DialogHeader>
                         <DialogTitle>{t("stAddPaymentMethod")}</DialogTitle>
                         <DialogDescription>{t("stAddPaymentMethodDesc")}</DialogDescription>
                       </DialogHeader>
                       <div className="space-y-4 py-2">
                         <div className="space-y-2">
                           <Label>{t("stCardBrand")}</Label>
                           <Select value={newCardBrand} onValueChange={setNewCardBrand}>
                             <SelectTrigger data-testid="select-card-brand">
                               <SelectValue />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="VISA">VISA</SelectItem>
                               <SelectItem value="MC">Mastercard</SelectItem>
                               <SelectItem value="AMEX">American Express</SelectItem>
                               <SelectItem value="JCB">JCB</SelectItem>
                             </SelectContent>
                           </Select>
                         </div>
                         <div className="space-y-2">
                           <Label>{t("stCardNumber")}</Label>
                           <Input
                             className="font-mono"
                             placeholder="0000 0000 0000 0000"
                             value={newCardNumber}
                             onChange={(e) => setNewCardNumber(e.target.value)}
                             data-testid="input-card-number"
                           />
                         </div>
                         <div className="space-y-2">
                           <Label>{t("stCardExpiry")}</Label>
                           <Input
                             className="font-mono"
                             placeholder="MM/YYYY"
                             value={newCardExpiry}
                             onChange={(e) => setNewCardExpiry(e.target.value)}
                             data-testid="input-card-expiry"
                           />
                         </div>
                       </div>
                       <DialogFooter>
                         <Button variant="outline" onClick={() => setAddPmOpen(false)} data-testid="button-cancel-pm">
                           {t("stCancel")}
                         </Button>
                         <Button onClick={addPaymentMethod} data-testid="button-save-pm">
                           {t("stRegister")}
                         </Button>
                       </DialogFooter>
                     </DialogContent>
                   </Dialog>
                 </CardContent>
               </Card>
             </div>

             <Card>
               <CardHeader>
                 <CardTitle>{t("stBillingHistory")}</CardTitle>
                 <CardDescription>{t("stBillingHistoryDesc")}</CardDescription>
               </CardHeader>
               <CardContent>
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>{t("stInvoiceId")}</TableHead>
                       <TableHead>{t("stDate")}</TableHead>
                       <TableHead>{t("stAmount")}</TableHead>
                       <TableHead>{t("stStatus")}</TableHead>
                       <TableHead className="text-right">{t("stAction")}</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {[
                       { id: "INV-2024-001", date: "Dec 01, 2024", amount: "$49.00", status: t("stPaid") },
                       { id: "INV-2024-002", date: "Nov 01, 2024", amount: "$49.00", status: t("stPaid") },
                       { id: "INV-2024-003", date: "Oct 01, 2024", amount: "$49.00", status: t("stPaid") },
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
                    <Zap className="w-5 h-5" /> {t("stProPlan")}
                  </CardTitle>
                  <CardDescription className="text-primary/80">
                    {t("stProPlanDesc")}
                  </CardDescription>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="border-primary/20 hover:bg-primary/10 hover:text-primary">
                    {t("stManageSubscription")}
                  </Button>
                  <Button onClick={() => setActiveTab("billing")}>
                    {t("stUpgradePlan")}
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t("stTotalProjects")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12 / 20</div>
                  <p className="text-xs text-muted-foreground mt-1">{t("stProjectsCreatedDesc")}</p>
                  <div className="mt-4 h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[60%]" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t("stTotalDataUsage")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2 GB / 5.0 GB</div>
                  <p className="text-xs text-muted-foreground mt-1">{t("stStorageUsedDesc")}</p>
                  <div className="mt-4 h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[64%]" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t("stUserUsageStats")}</CardTitle>
                <CardDescription>{t("stUserUsageStatsDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("stUser")}</TableHead>
                      <TableHead>{t("stRole")}</TableHead>
                      <TableHead className="text-right">{t("stProjectsCreated")}</TableHead>
                      <TableHead className="text-right">{t("stDataUsage")}</TableHead>
                      <TableHead className="text-right">{t("stLastActive")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: "John Doe", email: "john@kolon.com", role: t("stOwner"), projects: 5, storage: "1.2 GB", lastActive: t("stJustNow"), avatar: "JD", color: "bg-primary/20 text-primary" },
                      { name: "Alice Smith", email: "alice@kolon.com", role: t("stEditor"), projects: 4, storage: "1.5 GB", lastActive: t("stHoursAgo"), avatar: "AS", color: "bg-orange-500/20 text-orange-600" },
                      { name: "Mike Kim", email: "mike@kolon.com", role: t("stViewer"), projects: 0, storage: "0 GB", lastActive: t("stPending"), avatar: "MK", color: "bg-slate-200 text-slate-500" },
                      { name: "Sarah Lee", email: "sarah@kolon.com", role: t("stEditor"), projects: 3, storage: "500 MB", lastActive: t("stDayAgo"), avatar: "SL", color: "bg-green-500/20 text-green-600" },
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
                 <h3 className="text-lg font-medium">{t("stMcpTitle")}</h3>
                 <p className="text-sm text-muted-foreground">{t("stMcpDesc")}</p>
               </div>
               <Dialog>
                 <DialogTrigger asChild>
                   <Button>
                     <Plus className="w-4 h-4 mr-2" />
                     {t("stAddMcpServer")}
                   </Button>
                 </DialogTrigger>
                 <DialogContent className="sm:max-w-[525px]">
                   <DialogHeader>
                     <DialogTitle>{t("stAddMcpServer")}</DialogTitle>
                     <DialogDescription>
                       {t("stAddMcpServerDesc")}
                     </DialogDescription>
                   </DialogHeader>
                   <div className="grid gap-4 py-4">
                     <div className="grid grid-cols-4 items-center gap-4">
                       <Label htmlFor="mcp-name" className="text-right">
                         {t("stName")}
                       </Label>
                       <Input id="mcp-name" placeholder="e.g. Production DB" className="col-span-3" />
                     </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                       <Label htmlFor="mcp-url" className="text-right">
                         {t("stEndpointUrl")}
                       </Label>
                       <Input id="mcp-url" placeholder="https://mcp.example.com/v1" className="col-span-3 font-mono text-xs" />
                     </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                       <Label htmlFor="mcp-type" className="text-right">
                         {t("stType")}
                       </Label>
                       <Select>
                         <SelectTrigger className="col-span-3">
                           <SelectValue placeholder={t("stSelectServerType")} />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="db">{t("stDatabase")}</SelectItem>
                           <SelectItem value="vcs">{t("stVersionControl")}</SelectItem>
                           <SelectItem value="communication">{t("stCommunication")}</SelectItem>
                           <SelectItem value="knowledge">{t("stKnowledgeBase")}</SelectItem>
                           <SelectItem value="other">{t("stOther")}</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                     <div className="grid grid-cols-4 items-start gap-4">
                       <Label htmlFor="mcp-token" className="text-right pt-2">
                         {t("stAuthToken")}
                       </Label>
                       <div className="col-span-3 space-y-2">
                          <Input id="mcp-token" type="password" placeholder="Optional access token" />
                          <p className="text-[10px] text-muted-foreground">{t("stAuthTokenHelp")}</p>
                       </div>
                     </div>
                   </div>
                   <DialogFooter>
                     <Button type="submit">{t("stConnectServer")}</Button>
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
                         {mcp.status === 'connected' ? t("stConnected") : t("stDisconnected")}
                       </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <SettingsIcon className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{t("stActions")}</DropdownMenuLabel>
                          <DropdownMenuItem className="gap-2">
                            <Pencil className="w-4 h-4" /> {t("stConfigure")}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <RefreshCw className="w-4 h-4" /> {t("stRefreshStatus")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                            <Trash2 className="w-4 h-4" /> {t("stDeleteServer")}
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
        </div>
      </div>
    </Layout>
  );
}

// Need to update imports to include Settings icon if I missed it
// Actually I imported Settings in the Layout, but here I imported specific icons.
// Let's add Settings to the import list above.
