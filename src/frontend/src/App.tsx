import { Toaster } from "@/components/ui/sonner";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import { Navigate } from "./components/Navigate";
import ClientsPage from "./pages/ClientsPage";
import DashboardPage from "./pages/DashboardPage";
import EditClientPage from "./pages/EditClientPage";
import InvoiceDetailPage from "./pages/InvoiceDetailPage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import NewClientPage from "./pages/NewClientPage";
import NewInvoicePage from "./pages/NewInvoicePage";
import SettingsPage from "./pages/SettingsPage";

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="top-center" />
    </>
  ),
});

// Auth guard wrapper
function AuthGuardWrapper({ children }: { children: React.ReactNode }) {
  const isAuth = localStorage.getItem("cim_auth") === "true";
  if (!isAuth) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
}

// Routes
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <AuthGuardWrapper>
      <DashboardPage />
    </AuthGuardWrapper>
  ),
});

const clientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/clients",
  component: () => (
    <AuthGuardWrapper>
      <ClientsPage />
    </AuthGuardWrapper>
  ),
});

const newClientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/clients/new",
  component: () => (
    <AuthGuardWrapper>
      <NewClientPage />
    </AuthGuardWrapper>
  ),
});

const editClientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/clients/$id/edit",
  component: () => (
    <AuthGuardWrapper>
      <EditClientPage />
    </AuthGuardWrapper>
  ),
});

const newInvoiceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/invoices/new",
  component: () => (
    <AuthGuardWrapper>
      <NewInvoicePage />
    </AuthGuardWrapper>
  ),
});

const invoicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/invoices",
  component: () => (
    <AuthGuardWrapper>
      <InvoicesPage />
    </AuthGuardWrapper>
  ),
});

const invoiceDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/invoices/$id",
  component: () => (
    <AuthGuardWrapper>
      <InvoiceDetailPage />
    </AuthGuardWrapper>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: () => (
    <AuthGuardWrapper>
      <SettingsPage />
    </AuthGuardWrapper>
  ),
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  dashboardRoute,
  clientsRoute,
  newClientRoute,
  editClientRoute,
  newInvoiceRoute,
  invoicesRoute,
  invoiceDetailRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
