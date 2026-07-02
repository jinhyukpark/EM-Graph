import { useEffect, useState, type ComponentType } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Download,
  Globe,
  Mail,
  Shield,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export interface PluginInfo {
  id: string;
  name: string;
  vendor: string;
  desc: string;
  category: string;
  Icon: ComponentType<{ className?: string }>;
  iconColor: string;
  price: number;
  badge?: "Editor" | "Best" | null;
  rating?: number;
  reviews?: number;
  downloads?: string;
  canceled?: boolean;
  startDate?: string;
  endDate?: string;
  nextBillingDate?: string;
}

interface PluginDetailModalProps {
  plugin: PluginInfo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscribed: boolean;
  onSubscribe: (id: string) => void;
  onCancel: (id: string) => void;
}

export default function PluginDetailModal({
  plugin,
  open,
  onOpenChange,
  subscribed,
  onSubscribe,
  onCancel,
}: PluginDetailModalProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"overview" | "pricing" | "terms">("overview");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [payOpen, setPayOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [payMethod, setPayMethod] = useState("pm-shinhan");

  useEffect(() => {
    if (open) {
      setActiveTab("overview");
      setBillingCycle("monthly");
    } else {
      setPayOpen(false);
    }
  }, [open, plugin?.id]);

  useEffect(() => {
    if (payOpen) {
      setCouponInput("");
      setCouponApplied(false);
      setPayMethod("pm-shinhan");
    }
  }, [payOpen, plugin?.id]);

  if (!plugin) return null;

  const PAYMENT_METHODS = [
    { id: "pm-shinhan", label: "신한카드", last4: "4242", isDefault: true },
    { id: "pm-kb", label: "KB국민카드", last4: "8810", isDefault: false },
  ];
  const discountRate = couponApplied ? 0.1 : 0;
  const discountAmount = Math.round(plugin.price * discountRate);
  const vat = Math.round((plugin.price - discountAmount) * 0.1);
  const payTotal = plugin.price - discountAmount + vat;
  const handleConfirmPayment = () => {
    setPayOpen(false);
    onSubscribe(plugin.id);
  };

  const YEARLY_DISCOUNT = 0.2;
  const PRICING_TIERS = [
    {
      name: "Starter",
      description: "소규모 팀이 핵심 기능을 빠르게 체험해볼 수 있는 플랜.",
      monthly: 29000,
      seats: "최대 5명",
      cta: "시작하기",
      highlight: false,
      features: ["핵심 지표 5종 제공", "월 10,000 API 호출", "기본 대시보드", "이메일 지원"],
    },
    {
      name: "Pro",
      description: "성장하는 팀을 위한 가장 인기있는 플랜.",
      monthly: 79000,
      seats: "최대 20명",
      cta: "14일 무료 체험",
      highlight: true,
      features: ["전체 지표 제공", "월 100,000 API 호출", "실시간 알림 & 트리거", "커스텀 대시보드", "우선 기술지원"],
    },
    {
      name: "Enterprise",
      description: "대규모 조직과 엔터프라이즈 워크플로우에 최적화.",
      monthly: 199000,
      seats: "무제한",
      cta: "영업팀 문의",
      highlight: false,
      features: ["Pro의 모든 기능", "무제한 API 호출", "SSO / SAML 인증", "전담 매니저 지원", "SLA 보장 (99.95%)"],
    },
  ];
  const formatPrice = (monthly: number) => {
    const value = billingCycle === "yearly" ? Math.round(monthly * (1 - YEARLY_DISCOUNT)) : monthly;
    return value.toLocaleString("ko-KR");
  };
  const screenshots = [
    { title: "대시보드 미리보기", subtitle: "핵심 KPI를 한눈에", tint: "from-violet-600 to-indigo-700" },
    { title: "실시간 분석", subtitle: "데이터 변화 추적", tint: "from-emerald-600 to-teal-700" },
  ];

  const tabs = [
    { key: "overview" as const, label: t("stPluginTabOverview") },
    { key: "pricing" as const, label: t("stPluginTabPricing") },
    { key: "terms" as const, label: t("stPluginTabTerms") },
  ];

  return (
    <>
    <Dialog open={open && !payOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0" data-testid="dialog-plugin-detail">
        <DialogTitle className="sr-only">{plugin.name}</DialogTitle>
        <DialogDescription className="sr-only">{plugin.desc}</DialogDescription>

        <div className="px-8 py-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-6 mb-8 pr-8">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className={`w-16 h-16 rounded-2xl inline-flex items-center justify-center shrink-0 ${plugin.iconColor}`}>
                <plugin.Icon className="w-8 h-8" />
              </div>
              <div className="min-w-0 flex-1">
                {plugin.badge && (
                  <div className="text-[11px] text-emerald-700 font-medium mb-1">
                    {plugin.badge === "Best" ? t("stPluginBestSeller") : t("stPluginEditorChoice")}
                  </div>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-foreground" data-testid="text-detail-plugin-name">{plugin.name}</h1>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                  <button className="text-muted-foreground hover:text-yellow-500" data-testid="button-detail-favorite">
                    <Star className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                  <span>기준 {plugin.vendor}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              {subscribed && !plugin.canceled ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="lg" variant="destructive" className="gap-2 shadow-sm" data-testid="button-detail-cancel">
                      {t("stPluginCancel")}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("stPluginCancelConfirmTitle")}</AlertDialogTitle>
                      <AlertDialogDescription>{t("stPluginCancelConfirmDesc")}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("stPluginKeepActive")}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onCancel(plugin.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        data-testid="button-detail-confirm-cancel"
                      >
                        {t("stPluginCancelConfirm")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button
                  size="lg"
                  className="gap-2 shadow-sm"
                  onClick={() => setPayOpen(true)}
                  data-testid="button-detail-subscribe"
                >
                  <Download className="w-4 h-4" />
                  {t("stPluginSubscribe")}
                </Button>
              )}
              <div className="text-right">
                <span className="text-lg font-bold text-foreground">₩{plugin.price.toLocaleString("ko-KR")}</span>
                <span className="text-xs text-muted-foreground">{t("stPluginPerMonth")}</span>
              </div>
            </div>
          </div>

          {/* Screenshots Carousel */}
          <div className="relative mb-8">
            <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-border flex items-center justify-center hover:bg-secondary" data-testid="button-detail-screenshot-prev">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-border flex items-center justify-center hover:bg-secondary" data-testid="button-detail-screenshot-next">
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-2 gap-4">
              {screenshots.map((s, i) => (
                <div key={i} className={`aspect-[16/10] rounded-xl bg-gradient-to-br ${s.tint} flex flex-col items-center justify-center text-white shadow-md relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,white,transparent_60%)]" />
                  <div className="relative text-center">
                    <div className="text-xs uppercase tracking-wider opacity-80 mb-1">Screenshot {i + 1}</div>
                    <div className="text-xl font-bold">{s.title}</div>
                    <div className="text-sm opacity-80 mt-1">{s.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border mb-6">
            <div className="flex gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key ? "border-blue-500 text-blue-600" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`tab-detail-${tab.key}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className={`grid grid-cols-1 gap-8 ${activeTab === "overview" ? "lg:grid-cols-[1fr_300px]" : ""}`}>
            <div className="space-y-8 text-sm leading-relaxed">
              {activeTab === "overview" && (
                <>
                  <section>
                    <h3 className="text-base font-bold text-foreground mb-3">{t("stPluginKeyFeaturesIntro")}</h3>
                    <p className="text-muted-foreground leading-7">
                      본 {plugin.name} 서비스는 EM-Graph 워크스페이스의 데이터를 종합적으로 분석하여 노드별·관계별 인사이트(연결 강도와 방향)를 정량화된 지표로 제공하는 서비스입니다.
                      단순 통계 정보가 아닌 일정 기간 동안의 추세 지속성, 변동성 대비 활동 강도, 트래픽 기반 신뢰도 등을 함께 반영하여 보다 정교한 비즈니스 판단을 지원하는 것이 특징이며,
                      실시간에 가까운 데이터를 기반으로 AI가 진단한 핵심 지표와 시장 대비 변화율을 제공하여 단기 운영부터 중장기 전략 수립까지 활용 가능한 구조로 설계된 {plugin.category} 서비스입니다.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-base font-bold text-foreground mb-3">{t("stPluginKeyFeatures")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        "노드별 활동 지표 제공",
                        "기간별 추세 분석 (5일/10일/20일)",
                        "시계열 데이터 조회 API (최근 6개월)",
                        "실시간 알림 및 이벤트 트리거",
                      ].map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-emerald-50/70 border border-emerald-100"
                          data-testid={`detail-feature-${feature}`}
                        >
                          <Star className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="text-sm text-emerald-900">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-base font-bold text-foreground mb-3">{t("stPluginUseCases")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { title: "핵심 노드 선별 전략 구축", desc: "활동 점수가 높은 노드를 선별하여 우선 분석 후보군으로 활용하는 전략입니다." },
                        { title: "자동화 워크플로우 연동", desc: "지표 임계값을 트리거 조건으로 활용하여 자동화 워크플로우를 구현하는 방식입니다." },
                        { title: "포트폴리오 리밸런싱 기준 활용", desc: "약화된 영역은 비중을 축소, 강화된 영역은 비중을 확대하는 방식으로 자원을 조정하는 기준입니다." },
                        { title: "인사이트 대시보드 구성", desc: "API 형태로 제공되어 분석 시스템, 운영 대시보드, 리서치 플랫폼 등 다양한 환경에 쉽게 연동할 수 있습니다." },
                      ].map((item) => (
                        <div
                          key={item.title}
                          className="px-4 py-3 rounded-lg bg-blue-50/60 border border-blue-100 space-y-1"
                          data-testid={`detail-usecase-${item.title}`}
                        >
                          <div className="flex items-center gap-2 text-blue-900 font-semibold text-sm">
                            <svg className="w-4 h-4 text-blue-600 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 11 8 15 16 6" /></svg>
                            {item.title}
                          </div>
                          <p className="text-xs text-blue-900/80 leading-relaxed pl-6">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {activeTab === "pricing" && (
                <section className="space-y-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">팀 규모에 맞는 요금제를 선택하세요</h3>
                      <p className="text-xs text-muted-foreground mt-1">언제든지 업그레이드하거나 다운그레이드할 수 있습니다.</p>
                    </div>
                    <div className="inline-flex items-center bg-secondary/70 rounded-full p-1 text-xs font-medium">
                      <button
                        onClick={() => setBillingCycle("monthly")}
                        className={`px-4 py-1.5 rounded-full transition-colors ${billingCycle === "monthly" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"}`}
                        data-testid="toggle-detail-billing-monthly"
                      >
                        월간 결제
                      </button>
                      <button
                        onClick={() => setBillingCycle("yearly")}
                        className={`px-4 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${billingCycle === "yearly" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"}`}
                        data-testid="toggle-detail-billing-yearly"
                      >
                        연간 결제
                        <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">-20%</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PRICING_TIERS.map((tier) => (
                      <Card
                        key={tier.name}
                        className={`p-5 flex flex-col relative ${tier.highlight ? "border-blue-500 border-2 shadow-md" : "border-border/60"}`}
                        data-testid={`detail-pricing-tier-${tier.name}`}
                      >
                        {tier.highlight && (
                          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            인기
                          </div>
                        )}
                        <div className="space-y-1 mb-4">
                          <div className="text-base font-bold text-foreground">{tier.name}</div>
                          <p className="text-xs text-muted-foreground leading-relaxed min-h-[2.5rem]">{tier.description}</p>
                        </div>
                        <div className="mb-1">
                          {billingCycle === "yearly" && (
                            <div className="text-[11px] text-muted-foreground line-through">
                              ₩{tier.monthly.toLocaleString("ko-KR")} / 월
                            </div>
                          )}
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-foreground">₩{formatPrice(tier.monthly)}</span>
                            <span className="text-xs text-muted-foreground">/ 월</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {billingCycle === "yearly"
                              ? `연 ₩${(Math.round(tier.monthly * (1 - YEARLY_DISCOUNT)) * 12).toLocaleString("ko-KR")} 일시 결제`
                              : "월 단위 결제"}
                          </div>
                        </div>
                        <div className="text-[11px] text-muted-foreground mb-4 mt-2">사용자 {tier.seats}</div>
                        <Button
                          className={`w-full mb-4 ${tier.highlight ? "" : "bg-secondary text-foreground hover:bg-secondary/80"}`}
                          variant={tier.highlight ? "default" : "secondary"}
                          data-testid={`button-detail-tier-${tier.name}`}
                        >
                          {tier.cta}
                        </Button>
                        <ul className="space-y-2 text-xs text-muted-foreground">
                          {tier.features.map((f) => (
                            <li key={f} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    ))}
                  </div>

                  <Card className="p-5 border-border/60 bg-secondary/30 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-foreground">맞춤형 엔터프라이즈 플랜이 필요하신가요?</div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">대규모 사용량, 온프레미스 배포, 별도 SLA가 필요하신 경우 영업팀이 맞춤 견적을 도와드립니다.</p>
                    </div>
                    <Button variant="outline" size="sm" data-testid="button-detail-contact-sales">영업팀 문의</Button>
                  </Card>

                  <div className="text-[11px] text-muted-foreground space-y-1">
                    <p>· 모든 가격은 VAT 별도이며 원화(KRW) 기준입니다.</p>
                    <p>· 연간 결제 시 20% 할인이 자동 적용되며, 1년 단위로 일시 결제됩니다.</p>
                    <p>· 14일 무료 체험 기간 동안 언제든지 해지 가능하며, 결제는 발생하지 않습니다.</p>
                  </div>
                </section>
              )}

              {activeTab === "terms" && (
                <section className="space-y-5 text-sm text-muted-foreground leading-7">
                  <div>
                    <h3 className="text-base font-bold text-foreground mb-2">제1조 (목적)</h3>
                    <p>본 약관은 ㈜{plugin.vendor}가 제공하는 {plugin.name} 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground mb-2">제2조 (이용 계약의 체결)</h3>
                    <p>이용 계약은 이용자가 본 약관에 동의하고 서비스 구독을 신청한 후 회사가 이를 승낙함으로써 체결됩니다. 무료 체험 기간 종료 후에는 선택한 요금제에 따라 자동으로 결제가 진행됩니다.</p>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground mb-2">제3조 (서비스의 제공 및 변경)</h3>
                    <p>회사는 안정적인 서비스 제공을 위해 정기 점검을 실시할 수 있으며, 서비스의 내용은 운영상·기술상의 필요에 따라 변경될 수 있습니다. 중요한 변경 사항은 사전에 공지합니다.</p>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground mb-2">제4조 (해지 및 환불)</h3>
                    <p>이용자는 언제든지 구독을 해지할 수 있으며, 해지 시 현재 결제 주기가 종료되는 시점까지 서비스를 계속 이용할 수 있습니다. 환불 정책은 관련 법령 및 회사의 환불 규정을 따릅니다.</p>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground mb-2">제5조 (데이터 보호)</h3>
                    <p>회사는 이용자의 데이터를 안전하게 보호하기 위해 암호화 및 접근 통제 등 합리적인 보안 조치를 시행하며, 개인정보 처리방침에 따라 개인정보를 처리합니다.</p>
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            {activeTab === "overview" && (
              <aside className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-2">{t("stPluginPrivacySecurity")}</h4>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li><a href="#" className="hover:text-foreground">{t("stPluginPrivacyPolicy")}</a></li>
                    <li><a href="#" className="hover:text-foreground">{t("stPluginTerms")}</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-foreground mb-2">{t("stPluginCategoryLabel")}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {[plugin.category, "Integrations", "Productivity"].map((c) => (
                      <Badge key={c} variant="outline" className="text-xs font-normal">{c}</Badge>
                    ))}
                  </div>
                </div>

                <Card className="p-5 border-border/60 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl inline-flex items-center justify-center shrink-0 ${plugin.iconColor}`}>
                      <plugin.Icon className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-base text-foreground">{plugin.vendor}</div>
                      <div className="flex items-center gap-1 mt-0.5 text-xs text-emerald-700">
                        <Shield className="w-3.5 h-3.5" />
                        {t("stPluginVerifiedProvider")}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    ㈜{plugin.vendor}는 인공지능/데이터 분석 분야에 특화된 기술을 확보하여 2018년부터 특허·논문·기업·산업 데이터 분석 사업을 수행하며, 온톨로지 알고리즘 기반 분석 솔루션 및 산업분석 특화 LLM 모델을 제공합니다.
                  </p>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-foreground">
                      <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                      <a href="#" className="hover:underline">{plugin.vendor.toLowerCase().replace(/\s+/g, "")}.com</a>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      <a href="#" className="hover:underline">manager@{plugin.vendor.toLowerCase().replace(/\s+/g, "")}.com</a>
                    </div>
                  </div>
                </Card>
              </aside>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Payment Popup */}
    <Dialog open={payOpen} onOpenChange={setPayOpen}>
      <DialogContent className="max-w-md" data-testid="dialog-plugin-payment">
        <DialogTitle>구독 결제</DialogTitle>
        <DialogDescription>{plugin.name} 구독을 시작합니다.</DialogDescription>

        <div className="space-y-5 pt-2">
          {/* Order summary */}
          <Card className="p-4 border-border/60 flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl inline-flex items-center justify-center shrink-0 ${plugin.iconColor}`}>
              <plugin.Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-sm text-foreground truncate">{plugin.name}</div>
              <div className="text-xs text-muted-foreground">월간 구독 · {plugin.vendor}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-bold text-foreground">₩{plugin.price.toLocaleString("ko-KR")}</div>
              <div className="text-[11px] text-muted-foreground">/ 월</div>
            </div>
          </Card>

          {/* Coupon */}
          <div>
            <div className="text-xs font-medium text-foreground mb-1.5">할인 코드</div>
            <div className="flex gap-2">
              <Input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="쿠폰 코드를 입력하세요"
                className="h-9"
                data-testid="input-payment-coupon"
              />
              <Button
                variant="outline"
                className="h-9 shrink-0"
                disabled={!couponInput.trim()}
                onClick={() => setCouponApplied(true)}
                data-testid="button-payment-apply-coupon"
              >
                적용
              </Button>
            </div>
            {couponApplied && (
              <p className="text-[11px] text-emerald-600 mt-1.5" data-testid="text-payment-coupon-applied">
                쿠폰이 적용되어 10% 할인되었습니다.
              </p>
            )}
          </div>

          {/* Payment method */}
          <div>
            <div className="text-xs font-medium text-foreground mb-1.5">결제 수단</div>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm.id}
                  onClick={() => setPayMethod(pm.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors ${
                    payMethod === pm.id ? "border-blue-500 bg-blue-50/50" : "border-border hover:bg-secondary/50"
                  }`}
                  data-testid={`button-payment-method-${pm.id}`}
                >
                  <CreditCard className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground flex-1">
                    {pm.label} •••• {pm.last4}
                  </span>
                  {pm.isDefault && (
                    <Badge variant="outline" className="text-[10px] font-normal">기본</Badge>
                  )}
                  {payMethod === pm.id && <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Total breakdown */}
          <div className="space-y-1.5 text-sm border-t border-border pt-4">
            <div className="flex justify-between text-muted-foreground">
              <span>상품 금액</span>
              <span>₩{plugin.price.toLocaleString("ko-KR")}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>할인</span>
                <span>-₩{discountAmount.toLocaleString("ko-KR")}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>부가세 (VAT 10%)</span>
              <span>₩{vat.toLocaleString("ko-KR")}</span>
            </div>
            <div className="flex justify-between items-baseline font-bold text-foreground pt-1">
              <span>총 결제 금액</span>
              <span className="text-lg" data-testid="text-payment-total">₩{payTotal.toLocaleString("ko-KR")}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              className="flex-1 gap-1"
              onClick={() => setPayOpen(false)}
              data-testid="button-payment-back"
            >
              <ChevronLeft className="w-4 h-4" />
              뒤로
            </Button>
            <Button
              className="flex-1 gap-2"
              onClick={handleConfirmPayment}
              data-testid="button-payment-confirm"
            >
              <CreditCard className="w-4 h-4" />
              ₩{payTotal.toLocaleString("ko-KR")} 결제하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
