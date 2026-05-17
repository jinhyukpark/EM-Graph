import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/lib/i18n';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Search, Download, Settings as SettingsIcon, MessageCircle, X, Sparkles,
  Database, FileText, BarChart3, Mail, Calendar, Bot, Link2, Shield,
  Workflow, GitBranch, FileSpreadsheet, Bell, Cloud, Lock, Users, Zap,
  Globe, ImageIcon, PieChart, Slack, ArrowRight, Star, ChevronLeft, ChevronRight,
  CheckCircle2, Flag, ExternalLink
} from 'lucide-react';
import aiBannerImg from '@assets/generated_images/modern_office_team_collaboration_416f.png';

type Plugin = {
  id: string;
  name: string;
  vendor: string;
  desc: string;
  category: string;
  Icon: any;
  iconColor: string;
  rating?: number;
  reviews?: number;
  downloads?: string;
  badge?: 'Editor' | 'Best' | null;
};

const CATEGORIES = [
  'Discover', 'Featured', 'For you', 'Trending', "Editor's choice", 'New', 'Favorites',
  'AI', 'Data', 'Integrations', 'Analytics', 'Workflow', 'Security', 'Collaboration',
];

const PLUGINS: Plugin[] = [
  { id: 'p1', name: 'Graph AI Copilot', vendor: 'EM-Graph Labs', desc: '그래프 패턴 자동 발견 및 자연어 질의 응답을 제공하는 AI 어시스턴트.', category: 'AI', Icon: Bot, iconColor: 'text-violet-600 bg-violet-50', rating: 5.0, reviews: 312, downloads: '12.4K', badge: 'Editor' },
  { id: 'p2', name: 'Snowflake Connector', vendor: 'EM-Graph', desc: 'Snowflake 웨어하우스에서 실시간으로 데이터를 동기화합니다.', category: 'Data', Icon: Database, iconColor: 'text-sky-600 bg-sky-50', rating: 4.8, reviews: 145, downloads: '8.2K', badge: 'Best' },
  { id: 'p3', name: 'PDF Knowledge Extractor', vendor: 'DocuMind', desc: 'PDF/문서에서 엔티티와 관계를 자동 추출하여 그래프로 변환.', category: 'AI', Icon: FileText, iconColor: 'text-rose-600 bg-rose-50', rating: 4.7, reviews: 88, downloads: '5.1K', badge: 'Editor' },
  { id: 'p4', name: 'Looker Dashboard Sync', vendor: 'Vantage Charts', desc: '그래프 인사이트를 Looker 대시보드와 양방향 동기화.', category: 'Analytics', Icon: BarChart3, iconColor: 'text-emerald-600 bg-emerald-50', rating: 4.6, reviews: 67, downloads: '3.4K' },
  { id: 'p5', name: 'Email Digest', vendor: 'BriefBox', desc: '매일 그래프 변화와 핵심 알림을 이메일로 요약 발송.', category: 'Workflow', Icon: Mail, iconColor: 'text-blue-600 bg-blue-50', rating: 4.5, reviews: 92, downloads: '6.0K' },
  { id: 'p6', name: 'Slack Alerts', vendor: 'Pioneera', desc: '그래프 노드/엣지 변동을 실시간으로 슬랙 채널에 알립니다.', category: 'Integrations', Icon: Slack, iconColor: 'text-fuchsia-600 bg-fuchsia-50', rating: 4.9, reviews: 220, downloads: '15.8K', badge: 'Best' },
  { id: 'p7', name: 'Calendar Sync', vendor: 'EM-Graph', desc: '회의/이벤트와 그래프 엔티티를 연결해 컨텍스트를 풍부하게.', category: 'Integrations', Icon: Calendar, iconColor: 'text-amber-600 bg-amber-50', rating: 4.3, reviews: 41, downloads: '2.1K' },
  { id: 'p8', name: 'Auto-Tagger', vendor: 'TagFlow', desc: '머신러닝으로 노드에 비즈니스 태그를 자동 부여.', category: 'AI', Icon: Sparkles, iconColor: 'text-violet-600 bg-violet-50', rating: 4.4, reviews: 53, downloads: '2.9K' },
  { id: 'p9', name: 'Webhook Gateway', vendor: 'EM-Graph', desc: '외부 시스템과의 이벤트 기반 통합. REST/GraphQL 지원.', category: 'Integrations', Icon: Link2, iconColor: 'text-indigo-600 bg-indigo-50', rating: 4.2, reviews: 28, downloads: '1.5K' },
  { id: 'p10', name: 'Audit & Compliance', vendor: 'SafeTrace', desc: '모든 그래프 변경 이력을 추적하고 감사 보고서를 생성.', category: 'Security', Icon: Shield, iconColor: 'text-red-600 bg-red-50', rating: 4.8, reviews: 119, downloads: '4.7K', badge: 'Editor' },
  { id: 'p11', name: 'Workflow Builder', vendor: 'FlowKit', desc: '드래그앤드롭으로 자동화 워크플로우를 만드는 No-Code 도구.', category: 'Workflow', Icon: Workflow, iconColor: 'text-teal-600 bg-teal-50', rating: 4.6, reviews: 78, downloads: '5.6K' },
  { id: 'p12', name: 'Git Sync', vendor: 'DevBridge', desc: '온톨로지를 Git 저장소와 버전 관리.', category: 'Workflow', Icon: GitBranch, iconColor: 'text-orange-600 bg-orange-50', rating: 4.5, reviews: 33, downloads: '1.8K' },
  { id: 'p13', name: 'Excel Import +', vendor: 'EM-Graph', desc: '복잡한 엑셀 시트를 그래프 노드/엣지로 자동 매핑.', category: 'Data', Icon: FileSpreadsheet, iconColor: 'text-green-600 bg-green-50', rating: 4.7, reviews: 201, downloads: '10.3K', badge: 'Best' },
  { id: 'p14', name: 'Smart Notifications', vendor: 'PingPro', desc: '중요도 기반 알림 필터링 및 우선순위 정렬.', category: 'Workflow', Icon: Bell, iconColor: 'text-yellow-600 bg-yellow-50', rating: 4.4, reviews: 47, downloads: '2.5K' },
  { id: 'p15', name: 'Cloud Backup', vendor: 'VaultCloud', desc: 'S3/GCS에 자동 백업 및 복원 기능 제공.', category: 'Security', Icon: Cloud, iconColor: 'text-cyan-600 bg-cyan-50', rating: 4.6, reviews: 64, downloads: '3.2K' },
  { id: 'p16', name: 'SSO & RBAC', vendor: 'EM-Graph', desc: 'Okta·Azure AD SSO와 세분화된 역할 기반 권한 관리.', category: 'Security', Icon: Lock, iconColor: 'text-slate-600 bg-slate-100', rating: 4.9, reviews: 156, downloads: '7.4K', badge: 'Editor' },
  { id: 'p17', name: 'Team Spaces', vendor: 'TeamUp', desc: '팀별 분리된 작업 공간과 공유 권한을 제공합니다.', category: 'Collaboration', Icon: Users, iconColor: 'text-pink-600 bg-pink-50', rating: 4.5, reviews: 71, downloads: '3.8K' },
  { id: 'p18', name: 'Performance Boost', vendor: 'TurboGraph', desc: '대용량 그래프에서 쿼리 성능을 최대 5배 향상.', category: 'Data', Icon: Zap, iconColor: 'text-amber-600 bg-amber-50', rating: 4.7, reviews: 84, downloads: '4.1K' },
  { id: 'p19', name: 'Public API Gateway', vendor: 'EM-Graph', desc: '외부에 안전하게 공개 가능한 그래프 API 엔드포인트.', category: 'Integrations', Icon: Globe, iconColor: 'text-sky-600 bg-sky-50', rating: 4.4, reviews: 39, downloads: '2.0K' },
  { id: 'p20', name: 'Image Recognition', vendor: 'VisionLink', desc: '이미지에서 자동으로 엔티티를 식별하고 노드로 추가.', category: 'AI', Icon: ImageIcon, iconColor: 'text-purple-600 bg-purple-50', rating: 4.3, reviews: 22, downloads: '1.2K' },
  { id: 'p21', name: 'Insight Charts', vendor: 'Vantage Charts', desc: '그래프 메트릭을 다양한 차트로 시각화.', category: 'Analytics', Icon: PieChart, iconColor: 'text-emerald-600 bg-emerald-50', rating: 4.5, reviews: 55, downloads: '2.6K' },
];

