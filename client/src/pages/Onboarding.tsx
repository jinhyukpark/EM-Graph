import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { setPurpose as persistPurpose, type PurposeId } from "@/lib/onboardingPurpose";
import logoImg from "@assets/로고svg_1783561501600.svg";
import featureGardenImg from "@assets/지식정원1_1783572771154.svg";
import featureNetworkImg from "@assets/네트워크연결2_1783572772639.svg";
import featureAiImg from "@assets/ai3_1783572774559.svg";
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
  Mail,
  Lock,
  User,
  UserPlus,
  LogIn,
  Boxes,
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

  const [authPhase, setAuthPhase] = useState<"signup" | "login" | "done">("signup");
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [showFirstNote, setShowFirstNote] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [step, setStep] = useState(0);
  const [featureSub, setFeatureSub] = useState(0);
  const [purposes, setPurposes] = useState<PurposeId[]>([]);
  const [direction, setDirection] = useState(1);

  const purposeOptions: {
    id: PurposeId;
    icon: typeof Building2;
    title: string;
    desc: string;
    iconCls: string;
    activeIconCls: string;
  }[] = [
    {
      id: "enterprise",
      icon: Building2,
      title: t("obPurposeEnterprise"),
      desc: t("obPurposeEnterpriseDesc"),
      iconCls: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
      activeIconCls: "bg-sky-500 text-white",
    },
    {
      id: "research",
      icon: FlaskConical,
      title: t("obPurposeResearch"),
      desc: t("obPurposeResearchDesc"),
      iconCls: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
      activeIconCls: "bg-violet-500 text-white",
    },
    {
      id: "archive",
      icon: Archive,
      title: t("obPurposeArchive"),
      desc: t("obPurposeArchiveDesc"),
      iconCls: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
      activeIconCls: "bg-amber-500 text-white",
    },
    {
      id: "exploring",
      icon: Compass,
      title: t("obPurposeExploring"),
      desc: t("obPurposeExploringDesc"),
      iconCls: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
      activeIconCls: "bg-emerald-500 text-white",
    },
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
      setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
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
    console.log("onboarding_complete", { purposes, cta: "knowledge_garden" });
    setShowWorkspace(true);
  }, [purposes]);

  const handleCreateWorkspace = useCallback((name: string) => {
    console.log("onboarding_workspace_create", { name });
    setWorkspaceName(name);
    setShowWorkspace(false);
    setShowFirstNote(true);
  }, []);

  const handleWorkspaceBack = useCallback(() => {
    setShowWorkspace(false);
  }, []);

  const handleCreateFirstNote = useCallback(
    (title: string) => {
      console.log("onboarding_first_note_create", { title });
      markOnboardingComplete();
      setLocation("/knowledge-garden");
    },
    [setLocation]
  );

  const handleFirstNoteBack = useCallback(() => {
    setShowFirstNote(false);
    setShowWorkspace(true);
  }, []);

  const handleLater = useCallback(() => {
    console.log("onboarding_complete", { purposes, cta: "later" });
    markOnboardingComplete();
    setLocation("/dashboard");
  }, [purposes, setLocation]);

  const handleSignup = useCallback(() => {
    console.log("onboarding_signup");
    setAuthPhase("login");
  }, []);

  const handleLogin = useCallback(() => {
    console.log("onboarding_login");
    setAuthPhase("done");
  }, []);

  // Log auth screen views
  useEffect(() => {
    if (authPhase !== "done") console.log("onboarding_auth_view", { screen: authPhase });
  }, [authPhase]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Auth / workspace / first-note screens have their own controls — no wizard nav there.
      if (authPhase !== "done" || showWorkspace || showFirstNote) return;
      // Don't hijack Enter when the user is focused on an interactive control
      // (buttons, links, inputs) — let that control handle it instead.
      const el = document.activeElement as HTMLElement | null;
      const onInteractive =
        !!el && (el.tagName === "BUTTON" || el.tagName === "A" || el.tagName === "INPUT" || el.tagName === "TEXTAREA");
      // The purpose step requires at least one selection before advancing.
      const nextBlocked = step === TOTAL_STEPS - 1 || (step === 1 && purposes.length === 0);
      if (e.key === "ArrowRight") {
        if (nextBlocked) return;
        e.preventDefault();
        goNext();
      } else if (e.key === "Enter") {
        if (nextBlocked || onInteractive) return;
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
  }, [step, goNext, goBack, authPhase, showWorkspace, showFirstNote, purposes]);

  // Log workspace screen view
  useEffect(() => {
    if (showWorkspace) console.log("onboarding_workspace_view");
  }, [showWorkspace]);

  // Log first-note screen view
  useEffect(() => {
    if (showFirstNote) console.log("onboarding_first_note_view");
  }, [showFirstNote]);

  const isLastStep = step === TOTAL_STEPS - 1;
  const contentKey = step === 2 ? `2-${featureSub}` : `${step}`;

  return (
    <div className="fixed inset-0 flex flex-col bg-background text-foreground overflow-hidden" data-testid="page-onboarding">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-3xl" />
      </div>

      {authPhase !== "done" ? (
        <AuthScreen
          t={t}
          mode={authPhase}
          onSignup={handleSignup}
          onLogin={handleLogin}
          onSwitch={(m) => setAuthPhase(m)}
        />
      ) : showWorkspace ? (
        <WorkspaceScreen t={t} onCreate={handleCreateWorkspace} onBack={handleWorkspaceBack} />
      ) : showFirstNote ? (
        <FirstNoteScreen
          t={t}
          workspaceName={workspaceName}
          onCreate={handleCreateFirstNote}
          onBack={handleFirstNoteBack}
        />
      ) : (
      <>
      {/* Header: logo + progress */}
      <header className="relative z-10 flex items-center justify-between gap-4 px-6 py-5 md:px-10">
        <div className="flex w-32 items-center">
          <img src={logoImg} alt="EM Graph" className="h-6 w-auto dark:invert" data-testid="img-header-logo" />
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
        <div className="hidden w-32 sm:block" aria-hidden />
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
                selected={purposes}
                onToggle={(id) => {
                  const next = purposes.includes(id)
                    ? purposes.filter((p) => p !== id)
                    : [...purposes, id];
                  setPurposes(next);
                  // Home personalization reads a single purpose — keep the first
                  // selected option as the representative one.
                  persistPurpose(next[0] ?? null);
                }}
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

        {/* Primary action + skip, placed right below the content. */}
        {!isLastStep && (
          <div className={cn("flex flex-col items-center gap-2", step === 2 ? "mt-6" : step === 1 ? "mt-8" : "mt-10")}>
            <Button
              size="lg"
              onClick={goNext}
              disabled={step === 1 && purposes.length === 0}
              className="min-w-[220px]"
              data-testid="button-next"
            >
              {step === 0 ? t("obGetStarted") : t("obNext")}
              <ArrowRight className="h-4 w-4" />
            </Button>
            {/* Skip is only offered on the very first (welcome) step */}
            {step === 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={handleSkip}
                data-testid="button-skip"
              >
                {t("obSkip")}
              </Button>
            )}
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
      </>
      )}
    </div>
  );
}

