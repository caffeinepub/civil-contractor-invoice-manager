import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  ChevronRight,
  FilePlus,
  FileText,
  IndianRupee,
  TrendingUp,
  Users,
} from "lucide-react";
import AppLayout from "../components/AppLayout";
import { useGetDashboardStats } from "../hooks/useQueries";
import { getCurrentRole, getCurrentUser } from "../utils/auth";
import { formatINR } from "../utils/format";

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  isLoading,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
  isLoading: boolean;
}) {
  return (
    <Card className="shadow-card border-border/60">
      <CardContent className="p-4">
        <div
          className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${color}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        {isLoading ? (
          <>
            <Skeleton className="h-7 w-16 mb-1" />
            <Skeleton className="h-3.5 w-20" />
          </>
        ) : (
          <>
            <p className="font-display font-bold text-2xl text-foreground leading-tight">
              {value}
            </p>
            <p className="text-muted-foreground text-xs font-medium mt-0.5">
              {label}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useGetDashboardStats();
  const currentUser = getCurrentUser();
  const currentRole = getCurrentRole();

  const totalClients = stats ? Number(stats.totalClients) : 0;
  const totalInvoices = stats ? Number(stats.totalInvoices) : 0;
  const totalBilled = stats ? Number(stats.totalBillingAmount) : 0;

  return (
    <AppLayout title="Dashboard">
      <div data-ocid="dashboard.page" className="p-4 space-y-5 animate-fade-up">
        {/* Welcome banner */}
        <div className="rounded-2xl bg-primary p-4 text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-6 translate-x-6" />
          <div className="absolute bottom-0 right-8 w-16 h-16 rounded-full bg-white/10 translate-y-6" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 opacity-80" />
              <span className="text-xs font-medium opacity-80 uppercase tracking-wide">
                Business Overview
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display font-bold text-xl">
                Welcome, {currentUser}
              </h2>
              <Badge
                className={
                  currentRole === "admin"
                    ? "bg-amber-400/30 text-amber-100 border-amber-300/30 text-xs font-semibold"
                    : "bg-blue-400/30 text-blue-100 border-blue-300/30 text-xs font-semibold"
                }
              >
                {currentRole === "admin" ? "Admin" : "User"}
              </Badge>
            </div>
            <p className="text-sm opacity-80 mt-0.5">
              {isLoading
                ? "Loading your stats..."
                : `Managing ${totalClients} clients & ${totalInvoices} invoices`}
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div>
          <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
            Quick Stats
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={Users}
              label="Total Clients"
              value={isLoading ? "—" : totalClients.toString()}
              color="bg-blue-50 text-blue-600"
              isLoading={isLoading}
            />
            <StatCard
              icon={FileText}
              label="Total Invoices"
              value={isLoading ? "—" : totalInvoices.toString()}
              color="bg-emerald-50 text-emerald-600"
              isLoading={isLoading}
            />
            <div className="col-span-2">
              <Card className="shadow-card border-border/60">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-600">
                      <IndianRupee className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      {isLoading ? (
                        <>
                          <Skeleton className="h-7 w-32 mb-1" />
                          <Skeleton className="h-3.5 w-24" />
                        </>
                      ) : (
                        <>
                          <p className="font-display font-bold text-2xl text-foreground leading-tight">
                            {formatINR(totalBilled)}
                          </p>
                          <p className="text-muted-foreground text-xs font-medium mt-0.5">
                            Total Amount Billed
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button
              type="button"
              data-ocid="dashboard.new_invoice_button"
              onClick={() => void navigate({ to: "/invoices/new" })}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-primary/10 hover:bg-primary/15 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                <FilePlus className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">
                  Create New Invoice
                </p>
                <p className="text-muted-foreground text-xs">
                  Bill your client for completed work
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>

            <button
              type="button"
              data-ocid="dashboard.clients_link"
              onClick={() => void navigate({ to: "/clients" })}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-accent hover:bg-accent/80 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">
                  Manage Clients
                </p>
                <p className="text-muted-foreground text-xs">
                  Add, edit or view client details
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>

            <button
              type="button"
              data-ocid="dashboard.history_link"
              onClick={() => void navigate({ to: "/invoices" })}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-accent hover:bg-accent/80 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">
                  Invoice History
                </p>
                <p className="text-muted-foreground text-xs">
                  View and print past invoices
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground py-2">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </AppLayout>
  );
}
