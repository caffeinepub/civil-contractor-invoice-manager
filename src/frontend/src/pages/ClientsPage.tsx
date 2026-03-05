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
import { Hash, MapPin, Pencil, Phone, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Client } from "../backend.d";
import AppLayout from "../components/AppLayout";
import { useDeleteClient, useGetAllClients } from "../hooks/useQueries";

function ClientCard({
  client,
  index,
  onEdit,
  onDelete,
}: {
  client: Client;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card
      data-ocid={`clients.item.${index}`}
      className="shadow-card border-border/60 card-hover"
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="font-display font-bold text-primary text-sm">
              {client.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display font-semibold text-foreground text-sm truncate">
                {client.name}
              </h3>
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-4 shrink-0"
              >
                <Hash className="h-2.5 w-2.5 mr-0.5" />
                {client.billingNumber}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Phone className="h-3 w-3 flex-shrink-0" />
                <span className="text-xs truncate">{client.mobile}</span>
              </div>
              {client.address && (
                <div className="flex items-start gap-1.5 text-muted-foreground">
                  <MapPin className="h-3 w-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs line-clamp-2">{client.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
          <Button
            data-ocid={`clients.edit_button.${index}`}
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1 h-8 text-xs"
          >
            <Pencil className="h-3 w-3 mr-1.5" />
            Edit
          </Button>
          <Button
            data-ocid={`clients.delete_button.${index}`}
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="flex-1 h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
          >
            <Trash2 className="h-3 w-3 mr-1.5" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ClientCardSkeleton() {
  return (
    <Card className="shadow-card border-border/60">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
        <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
          <Skeleton className="flex-1 h-8 rounded-md" />
          <Skeleton className="flex-1 h-8 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function ClientsPage() {
  const navigate = useNavigate();
  const { data: clients, isLoading } = useGetAllClients();
  const deleteClient = useDeleteClient();
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteClient.mutateAsync(deleteId);
      toast.success("Client deleted successfully");
    } catch {
      toast.error("Failed to delete client");
    } finally {
      setDeleteId(null);
    }
  };

  const addButton = (
    <Button
      data-ocid="clients.add_button"
      size="sm"
      onClick={() => void navigate({ to: "/clients/new" })}
      className="h-8 px-3 text-xs font-semibold"
    >
      <Plus className="h-3.5 w-3.5 mr-1" />
      Add
    </Button>
  );

  return (
    <AppLayout title="Clients" rightAction={addButton}>
      <div data-ocid="clients.page" className="p-4 space-y-3 animate-fade-up">
        {isLoading ? (
          <>
            <ClientCardSkeleton />
            <ClientCardSkeleton />
            <ClientCardSkeleton />
          </>
        ) : !clients || clients.length === 0 ? (
          <div
            data-ocid="clients.empty_state"
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-1">
              No Clients Yet
            </h3>
            <p className="text-muted-foreground text-sm mb-4 max-w-[200px]">
              Add your first client to start creating invoices
            </p>
            <Button
              onClick={() => void navigate({ to: "/clients/new" })}
              className="font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Client
            </Button>
          </div>
        ) : (
          <div data-ocid="clients.list" className="space-y-3">
            {clients.map((client, i) => (
              <ClientCard
                key={client.id.toString()}
                client={client}
                index={i + 1}
                onEdit={() =>
                  void navigate({ to: `/clients/${client.id.toString()}/edit` })
                }
                onDelete={() => setDeleteId(client.id)}
              />
            ))}
          </div>
        )}
      </div>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this client and all their invoices.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="clients.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="clients.confirm_button"
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