type TFn = ReturnType<typeof useLanguage>["t"];

function AuthScreen({
  t,
  mode,
  onSignup,
  onLogin,
  onSwitch,
}: {
  t: TFn;
  mode: "signup" | "login";
  onSignup: () => void;
  onLogin: () => void;
  onSwitch: (m: "signup" | "login") => void;
}) {
  const isSignup = mode === "signup";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) onSignup();
    else onLogin();
  };

  return (
    <div className="relative z-10 flex flex-1 items-center justify-center overflow-y-auto px-6 py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm"
          data-testid={`auth-${mode}`}
        >
          {/* Brand */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              <Network className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight" data-testid="text-auth-title">
              {isSignup ? t("obAuthSignupTitle") : t("obAuthLoginTitle")}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {isSignup ? t("obAuthSignupSubtitle") : t("obAuthLoginSubtitle")}
            </p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {isSignup && (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="auth-name">{t("obAuthName")}</Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="auth-name"
                      type="text"
                      autoComplete="name"
                      placeholder={t("obAuthNamePlaceholder")}
                      className="pl-9"
                      data-testid="input-auth-name"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="auth-email">{t("obAuthEmail")}</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    placeholder={t("obAuthEmailPlaceholder")}
                    className="pl-9"
                    data-testid="input-auth-email"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="auth-password">{t("obAuthPassword")}</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="auth-password"
                    type="password"
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    placeholder={t("obAuthPasswordPlaceholder")}
                    className="pl-9"
                    data-testid="input-auth-password"
                  />
                </div>
              </div>

              <Button type="submit" size="lg" className="mt-1 w-full" data-testid="button-auth-submit">
                {isSignup ? (
                  <>
                    <UserPlus className="h-4 w-4" />
                    {t("obAuthSignupCta")}
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    {t("obAuthLoginCta")}
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Switch mode */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignup ? t("obAuthHaveAccount") : t("obAuthNoAccount")}{" "}
            <button
              type="button"
              onClick={() => onSwitch(isSignup ? "login" : "signup")}
              className="font-semibold text-primary hover:underline"
              data-testid="link-auth-switch"
            >
              {isSignup ? t("obAuthLoginCta") : t("obAuthSignupCta")}
            </button>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function WorkspaceScreen({
  t,
  onCreate,
  onBack,
}: {
  t: TFn;
  onCreate: (name: string) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const trimmed = name.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmed) return;
    onCreate(trimmed);
  };

  return (
    <div className="relative z-10 flex flex-1 items-center justify-center overflow-y-auto px-6 py-8" data-testid="workspace-screen">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <Boxes className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl" data-testid="text-workspace-title">
            {t("obWsTitle")}
          </h1>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{t("obWsSubtitle")}</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ws-name">{t("obWsName")}</Label>
              <div className="relative">
                <Boxes className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="ws-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("obWsNamePlaceholder")}
                  className="pl-9"
                  autoFocus
                  data-testid="input-workspace-name"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ws-desc">{t("obWsDesc")}</Label>
              <Input
                id="ws-desc"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder={t("obWsDescPlaceholder")}
                data-testid="input-workspace-desc"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-1 w-full"
              disabled={!trimmed}
              data-testid="button-create-workspace"
            >
              {t("obWsCreateCta")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </Card>

        <div className="mt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={onBack}
            data-testid="button-workspace-back"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("obBack")}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function FirstNoteScreen({
  t,
  workspaceName,
  onCreate,
  onBack,
}: {
  t: TFn;
  workspaceName: string;
  onCreate: (title: string) => void;
  onBack: () => void;
}) {
  const [title, setTitle] = useState("");
  const trimmed = title.trim();

  const suggestions = [t("obNoteSuggest1"), t("obNoteSuggest2"), t("obNoteSuggest3")];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmed) return;
    onCreate(trimmed);
  };

  // Heading references the workspace name, split around the {name} token so the
  // name itself can be highlighted regardless of language word order.
  const [headBefore, headAfter] = t("obNoteHeading").split("{name}");

  return (
    <div className="relative z-10 flex flex-1 items-center justify-center overflow-y-auto px-6 py-8" data-testid="first-note-screen">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg"
      >
        {/* Hero */}
        <div className="mb-8 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.05, type: "spring", stiffness: 200, damping: 16 }}
            className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-xl shadow-primary/25"
          >
            <PenLine className="h-7 w-7" />
            <motion.span
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 12 }}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-background text-primary shadow-md"
            >
              <Sparkles className="h-3.5 w-3.5" />
            </motion.span>
          </motion.div>

          <Badge variant="secondary" className="mb-3 gap-1.5" data-testid="badge-first-note">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {t("obNoteBadge")}
          </Badge>

          <h1 className="whitespace-nowrap text-2xl font-bold leading-snug tracking-tight md:text-3xl" data-testid="text-first-note-title">
            {headBefore}
            <span className="text-primary">{workspaceName}</span>
            {headAfter}
          </h1>
          <p className="mt-2 whitespace-nowrap text-sm text-muted-foreground">{t("obNoteSubtitle")}</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="note-title">{t("obNoteTitleLabel")}</Label>
              <div className="relative">
                <FileText className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="note-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("obNoteTitlePlaceholder")}
                  className="pl-9"
                  autoFocus
                  data-testid="input-first-note-title"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground">{t("obNoteSuggestLabel")}</span>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTitle(s)}
                    className="rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
                    data-testid={`chip-note-suggest-${i}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-1 w-full"
              disabled={!trimmed}
              data-testid="button-create-first-note"
            >
              {t("obNoteCreateCta")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </Card>

        <div className="mt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={onBack}
            data-testid="button-first-note-back"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("obBack")}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function WelcomeStep({ t }: { t: TFn }) {
  return (
    <div className="flex flex-col items-center text-center">
      <Badge variant="secondary" className="mb-6 gap-1.5" data-testid="badge-welcome">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        {t("obWelcomeBadge")}
      </Badge>

      {/* Knowledge garden visual */}
      <div className="relative mb-8 flex h-60 w-full max-w-md items-center justify-center">
        {/* soft colorful glow */}
        <div className="absolute h-48 w-48 rounded-full bg-gradient-to-br from-primary/25 via-violet-400/15 to-emerald-400/15 blur-2xl" />

        {/* orbit rings (slowly rotating) */}
        <motion.div
          className="absolute h-64 w-64 rounded-full border border-dashed border-primary/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-primary shadow-sm" />
          <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-amber-400" />
        </motion.div>
        <motion.div
          className="absolute h-48 w-48 rounded-full border border-accent/25"
          animate={{ rotate: -360 }}
          transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-emerald-400" />
          <span className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-violet-400" />
        </motion.div>
        <div className="absolute h-36 w-36 rounded-full border border-primary/15 bg-primary/5" />

        {/* faint connecting lines from center */}
        <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
          {[
            { x2: "22%", y2: "16%" },
            { x2: "80%", y2: "22%" },
            { x2: "26%", y2: "84%" },
            { x2: "76%", y2: "80%" },
          ].map((l, i) => (
            <motion.line
              key={i}
              x1="50%"
              y1="50%"
              x2={l.x2}
              y2={l.y2}
              stroke="currentColor"
              className="text-primary/25"
              strokeWidth={1.2}
              strokeDasharray="3 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
            />
          ))}
        </svg>

        {/* floating note tiles with varied colors */}
        {[
          {
            icon: FileText,
            pos: "top-1 left-12",
            tile: "bg-sky-50 text-sky-600 border-sky-200/70 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/25",
            delay: 0,
            float: 3.2,
          },
          {
            icon: PenLine,
            pos: "top-7 right-8",
            tile: "bg-amber-50 text-amber-600 border-amber-200/70 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/25",
            delay: 0.15,
            float: 3.8,
          },
          {
            icon: Network,
            pos: "bottom-3 left-16",
            tile: "bg-violet-50 text-violet-600 border-violet-200/70 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/25",
            delay: 0.3,
            float: 3.5,
          },
          {
            icon: FileText,
            pos: "bottom-8 right-14",
            tile: "bg-emerald-50 text-emerald-600 border-emerald-200/70 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/25",
            delay: 0.45,
            float: 4.1,
          },
        ].map((n, i) => {
          const Icon = n.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
              transition={{
                opacity: { delay: 0.2 + n.delay, duration: 0.4 },
                scale: { delay: 0.2 + n.delay, duration: 0.4 },
                y: { delay: 0.6 + n.delay, duration: n.float, repeat: Infinity, ease: "easeInOut" },
              }}
              className={cn(
                "absolute flex h-11 w-11 items-center justify-center rounded-xl border shadow-sm backdrop-blur-sm",
                n.pos,
                n.tile
              )}
            >
              <Icon className="h-5 w-5" />
            </motion.div>
          );
        })}

        {/* scattered accent dots */}
        {[
          { pos: "top-10 left-2", color: "bg-rose-400/70", size: "h-1.5 w-1.5", delay: 0 },
          { pos: "top-2 right-20", color: "bg-emerald-400/70", size: "h-2 w-2", delay: 0.8 },
          { pos: "bottom-12 left-6", color: "bg-amber-400/70", size: "h-2 w-2", delay: 1.4 },
          { pos: "bottom-1 right-6", color: "bg-sky-400/70", size: "h-1.5 w-1.5", delay: 0.4 },
        ].map((d, i) => (
          <motion.span
            key={i}
            className={cn("absolute rounded-full", d.pos, d.color, d.size)}
            animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }}
            transition={{ delay: d.delay, duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* center emblem: brand logo on a light card */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative flex items-center justify-center rounded-2xl border border-border bg-white px-5 py-4 shadow-xl shadow-primary/20 dark:bg-zinc-100"
        >
          <motion.span
            className="absolute inset-0 rounded-2xl bg-primary/20"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <img src={logoImg} alt="EM Graph" className="relative h-9 w-auto" data-testid="img-welcome-logo" />
          <motion.span
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 12 }}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-background text-amber-500 shadow-md"
          >
            <Sparkles className="h-3.5 w-3.5" />
          </motion.span>
        </motion.div>
      </div>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl" data-testid="text-welcome-title">
        {t("obWelcomeTitle")}
      </h1>
      <p className="max-w-xl whitespace-pre-line text-base text-muted-foreground md:text-lg">{t("obWelcomeSubtitle")}</p>
    </div>
  );
}

function PurposeStep({
  t,
  options,
  selected,
  onToggle,
}: {
  t: TFn;
  options: {
    id: PurposeId;
    icon: typeof Building2;
    title: string;
    desc: string;
    iconCls: string;
    activeIconCls: string;
  }[];
  selected: PurposeId[];
  onToggle: (id: PurposeId) => void;
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
          const isActive = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => onToggle(opt.id)}
              aria-pressed={isActive}
              data-testid={`card-purpose-${opt.id}`}
              className={cn(
                "group flex items-start gap-4 rounded-xl border p-5 text-left transition-all hover-elevate",
                isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card"
              )}
            >
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors",
                  isActive ? opt.activeIconCls : opt.iconCls
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
      visual: (
        <img
          src={featureGardenImg}
          alt={t("obFeatureGardenTitle")}
          className="h-full w-full object-contain"
          data-testid="img-feature-garden"
        />
      ),
    },
    {
      title: t("obFeatureNoteTitle"),
      desc: t("obFeatureNoteDesc"),
      visual: (
        <img
          src={featureNetworkImg}
          alt={t("obFeatureNoteTitle")}
          className="h-full w-full object-contain"
          data-testid="img-feature-network"
        />
      ),
    },
    {
      title: t("obFeatureAiTitle"),
      desc: t("obFeatureAiDesc"),
      visual: (
        <img
          src={featureAiImg}
          alt={t("obFeatureAiTitle")}
          className="h-full w-full object-contain"
          data-testid="img-feature-ai"
        />
      ),
    },
  ];
  const f = features[sub];

  return (
    <div className="grid w-full items-center gap-8 md:grid-cols-2 md:gap-12">
      <div className="order-2 md:order-1">
        <div className="mb-3 text-sm font-semibold text-primary">
          {sub + 1} / {FEATURE_SUBSTEPS}
        </div>
        <h2 className="mb-4 break-keep text-2xl font-bold tracking-tight md:text-3xl" data-testid="text-feature-title">
          {f.title}
        </h2>
        <p className="whitespace-pre-line break-keep text-base leading-relaxed text-muted-foreground">{f.desc}</p>
      </div>
      <div className="order-1 flex h-64 items-center justify-center md:order-2 md:h-72">
        {f.visual}
      </div>
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
