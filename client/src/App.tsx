import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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

// Suppress specific errors that are common in iframe environments like Replit Preview
// but don't affect the actual functionality of the application.
const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('ResizeObserver loop')) return;
  originalConsoleError.apply(console, args);
};

window.addEventListener('error', (event) => {
  if (event.message === 'ResizeObserver loop limit exceeded' || 
      event.message === 'Script error.' ||
      event.message === 'An uncaught exception occured but the error was not an error object.') {
    event.stopImmediatePropagation();
    // Don't prevent default for everything, just suppress the noise
  }
});

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
        <Route path="/brain-market" component={BrainMarket} />
        <Route path="/create" component={CreateProject} />
        <Route path="/project/:id/setup" component={ProjectSetup} />
        <Route path="/project/:id/view" component={ProjectView} />
        <Route path="/database" component={DatabaseManager} />
        <Route path="/resources" component={ResourcesManager} />
        <Route path="/settings" component={Settings} />
        <Route path="/graph-builder" component={GraphBuilder} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
