import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  ArrowRight, Brain, Check, Sprout, BookOpen, Search, ListChecks,
  Calendar, Scissors, Users, Network, FileText, Link2,
  Tag, Globe as GlobeIcon, Workflow, Table2, Share2, SlidersHorizontal, Database,
} from "lucide-react";
import { useState, useEffect } from "react";
import { translations } from "@/lib/translations";
import { motion } from "framer-motion";
import {
  Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";

import organizeImage from '../assets/generated_images/abstract_database_ontology_illustration.png';
import searchImage from '../assets/generated_images/abstract_graph_analytics_illustration.png';
import aiImage from '../assets/generated_images/abstract_ai_brain_network_illustration.png';
import shareImage from '../assets/generated_images/abstract_collaboration_network_illustration.png';
import captureImage from '../assets/generated_images/data_import_and_mapping_ui.png';
import gardenShot from '@assets/image_1781068791021.png';
import supplyShot from '../assets/generated_images/global_supply_chain_network_with_logistics_nodes.png';
import financeShot from '../assets/generated_images/financial_transaction_graph_with_fraud_anomaly.png';
import bioShot from '../assets/generated_images/biological_protein_interaction_network_graph.png';

const gridIcons = [Sprout, BookOpen, Search, ListChecks, Calendar, Scissors, Users, Brain];
const gridIconStyles = [
  "bg-blue-100 text-blue-600",
  "bg-indigo-100 text-indigo-600",
  "bg-purple-100 text-purple-600",
  "bg-emerald-100 text-emerald-600",
  "bg-sky-100 text-sky-600",
  "bg-amber-100 text-amber-600",
  "bg-rose-100 text-rose-600",
  "bg-violet-100 text-violet-600",
];

const highlightImages = [organizeImage, searchImage, aiImage, shareImage, captureImage];
const highlightAccents = [
  { pill: "bg-blue-100 text-blue-700", icon: BookOpen, iconBg: "bg-blue-100 text-blue-600", chip: "bg-blue-50 text-blue-700 border-blue-100" },
  { pill: "bg-purple-100 text-purple-700", icon: Search, iconBg: "bg-purple-100 text-purple-600", chip: "bg-purple-50 text-purple-700 border-purple-100" },
  { pill: "bg-violet-100 text-violet-700", icon: Brain, iconBg: "bg-violet-100 text-violet-600", chip: "bg-violet-50 text-violet-700 border-violet-100" },
  { pill: "bg-indigo-100 text-indigo-700", icon: Users, iconBg: "bg-indigo-100 text-indigo-600", chip: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  { pill: "bg-emerald-100 text-emerald-700", icon: Scissors, iconBg: "bg-emerald-100 text-emerald-600", chip: "bg-emerald-50 text-emerald-700 border-emerald-100" },
];

const experienceSlides = [gardenShot, supplyShot, financeShot, bioShot];

const engineIcons = [Workflow, Network, Table2, Share2, SlidersHorizontal, Database];
const engineStyles = [
  "bg-blue-100 text-blue-600",
  "bg-purple-100 text-purple-600",
  "bg-indigo-100 text-indigo-600",
  "bg-violet-100 text-violet-600",
  "bg-sky-100 text-sky-600",
  "bg-blue-100 text-blue-600",
];

const float = (delay: number, distance = 12) => ({
  animate: { y: [0, -distance, 0] },
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const, delay },
});

export default function LandingPage() {
  const [lang, setLang] = useState<'en' | 'ko'>('en');
  const t = translations[lang];

  const toggleLanguage = () => setLang(prev => (prev === 'en' ? 'ko' : 'en'));

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    if (!carouselApi) return;
    setCurrentSlide(carouselApi.selectedScrollSnap());
    const onSelect = () => setCurrentSlide(carouselApi.selectedScrollSnap());
    carouselApi.on("select", onSelect);
    return () => { carouselApi.off("select", onSelect); };
  }, [carouselApi]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const p = t.hero.preview;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sprout className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">EM-Graph</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <button onClick={() => scrollToSection('features')} className="hover:text-foreground transition-colors" data-testid="link-nav-features">{t.nav.features}</button>
            <button onClick={() => scrollToSection('highlights')} className="hover:text-foreground transition-colors" data-testid="link-nav-highlights">{t.nav.solutions}</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-foreground transition-colors" data-testid="link-nav-pricing">{t.nav.pricing}</button>
          </nav>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="hidden md:flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground"
              data-testid="button-toggle-language"
            >
              <GlobeIcon className="w-4 h-4" />
              {lang === 'en' ? 'ENG' : 'KOR'}
            </Button>
            <Link href="/dashboard">
              <Button variant="ghost" data-testid="button-login">{t.nav.login}</Button>
            </Link>
            <Link href="/organization-select">
              <Button data-testid="button-get-started">{t.nav.getStarted}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-28">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="absolute top-0 right-0 -z-10 opacity-30 blur-3xl overflow-hidden">
          <div className="w-[700px] h-[700px] bg-primary/20 rounded-full translate-x-1/3 -translate-y-1/3" />
        </div>
        <div className="absolute top-40 left-0 -z-10 opacity-25 blur-3xl overflow-hidden">
          <div className="w-[600px] h-[600px] bg-purple-400/20 rounded-full -translate-x-1/3" />
        </div>

        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold border-transparent bg-primary/10 text-primary mb-8">
              <Sprout className="w-3.5 h-3.5 mr-1.5" />
              {t.hero.newBadge}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto leading-tight" data-testid="text-hero-title">
              {t.hero.titleLine} <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                {t.hero.subtitle}
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              {t.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/organization-select">
                <Button size="lg" className="h-12 px-8 text-base gap-2" data-testid="button-hero-start">
                  {t.hero.startBtn} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base" data-testid="button-hero-demo">
                {t.hero.demoBtn}
              </Button>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              {t.hero.loginPrompt}{' '}
              <Link href="/dashboard">
                <span className="font-semibold text-primary underline-offset-4 hover:underline cursor-pointer">{t.hero.loginLink}</span>
              </Link>
            </p>
          </motion.div>

          {/* Animated Product Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-20 relative mx-auto max-w-4xl"
          >
            {/* Floating accent chips */}
            <motion.div
              {...float(0)}
              className="absolute -top-6 -left-4 md:-left-10 z-20 hidden sm:flex items-center gap-2 bg-white border border-slate-100 shadow-xl rounded-xl px-4 py-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <Search className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-slate-700">{p.chipSearch}</span>
            </motion.div>

            <motion.div
              {...float(1.2)}
              className="absolute top-1/2 -right-4 md:-right-12 z-20 hidden sm:flex items-center gap-2 bg-white border border-slate-100 shadow-xl rounded-xl px-4 py-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Link2 className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-slate-700">{p.chipLink}</span>
            </motion.div>

            <motion.div
              {...float(0.6)}
              className="absolute -bottom-5 left-6 md:left-12 z-20 hidden sm:flex items-center gap-2 bg-white border border-slate-100 shadow-xl rounded-xl px-4 py-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-slate-700">{p.chipNote}</span>
            </motion.div>

            {/* App window */}
            <motion.div {...float(0.3, 8)} className="rounded-2xl border bg-white shadow-2xl overflow-hidden text-left">
              {/* Window top bar */}
              <div className="h-11 bg-slate-50 border-b flex items-center px-4 gap-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex items-center">
                  <div className="bg-white text-slate-500 text-xs px-3 py-1.5 rounded-md flex items-center gap-2 border w-full max-w-md">
                    <Sprout className="w-3 h-3 text-primary" />
                    <span className="truncate">{p.breadcrumb}</span>
                  </div>
                </div>
              </div>

              <div className="flex">
                {/* Mini sidebar */}
                <div className="w-14 bg-slate-50/70 border-r flex flex-col items-center py-4 gap-3 shrink-0">
                  <div className="p-2 bg-primary rounded-lg shadow-sm"><Sprout className="w-4 h-4 text-primary-foreground" /></div>
                  <div className="p-2 rounded-lg"><Search className="w-4 h-4 text-slate-400" /></div>
                  <div className="p-2 rounded-lg"><ListChecks className="w-4 h-4 text-slate-400" /></div>
                  <div className="p-2 rounded-lg"><Users className="w-4 h-4 text-slate-400" /></div>
                </div>

                {/* Main content */}
                <div className="flex-1 p-5 md:p-7 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                      <Tag className="w-3 h-3" /> {p.tag1}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                      <Tag className="w-3 h-3" /> {p.tag2}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">{p.noteTitle}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5 max-w-xl">{p.noteBody}</p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* AI summary card */}
                    <div className="rounded-xl border bg-gradient-to-br from-violet-50 to-blue-50 p-4">
                      <div className="flex items-center gap-2 mb-2 text-violet-700">
                        <Brain className="w-4 h-4" />
                        <span className="text-xs font-bold">{p.aiTitle}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{p.aiBody}</p>
                    </div>

                    {/* Mini graph */}
                    <div className="rounded-xl border bg-slate-50 p-4 relative overflow-hidden min-h-[110px]">
                      <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
                        <line x1="50%" y1="50%" x2="22%" y2="30%" stroke="#c7d2fe" strokeWidth="2" />
                        <line x1="50%" y1="50%" x2="80%" y2="28%" stroke="#ddd6fe" strokeWidth="2" />
                        <line x1="50%" y1="50%" x2="28%" y2="78%" stroke="#bfdbfe" strokeWidth="2" />
                        <line x1="50%" y1="50%" x2="78%" y2="76%" stroke="#c7d2fe" strokeWidth="2" />
                      </svg>
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md z-10">
                        <Network className="w-4 h-4" />
                      </div>
                      <motion.div {...float(0.2, 6)} className="absolute left-[22%] top-[30%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-blue-200" />
                      <motion.div {...float(0.9, 6)} className="absolute left-[80%] top-[28%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-purple-200" />
                      <motion.div {...float(1.4, 6)} className="absolute left-[28%] top-[78%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-sky-200" />
                      <motion.div {...float(0.5, 6)} className="absolute left-[78%] top-[76%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-indigo-200" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" data-testid="text-grid-title">{t.grid.title}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t.grid.subtitle}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.grid.items.map((item, i) => {
              const Icon = gridIcons[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 4) * 0.08 }}
                  className="bg-background rounded-2xl border shadow-sm hover:shadow-md transition-all p-6"
                  data-testid={`card-feature-${i}`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${gridIconStyles[i]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dark Productivity Band */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-24">
        <div className="absolute -top-20 -left-20 w-[420px] h-[420px] bg-blue-600/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-16 w-[460px] h-[460px] bg-purple-600/30 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/3 w-[260px] h-[260px] bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-5">{t.band.title}</h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-lg">{t.band.desc}</p>
            <Link href="/organization-select">
              <Button size="lg" className="h-12 px-8 text-base bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 gap-2" data-testid="button-band-learn-more">
                {t.band.btn} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Highlights — alternating rows */}
      <section id="highlights" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t.highlights.title}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">{t.highlights.subtitle}</p>
          </div>

          <div className="space-y-20">
            {t.highlights.rows.map((row, i) => {
              const accent = highlightAccents[i];
              const Icon = accent.icon;
              const imageLeft = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: imageLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col md:flex-row items-center gap-12 lg:gap-20"
                  data-testid={`row-highlight-${i}`}
                >
                  <div className={`flex-1 w-full ${imageLeft ? 'order-2 md:order-1' : 'order-2 md:order-2'}`}>
                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-50 relative group transform hover:-translate-y-1 transition-transform duration-500">
                      <img src={highlightImages[i]} alt={row.title} className="w-full h-auto" />
                      <div className="absolute inset-0 bg-indigo-900/5 group-hover:bg-transparent transition-colors" />
                    </div>
                  </div>
                  <div className={`flex-1 space-y-6 ${imageLeft ? 'order-1 md:order-2' : 'order-1 md:order-1'}`}>
                    <span className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full ${accent.pill}`}>{row.pill}</span>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${accent.iconBg}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">{row.title}</h3>
                      <p className="text-lg text-slate-600 leading-relaxed mb-6">{row.desc}</p>
                      <div className="flex flex-col gap-3">
                        {row.benefits.map((benefit, idx) => (
                          <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg border font-medium text-sm ${accent.chip}`}>
                            <div className="w-5 h-5 rounded-full bg-white/70 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3" />
                            </div>
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2">
                      <Link href="/organization-select">
                        <Button className="gap-2" data-testid={`button-highlight-${i}`}>
                          {row.btn} <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Graph sample slideshow */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" data-testid="text-experience-title">{t.experience.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">{t.experience.subtitle}</p>
          </div>

          <Carousel setApi={setCarouselApi} opts={{ loop: true }} className="max-w-5xl mx-auto">
            <CarouselContent>
              {t.experience.slides.map((slide, i) => (
                <CarouselItem key={i} data-testid={`slide-experience-${i}`}>
                  <div className="relative rounded-2xl overflow-hidden border shadow-lg bg-white">
                    <img
                      src={experienceSlides[i]}
                      alt={slide.title}
                      className="w-full aspect-[16/9] object-cover"
                      data-testid={`img-experience-${i}`}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/85 via-slate-900/40 to-transparent p-6 sm:p-8">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{slide.title}</h3>
                      <p className="text-sm text-slate-200 max-w-xl leading-relaxed">{slide.desc}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex -left-5" data-testid="button-experience-prev" />
            <CarouselNext className="hidden sm:flex -right-5" data-testid="button-experience-next" />
          </Carousel>

          <div className="flex items-center justify-center gap-2 mt-6">
            {t.experience.slides.map((_, i) => (
              <button
                key={i}
                onClick={() => carouselApi?.scrollTo(i)}
                aria-label={`${t.experience.goToSlide} ${i + 1}`}
                className={`h-2 rounded-full transition-all ${currentSlide === i ? 'w-6 bg-primary' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
                data-testid={`dot-experience-${i}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Graph & Data Engine */}
      <section id="engine" className="py-24 bg-gradient-to-br from-blue-50/60 via-white to-purple-50/50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-full border border-transparent bg-primary/10 text-primary px-3 py-1 text-xs font-semibold mb-4">
              <Network className="w-3.5 h-3.5 mr-1.5" />
              {t.engine.badge}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" data-testid="text-engine-title">{t.engine.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">{t.engine.subtitle}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.engine.items.map((item, i) => {
              const Icon = engineIcons[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                  className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all p-6"
                  data-testid={`card-engine-${i}`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${engineStyles[i]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{t.pricing.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.pricing.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 border shadow-sm hover:shadow-md transition-shadow relative"
            >
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
              <Button variant="outline" className="w-full" data-testid="button-pricing-starter">{t.pricing.starter.btn}</Button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl p-8 border-2 border-primary shadow-lg relative transform scale-105 z-10"
            >
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
              <Button className="w-full" data-testid="button-pricing-pro">{t.pricing.pro.btn}</Button>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 border shadow-sm hover:shadow-md transition-shadow relative"
            >
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
              <Button variant="outline" className="w-full" data-testid="button-pricing-enterprise">{t.pricing.enterprise.btn}</Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-[420px] h-[420px] bg-blue-600/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 w-[460px] h-[460px] bg-purple-600/25 rounded-full blur-3xl" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.cta.title}</h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-10 text-lg">{t.cta.desc}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-slate-700 hover:bg-slate-800 text-slate-100 hover:text-white" data-testid="button-cta-inquiry">
                {t.cta.btnSecondary}
              </Button>
              <Link href="/signup">
                <Button size="lg" className="h-14 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-cta-signup">
                  {t.cta.btnPrimary}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-12 border-t">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <Sprout className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg tracking-tight">EM-Graph</span>
              </div>
              <p className="text-sm text-muted-foreground">{t.footer.tagline}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t.footer.product}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-foreground text-left">{t.nav.features}</button></li>
                <li><button onClick={() => scrollToSection('highlights')} className="hover:text-foreground text-left">{t.nav.solutions}</button></li>
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
    </div>
  );
}
