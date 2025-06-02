import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TranslationProvider } from "./contexts/TranslationContext";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import TranslatePage from "@/pages/TranslatePage";
import VoiceTranslatePage from "@/pages/VoiceTranslatePage";
import ConversationPage from "@/pages/ConversationPage";
import LanguagesPage from "@/pages/LanguagesPage";
import HistoryPage from "@/pages/HistoryPage";
import SavedPage from "@/pages/SavedPage";
import DownloadsPage from "@/pages/DownloadsPage";
import SettingsPage from "@/pages/SettingsPage";
import AccountPage from "@/pages/AccountPage";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={TranslatePage} />
        <Route path="/voice" component={VoiceTranslatePage} />
        <Route path="/conversation" component={ConversationPage} />
        <Route path="/languages" component={LanguagesPage} />
        <Route path="/history" component={HistoryPage} />
        <Route path="/saved" component={SavedPage} />
        <Route path="/downloads" component={DownloadsPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/account" component={AccountPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TranslationProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </QueryClientProvider>
      </TranslationProvider>
    </ThemeProvider>
  );
}

export default App;
