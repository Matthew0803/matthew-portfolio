import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Gallery from "./pages/Gallery";
import ProjectDetail from "./pages/ProjectDetail";
import AdminExperience from "./pages/AdminExperience";
import AdminProject from "./pages/AdminProject";
import AdminGallery from "./pages/AdminGallery";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const ADMIN_ENABLED = import.meta.env.VITE_ADMIN_ENABLED === "true";
const PAGES_ENABLED = import.meta.env.VITE_PAGES_ENABLED !== "false";

// Create a client
const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      {PAGES_ENABLED && (
        <>
          <Route path={"/projects"} component={Projects} />
          <Route path={"/projects/:id"} component={ProjectDetail} />
          <Route path={"/gallery"} component={Gallery} />
        </>
      )}
      {ADMIN_ENABLED && (
        <>
          <Route path={"/admin/experience"} component={AdminExperience} />
          <Route path={"/admin/project"} component={AdminProject} />
          <Route path={"/admin/gallery"} component={AdminGallery} />
        </>
      )}
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          defaultTheme="dark"
          switchable
        >
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
