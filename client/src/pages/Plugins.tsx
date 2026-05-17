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
  Globe, ImageIcon, PieChart, Slack, ArrowRight, Star
} from 'lucide-react';

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

function PluginCard({ p }: { p: Plugin }) {
  return (
    <Card className="p-4 hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col gap-3 border-border/60" data-testid={`card-plugin-${p.id}`}>
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

function PluginSection({ title, plugins }: { title: string; plugins: Plugin[] }) {
  if (plugins.length === 0) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <button className="text-xs text-primary hover:underline flex items-center gap-1" data-testid={`link-more-${title}`}>
          자세히 보기 <ArrowRight className="w-3 h-3" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {plugins.slice(0, 4).map(p => <PluginCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}

export default function Plugins() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('Discover');

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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-foreground">EM-Graph <span className="text-muted-foreground font-normal">marketplace</span></span>
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
          <div className="max-w-6xl mx-auto px-8 py-8 space-y-8">
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
            <div className="rounded-2xl bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white p-8 flex items-center justify-between overflow-hidden relative">
              <div className="relative z-10 max-w-md">
                <div className="text-[11px] uppercase tracking-wider opacity-70 mb-1">AI 허브</div>
                <h2 className="text-2xl font-bold mb-3">새로운 AI 인력을 만나보세요</h2>
                <Button variant="secondary" size="sm" className="bg-white/10 text-white border border-white/20 hover:bg-white/20" data-testid="button-explore-ai">
                  탐색 시작
                </Button>
              </div>
              <div className="hidden md:flex gap-4 relative z-10">
                {[Sparkles, Bot, Zap].map((Icon, i) => (
                  <div key={i} className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-xl">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                ))}
              </div>
              <div className="absolute -right-10 -top-10 w-60 h-60 rounded-full bg-violet-500/20 blur-3xl" />
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
            <PluginSection title="Recently viewed" plugins={recentlyViewed} />
            <PluginSection title="Featured" plugins={featured} />
            <PluginSection title="AI" plugins={aiPlugins} />
            <PluginSection title="Integrations & Data" plugins={integrations} />

            {/* All */}
            <div className="space-y-3">
              <h2 className="text-base font-semibold text-foreground">전체 플러그인 ({filtered.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(p => <PluginCard key={p.id} p={p} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
