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
import { getCompanyProfile } from "../utils/companyProfile";
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

function PrintRoomSection({
  room,
  startIndex,
}: { room: Room; startIndex: number }) {
  const { data: items } = useGetItemsByRoomId(room.id);

  return (
    <div className="print-room-section mb-4">
      <h3
        style={{
          fontWeight: 700,
          fontSize: "10pt",
          borderBottom: "1.5px solid #374151",
          paddingBottom: "3pt",
          marginBottom: "4pt",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {room.name}
      </h3>
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt" }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#f9fafb",
              borderBottom: "1px solid #d1d5db",
            }}
          >
            <th
              style={{
                textAlign: "left",
                padding: "4pt 5pt",
                fontWeight: 600,
                width: "28pt",
              }}
            >
              Sr.
            </th>
            <th
              style={{ textAlign: "left", padding: "4pt 5pt", fontWeight: 600 }}
            >
              Description
            </th>
            <th
              style={{
                textAlign: "right",
                padding: "4pt 5pt",
                fontWeight: 600,
                width: "36pt",
              }}
            >
              Qty
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "4pt 5pt",
                fontWeight: 600,
                width: "48pt",
              }}
            >
              Unit
            </th>
            <th
              style={{
                textAlign: "right",
                padding: "4pt 5pt",
                fontWeight: 600,
                width: "56pt",
              }}
            >
              Rate (₹)
            </th>
            <th
              style={{
                textAlign: "right",
                padding: "4pt 5pt",
                fontWeight: 600,
                width: "60pt",
              }}
            >
              Amount (₹)
            </th>
          </tr>
        </thead>
        <tbody>
          {(items ?? []).map((item: Item, idx) => (
            <tr
              key={item.id.toString()}
              style={{
                borderBottom: "1px solid #e5e7eb",
                backgroundColor: idx % 2 === 0 ? "#fff" : "#f9fafb",
              }}
            >
              <td style={{ padding: "3pt 5pt", color: "#6b7280" }}>
                {startIndex + idx}
              </td>
              <td style={{ padding: "3pt 5pt" }}>{item.description}</td>
              <td style={{ textAlign: "right", padding: "3pt 5pt" }}>
                {item.quantity}
              </td>
              <td style={{ padding: "3pt 5pt", color: "#6b7280" }}>
                {item.unit}
              </td>
              <td style={{ textAlign: "right", padding: "3pt 5pt" }}>
                {formatINR(item.rate)}
              </td>
              <td
                style={{
                  textAlign: "right",
                  padding: "3pt 5pt",
                  fontWeight: 600,
                }}
              >
                {formatINR(item.amount)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr
            style={{
              borderTop: "1.5px solid #374151",
              backgroundColor: "#f3f4f6",
            }}
          >
            <td
              colSpan={5}
              style={{
                textAlign: "right",
                padding: "4pt 5pt",
                fontWeight: 600,
                fontSize: "9pt",
              }}
            >
              Room Subtotal:
            </td>
            <td
              style={{
                textAlign: "right",
                padding: "4pt 5pt",
                fontWeight: 700,
                fontSize: "9pt",
              }}
            >
              {formatINR(room.subtotal)}
            </td>
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
  const companyProfile = getCompanyProfile();
  const hasCompanyInfo = !!(companyProfile.name || companyProfile.logo);

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
              {/* Company header card */}
              {hasCompanyInfo && (
                <Card className="shadow-card border-border/60 bg-gradient-to-br from-primary/5 to-background">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      {companyProfile.logo && (
                        <img
                          src={companyProfile.logo}
                          alt="Company logo"
                          className="h-12 w-auto max-w-[80px] object-contain rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        {companyProfile.name && (
                          <p className="font-display font-bold text-foreground text-base leading-tight">
                            {companyProfile.name}
                          </p>
                        )}
                        {companyProfile.address && (
                          <p className="text-xs text-muted-foreground mt-0.5 whitespace-pre-wrap line-clamp-3">
                            {companyProfile.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

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

            {/* ── Print-only view (A4) ── */}
            <div
              className="print-invoice hidden print:block"
              style={{ fontFamily: "Arial, sans-serif", color: "#000" }}
            >
              {/* Company header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12pt",
                  marginBottom: "10pt",
                  paddingBottom: "8pt",
                  borderBottom: "2px solid #111827",
                }}
              >
                {companyProfile.logo && (
                  <img
                    src={companyProfile.logo}
                    alt="Company logo"
                    style={{
                      height: "52pt",
                      width: "auto",
                      objectFit: "contain",
                      flexShrink: 0,
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  {companyProfile.name ? (
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "16pt",
                        lineHeight: 1.2,
                      }}
                    >
                      {companyProfile.name}
                    </div>
                  ) : (
                    <div style={{ fontWeight: 700, fontSize: "16pt" }}>
                      CIVIL CONTRACTOR
                    </div>
                  )}
                  {companyProfile.address && (
                    <div
                      style={{
                        fontSize: "8.5pt",
                        color: "#4b5563",
                        marginTop: "2pt",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {companyProfile.address}
                    </div>
                  )}
                  {!companyProfile.address && (
                    <div style={{ fontSize: "8.5pt", color: "#6b7280" }}>
                      Professional Construction &amp; Civil Work
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div
                    style={{
                      fontSize: "20pt",
                      fontWeight: 800,
                      color: "#111827",
                      letterSpacing: "-0.5pt",
                    }}
                  >
                    INVOICE
                  </div>
                  <div
                    style={{
                      fontSize: "9pt",
                      color: "#6b7280",
                      marginTop: "2pt",
                    }}
                  >
                    #{invoice.billingNumber}
                  </div>
                </div>
              </div>

              {/* Invoice meta + Billed To */}
              <div
                style={{ display: "flex", gap: "16pt", marginBottom: "10pt" }}
              >
                {/* Billed To */}
                {client && (
                  <div
                    style={{
                      flex: 1,
                      padding: "8pt",
                      backgroundColor: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: "4pt",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "7pt",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "#6b7280",
                        marginBottom: "4pt",
                      }}
                    >
                      Billed To
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "10pt" }}>
                      {client.name}
                    </div>
                    <div
                      style={{
                        fontSize: "8.5pt",
                        color: "#4b5563",
                        marginTop: "2pt",
                      }}
                    >
                      {client.mobile}
                    </div>
                    {client.address && (
                      <div
                        style={{
                          fontSize: "8.5pt",
                          color: "#4b5563",
                          marginTop: "1pt",
                        }}
                      >
                        {client.address}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: "7.5pt",
                        color: "#9ca3af",
                        marginTop: "3pt",
                      }}
                    >
                      Client Ref: {client.billingNumber}
                    </div>
                  </div>
                )}
                {/* Invoice details */}
                <div
                  style={{
                    width: "140pt",
                    padding: "8pt",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "4pt",
                  }}
                >
                  <div
                    style={{
                      fontSize: "7pt",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "#6b7280",
                      marginBottom: "4pt",
                    }}
                  >
                    Invoice Details
                  </div>
                  <table
                    style={{
                      width: "100%",
                      fontSize: "8.5pt",
                      borderCollapse: "collapse",
                    }}
                  >
                    <tbody>
                      <tr>
                        <td
                          style={{
                            paddingBottom: "3pt",
                            color: "#6b7280",
                            width: "50%",
                          }}
                        >
                          Invoice No.
                        </td>
                        <td
                          style={{
                            paddingBottom: "3pt",
                            fontWeight: 600,
                            textAlign: "right",
                          }}
                        >
                          {invoice.billingNumber}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ paddingBottom: "3pt", color: "#6b7280" }}>
                          Date
                        </td>
                        <td
                          style={{
                            paddingBottom: "3pt",
                            fontWeight: 600,
                            textAlign: "right",
                          }}
                        >
                          {formatDate(invoice.createdAt)}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ color: "#6b7280" }}>Total Rooms</td>
                        <td style={{ fontWeight: 600, textAlign: "right" }}>
                          {rooms?.length ?? 0}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Room sections */}
              {(() => {
                let srCounter = 1;
                return rooms?.map((room: Room) => {
                  const itemCount = 0; // items loaded per room component
                  const section = (
                    <PrintRoomSection
                      key={room.id.toString()}
                      room={room}
                      startIndex={srCounter}
                    />
                  );
                  srCounter += itemCount;
                  return section;
                });
              })()}

              {/* Grand Total */}
              <div
                style={{
                  borderTop: "2px solid #111827",
                  marginTop: "8pt",
                  paddingTop: "6pt",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <table style={{ fontSize: "10pt", borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          paddingRight: "20pt",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Grand Total
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontWeight: 800,
                          fontSize: "13pt",
                        }}
                      >
                        {formatINR(Number(invoice.grandTotal))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div
                style={{
                  marginTop: "20pt",
                  paddingTop: "8pt",
                  borderTop: "1px solid #e5e7eb",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "7.5pt",
                  color: "#9ca3af",
                }}
              >
                <span>Generated by Civil Invoice Manager</span>
                <span>Thank you for your business!</span>
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
