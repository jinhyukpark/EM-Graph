import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, BarChart2, Brain, Database, FileSearch, Globe, Lock, Network, Share2, Zap, Plus, Sigma, Wand2, Upload, Sparkles, Check } from "lucide-react";
import { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { translations } from "@/lib/translations";
import { Globe as GlobeIcon } from "lucide-react";

import investigationImage from '@assets/generated_images/digital_network_graph_connecting_suspects_and_evidence.png';
import supplyChainImage from '@assets/generated_images/global_supply_chain_network_with_logistics_nodes.png';
import financeImage from '@assets/generated_images/financial_transaction_graph_with_fraud_anomaly.png';
import biotechImage from '@assets/generated_images/scientist_with_test_tube.png';

import heroInvestigationImage from '@assets/generated_images/dark_mode_graph_analysis_software_dashboard_for_investigation.png';
import heroSupplyChainImage from '@assets/generated_images/dark_mode_supply_chain_management_dashboard_ui.png';
import heroFinanceImage from '@assets/generated_images/dark_mode_financial_fraud_detection_dashboard_ui.png';

const caseImages: Record<string, string> = {
  investigation: investigationImage,
  supplyChain: supplyChainImage,
  finance: financeImage,
  biotech: biotechImage
};

export default function LandingPage() {
  const [lang, setLang] = useState<'en' | 'ko'>('en'); // Default to English
  const t = translations[lang];
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'ko' : 'en');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Network className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">EM-Graph</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <button onClick={() => scrollToSection('features')} className="hover:text-foreground transition-colors">{t.nav.features}</button>
            <button onClick={() => scrollToSection('solutions')} className="hover:text-foreground transition-colors">{t.nav.solutions}</button>
            <button onClick={() => scrollToSection('cases')} className="hover:text-foreground transition-colors">{t.nav.cases}</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-foreground transition-colors">{t.nav.pricing}</button>
          </nav>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleLanguage}
              className="hidden md:flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground"
            >
              <GlobeIcon className="w-4 h-4" />
              {lang === 'en' ? 'ENG' : 'KOR'}
            </Button>
            <Link href="/dashboard">
              <Button variant="ghost">{t.nav.login}</Button>
            </Link>
            <Link href="/dashboard">
              <Button>{t.nav.getStarted}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="absolute top-0 right-0 -z-10 opacity-30 blur-3xl overflow-hidden">
          <div className="w-[800px] h-[800px] bg-primary/20 rounded-full translate-x-1/3 -translate-y-1/3" />
        </div>
        
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 mb-8">
            <Zap className="w-3 h-3 mr-1" />
            {t.hero.newBadge}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto leading-tight">
            {t.hero.title} <br />
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              {t.hero.subtitle}
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-12 px-8 text-base gap-2">
                {t.hero.startBtn} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              {t.hero.demoBtn}
            </Button>
          </div>
          
          <div className="mt-20 relative mx-auto max-w-5xl">
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {/* Slide 1: Investigation Dashboard */}
                <CarouselItem>
                  <div className="rounded-xl border bg-background/50 shadow-2xl backdrop-blur-sm p-2">
                    <div className="aspect-[16/9] rounded-lg bg-slate-900 border overflow-hidden relative group">
                       {/* App Header */}
                       <div className="absolute top-0 left-0 right-0 h-12 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-4 z-20">
                         <div className="flex gap-2">
                           <div className="w-3 h-3 rounded-full bg-red-500"/>
                           <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                           <div className="w-3 h-3 rounded-full bg-green-500"/>
                         </div>
                         <div className="h-6 w-px bg-slate-800 mx-2"/>
                         <div className="flex-1 flex items-center gap-2">
                            <div className="bg-slate-800 text-slate-400 text-xs px-3 py-1.5 rounded-md flex items-center gap-2 w-64 border border-slate-700">
                              <FileSearch className="w-3 h-3" />
                              <span>Case #24-9938: Cyber Syndicate</span>
                            </div>
                         </div>
                       </div>
                       
                       {/* Sidebar */}
                       <div className="absolute top-12 left-0 bottom-0 w-16 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-4 gap-4 z-20">
                         <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-900/50"><Network className="w-5 h-5 text-white" /></div>
                         <div className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"><Database className="w-5 h-5 text-slate-500" /></div>
                         <div className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"><Share2 className="w-5 h-5 text-slate-500" /></div>
                       </div>

                       {/* Main Content - Image */}
                       <div className="absolute top-12 left-16 right-0 bottom-0 bg-slate-950 overflow-hidden">
                          <img src={heroInvestigationImage} className="w-full h-full object-cover" alt="Investigation Graph" />
                          
                          {/* Overlay UI: Nodes */}
                          <div className="absolute top-1/3 left-1/3 w-32 h-32 border-2 border-indigo-500/50 rounded-full animate-pulse opacity-50" />
                          
                          {/* Overlay UI: Panel */}
                          <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur border border-slate-800 p-4 rounded-lg w-72 shadow-2xl">
                             <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2 pb-2 border-b border-slate-800">
                               <Brain className="w-4 h-4 text-indigo-400" /> AI Analysis
                             </h4>
                             <div className="space-y-3">
                                <div className="bg-slate-800/50 p-2.5 rounded text-xs text-slate-300 border border-slate-700 flex gap-2 items-start">
                                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                                   <span><span className="text-emerald-400 font-bold">98% Match</span> found between Suspect A and offshore account.</span>
                                </div>
                                <div className="bg-slate-800/50 p-2.5 rounded text-xs text-slate-300 border border-slate-700 flex gap-2 items-start">
                                   <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                                   <span>New connection detected in <span className="text-indigo-400">Layer 3</span> (Financial).</span>
                                </div>
                             </div>
                             <div className="mt-3 pt-2 flex gap-2">
                                <Button size="sm" className="w-full h-7 text-xs bg-indigo-600 hover:bg-indigo-700">Explore</Button>
                                <Button size="sm" variant="outline" className="w-full h-7 text-xs border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">Ignore</Button>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </CarouselItem>

                {/* Slide 2: Supply Chain Dashboard */}
                <CarouselItem>
                  <div className="rounded-xl border bg-background/50 shadow-2xl backdrop-blur-sm p-2">
                    <div className="aspect-[16/9] rounded-lg bg-slate-900 border overflow-hidden relative group">
                       <div className="absolute top-0 left-0 right-0 h-12 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-4 z-20">
                         <div className="flex gap-2">
                           <div className="w-3 h-3 rounded-full bg-red-500"/>
                           <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                           <div className="w-3 h-3 rounded-full bg-green-500"/>
                         </div>
                         <div className="h-6 w-px bg-slate-800 mx-2"/>
                         <div className="flex-1 flex items-center gap-2">
                            <div className="bg-slate-800 text-slate-400 text-xs px-3 py-1.5 rounded-md flex items-center gap-2 w-64 border border-slate-700">
                              <Globe className="w-3 h-3" />
                              <span>Global Logistics Overview</span>
                            </div>
                         </div>
                       </div>
                       
                       <div className="absolute top-12 left-0 bottom-0 w-16 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-4 gap-4 z-20">
                         <div className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"><Network className="w-5 h-5 text-slate-500" /></div>
                         <div className="p-2 bg-emerald-600 rounded-lg shadow-lg shadow-emerald-900/50"><Globe className="w-5 h-5 text-white" /></div>
                         <div className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"><Share2 className="w-5 h-5 text-slate-500" /></div>
                       </div>

                       <div className="absolute top-12 left-16 right-0 bottom-0 bg-slate-950 overflow-hidden">
                          <img src={heroSupplyChainImage} className="w-full h-full object-cover" alt="Supply Chain Map" />
                          
                          <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur border border-slate-800 p-4 rounded-lg w-80 shadow-2xl">
                             <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2 pb-2 border-b border-slate-800">
                               <Zap className="w-4 h-4 text-emerald-400" /> Real-time Alert
                             </h4>
                             <div className="flex items-center gap-3 mb-2">
                                <div className="text-2xl font-bold text-white">24h</div>
                                <div className="text-xs text-slate-400">Estimated Delay<br/>Port of Singapore</div>
                             </div>
                             <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2">
                               <div className="bg-emerald-500 h-1.5 rounded-full w-3/4" />
                             </div>
                             <p className="text-xs text-slate-400">Alternate route calculated via Malaysia.</p>
                          </div>
                       </div>
                    </div>
                  </div>
                </CarouselItem>

                {/* Slide 3: Finance Dashboard */}
                <CarouselItem>
                  <div className="rounded-xl border bg-background/50 shadow-2xl backdrop-blur-sm p-2">
                    <div className="aspect-[16/9] rounded-lg bg-slate-900 border overflow-hidden relative group">
                       <div className="absolute top-0 left-0 right-0 h-12 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-4 z-20">
                         <div className="flex gap-2">
                           <div className="w-3 h-3 rounded-full bg-red-500"/>
                           <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                           <div className="w-3 h-3 rounded-full bg-green-500"/>
                         </div>
                         <div className="h-6 w-px bg-slate-800 mx-2"/>
                         <div className="flex-1 flex items-center gap-2">
                            <div className="bg-slate-800 text-slate-400 text-xs px-3 py-1.5 rounded-md flex items-center gap-2 w-64 border border-slate-700">
                              <BarChart2 className="w-3 h-3" />
                              <span>Market Anomaly Detection</span>
                            </div>
                         </div>
                       </div>
                       
                       <div className="absolute top-12 left-0 bottom-0 w-16 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-4 gap-4 z-20">
                         <div className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"><Network className="w-5 h-5 text-slate-500" /></div>
                         <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/50"><BarChart2 className="w-5 h-5 text-white" /></div>
                         <div className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"><Share2 className="w-5 h-5 text-slate-500" /></div>
                       </div>

                       <div className="absolute top-12 left-16 right-0 bottom-0 bg-slate-950 overflow-hidden">
                          <img src={heroFinanceImage} className="w-full h-full object-cover" alt="Finance Graph" />
                          
                          <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur border border-slate-800 p-4 rounded-lg w-64 shadow-2xl">
                             <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-slate-400">Risk Score</span>
                                <span className="text-xs font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">HIGH</span>
                             </div>
                             <div className="text-3xl font-bold text-white mb-1">87.4</div>
                             <p className="text-[10px] text-slate-400">+12% from last hour</p>
                          </div>
                       </div>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              
              {/* Dots Navigation */}
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: count }).map((_, index) => (
                  <button
                    key={index}
                    className={`rounded-full transition-all duration-300 ${
                      index + 1 === current 
                        ? "bg-indigo-600 w-8 h-2.5" 
                        : "bg-slate-300 hover:bg-slate-400 w-2.5 h-2.5"
                    }`}
                    onClick={() => api?.scrollTo(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{t.features.title}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t.features.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-background p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3">{t.features.ai.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.features.ai.desc}
              </p>
            </div>
            <div className="bg-background p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3">{t.features.ontology.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.features.ontology.desc}
              </p>
            </div>
            <div className="bg-background p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Sigma className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3">{t.features.metrics.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.features.metrics.desc}
              </p>
            </div>
            <div className="bg-background p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3">{t.features.collab.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.features.collab.desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section (Renamed from Ease of Construction) */}
      <section id="solutions" className="py-24 bg-white relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 lg:p-12 border border-indigo-100">
            <div className="flex flex-col md:flex-row items-center gap-8">
               <div className="flex-1 space-y-4">
                  <div className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-600 shadow-sm border border-indigo-100">
                    <Wand2 className="w-3 h-3 mr-1.5" />
                    Effortless Creation
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Build Complex Networks in Minutes, Not Days</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Say goodbye to manual coding and complex scripts. With our drag-and-drop builder 
                    and AI-assisted node linking, you can construct intricate relationship networks 
                    intuitively. Just bring your data, and we'll handle the connections.
                  </p>
                  <ul className="space-y-2 pt-2">
                    <li className="flex items-center text-sm text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2 text-xs">✓</div>
                      {t.creation.list.dragDrop}
                    </li>
                    <li className="flex items-center text-sm text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2 text-xs">✓</div>
                      {t.creation.list.aiSuggest}
                    </li>
                    <li className="flex items-center text-sm text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2 text-xs">✓</div>
                      {t.creation.list.import}
                    </li>
                  </ul>
               </div>
               <div className="flex-1 w-full max-w-md">
                 <Carousel className="w-full">
                   <CarouselContent>
                     {/* Slide 1: Drag & Drop */}
                     <CarouselItem>
                       <div className="bg-white rounded-xl shadow-lg border p-2 rotate-1 hover:rotate-0 transition-transform duration-500 mx-1">
                         <div className="aspect-[4/3] bg-slate-50 rounded-lg relative overflow-hidden border border-dashed border-slate-200">
                            <div className="absolute inset-0 flex items-center justify-center">
                               <div className="text-center">
                                  <Network className="w-16 h-16 text-indigo-200 mx-auto mb-2" />
                                  <div className="text-xs text-slate-400">Drag to Connect</div>
                               </div>
                            </div>
                            <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-white rounded-full shadow-md border-2 border-indigo-500 flex items-center justify-center z-10">
                              <Brain className="w-5 h-5 text-indigo-500" />
                            </div>
                            <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-white rounded-full shadow-md border-2 border-emerald-500 flex items-center justify-center z-10">
                              <Database className="w-5 h-5 text-emerald-500" />
                            </div>
                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                              <path d="M 130 90 Q 200 150 280 180" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 4" className="opacity-50" />
                              <circle cx="205" cy="135" r="4" fill="#6366f1" className="animate-ping opacity-75" />
                            </svg>
                            <div className="absolute top-1/2 left-1/2 -translate-x-4 -translate-y-4">
                               <div className="w-4 h-4 bg-slate-900 rounded-full opacity-20 blur-sm absolute top-4 left-4" />
                               <svg className="w-6 h-6 text-slate-900 relative z-20 drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                                 <path d="M7 2l12 11.2-5.8.5 3.3 7.3-2.2.9-3.2-7.4-4.4 4.6z" />
                               </svg>
                            </div>
                            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-medium text-slate-500 border shadow-sm">
                              Visual Builder
                            </div>
                         </div>
                       </div>
                     </CarouselItem>

                     {/* Slide 2: Auto-suggest */}
                     <CarouselItem>
                       <div className="bg-white rounded-xl shadow-lg border p-2 -rotate-1 hover:rotate-0 transition-transform duration-500 mx-1">
                         <div className="aspect-[4/3] bg-slate-50 rounded-lg relative overflow-hidden border border-dashed border-slate-200">
                            <div className="absolute inset-0 flex items-center justify-center">
                               <div className="w-16 h-16 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center shadow-lg relative z-10">
                                  <Brain className="w-8 h-8 text-indigo-600" />
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                                    <Sparkles className="w-3 h-3 text-yellow-900" />
                                  </div>
                               </div>
                            </div>
                            {/* Suggestions */}
                            <div className="absolute top-1/4 right-1/4 animate-in fade-in zoom-in duration-700 delay-100">
                               <div className="bg-white px-3 py-1.5 rounded-lg shadow-md border text-xs font-medium text-indigo-600 flex items-center gap-1">
                                 <Plus className="w-3 h-3" /> Connect Evidence
                               </div>
                               <div className="w-0.5 h-8 bg-indigo-200 absolute top-full left-1/2 -translate-x-1/2 origin-top rotate-45" />
                            </div>
                            <div className="absolute bottom-1/4 left-1/4 animate-in fade-in zoom-in duration-700 delay-300">
                               <div className="bg-white px-3 py-1.5 rounded-lg shadow-md border text-xs font-medium text-emerald-600 flex items-center gap-1">
                                 <Plus className="w-3 h-3" /> Link Location
                               </div>
                               <div className="w-0.5 h-8 bg-emerald-200 absolute bottom-full left-1/2 -translate-x-1/2 origin-bottom -rotate-45" />
                            </div>
                            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-medium text-slate-500 border shadow-sm">
                              AI Suggestions
                            </div>
                         </div>
                       </div>
                     </CarouselItem>

                     {/* Slide 3: Import */}
                     <CarouselItem>
                       <div className="bg-white rounded-xl shadow-lg border p-2 rotate-1 hover:rotate-0 transition-transform duration-500 mx-1">
                         <div className="aspect-[4/3] bg-slate-50 rounded-lg relative overflow-hidden border border-dashed border-slate-200 flex flex-col items-center justify-center">
                            <div className="flex items-center gap-4 mb-4">
                               <div className="w-12 h-16 bg-white border rounded shadow-sm flex flex-col items-center justify-center relative group">
                                  <div className="w-8 h-1 bg-slate-200 mb-1" />
                                  <div className="w-8 h-1 bg-slate-200 mb-1" />
                                  <div className="w-6 h-1 bg-slate-200" />
                                  <div className="absolute inset-0 bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors" />
                               </div>
                               <ArrowRight className="w-6 h-6 text-slate-300" />
                               <div className="w-24 h-24 relative">
                                  <Network className="w-full h-full text-indigo-500 animate-pulse" />
                               </div>
                            </div>
                            <div className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-lg shadow-indigo-200">
                               <Upload className="w-3 h-3" /> Importing CSV...
                            </div>
                            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-medium text-slate-500 border shadow-sm">
                              Data Import
                            </div>
                         </div>
                       </div>
                     </CarouselItem>
                   </CarouselContent>
                   <div className="flex justify-center mt-6 gap-3">
                     <CarouselPrevious variant="outline" className="static translate-y-0 w-8 h-8 border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50" />
                     <CarouselNext variant="outline" className="static translate-y-0 w-8 h-8 border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50" />
                   </div>
                 </Carousel>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cases Section (Renamed from Solutions) */}
      <section id="cases" className="py-24 relative bg-slate-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2 space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                {t.solutions.title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t.solutions.subtitle}
              </p>
              
              <div className="space-y-4">
                <div 
                  className="flex gap-4 p-4 -mx-4 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
                  onClick={() => setSelectedCase('investigation')}
                >
                  <div className="mt-1">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:bg-indigo-100 transition-colors border shadow-sm">
                      <FileSearch className="w-5 h-5 text-slate-700 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold group-hover:text-indigo-700 transition-colors">{t.solutions.cards.investigation.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{t.solutions.cards.investigation.desc}</p>
                  </div>
                </div>
                
                <div 
                  className="flex gap-4 p-4 -mx-4 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
                  onClick={() => setSelectedCase('supplyChain')}
                >
                  <div className="mt-1">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:bg-emerald-100 transition-colors border shadow-sm">
                      <Globe className="w-5 h-5 text-slate-700 group-hover:text-emerald-600 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold group-hover:text-emerald-700 transition-colors">{t.solutions.cards.supplyChain.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{t.solutions.cards.supplyChain.desc}</p>
                  </div>
                </div>
                
                <div 
                  className="flex gap-4 p-4 -mx-4 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
                  onClick={() => setSelectedCase('finance')}
                >
                  <div className="mt-1">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors border shadow-sm">
                      <BarChart2 className="w-5 h-5 text-slate-700 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold group-hover:text-blue-700 transition-colors">{t.solutions.cards.finance.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{t.solutions.cards.finance.desc}</p>
                  </div>
                </div>

                <div 
                  className="flex gap-4 p-4 -mx-4 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
                  onClick={() => setSelectedCase('biotech')}
                >
                  <div className="mt-1">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors border shadow-sm">
                      <Network className="w-5 h-5 text-slate-700 group-hover:text-purple-600 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold group-hover:text-purple-700 transition-colors">{t.solutions.cards.biotech.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{t.solutions.cards.biotech.desc}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2">
               <div className="grid grid-cols-2 gap-4">
                  {/* Investigation */}
                  <div className="relative rounded-2xl overflow-hidden aspect-square group border shadow-sm">
                     <img 
                       src={investigationImage} 
                       alt="Investigation" 
                       className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                     <div className="absolute bottom-0 left-0 p-6 text-white">
                        <div className="mb-3 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center">
                           <FileSearch className="w-5 h-5 text-white" />
                        </div>
                        <h5 className="font-bold text-lg">{t.solutions.cards.investigation.label}</h5>
                        <p className="text-sm text-slate-300 mt-1 font-medium">{t.solutions.cards.investigation.sub}</p>
                     </div>
                  </div>

                  {/* Supply Chain */}
                  <div className="relative rounded-2xl overflow-hidden aspect-square group translate-y-8 border shadow-sm">
                     <img 
                       src={supplyChainImage} 
                       alt="Supply Chain" 
                       className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                     <div className="absolute bottom-0 left-0 p-6 text-white">
                        <div className="mb-3 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center">
                           <Globe className="w-5 h-5 text-white" />
                        </div>
                        <h5 className="font-bold text-lg">{t.solutions.cards.supplyChain.label}</h5>
                        <p className="text-sm text-slate-300 mt-1 font-medium">{t.solutions.cards.supplyChain.sub}</p>
                     </div>
                  </div>

                  {/* Finance */}
                  <div className="relative rounded-2xl overflow-hidden aspect-square group border shadow-sm">
                     <img 
                       src={financeImage} 
                       alt="Finance" 
                       className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                     <div className="absolute bottom-0 left-0 p-6 text-white">
                        <div className="mb-3 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center">
                           <BarChart2 className="w-5 h-5 text-white" />
                        </div>
                        <h5 className="font-bold text-lg">{t.solutions.cards.finance.label}</h5>
                        <p className="text-sm text-slate-300 mt-1 font-medium">{t.solutions.cards.finance.sub}</p>
                     </div>
                  </div>

                  {/* Bio-Tech */}
                  <div className="relative rounded-2xl overflow-hidden aspect-square group translate-y-8 border shadow-sm">
                     <img 
                       src={biotechImage} 
                       alt="Bio-Tech" 
                       className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                     <div className="absolute bottom-0 left-0 p-6 text-white">
                        <div className="mb-3 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center">
                           <Network className="w-5 h-5 text-white" />
                        </div>
                        <h5 className="font-bold text-lg">{t.solutions.cards.biotech.label}</h5>
                        <p className="text-sm text-slate-300 mt-1 font-medium">{t.solutions.cards.biotech.sub}</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-slate-200">
             <div className="flex flex-col md:flex-row items-start gap-6 bg-white p-6 rounded-xl border shadow-sm">
                <div className="mt-1">
                  <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <Plus className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">{t.solutions.complexity.title}</h4>
                  <p className="text-slate-600 mb-4 max-w-3xl">
                    {t.solutions.complexity.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                     <span className="px-3 py-1.5 rounded-md bg-slate-100 text-xs font-medium text-slate-600 border border-slate-200">Cybersecurity</span>
                     <span className="px-3 py-1.5 rounded-md bg-slate-100 text-xs font-medium text-slate-600 border border-slate-200">Legal Tech</span>
                     <span className="px-3 py-1.5 rounded-md bg-slate-100 text-xs font-medium text-slate-600 border border-slate-200">Knowledge Graphs</span>
                     <span className="px-3 py-1.5 rounded-md bg-slate-100 text-xs font-medium text-slate-600 border border-slate-200">Intelligence</span>
                     <span className="px-3 py-1.5 rounded-md bg-slate-100 text-xs font-medium text-slate-600 border border-slate-200">Academic Research</span>
                  </div>
                </div>
                <Button variant="outline" className="hidden md:flex whitespace-nowrap">Learn More</Button>
             </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t.pricing.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.pricing.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white rounded-2xl p-8 border shadow-sm hover:shadow-md transition-shadow relative">
              <h3 className="text-xl font-semibold mb-2">{t.pricing.starter.name}</h3>
              <p className="text-muted-foreground text-sm mb-6">{t.pricing.starter.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {t.pricing.starter.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full">{t.pricing.starter.btn}</Button>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-2xl p-8 border-2 border-primary shadow-lg relative transform scale-105 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                {t.pricing.pro.badge}
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.pricing.pro.name}</h3>
              <p className="text-muted-foreground text-sm mb-6">{t.pricing.pro.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {t.pricing.pro.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full">{t.pricing.pro.btn}</Button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl p-8 border shadow-sm hover:shadow-md transition-shadow relative">
              <h3 className="text-xl font-semibold mb-2">{t.pricing.enterprise.name}</h3>
              <p className="text-muted-foreground text-sm mb-6">{t.pricing.enterprise.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">{t.pricing.enterprise.price}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {t.pricing.enterprise.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full">{t.pricing.enterprise.btn}</Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.cta.title}</h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-10 text-lg">
            {t.cta.desc}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
                {t.cta.btnPrimary}
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-slate-700 hover:bg-slate-800 text-slate-100 hover:text-white">
              {t.cta.btnSecondary}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-12 border-t">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <Network className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg tracking-tight">EM-Graph</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t.footer.tagline}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t.footer.product}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-foreground text-left">{t.nav.features}</button></li>
                <li><button onClick={() => scrollToSection('solutions')} className="hover:text-foreground text-left">{t.nav.solutions}</button></li>
                <li><button onClick={() => scrollToSection('cases')} className="hover:text-foreground text-left">{t.nav.cases}</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-foreground text-left">{t.nav.pricing}</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t.footer.resources}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Blog</li>
                <li>Community</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t.footer.company}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About Us</li>
                <li>Careers</li>
                <li>Legal</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">{t.footer.copyright}</p>
            <div className="flex gap-4">
               <div className="w-5 h-5 bg-muted rounded-full" />
               <div className="w-5 h-5 bg-muted rounded-full" />
               <div className="w-5 h-5 bg-muted rounded-full" />
            </div>
          </div>
        </div>
      </footer>

      {/* Case Details Dialog */}
      <Dialog open={!!selectedCase} onOpenChange={(open) => !open && setSelectedCase(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              {selectedCase && (
                <>
                  {selectedCase === 'investigation' && <FileSearch className="w-6 h-6 text-indigo-600" />}
                  {selectedCase === 'supplyChain' && <Globe className="w-6 h-6 text-emerald-600" />}
                  {selectedCase === 'finance' && <BarChart2 className="w-6 h-6 text-blue-600" />}
                  {selectedCase === 'biotech' && <Network className="w-6 h-6 text-purple-600" />}
                  {t.solutions.cards[selectedCase as keyof typeof t.solutions.cards]?.title}
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-base">
               {selectedCase && t.solutions.cards[selectedCase as keyof typeof t.solutions.cards]?.desc}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
             {selectedCase && (
               <>
                 <div className="aspect-video relative rounded-lg overflow-hidden bg-slate-100 border shadow-sm">
                    <img 
                      src={caseImages[selectedCase]} 
                      alt={t.solutions.cards[selectedCase as keyof typeof t.solutions.cards]?.title} 
                      className="object-cover w-full h-full"
                    />
                 </div>
                 
                 <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg border">
                       <h4 className="font-semibold mb-2 text-sm uppercase text-muted-foreground tracking-wider">Use Case Overview</h4>
                       <p className="text-sm leading-relaxed text-slate-700">
                         {selectedCase === 'investigation' && "In criminal investigations, connecting the dots between suspects, assets, and events is crucial. EM-Graph enables investigators to ingest disparate data sources—police reports, financial records, communication logs—and automatically link entities based on shared attributes. The AI engine flags suspicious patterns, such as circular money transfers or frequent communications during key timeframes, reducing investigation time by up to 60%."}
                         {selectedCase === 'supplyChain' && "Global supply chains are vulnerable to disruptions that can cascade through the network. By mapping multi-tier dependencies, EM-Graph helps logistics managers visualize the entire ecosystem. When a supplier in one region faces a delay (e.g., port strike or natural disaster), the system calculates the downstream impact instantly, suggesting alternative routes or suppliers to mitigate risk before it affects production lines."}
                         {selectedCase === 'finance' && "Financial fraud is increasingly sophisticated, often involving complex networks of shell companies and mule accounts. EM-Graph's graph algorithms (like PageRank and Community Detection) identify clusters of high-risk activity that rule-based systems miss. Analysts can visually traverse transaction paths to trace the flow of illicit funds, uncovering the ultimate beneficiaries behind layered ownership structures."}
                         {selectedCase === 'biotech' && "In drug discovery and healthcare, understanding the relationships between proteins, genes, and diseases is key. EM-Graph models these biological interactions as a massive knowledge graph. Researchers can query the graph to find potential drug targets or predict side effects based on pathway analysis. This ontology-driven approach accelerates the hypothesis generation phase of research."}
                       </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="border p-4 rounded-lg">
                          <h4 className="font-semibold mb-2 text-sm">Key Benefits</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                             <li>Rapid Pattern Detection</li>
                             <li>Visual Evidence Presentation</li>
                             <li>Automated Link Analysis</li>
                          </ul>
                       </div>
                       <div className="border p-4 rounded-lg">
                          <h4 className="font-semibold mb-2 text-sm">Applied Technologies</h4>
                          <div className="flex flex-wrap gap-2">
                             <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">Graph Neural Networks</span>
                             <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">NLP</span>
                             <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">Vector Search</span>
                          </div>
                       </div>
                    </div>
                 </div>
               </>
             )}
          </div>
          <DialogFooter>
            <Button onClick={() => setSelectedCase(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}