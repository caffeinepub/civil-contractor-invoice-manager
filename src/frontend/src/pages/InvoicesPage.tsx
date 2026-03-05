import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  ChevronRight,
  FileText,
  Hash,
  IndianRupee,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Client, Invoice } from "../backend.d";
import AppLayout from "../components/AppLayout";
import {
  useDeleteInvoice,
  useGetAllClients,
  useGetAllInvoices,
} from "../hooks/useQueries";
import { formatDate, formatINR } from "../utils/format";

function InvoiceCard({
  invoice,
  client,
  index,
  onView,
  onDelete,
}: {
  invoice: Invoice;
  client?: Client;
  index: number;
  onView: () => void;
  onDelete: () => void;
}) {
  return (
    <Card
      data-ocid={`invoices.item.${index}`}
      className="shadow-card border-border/60 cursor-pointer card-hover"
      onClick={onView}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <FileText className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5">
                <Hash className="h-3 w-3 text-muted-foreground" />
                <span className="font-display font-semibold text-foreground text-sm">
                  {invoice.billingNumber}
                </span>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-4 font-medium text-emerald-600 border-emerald-200 bg-emerald-50 flex-shrink-0"
              >
                Invoice
              </Badge>
            </div>
            <p className="text-sm text-foreground font-medium truncate">
              {client?.name ?? "Unknown Client"}
            </p>
            <div className="flex items-center justify-between mt-1.5">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span className="text-xs">{formatDate(invoice.createdAt)}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <IndianRupee className="h-3 w-3 text-primary" />
                <span className="font-display font-bold text-primary text-sm">
                  {formatINR(Number(invoice.grandTotal)).replace("₹", "")}
                </span>
              </div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
        </div>
        <div className="mt-3 pt-2 border-t border-border/40 flex justify-end">
          <Button
            data-ocid={`invoices.delete_button.${index}`}
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="h-7 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function InvoiceCardSkeleton() {
  return (
    <Card className="shadow-card border-border/60">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function InvoicesPage() {
  const navigate = useNavigate();
  const { data: invoices, isLoading: invoicesLoading } = useGetAllInvoices();
  const { data: clients } = useGetAllClients();
  const deleteInvoice = useDeleteInvoice();
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const clientMap = new Map<string, Client>(
    (clients ?? []).map((c) => [c.id.toString(), c]),
  );

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteInvoice.mutateAsync(deleteId);
      toast.success("Invoice deleted successfully");
    } catch {
      toast.error("Failed to delete invoice");
    } finally {
      setDeleteId(null);
    }
  };

  const sortedInvoices = invoices
    ? [...invoices].sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    : [];

  return (
    <AppLayout title="Invoice History">
      <div data-ocid="invoices.page" className="p-4 space-y-3 animate-fade-up">
        {invoicesLoading ? (
          <>
            <InvoiceCardSkeleton />
            <InvoiceCardSkeleton />
            <InvoiceCardSkeleton />
          </>
        ) : sortedInvoices.length === 0 ? (
          <div
            data-ocid="invoices.empty_state"
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-1">
              No Invoices Yet
            </h3>
            <p className="text-muted-foreground text-sm mb-4 max-w-[200px]">
              Create your first invoice to get started
            </p>
            <Button
              onClick={() => void navigate({ to: "/invoices/new" })}
              className="font-semibold"
            >
              Create Invoice
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between py-1">
              <p className="text-sm text-muted-foreground">
                {sortedInvoices.length} invoice
                {sortedInvoices.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div data-ocid="invoices.list" className="space-y-3">
              {sortedInvoices.map((invoice, i) => (
                <InvoiceCard
                  key={invoice.id.toString()}
                  invoice={invoice}
                  client={clientMap.get(invoice.clientId.toString())}
                  index={i + 1}
                  onView={() =>
                    void navigate({ to: `/invoices/${invoice.id.toString()}` })
                  }
                  onDelete={() => setDeleteId(invoice.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this invoice and all its data. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
