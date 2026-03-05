import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, ImagePlus, Loader2, Save, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import AppLayout from "../components/AppLayout";
import { getCompanyProfile, saveCompanyProfile } from "../utils/companyProfile";

export default function SettingsPage() {
  const profile = getCompanyProfile();
  const [name, setName] = useState(profile.name);
  const [address, setAddress] = useState(profile.address);
  const [logo, setLogo] = useState(profile.logo);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") {
        setLogo(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogo("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = () => {
    setIsSaving(true);
    try {
      saveCompanyProfile({ name: name.trim(), address: address.trim(), logo });
      toast.success("Company profile saved");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppLayout title="Settings">
      <div className="p-4 space-y-6 animate-fade-up">
        {/* Section header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-base text-foreground">
              Company Profile
            </h2>
            <p className="text-muted-foreground text-xs">
              This information will appear on your invoices
            </p>
          </div>
        </div>

        {/* Company Logo */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Company Logo</Label>
          {logo ? (
            <div
              data-ocid="settings.logo_preview"
              className="relative inline-flex items-center gap-3 p-3 bg-card border border-border/60 rounded-xl"
            >
              <img
                src={logo}
                alt="Company logo"
                className="h-12 w-auto max-w-[120px] object-contain rounded-lg"
              />
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-muted-foreground">
                  Logo uploaded
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    data-ocid="settings.logo_upload_button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-1"
                  >
                    <ImagePlus className="h-3 w-3" />
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="text-xs text-destructive hover:text-destructive/80 font-medium transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              data-ocid="settings.logo_upload_button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-24 border-2 border-dashed border-border/60 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary"
            >
              <ImagePlus className="h-6 w-6" />
              <span className="text-sm font-medium">Upload Logo</span>
              <span className="text-xs">PNG, JPG up to 2MB</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoChange}
          />
        </div>

        {/* Company Name */}
        <div className="space-y-1.5">
          <Label htmlFor="company-name" className="text-sm font-medium">
            Company Name
          </Label>
          <Input
            id="company-name"
            data-ocid="settings.company_name_input"
            placeholder="e.g., Sharma Civil Contractors"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11"
          />
        </div>

        {/* Company Address */}
        <div className="space-y-1.5">
          <Label htmlFor="company-address" className="text-sm font-medium">
            Company Address
          </Label>
          <Textarea
            id="company-address"
            data-ocid="settings.company_address_textarea"
            placeholder="e.g., 123, Main Street, Mumbai, Maharashtra - 400001"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Preview */}
        {(name || address || logo) && (
          <div className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Invoice Preview
            </p>
            {logo && (
              <img
                src={logo}
                alt="Company logo preview"
                className="h-10 w-auto object-contain mb-2"
              />
            )}
            {name && (
              <p className="font-display font-bold text-foreground">{name}</p>
            )}
            {address && (
              <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                {address}
              </p>
            )}
          </div>
        )}

        {/* Save button */}
        <Button
          data-ocid="settings.save_button"
          onClick={handleSave}
          className="w-full h-11 font-semibold"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </AppLayout>
  );
}
