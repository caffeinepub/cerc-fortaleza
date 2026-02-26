import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from "@tanstack/react-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { AdminPanel } from "@/pages/AdminPanel";
import { OnboardingPage } from "@/pages/OnboardingPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { CheckoutSuccessPage } from "@/pages/CheckoutSuccessPage";
import { AppLayout } from "@/layouts/AppLayout";
import { SearchTab } from "@/pages/SearchTab";
import { VaultTab } from "@/pages/VaultTab";
import { RecoveredTab } from "@/pages/RecoveredTab";
import { SOSTab } from "@/pages/SOSTab";
import { StripeConfigPage } from "@/pages/StripeConfigPage";
import { PlanosPage } from "@/pages/PlanosPage";
import { Toaster } from "@/components/ui/sonner";

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
