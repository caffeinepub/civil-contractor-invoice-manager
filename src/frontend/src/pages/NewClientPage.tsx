import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AppLayout from "../components/AppLayout";
import { useActor } from "../hooks/useActor";
import { useCreateClient } from "../hooks/useQueries";

export default function NewClientPage() {
  const navigate = useNavigate();
  const { actor, isFetching: actorLoading } = useActor();
  const createClient = useCreateClient();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");

  const isReady = !!actor && !actorLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) {
      toast.error("Name and mobile number are required");
      return;
    }
    if (!isReady) {
      toast.error("App is still loading. Please wait a moment and try again.");
      return;
    }

    try {
      await createClient.mutateAsync({
        name: name.trim(),
        mobile: mobile.trim(),
        address: address.trim(),
      });
      toast.success("Client added successfully");
      void navigate({ to: "/clients" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to add client.";
      toast.error(msg);
    }
  };

  return (
    <AppLayout title="Add Client" showBack>
      <div className="p-4 animate-fade-up">
        <Card className="shadow-card border-border/60">
          <CardContent className="p-4">
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
                  disabled={createClient.isPending}
                >
                  Cancel
                </Button>
                <Button
                  data-ocid="client_form.submit_button"
                  type="submit"
                  className="flex-1 h-11 font-semibold"
                  disabled={createClient.isPending || !isReady}
                >
                  {createClient.isPending || actorLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {actorLoading ? "Loading..." : "Saving..."}
                    </>
                  ) : (
                    "Save Client"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
