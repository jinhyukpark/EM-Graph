import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { setPurpose as persistPurpose, type PurposeId } from "@/lib/onboardingPurpose";
import {
  Sparkles,
  Building2,
  FlaskConical,
  Archive,
  Compass,
  FileText,
  PenLine,
  Network,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";

const TOTAL_STEPS = 4;
const FEATURE_SUBSTEPS = 3;

export const ONBOARDING_DONE_KEY = "em-graph-onboarding-complete";

export function hasCompletedOnboarding() {
  try {
    return localStorage.getItem(ONBOARDING_DONE_KEY) === "true";
  } catch {
    return false;
  }
}

function markOnboardingComplete() {
  try {
    localStorage.setItem(ONBOARDING_DONE_KEY, "true");
  } catch {
    // Ignore storage errors (e.g. private mode); onboarding just shows again.
  }
}

export default function Onboarding() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  const [step, setStep] = useState(0);
  const [featureSub, setFeatureSub] = useState(0);
  const [purpose, setPurpose] = useState<PurposeId | null>(null);
  const [direction, setDirection] = useState(1);

  const purposeOptions: {
    id: PurposeId;
    icon: typeof Building2;
    title: string;
    desc: string;
  }[] = [
    { id: "enterprise", icon: Building2, title: t("obPurposeEnterprise"), desc: t("obPurposeEnterpriseDesc") },
    { id: "research", icon: FlaskConical, title: t("obPurposeResearch"), desc: t("obPurposeResearchDesc") },
    { id: "archive", icon: Archive, title: t("obPurposeArchive"), desc: t("obPurposeArchiveDesc") },
    { id: "exploring", icon: Compass, title: t("obPurposeExploring"), desc: t("obPurposeExploringDesc") },
  ];

  const stepLabels = [t("obStepWelcome"), t("obStepPurpose"), t("obStepFeatures"), t("obStepStart")];

  // Log step views
  useEffect(() => {
    console.log("onboarding_step_view", { step, featureSub: step === 2 ? featureSub : undefined });
  }, [step, featureSub]);

  const goNext = useCallback(() => {
    if (step === 2 && featureSub < FEATURE_SUBSTEPS - 1) {
      setDirection(1);
      setFeatureSub((s) => s + 1);
      return;
    }
    if (step < TOTAL_STEPS - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  }, [step, featureSub]);

  const goBack = useCallback(() => {
    if (step === 2 && featureSub > 0) {
      setDirection(-1);
      setFeatureSub((s) => s - 1);
      return;
    }
    if (step > 0) {
      setDirection(-1);
      const prev = step - 1;
      setStep(prev);
      if (prev === 2) setFeatureSub(FEATURE_SUBSTEPS - 1);
    }
  }, [step, featureSub]);

  const handleSkip = useCallback(() => {
    console.log("onboarding_skip", { step, featureSub: step === 2 ? featureSub : undefined });
    markOnboardingComplete();
    setLocation("/dashboard");
  }, [step, featureSub, setLocation]);

  const handleStartGarden = useCallback(() => {
    console.log("onboarding_complete", { purpose, cta: "knowledge_garden" });
    markOnboardingComplete();
    setLocation("/knowledge-garden");
  }, [purpose, setLocation]);

  const handleLater = useCallback(() => {
    console.log("onboarding_complete", { purpose, cta: "later" });
    markOnboardingComplete();
    setLocation("/dashboard");
  }, [purpose, setLocation]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't hijack Enter when the user is focused on an interactive control
      // (buttons, links, inputs) — let that control handle it instead.
      const el = document.activeElement as HTMLElement | null;
      const onInteractive =
        !!el && (el.tagName === "BUTTON" || el.tagName === "A" || el.tagName === "INPUT" || el.tagName === "TEXTAREA");
      if (e.key === "ArrowRight") {
        if (step === TOTAL_STEPS - 1) return;
        e.preventDefault();
        goNext();
      } else if (e.key === "Enter") {
        if (step === TOTAL_STEPS - 1 || onInteractive) return;
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        if (onInteractive && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
        e.preventDefault();
        goBack();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, goNext, goBack]);

  const isLastStep = step === TOTAL_STEPS - 1;
  const contentKey = step === 2 ? `2-${featureSub}` : `${step}`;

  return (
    <div className="fixed inset-0 flex flex-col bg-background text-foreground overflow-hidden" data-testid="page-onboarding">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/* Header: logo + progress */}
      <header className="relative z-10 flex items-center justify-between gap-4 px-6 py-5 md:px-10">
        <div className="flex w-24 items-center gap-2 text-sm font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Network className="h-4 w-4" />
          </div>
          <span className="hidden sm:inline">EM Graph</span>
        </div>

        {/* Step indicator */}
        <div className="flex flex-1 items-center justify-center gap-2 sm:gap-3" data-testid="onboarding-progress">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  i < step && "bg-primary text-primary-foreground",
                  i === step && "bg-primary/15 text-primary ring-2 ring-primary/40",
                  i > step && "bg-muted text-muted-foreground"
                )}
                data-testid={`step-dot-${i}`}
              >
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </div>
              <span
                className={cn(
                  "hidden text-xs font-medium md:inline",
                  i === step ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
              {i < stepLabels.length - 1 && <div className="mx-0.5 h-px w-4 bg-border sm:w-6" />}
            </div>
          ))}
        </div>

        {/* Spacer to keep the step indicator centered */}
        <div className="w-24" aria-hidden />
      </header>

      {/* Content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-4 md:px-10">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={contentKey}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full max-w-5xl"
          >
            {step === 0 && <WelcomeStep t={t} />}
            {step === 1 && (
              <PurposeStep
                t={t}
                options={purposeOptions}
                selected={purpose}
                onSelect={(id) =>
                  setPurpose((cur) => {
                    const next = cur === id ? null : id;
                    persistPurpose(next);
                    return next;
                  })
                }
              />
            )}
            {step === 2 && <FeatureStep t={t} sub={featureSub} />}
            {step === 3 && <FinalStep t={t} onPrimary={handleStartGarden} onSecondary={handleLater} />}
          </motion.div>
        </AnimatePresence>

        {/* Substep dots for feature step */}
        {step === 2 && (
          <div className="mt-8 flex items-center gap-1.5" data-testid="feature-substep-dots">
            {Array.from({ length: FEATURE_SUBSTEPS }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === featureSub ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        )}

        {/* Primary action + skip, placed right below the content */}
        {!isLastStep && (
          <div className={cn("flex flex-col items-center gap-2", step === 2 ? "mt-6" : "mt-10")}>
            <Button size="lg" onClick={goNext} className="min-w-[220px]" data-testid="button-next">
              {step === 0 ? t("obGetStarted") : t("obNext")}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={handleSkip}
              data-testid="button-skip"
            >
              {t("obSkip")}
            </Button>
          </div>
        )}
      </main>

      {/* Back button - tucked to the bottom-left */}
      {!(step === 0 && featureSub === 0) && (
        <Button
          variant="ghost"
          onClick={goBack}
          className="absolute bottom-6 left-6 z-10 text-muted-foreground md:left-10"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{t("obBack")}</span>
        </Button>
      )}
    </div>
  );
}

