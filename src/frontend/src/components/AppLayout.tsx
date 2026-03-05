import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  FilePlus,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { getCurrentRole, getCurrentUser, logout } from "../utils/auth";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  showBack?: boolean;
  rightAction?: ReactNode;
}

const navItems = [
  {
    path: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    ocid: "nav.dashboard_link",
  },
  { path: "/clients", label: "Clients", icon: Users, ocid: "nav.clients_link" },
  {
    path: "/invoices/new",
    label: "New Invoice",
    icon: FilePlus,
    ocid: "nav.new_invoice_link",
  },
  {
    path: "/invoices",
    label: "History",
    icon: FileText,
    ocid: "nav.history_link",
  },
  {
    path: "/settings",
    label: "Settings",
    icon: Settings,
    ocid: "nav.settings_link",
  },
];

export default function AppLayout({
  children,
  title,
  showBack,
  rightAction,
}: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();
  const currentRole = getCurrentRole();

  const handleLogout = () => {
    logout();
    void navigate({ to: "/login" });
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    if (path === "/invoices") {
      return (
        location.pathname === "/invoices" ||
        (location.pathname.startsWith("/invoices/") &&
          location.pathname !== "/invoices/new")
      );
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="app-container bg-background">
      {/* Header */}
      <header className="no-print sticky top-0 z-40 bg-card border-b border-border shadow-xs">
        <div className="flex items-center h-14 px-4 gap-3">
          {showBack && (
            <button
              type="button"
              onClick={() => window.history.back()}
              className="p-1.5 rounded-full hover:bg-accent transition-colors"
              aria-label="Go back"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <title>Back</title>
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {!showBack && (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground text-xs font-bold font-display">
                CIM
              </span>
            </div>
          )}
          <h1 className="flex-1 font-display font-semibold text-base text-foreground truncate">
            {title}
          </h1>
          {currentUser && (
            <span className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium border border-border/60 shrink-0">
              <span className="text-foreground/80">{currentUser}</span>
              <span className="text-muted-foreground/60">•</span>
              <span
                className={
                  currentRole === "admin"
                    ? "text-amber-600 dark:text-amber-400 font-semibold"
                    : "text-blue-600 dark:text-blue-400 font-semibold"
                }
              >
                {currentRole === "admin" ? "Admin" : "User"}
              </span>
            </span>
          )}
          {rightAction}
          {!rightAction && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive h-9 w-9"
              aria-label="Logout"
              data-ocid="nav.logout_button"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="pb-safe">
        {children}
        <div className="bottom-nav-spacer no-print" />
      </main>

      {/* Bottom navigation */}
      <nav className="no-print fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card border-t border-border z-50">
        <div className="flex items-stretch h-[64px]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                type="button"
                data-ocid={item.ocid}
                onClick={() => void navigate({ to: item.path })}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors pt-1",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
              >
                <div
                  className={cn(
                    "rounded-full p-1.5 transition-colors",
                    active ? "bg-primary/10" : "",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium leading-none",
                    active ? "font-semibold" : "",
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
