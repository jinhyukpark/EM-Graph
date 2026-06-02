import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/i18n";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import LandingPage from "@/pages/LandingPage";
import CreateProject from "@/pages/CreateProject";
import ProjectSetup from "@/pages/ProjectSetup";
import ProjectView from "@/pages/ProjectView";
import DatabaseManager from "@/pages/DatabaseManager";
import GraphBuilder from "@/pages/GraphBuilder";
import ResourcesManager from "@/pages/ResourcesManager";
import Settings from "@/pages/Settings";
import Projects from "@/pages/Projects";
import SignUp from "@/pages/SignUp";
import OrganizationSelect from "@/pages/OrganizationSelect";
import KnowledgeGarden from "@/pages/KnowledgeGarden";
import BrainMarket from "@/pages/BrainMarket";
import IntelliSearch from "@/pages/IntelliSearch";
import Chatbot from "@/pages/Chatbot";
import Plugins from "@/pages/Plugins";
import TodoList from "@/pages/TodoList";
import CalendarPage from "@/pages/CalendarPage";

// Suppress specific errors that are common in iframe environments like Replit Preview
// but don't affect the actual functionality of the application.
const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('ResizeObserver loop')) return;
  originalConsoleError.apply(console, args);
};

// Only suppress the benign ResizeObserver loop signal, which React Flow + resizable
// panels trigger when layout settles. The "not an error object" message is how this
// env surfaces that loop (an error event with no error object). We intentionally do
// NOT suppress "Script error." so genuine cross-origin failures still surface.
const isBenignError = (message?: string) =>
  !!message && (
    message.includes('ResizeObserver loop') ||
    message === 'An uncaught exception occured but the error was not an error object.'
  );

window.addEventListener('error', (event) => {
  if (isBenignError(event.message)) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
}, true);

window.addEventListener('unhandledrejection', (event) => {
  const reason: any = event.reason;
  const message = typeof reason === 'string' ? reason : reason?.message;
  if (isBenignError(message)) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
}, true);

function AppRouter() {
  return (
    <WouterRouter hook={useHashLocation}>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/signup" component={SignUp} />
        <Route path="/organization-select" component={OrganizationSelect} />
        <Route path="/dashboard" component={Home} />
        <Route path="/projects" component={Projects} />
        <Route path="/knowledge-garden" component={KnowledgeGarden} />
        <Route path="/todo-list" component={TodoList} />
        <Route path="/calendar" component={CalendarPage} />
        <Route path="/brain-market" component={BrainMarket} />
        <Route path="/create" component={CreateProject} />
        <Route path="/project/:id/setup" component={ProjectSetup} />
        <Route path="/project/:id/view" component={ProjectView} />
        <Route path="/database" component={DatabaseManager} />
        <Route path="/resources" component={ResourcesManager} />
        <Route path="/settings" component={Settings} />
        <Route path="/graph-builder" component={GraphBuilder} />
        <Route path="/intelligence/search" component={IntelliSearch} />
        <Route path="/intelligence/chatbot" component={Chatbot} />
        <Route path="/plugins" component={Plugins} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <AppRouter />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