type TFn = ReturnType<typeof useLanguage>["t"];

function WelcomeStep({ t }: { t: TFn }) {
  return (
    <div className="flex flex-col items-center text-center">
      <Badge variant="secondary" className="mb-6 gap-1.5" data-testid="badge-welcome">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        {t("obWelcomeBadge")}
      </Badge>

      {/* Knowledge garden visual */}
      <div className="relative mb-8 flex h-56 w-full max-w-md items-center justify-center">
        <div className="absolute h-40 w-40 rounded-full bg-primary/10" />
        <div className="absolute h-64 w-64 rounded-full border border-primary/15" />
        <div className="absolute h-52 w-52 rounded-full border border-accent/15" />
        {[
          { icon: FileText, cls: "-top-2 left-10 text-primary", delay: 0 },
          { icon: PenLine, cls: "top-6 right-6 text-accent", delay: 0.15 },
          { icon: FileText, cls: "bottom-2 left-16 text-accent", delay: 0.3 },
          { icon: FileText, cls: "bottom-6 right-14 text-primary", delay: 0.45 },
        ].map((n, i) => {
          const Icon = n.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + n.delay, duration: 0.4 }}
              className={cn(
                "absolute flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card shadow-sm",
                n.cls
              )}
            >
              <Icon className="h-5 w-5" />
            </motion.div>
          );
        })}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg"
        >
          <Sparkles className="h-9 w-9" />
        </motion.div>
      </div>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl" data-testid="text-welcome-title">
        {t("obWelcomeTitle")}
      </h1>
      <p className="max-w-xl text-base text-muted-foreground md:text-lg">{t("obWelcomeSubtitle")}</p>
    </div>
  );
}

