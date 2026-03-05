import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AppLayout from "../components/AppLayout";
import { useGetClient, useUpdateClient } from "../hooks/useQueries";

export default function EditClientPage() {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false }) as { id?: string };
  const clientId = id ? BigInt(id) : null;

  const { data: client, isLoading } = useGetClient(clientId);
  const updateClient = useUpdateClient();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (client) {
      setName(client.name);
      setMobile(client.mobile);
      setAddress(client.address);
    }
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !name.trim() || !mobile.trim()) {
      toast.error("Name and mobile number are required");
      return;
    }

    try {
      await updateClient.mutateAsync({
        id: clientId,
        name: name.trim(),
        mobile: mobile.trim(),
        address: address.trim(),
      });
      toast.success("Client updated successfully");
      void navigate({ to: "/clients" });
    } catch {
      toast.error("Failed to update client. Please try again.");
    }
  };

  return (
    <AppLayout title="Edit Client" showBack>
      <div className="p-4 animate-fade-up">
        <Card className="shadow-card border-border/60">
          <CardContent className="p-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-11 w-full rounded-md" />
                <Skeleton className="h-11 w-full rounded-md" />
                <Skeleton className="h-20 w-full rounded-md" />
                <div className="flex gap-3">
                  <Skeleton className="flex-1 h-11 rounded-md" />
                  <Skeleton className="flex-1 h-11 rounded-md" />
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Client Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    data-ocid="client_form.name_input"
                    placeholder="e.g., Rajesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="mobile" className="text-sm font-medium">
                    Mobile Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="mobile"
                    data-ocid="client_form.mobile_input"
                    type="tel"
                    placeholder="e.g., 98765 43210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    data-ocid="client_form.address_textarea"
                    placeholder="e.g., 42, MG Road, Bangalore - 560001"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    data-ocid="client_form.cancel_button"
                    type="button"
                    variant="outline"
                    onClick={() => void navigate({ to: "/clients" })}
                    className="flex-1 h-11"
                    disabled={updateClient.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    data-ocid="client_form.submit_button"
                    type="submit"
                    className="flex-1 h-11 font-semibold"
                    disabled={updateClient.isPending}
                  >
                    {updateClient.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Client"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
