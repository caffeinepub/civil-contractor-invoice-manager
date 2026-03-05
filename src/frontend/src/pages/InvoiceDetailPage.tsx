import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  Hash,
  Home,
  Loader2,
  MapPin,
  Phone,
  Printer,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Item, Room } from "../backend.d";
import AppLayout from "../components/AppLayout";
import {
  useDeleteInvoice,
  useGetClient,
  useGetInvoice,
  useGetItemsByRoomId,
  useGetRoomsByInvoiceId,
} from "../hooks/useQueries";
import { formatDate, formatINR } from "../utils/format";

// ── Room items section ────────────────────────────────────────────────────

function RoomItemsSection({ room }: { room: Room }) {
  const { data: items, isLoading } = useGetItemsByRoomId(room.id);

  if (isLoading) {
    return (
      <div className="space-y-2 py-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-2">
        No items in this room.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs w-[40%]">Description</TableHead>
            <TableHead className="text-xs text-right">Qty</TableHead>
            <TableHead className="text-xs">Unit</TableHead>
            <TableHead className="text-xs text-right">Rate</TableHead>
            <TableHead className="text-xs text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item: Item) => (
            <TableRow key={item.id.toString()}>
              <TableCell className="text-xs py-2 font-medium">
                {item.description}
              </TableCell>
              <TableCell className="text-xs py-2 text-right">
                {item.quantity}
              </TableCell>
              <TableCell className="text-xs py-2 text-muted-foreground">
                {item.unit}
              </TableCell>
              <TableCell className="text-xs py-2 text-right">
                {formatINR(item.rate)}
              </TableCell>
              <TableCell className="text-xs py-2 text-right font-semibold">
                {formatINR(item.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center px-3 py-2 bg-muted/30 rounded-b-lg mt-1">
        <span className="text-xs font-medium text-muted-foreground">
          Room Subtotal
        </span>
        <span className="text-sm font-bold text-foreground">
          {formatINR(room.subtotal)}
        </span>
      </div>
    </div>
  );
}

// ── Print-friendly room section ───────────────────────────────────────────

function PrintRoomSection({ room }: { room: Room }) {
  const { data: items } = useGetItemsByRoomId(room.id);

  return (
    <div className="print-room-section mb-6">
      <h3 className="font-semibold text-sm border-b border-gray-300 pb-1 mb-2">
        {room.name}
      </h3>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-1 font-medium">Description</th>
            <th className="text-right py-1 font-medium">Qty</th>
            <th className="text-left py-1 font-medium px-2">Unit</th>
            <th className="text-right py-1 font-medium">Rate</th>
            <th className="text-right py-1 font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {(items ?? []).map((item: Item) => (
            <tr key={item.id.toString()} className="border-b border-gray-100">
              <td className="py-1">{item.description}</td>
              <td className="text-right py-1">{item.quantity}</td>
              <td className="py-1 px-2 text-gray-500">{item.unit}</td>
              <td className="text-right py-1">{formatINR(item.rate)}</td>
              <td className="text-right py-1 font-medium">
                {formatINR(item.amount)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-gray-300 font-semibold">
            <td colSpan={4} className="py-1 text-right text-xs">
              Subtotal:
            </td>
            <td className="text-right py-1">{formatINR(room.subtotal)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function InvoiceDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false }) as { id?: string };
  const invoiceId = id ? BigInt(id) : null;

  const { data: invoice, isLoading: invoiceLoading } = useGetInvoice(invoiceId);
  const { data: rooms, isLoading: roomsLoading } =
    useGetRoomsByInvoiceId(invoiceId);
  const { data: client, isLoading: clientLoading } = useGetClient(
    invoice ? invoice.clientId : null,
  );
  const deleteInvoice = useDeleteInvoice();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isLoading = invoiceLoading || roomsLoading || clientLoading;

  const handleDelete = async () => {
    if (!invoiceId) return;
    try {
      await deleteInvoice.mutateAsync(invoiceId);
      toast.success("Invoice deleted");
      void navigate({ to: "/invoices" });
    } catch {
      toast.error("Failed to delete invoice");
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const printButton = invoice ? (
    <Button
      data-ocid="invoice_detail.print_button"
      size="sm"
      variant="outline"
      onClick={handlePrint}
      className="h-8 px-3 text-xs no-print"
    >
      <Printer className="h-3.5 w-3.5 mr-1" />
      Print
    </Button>
  ) : undefined;

  return (
    <AppLayout
      title={invoice?.billingNumber ?? "Invoice"}
      showBack
      rightAction={printButton}
    >
      <div data-ocid="invoice_detail.page" className="animate-fade-up">
        {isLoading ? (
          <div className="p-4 space-y-4">
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        ) : !invoice ? (
          <div className="p-4 flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="font-display font-semibold text-foreground mb-1">
              Invoice Not Found
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              This invoice may have been deleted.
            </p>
            <Button
              variant="outline"
              onClick={() => void navigate({ to: "/invoices" })}
            >
              Go to History
            </Button>
          </div>
        ) : (
          <>
            {/* ── Screen view (hidden when printing) ── */}
            <div className="no-print p-4 space-y-4">
              {/* Invoice header */}
              <Card className="shadow-card border-border/60 bg-gradient-to-br from-primary/5 to-background">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-display font-bold text-foreground">
                          {invoice.billingNumber}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(invoice.createdAt)}
                      </p>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20 font-medium">
                      Invoice
                    </Badge>
                  </div>

                  <Separator className="my-3" />

                  {client && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                        Billed To
                      </p>
                      <p className="font-display font-semibold text-foreground">
                        {client.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {client.mobile}
                        </span>
                      </div>
                      {client.address && (
                        <div className="flex items-start gap-1.5 mt-1">
                          <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">
                            {client.address}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 mt-1">
                        <Hash className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Client #{client.billingNumber}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Rooms & Items */}
              {rooms && rooms.length > 0 && (
                <div>
                  <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                    Itemized Breakdown
                  </h3>
                  <Accordion
                    type="multiple"
                    defaultValue={rooms.map((r) => r.id.toString())}
                    className="space-y-2"
                  >
                    {rooms.map((room: Room) => (
                      <AccordionItem
                        key={room.id.toString()}
                        value={room.id.toString()}
                        className="border border-border/60 rounded-xl overflow-hidden bg-card shadow-card"
                      >
                        <AccordionTrigger className="px-4 py-3 hover:no-underline">
                          <div className="flex items-center gap-2 flex-1 text-left">
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Home className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-foreground">
                                {room.name}
                              </p>
                            </div>
                            <span className="font-bold text-sm text-foreground mr-2">
                              {formatINR(room.subtotal)}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-3 pb-3">
                          <RoomItemsSection room={room} />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}

              {/* Grand total */}
              <Card className="border-primary/30 bg-primary/5 shadow-card">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-display font-bold text-foreground">
                      Grand Total
                    </p>
                    <p className="text-xs text-muted-foreground">
                      All rooms included
                    </p>
                  </div>
                  <p className="font-display font-bold text-primary text-2xl">
                    {formatINR(Number(invoice.grandTotal))}
                  </p>
                </CardContent>
              </Card>

              {/* Delete button */}
              <Button
                data-ocid="invoice_detail.delete_button"
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                className="w-full h-11 text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Invoice
              </Button>
            </div>

            {/* ── Print-only view ── */}
            <div className="print-invoice hidden print:block p-6">
              <div className="text-center mb-6 pb-4 border-b-2 border-gray-800">
                <h1 className="text-xl font-bold">CIVIL CONTRACTOR INVOICE</h1>
                <p className="text-gray-500 text-sm mt-0.5">
                  Professional Construction &amp; Civil Work
                </p>
              </div>

              <div className="flex justify-between mb-6">
                <div>
                  <p className="font-semibold text-sm uppercase text-gray-500 mb-1">
                    Invoice No.
                  </p>
                  <p className="font-bold text-base">{invoice.billingNumber}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm uppercase text-gray-500 mb-1">
                    Date
                  </p>
                  <p className="font-bold text-base">
                    {formatDate(invoice.createdAt)}
                  </p>
                </div>
              </div>

              {client && (
                <div className="mb-6 p-3 bg-gray-50 rounded border border-gray-200">
                  <p className="font-semibold text-xs uppercase text-gray-500 mb-2">
                    Billed To
                  </p>
                  <p className="font-bold text-sm">{client.name}</p>
                  <p className="text-sm text-gray-600">{client.mobile}</p>
                  {client.address && (
                    <p className="text-sm text-gray-600">{client.address}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Client Ref: {client.billingNumber}
                  </p>
                </div>
              )}

              {rooms?.map((room: Room) => (
                <PrintRoomSection key={room.id.toString()} room={room} />
              ))}

              <div className="border-t-2 border-gray-800 pt-3 mt-6 flex justify-between items-center">
                <span className="font-bold text-base">GRAND TOTAL</span>
                <span className="font-bold text-xl">
                  {formatINR(Number(invoice.grandTotal))}
                </span>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
                <p>Generated by Civil Invoice Manager</p>
                <p className="mt-0.5">Thank you for your business!</p>
              </div>
            </div>
          </>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete invoice {invoice?.billingNumber} and
              all its items. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="invoice_detail.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteInvoice.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