function PluginCard({ p, onClick }: { p: Plugin; onClick?: () => void }) {
  return (
    <Card onClick={onClick} className="p-4 hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col gap-3 border-border/60 cursor-pointer" data-testid={`card-plugin-${p.id}`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg inline-flex items-center justify-center shrink-0 ${p.iconColor}`}>
          <p.Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <h3 className="text-sm font-semibold text-foreground truncate flex-1">{p.name}</h3>
            {p.badge && (
              <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 h-4 shrink-0 ${p.badge === 'Best' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {p.badge === 'Best' ? 'Best seller' : "Editor's choice"}
              </Badge>
            )}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">기준 {p.vendor}</div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{p.desc}</p>
      <div className="flex items-center justify-between mt-auto pt-1 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-3">
          {p.rating && (
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {p.rating} ({p.reviews})
            </span>
          )}
          {p.downloads && (
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {p.downloads}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

function PluginSection({ title, plugins, onSelect }: { title: string; plugins: Plugin[]; onSelect: (p: Plugin) => void }) {
  if (plugins.length === 0) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <button className="text-xs text-primary hover:underline flex items-center gap-1" data-testid={`link-more-${title}`}>
          자세히 보기 <ArrowRight className="w-3 h-3" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plugins.slice(0, 3).map(p => <PluginCard key={p.id} p={p} onClick={() => onSelect(p)} />)}
      </div>
    </div>
  );
}

function PluginDetail({ plugin, onBack }: { plugin: Plugin; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'pricing' | 'reviews' | 'security' | 'permissions'>('overview');
  const screenshots = [
    { title: '대시보드 미리보기', subtitle: '핵심 KPI를 한눈에', tint: 'from-violet-600 to-indigo-700' },
    { title: '실시간 분석', subtitle: '데이터 변화 추적', tint: 'from-emerald-600 to-teal-700' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted-foreground mb-6 flex items-center gap-1.5">
        <button onClick={onBack} className="hover:text-foreground" data-testid="link-breadcrumb-home">홈</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground truncate max-w-[280px]">{plugin.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-8 mb-8">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className={`w-16 h-16 rounded-2xl inline-flex items-center justify-center shrink-0 ${plugin.iconColor}`}>
            <plugin.Icon className="w-8 h-8" />
          </div>
          <div className="min-w-0 flex-1">
            {plugin.badge && (
              <div className="text-[11px] text-emerald-700 font-medium mb-1">
                {plugin.badge === 'Best' ? 'Best seller' : "Editor's choice"}
              </div>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">{plugin.name}</h1>
              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
              <button className="text-muted-foreground hover:text-yellow-500" data-testid="button-favorite">
                <Star className="w-5 h-5" />
              </button>
            </div>
            <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
              <span>기준 {plugin.vendor}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <Button size="lg" className="gap-2 shadow-sm" data-testid="button-install-plugin">
            <Download className="w-4 h-4" />
            앱 설치
          </Button>
          <span className="text-[11px] text-muted-foreground">14 days trial</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-8 mb-8 pb-6 border-b border-border">
        {[
          { label: '설치', value: <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" />{plugin.downloads ?? '1.5K'}</span> },
          { label: '런칭일', value: 'Apr 2025' },
          { label: '버전 업데이트', value: '3 days ago' },
          { label: '평가', value: plugin.rating ? <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />{plugin.rating} ({plugin.reviews})</span> : '아직 평가 없음' },
        ].map(s => (
          <div key={s.label}>
            <div className="text-[11px] text-muted-foreground mb-1">{s.label}</div>
            <div className="text-sm font-medium text-foreground">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Screenshots Carousel */}
      <div className="relative mb-8">
        <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-border flex items-center justify-center hover:bg-secondary" data-testid="button-screenshot-prev">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-border flex items-center justify-center hover:bg-secondary" data-testid="button-screenshot-next">
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
          {[
            { key: 'overview', label: '개요' },
            { key: 'pricing', label: '가격' },
            { key: 'reviews', label: '리뷰' },
            { key: 'security', label: '보안 및 규정 준수' },
            { key: 'permissions', label: '권한' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key ? 'border-blue-500 text-blue-600' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              data-testid={`tab-${tab.key}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body Two-Col */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Main content */}
        <div className="space-y-8 text-sm leading-relaxed">
          {/* 이 자료에 대하여 */}
          <section>
            <h3 className="text-base font-bold text-foreground mb-3">이 자료에 대하여</h3>
            <p className="text-muted-foreground leading-7">
              본 {plugin.name} 서비스는 EM-Graph 워크스페이스의 데이터를 종합적으로 분석하여 노드별·관계별 인사이트(연결 강도와 방향)를 정량화된 지표로 제공하는 서비스입니다.
              단순 통계 정보가 아닌 일정 기간 동안의 추세 지속성, 변동성 대비 활동 강도, 트래픽 기반 신뢰도 등을 함께 반영하여 보다 정교한 비즈니스 판단을 지원하는 것이 특징이며,
              실시간에 가까운 데이터를 기반으로 AI가 진단한 핵심 지표와 시장 대비 변화율을 제공하여 단기 운영부터 중장기 전략 수립까지 활용 가능한 구조로 설계된 {plugin.category} 서비스입니다.
            </p>
          </section>

          {/* 주요 기능 */}
          <section>
            <h3 className="text-base font-bold text-foreground mb-3">주요 기능</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                '노드별 활동 지표 제공',
                '기간별 추세 분석 (5일/10일/20일)',
                '시계열 데이터 조회 API (최근 6개월)',
                '실시간 알림 및 이벤트 트리거',
              ].map(feature => (
                <div
                  key={feature}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-emerald-50/70 border border-emerald-100"
                  data-testid={`feature-${feature}`}
                >
                  <Star className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-sm text-emerald-900">{feature}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 사용 예시 */}
          <section>
            <h3 className="text-base font-bold text-foreground mb-3">사용 예시</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  title: '핵심 노드 선별 전략 구축',
                  desc: '활동 점수가 높은 노드를 선별하여 우선 분석 후보군으로 활용하는 전략입니다.',
                },
                {
                  title: '자동화 워크플로우 연동',
                  desc: '지표 임계값을 트리거 조건으로 활용하여 자동화 워크플로우를 구현하는 방식입니다.',
                },
                {
                  title: '포트폴리오 리밸런싱 기준 활용',
                  desc: '약화된 영역은 비중을 축소, 강화된 영역은 비중을 확대하는 방식으로 자원을 조정하는 기준입니다.',
                },
                {
                  title: '인사이트 대시보드 구성',
                  desc: 'API 형태로 제공되어 분석 시스템, 운영 대시보드, 리서치 플랫폼 등 다양한 환경에 쉽게 연동할 수 있습니다.',
                },
              ].map(item => (
                <div
                  key={item.title}
                  className="px-4 py-3 rounded-lg bg-blue-50/60 border border-blue-100 space-y-1"
                  data-testid={`usecase-${item.title}`}
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

          <div className="pt-2">
            <h3 className="font-bold text-foreground mb-3">다음에서 앱을 사용할 수 있습니다</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-10 h-10 rounded-lg border border-border bg-secondary/40 flex items-center justify-center">
                <Workflow className="w-5 h-5" />
              </div>
              <span>워크스페이스</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <Card className="p-4 border-border/60">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-semibold">데이터 보호 인증</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              이 앱은 데이터 보호에 대한 헌신으로 인정받았습니다. 파트너가 제공한 다음 기준 중 하나를 충족한 자격이 있습니다:
            </p>
            <button className="text-xs text-blue-600 hover:underline mt-2 flex items-center gap-1">
              자세히 보기 <ChevronRight className="w-3 h-3" />
            </button>
          </Card>

          <div>
            <h4 className="text-sm font-bold text-foreground mb-2">리소스</h4>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">지원</a></li>
              <li><a href="#" className="hover:text-foreground">개발자 웹사이트</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground mb-2">개인정보 및 보안</h4>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">개인정보 처리방침</a></li>
              <li><a href="#" className="hover:text-foreground">서비스 약관</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground mb-2">카테고리</h4>
            <div className="flex flex-wrap gap-1.5">
              {[plugin.category, 'Integrations', 'Productivity'].map(c => (
                <Badge key={c} variant="outline" className="text-xs font-normal">{c}</Badge>
              ))}
            </div>
          </div>

          <Card className="p-4 border-border/60">
            <div className="text-xs text-muted-foreground mb-1">개발자:</div>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg inline-flex items-center justify-center shrink-0 ${plugin.iconColor}`}>
                <plugin.Icon className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-foreground">{plugin.vendor}</div>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-2">
              <CheckCircle2 className="w-4 h-4 text-slate-500" />
              Silver partner
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Silver 마켓플레이스 파트너는 EM-Graph 파트너 프로그램에 참여하여 강화된 요건을 충족했습니다.
              <a href="#" className="text-blue-600 hover:underline ml-1">마켓플레이스 파트너 프로그램에 대해 자세히 알아보기</a>
            </p>
          </Card>

          <Card className="p-4 border-border/60 flex items-center justify-center">
            <button className="text-xs text-rose-600 hover:underline flex items-center gap-1.5" data-testid="button-report-app">
              <Flag className="w-3.5 h-3.5" />
              이 앱 보고
            </button>
          </Card>
        </aside>
      </div>
    </div>
  );
}

export default function Plugins() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('Discover');
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);

  const filtered = PLUGINS.filter(p =>
    (!query || p.name.toLowerCase().includes(query.toLowerCase()) || p.desc.toLowerCase().includes(query.toLowerCase())) &&
    (activeCat === 'Discover' || activeCat === 'Featured' || activeCat === 'For you' || activeCat === 'Trending' || activeCat === "Editor's choice" || activeCat === 'New' || activeCat === 'Favorites' || p.category === activeCat)
  );

  const recentlyViewed = filtered.slice(0, 4);
  const featured = filtered.filter(p => p.badge === 'Best' || p.badge === 'Editor');
  const aiPlugins = filtered.filter(p => p.category === 'AI');
  const integrations = filtered.filter(p => p.category === 'Integrations' || p.category === 'Data');

  return (
    <Layout>
      <div className="h-full flex flex-col bg-background overflow-hidden">
        {/* Top Bar */}
        <div className="border-b border-border bg-card/40 px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedPlugin(null)} className="flex items-center gap-3" data-testid="button-marketplace-home">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-foreground">EM-Graph <span className="text-muted-foreground font-normal">marketplace</span></span>
            </button>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/60 text-xs">
            <Bot className="w-3.5 h-3.5 text-violet-500" />
            AI 허브
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs"><Download className="w-3.5 h-3.5" />관리하기</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><MessageCircle className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.history.back()} data-testid="button-close-plugins"><X className="w-4 h-4" /></Button>
          </div>
        </div>

        {/* Scroll Area */}
        <div className="flex-1 overflow-y-auto">
          {selectedPlugin ? (
            <PluginDetail plugin={selectedPlugin} onBack={() => setSelectedPlugin(null)} />
          ) : (
          <div className="max-w-[1400px] mx-auto px-8 py-8 space-y-8">
            {/* Heading + Search */}
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-semibold text-foreground">필요에 맞게 제작된 강력한 도구 살펴보기</h1>
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="원하는 플러그인 검색..."
                  className="pl-10 h-11 shadow-sm border-muted-foreground/20"
                  data-testid="input-plugin-search"
                />
              </div>
            </div>

            {/* AI Hub Banner */}
            <div className="rounded-2xl text-white p-10 flex items-center justify-between overflow-hidden relative min-h-[220px]">
              <img
                src={aiBannerImg}
                alt="AI 협업"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-slate-900/20" />
              <div className="relative z-10 max-w-md">
                <div className="text-[11px] uppercase tracking-wider opacity-80 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  AI 허브
                </div>
                <h2 className="text-3xl font-bold mb-2 leading-snug">새로운 AI 인력을<br/>만나보세요</h2>
                <p className="text-sm text-white/70 mb-4 max-w-sm">팀의 협업과 인사이트를 가속하는 EM-Graph AI 어시스턴트를 지금 만나보세요.</p>
                <Button variant="secondary" size="sm" className="bg-white/15 text-white border border-white/25 hover:bg-white/25 backdrop-blur-sm" data-testid="button-explore-ai">
                  탐색 시작
                </Button>
              </div>
              <div className="absolute -right-10 -top-10 w-60 h-60 rounded-full bg-violet-500/30 blur-3xl" />
              <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-pink-500/20 blur-3xl" />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeCat === cat
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-secondary/50 text-muted-foreground hover:bg-secondary border border-transparent'
                  }`}
                  data-testid={`pill-cat-${cat}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sections */}
            <PluginSection title="Recently viewed" plugins={recentlyViewed} onSelect={setSelectedPlugin} />
            <PluginSection title="Featured" plugins={featured} onSelect={setSelectedPlugin} />
            <PluginSection title="AI" plugins={aiPlugins} onSelect={setSelectedPlugin} />
            <PluginSection title="Integrations & Data" plugins={integrations} onSelect={setSelectedPlugin} />

            {/* All */}
            <div className="space-y-3">
              <h2 className="text-base font-semibold text-foreground">전체 플러그인 ({filtered.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(p => <PluginCard key={p.id} p={p} onClick={() => setSelectedPlugin(p)} />)}
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
