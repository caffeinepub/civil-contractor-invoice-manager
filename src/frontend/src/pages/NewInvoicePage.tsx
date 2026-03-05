import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Home,
  IndianRupee,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Client } from "../backend.d";
import AppLayout from "../components/AppLayout";
import {
  useCreateInvoice,
  useCreateItem,
  useCreateRoom,
  useGetAllClients,
} from "../hooks/useQueries";
import { formatINR } from "../utils/format";

// ── Types ─────────────────────────────────────────────────────────────────

interface LocalItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

interface LocalRoom {
  id: string;
  name: string;
  items: LocalItem[];
}

// ── Constants ─────────────────────────────────────────────────────────────

const PREDEFINED_ROOMS = [
  "Bathroom",
  "Kitchen",
  "Living Room",
  "Master Bedroom",
  "Kids Bedroom",
  "Terrace",
  "Balcony",
];

const UNITS = [
  "sq ft",
  "sq mt",
  "feet",
  "meters",
  "units",
  "running ft",
  "running mt",
];

// ── Step Indicator ─────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: number }) {
  const steps = ["Client", "Rooms", "Items", "Review"];
  return (
    <div className="flex items-center px-4 pt-3 pb-1">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isCompleted = step > stepNum;
        const isActive = step === stepNum;
        return (
          <div key={label} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : isActive
                      ? "bg-primary/20 text-primary border-2 border-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : stepNum}
              </div>
              <span
                className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 -mt-4 rounded-full ${step > stepNum ? "bg-primary" : "bg-muted"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Item Form Dialog ──────────────────────────────────────────────────────

interface ItemFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (item: Omit<LocalItem, "id">) => void;
  editItem?: LocalItem;
}

function ItemFormDialog({
  open,
  onClose,
  onSave,
  editItem,
}: ItemFormDialogProps) {
  const [description, setDescription] = useState(editItem?.description ?? "");
  const [quantity, setQuantity] = useState(
    editItem?.quantity?.toString() ?? "",
  );
  const [unit, setUnit] = useState(editItem?.unit ?? "sq ft");
  const [rate, setRate] = useState(editItem?.rate?.toString() ?? "");

  const qtyNum = Number.parseFloat(quantity) || 0;
  const rateNum = Number.parseFloat(rate) || 0;
  const amount = qtyNum * rateNum;

  // Reset fields when dialog opens fresh (no editItem)
  const handleOpen = () => {
    if (!editItem) {
      setDescription("");
      setQuantity("");
      setUnit("sq ft");
      setRate("");
    }
  };

  const handleSave = () => {
    if (!description.trim() || qtyNum <= 0 || rateNum <= 0) {
      toast.error("Please fill in all fields with valid values");
      return;
    }
    onSave({
      description: description.trim(),
      quantity: qtyNum,
      unit,
      rate: rateNum,
      amount,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (v) handleOpen();
        else onClose();
      }}
    >
      <DialogContent className="max-w-[360px] mx-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {editItem ? "Edit Item" : "Add Item"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Description</Label>
            <Input
              data-ocid="items.description_input"
              placeholder="e.g., Floor tiling work"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Quantity</Label>
              <Input
                data-ocid="items.quantity_input"
                type="number"
                placeholder="0"
                min="0"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger data-ocid="items.unit_select" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Rate (₹)</Label>
            <Input
              data-ocid="items.rate_input"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="h-10"
            />
          </div>
          {amount > 0 && (
            <div className="bg-primary/5 rounded-lg p-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">
                Amount
              </span>
              <span className="font-display font-bold text-primary">
                {formatINR(amount)}
              </span>
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            data-ocid="items.save_button"
            onClick={handleSave}
            className="flex-1 font-semibold"
          >
            {editItem ? "Update" : "Add Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function NewInvoicePage() {
  const navigate = useNavigate();
  const { data: clients, isLoading: clientsLoading } = useGetAllClients();
  const createInvoice = useCreateInvoice();
  const createRoom = useCreateRoom();
  const createItem = useCreateItem();

  const [step, setStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [rooms, setRooms] = useState<LocalRoom[]>([]);
  const [customRoomName, setCustomRoomName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Item dialog state
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<LocalItem | undefined>();

  // ── Room helpers ──

  const getRoomCount = (baseName: string) =>
    rooms.filter(
      (r) => r.name === baseName || r.name.startsWith(`${baseName} `),
    ).length;

  const addPredefinedRoom = (baseName: string) => {
    const count = getRoomCount(baseName);
    const name = count === 0 ? baseName : `${baseName} ${count + 1}`;
    setRooms((prev) => [...prev, { id: crypto.randomUUID(), name, items: [] }]);
  };

  const addCustomRoom = () => {
    const trimmed = customRoomName.trim();
    if (!trimmed) return;
    setRooms((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: trimmed, items: [] },
    ]);
    setCustomRoomName("");
  };

  const deleteRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
  };

  // ── Item helpers ──

  const openAddItem = (roomId: string) => {
    setActiveRoomId(roomId);
    setEditingItem(undefined);
    setItemDialogOpen(true);
  };

  const openEditItem = (roomId: string, item: LocalItem) => {
    setActiveRoomId(roomId);
    setEditingItem(item);
    setItemDialogOpen(true);
  };

  const handleSaveItem = (itemData: Omit<LocalItem, "id">) => {
    if (!activeRoomId) return;
    setRooms((prev) =>
      prev.map((room) => {
        if (room.id !== activeRoomId) return room;
        if (editingItem) {
          return {
            ...room,
            items: room.items.map((it) =>
              it.id === editingItem.id ? { ...itemData, id: it.id } : it,
            ),
          };
        }
        return {
          ...room,
          items: [...room.items, { ...itemData, id: crypto.randomUUID() }],
        };
      }),
    );
  };

  const deleteItem = (roomId: string, itemId: string) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId
          ? { ...r, items: r.items.filter((it) => it.id !== itemId) }
          : r,
      ),
    );
  };

  // ── Grand total ──

  const grandTotal = rooms.reduce(
    (sum, room) => sum + room.items.reduce((s, it) => s + it.amount, 0),
    0,
  );

  // ── Save invoice ──

  const handleSaveInvoice = async () => {
    if (!selectedClient) return;
    setIsSaving(true);
    try {
      const invoiceId = await createInvoice.mutateAsync(selectedClient.id);

      for (const room of rooms) {
        const roomId = await createRoom.mutateAsync({
          invoiceId,
          name: room.name,
        });
        for (const item of room.items) {
          await createItem.mutateAsync({
            roomId,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            rate: item.rate,
          });
        }
      }

      toast.success("Invoice created successfully!");
      void navigate({ to: `/invoices/${invoiceId.toString()}` });
    } catch {
      toast.error("Failed to save invoice. Please try again.");
      setIsSaving(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <AppLayout title="New Invoice" showBack>
      <div className="animate-fade-up">
        <StepIndicator step={step} />

        {/* Step 1 — Select Client */}
        {step === 1 && (
          <div className="p-4 space-y-4">
            <div>
              <h2 className="font-display font-semibold text-base text-foreground mb-1">
                Select Client
              </h2>
              <p className="text-muted-foreground text-sm">
                Choose the client for this invoice
              </p>
            </div>

            {clientsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            ) : !clients || clients.length === 0 ? (
              <Card className="border-dashed border-border/60">
                <CardContent className="p-6 text-center">
                  <User className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">
                    No clients found. Add a client first.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void navigate({ to: "/clients/new" })}
                  >
                    Add Client
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Client</Label>
                  <Select
                    value={selectedClient?.id.toString() ?? ""}
                    onValueChange={(val) => {
                      const c = clients.find((cl) => cl.id.toString() === val);
                      setSelectedClient(c ?? null);
                    }}
                  >
                    <SelectTrigger
                      data-ocid="new_invoice.client_select"
                      className="h-11"
                    >
                      <SelectValue placeholder="Choose a client..." />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem
                          key={c.id.toString()}
                          value={c.id.toString()}
                        >
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedClient && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <span className="font-display font-bold text-primary-foreground text-sm">
                            {selectedClient.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground text-sm">
                            {selectedClient.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {selectedClient.mobile}
                          </p>
                          {selectedClient.address && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {selectedClient.address}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            <Button
              data-ocid="new_invoice.next_button"
              onClick={() => setStep(2)}
              disabled={!selectedClient}
              className="w-full h-11 font-semibold"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 2 — Add Rooms */}
        {step === 2 && (
          <div className="p-4 space-y-4">
            <div>
              <h2 className="font-display font-semibold text-base text-foreground mb-1">
                Add Rooms
              </h2>
              <p className="text-muted-foreground text-sm">
                Select rooms to include in the invoice
              </p>
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                Quick Add Rooms
              </Label>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_ROOMS.map((room) => {
                  const count = getRoomCount(room);
                  return (
                    <button
                      key={room}
                      type="button"
                      data-ocid="new_invoice.add_room_button"
                      onClick={() => addPredefinedRoom(room)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card hover:bg-accent hover:border-primary/30 transition-colors text-sm font-medium"
                    >
                      <Plus className="h-3.5 w-3.5 text-primary" />
                      {room}
                      {count > 0 && (
                        <Badge
                          variant="secondary"
                          className="h-4 px-1 text-[10px] ml-0.5"
                        >
                          {count}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                Custom Room
              </Label>
              <div className="flex gap-2">
                <Input
                  data-ocid="new_invoice.custom_room_input"
                  placeholder="e.g., Store Room, Garage..."
                  value={customRoomName}
                  onChange={(e) => setCustomRoomName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomRoom()}
                  className="flex-1 h-10"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={addCustomRoom}
                  disabled={!customRoomName.trim()}
                  className="h-10 w-10 flex-shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {rooms.length > 0 && (
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                  Added Rooms ({rooms.length})
                </Label>
                <div data-ocid="new_invoice.rooms_list" className="space-y-2">
                  {rooms.map((room, i) => (
                    <div
                      key={room.id}
                      data-ocid={`new_invoice.room_item.${i + 1}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/60"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Home className="h-4 w-4 text-primary" />
                      </div>
                      <span className="flex-1 text-sm font-medium text-foreground">
                        {room.name}
                      </span>
                      <button
                        type="button"
                        data-ocid={`new_invoice.delete_room_button.${i + 1}`}
                        onClick={() => deleteRoom(room.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label={`Remove ${room.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 h-11"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                data-ocid="new_invoice.next_button"
                onClick={() => setStep(3)}
                disabled={rooms.length === 0}
                className="flex-1 h-11 font-semibold"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3 — Add Items */}
        {step === 3 && (
          <div className="p-4 space-y-4">
            <div>
              <h2 className="font-display font-semibold text-base text-foreground mb-1">
                Add Items
              </h2>
              <p className="text-muted-foreground text-sm">
                Add line items for each room
              </p>
            </div>

            <Accordion
              type="multiple"
              defaultValue={rooms.map((r) => r.id)}
              className="space-y-2"
            >
              {rooms.map((room) => {
                const subtotal = room.items.reduce((s, it) => s + it.amount, 0);
                return (
                  <AccordionItem
                    key={room.id}
                    value={room.id}
                    className="border border-border/60 rounded-xl overflow-hidden bg-card shadow-card"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <div className="flex items-center gap-2 flex-1 text-left">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Home className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-foreground">
                            {room.name}
                          </p>
                          {subtotal > 0 && (
                            <p className="text-xs text-primary font-medium">
                              {formatINR(subtotal)}
                            </p>
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs mr-2">
                          {room.items.length} item
                          {room.items.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      {room.items.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-2">
                          No items added yet.
                        </p>
                      ) : (
                        <div className="space-y-2 mb-3">
                          {room.items.map((item, idx) => (
                            <div
                              key={item.id}
                              className="flex items-start gap-2 p-2.5 bg-muted/40 rounded-lg"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {item.description}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {item.quantity} {item.unit} ×{" "}
                                  {formatINR(item.rate)}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <span className="font-semibold text-sm text-foreground">
                                  {formatINR(item.amount)}
                                </span>
                                <button
                                  type="button"
                                  data-ocid={`items.edit_button.${idx + 1}`}
                                  onClick={() => openEditItem(room.id, item)}
                                  className="p-1 text-muted-foreground hover:text-primary transition-colors"
                                  aria-label="Edit item"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  data-ocid={`items.delete_button.${idx + 1}`}
                                  onClick={() => deleteItem(room.id, item.id)}
                                  className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                                  aria-label="Delete item"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                          <div className="flex justify-between items-center pt-1 px-1">
                            <span className="text-xs font-medium text-muted-foreground">
                              Subtotal
                            </span>
                            <span className="text-sm font-bold text-foreground">
                              {formatINR(subtotal)}
                            </span>
                          </div>
                        </div>
                      )}
                      <Button
                        data-ocid="items.add_button"
                        variant="outline"
                        size="sm"
                        onClick={() => openAddItem(room.id)}
                        className="w-full h-9 border-dashed text-primary hover:text-primary hover:bg-primary/5 hover:border-primary"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        Add Item
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>

            {/* Grand total */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-primary" />
                  <span className="font-display font-semibold text-foreground text-sm">
                    Grand Total
                  </span>
                </div>
                <span className="font-display font-bold text-primary text-lg">
                  {formatINR(grandTotal)}
                </span>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="flex-1 h-11"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                data-ocid="new_invoice.next_button"
                onClick={() => setStep(4)}
                className="flex-1 h-11 font-semibold"
              >
                Review
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4 — Review & Save */}
        {step === 4 && (
          <div className="p-4 space-y-4">
            <div>
              <h2 className="font-display font-semibold text-base text-foreground mb-1">
                Review &amp; Save
              </h2>
              <p className="text-muted-foreground text-sm">
                Review your invoice before saving
              </p>
            </div>

            <Card className="shadow-card border-border/60">
              <CardHeader className="px-4 py-3 pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Client
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="font-semibold text-foreground">
                  {selectedClient?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedClient?.mobile}
                </p>
                {selectedClient?.address && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {selectedClient.address}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-card border-border/60">
              <CardHeader className="px-4 py-3 pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Rooms &amp; Items
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-3">
                {rooms.map((room) => {
                  const subtotal = room.items.reduce(
                    (s, it) => s + it.amount,
                    0,
                  );
                  return (
                    <div key={room.id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-foreground">
                          {room.name}
                        </span>
                        <span className="text-sm font-bold text-foreground">
                          {formatINR(subtotal)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {room.items.length} item
                        {room.items.length !== 1 ? "s" : ""}
                      </p>
                      <Separator className="mt-2" />
                    </div>
                  );
                })}
                <div className="flex justify-between items-center pt-1">
                  <span className="font-display font-bold text-foreground">
                    Grand Total
                  </span>
                  <span className="font-display font-bold text-primary text-lg">
                    {formatINR(grandTotal)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(3)}
                className="flex-1 h-11"
                disabled={isSaving}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                data-ocid="new_invoice.save_button"
                onClick={handleSaveInvoice}
                className="flex-1 h-11 font-semibold"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Invoice"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Item form dialog */}
      <ItemFormDialog
        open={itemDialogOpen}
        onClose={() => {
          setItemDialogOpen(false);
          setEditingItem(undefined);
        }}
        onSave={handleSaveItem}
        editItem={editingItem}
      />
    </AppLayout>
  );
}