function PurposeStep({
  t,
  options,
  selected,
  onSelect,
}: {
  t: TFn;
  options: { id: PurposeId; icon: typeof Building2; title: string; desc: string }[];
  selected: PurposeId | null;
  onSelect: (id: PurposeId) => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl" data-testid="text-purpose-title">
          {t("obPurposeTitle")}
        </h2>
        <p className="text-sm text-muted-foreground md:text-base">{t("obPurposeSubtitle")}</p>
      </div>

      <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isActive = selected === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              data-testid={`card-purpose-${opt.id}`}
              className={cn(
                "group flex items-start gap-4 rounded-xl border p-5 text-left transition-all hover-elevate",
                isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card"
              )}
            >
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{opt.title}</span>
                  {isActive && <Check className="h-4 w-4 shrink-0 text-primary" />}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{opt.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FeatureStep({ t, sub }: { t: TFn; sub: number }) {
  const features = [
    {
      title: t("obFeatureGardenTitle"),
      desc: t("obFeatureGardenDesc"),
      visual: <GardenVisual />,
    },
    {
      title: t("obFeatureNoteTitle"),
      desc: t("obFeatureNoteDesc"),
      visual: <NoteVisual />,
    },
    {
      title: t("obFeatureGraphTitle"),
      desc: t("obFeatureGraphDesc"),
      visual: <GraphVisual badge={t("obPluginBadge")} />,
    },
  ];
  const f = features[sub];

  return (
    <div className="grid w-full items-center gap-8 md:grid-cols-2 md:gap-12">
      <div className="order-2 md:order-1">
        <div className="mb-3 text-sm font-semibold text-primary">
          {sub + 1} / {FEATURE_SUBSTEPS}
        </div>
        <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl" data-testid="text-feature-title">
          {f.title}
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">{f.desc}</p>
      </div>
      <div className="order-1 md:order-2">
        <Card className="relative flex h-64 items-center justify-center overflow-hidden p-6 md:h-72">
          {f.visual}
        </Card>
      </div>
    </div>
  );
}

function GardenVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
            className="flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-lg border border-border bg-background/60"
          >
            <FileText className="h-5 w-5 text-primary/70" />
            <div className="h-1 w-8 rounded-full bg-muted-foreground/20" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function NoteVisual() {
  return (
    <div className="flex h-full w-full max-w-xs flex-col justify-center gap-3">
      <div className="flex items-center gap-2">
        <PenLine className="h-4 w-4 text-primary" />
        <div className="h-3 w-28 rounded-full bg-foreground/70" />
      </div>
      {[80, 95, 70, 88].map((w, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: `${w}%` }}
          transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
          className="h-2.5 rounded-full bg-muted-foreground/20"
        />
      ))}
      <div className="mt-2 flex gap-2">
        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">#분석</span>
        <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">#리서치</span>
      </div>
    </div>
  );
}

function GraphVisual({ badge }: { badge: string }) {
  const nodes = [
    { x: 50, y: 50 },
    { x: 18, y: 22 },
    { x: 82, y: 26 },
    { x: 20, y: 78 },
    { x: 80, y: 76 },
  ];
  const edges = [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
  ];
  return (
    <div className="relative h-full w-full">
      <Badge className="absolute right-1 top-1 z-10 gap-1" data-testid="badge-plugin">
        <Sparkles className="h-3 w-3" />
        {badge}
      </Badge>
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        {edges.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={`${nodes[a].x}%`}
            y1={`${nodes[a].y}%`}
            x2={`${nodes[b].x}%`}
            y2={`${nodes[b].y}%`}
            stroke="hsl(var(--primary))"
            strokeOpacity={0.35}
            strokeWidth={1.5}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
          />
        ))}
      </svg>
      {nodes.map((n, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.1, duration: 0.35 }}
          className={cn(
            "absolute flex items-center justify-center rounded-full",
            i === 0 ? "h-12 w-12 bg-primary text-primary-foreground" : "h-8 w-8 bg-accent/15 text-accent"
          )}
          style={{ left: `${n.x}%`, top: `${n.y}%`, transform: "translate(-50%, -50%)" }}
        >
          {i === 0 ? <Network className="h-5 w-5" /> : <FileText className="h-3.5 w-3.5" />}
        </motion.div>
      ))}
    </div>
  );
}

function FinalStep({
  t,
  onPrimary,
  onSecondary,
}: {
  t: TFn;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg"
      >
        <PenLine className="h-9 w-9" />
      </motion.div>

      <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl" data-testid="text-final-title">
        {t("obFinalTitle")}
      </h2>
      <p className="mb-8 max-w-lg text-base text-muted-foreground md:text-lg">{t("obFinalSubtitle")}</p>

      <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
        <Button size="lg" onClick={onPrimary} data-testid="button-start-garden">
          {t("obFinalPrimary")}
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button size="lg" variant="outline" onClick={onSecondary} data-testid="button-later">
          {t("obFinalSecondary")}
        </Button>
      </div>
    </div>
  );
}
