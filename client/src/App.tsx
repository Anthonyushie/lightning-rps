import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import { YakiHonneProvider } from "@/contexts/YakiHonneContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YakiHonneProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </YakiHonneProvider>
    </QueryClientProvider>
  );
}

export default App;
