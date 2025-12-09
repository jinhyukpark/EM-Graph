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

function AppRouter() {
  return (
    <WouterRouter hook={useHashLocation}>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/dashboard" component={Home} />
        <Route path="/projects" component={Projects} />
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
