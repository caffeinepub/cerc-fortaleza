import { AdminRoute } from "@/components/AdminRoute";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/layouts/AppLayout";
import { AdminPanel } from "@/pages/AdminPanel";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { CheckoutSuccessPage } from "@/pages/CheckoutSuccessPage";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { OnboardingPage } from "@/pages/OnboardingPage";
import { PlanosPage } from "@/pages/PlanosPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { RecoveredTab } from "@/pages/RecoveredTab";
import { SOSTab } from "@/pages/SOSTab";
import { SearchTab } from "@/pages/SearchTab";
import { StripeConfigPage } from "@/pages/StripeConfigPage";
import { VaultTab } from "@/pages/VaultTab";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// Define root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="top-center" />
    </>
  ),
});

// Define routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <AdminRoute>
      <AdminPanel />
    </AdminRoute>
  ),
});

const stripeConfigRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/stripe-config",
  component: () => (
    <AdminRoute>
      <StripeConfigPage />
    </AdminRoute>
  ),
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/onboarding",
  component: OnboardingPage,
});

const planosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/planos",
  component: PlanosPage,
});

const privacidadeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacidade",
  component: PrivacyPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: () => (
    <ProtectedRoute>
      <CheckoutPage />
    </ProtectedRoute>
  ),
});

const checkoutSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout/success",
  component: () => (
    <ProtectedRoute>
      <CheckoutSuccessPage />
    </ProtectedRoute>
  ),
});

// App layout with nested routes
const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app",
  component: () => (
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  ),
});

const appHomeRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/home",
  component: SearchTab,
});

const appVaultRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/vault",
  component: VaultTab,
});

const appRecoveredRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/recovered",
  component: RecoveredTab,
});

const appSOSRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/sos",
  component: SOSTab,
});

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  adminRoute,
  stripeConfigRoute,
  onboardingRoute,
  planosRoute,
  privacidadeRoute,
  checkoutRoute,
  checkoutSuccessRoute,
  appRoute.addChildren([
    appHomeRoute,
    appVaultRoute,
    appRecoveredRoute,
    appSOSRoute,
  ]),
]);

// Create router
const router = createRouter({ routeTree });

// Register router for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
