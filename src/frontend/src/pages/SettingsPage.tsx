import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  Save,
  Trash2,
  UserCog,
  UserPlus,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import AppLayout from "../components/AppLayout";
import {
  type UserAccount,
  addUser,
  deleteUser,
  getUsers,
  isAdmin,
  updateUser,
} from "../utils/auth";
import { getCompanyProfile, saveCompanyProfile } from "../utils/companyProfile";

// ─── User Management ──────────────────────────────────────────────────────────

interface EditState {
  username: string;
  password: string;
  showPassword: boolean;
}

function UserManagementSection() {
  const [users, setUsers] = useState<UserAccount[]>(() =>
    getUsers().filter((u) => u.role !== "admin"),
  );

  // Add-user form state
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Per-row edit state: key = original username
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>({
    username: "",
    password: "",
    showPassword: false,
  });

  // Confirm-delete state
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const refreshUsers = () => {
    setUsers(getUsers().filter((u) => u.role !== "admin"));
  };

  const handleStartEdit = (user: UserAccount) => {
    setEditingRow(user.username);
    setEditState({
      username: user.username,
      password: user.password,
      showPassword: false,
    });
    setConfirmDelete(null);
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditState({ username: "", password: "", showPassword: false });
  };

  const handleSaveEdit = (originalUsername: string) => {
    if (!editState.username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    if (!editState.password.trim()) {
      toast.error("Password cannot be empty");
      return;
    }
    const result = updateUser(
      originalUsername,
      editState.username.trim(),
      editState.password.trim(),
    );
    if (result.ok) {
      toast.success("User updated successfully");
      handleCancelEdit();
      refreshUsers();
    } else {
      toast.error(result.error ?? "Failed to update user");
    }
  };

  const handleDeleteConfirm = (username: string) => {
    const result = deleteUser(username);
    if (result.ok) {
      toast.success("User deleted");
      setConfirmDelete(null);
      refreshUsers();
    } else {
      toast.error(result.error ?? "Failed to delete user");
    }
  };

  const handleAddUser = () => {
    if (!newUsername.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    if (!newPassword.trim()) {
      toast.error("Password cannot be empty");
      return;
    }
    setIsAdding(true);
    const result = addUser(newUsername.trim(), newPassword.trim());
    setIsAdding(false);
    if (result.ok) {
      toast.success(`User "${newUsername.trim()}" added`);
      setNewUsername("");
      setNewPassword("");
      setShowNewPassword(false);
      refreshUsers();
    } else {
      toast.error(result.error ?? "Failed to add user");
    }
  };

  return (
    <section data-ocid="user_mgmt.section" className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <UserCog className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-base text-foreground">
            User Management
          </h2>
          <p className="text-muted-foreground text-xs">
            Add, edit, or remove regular user accounts
          </p>
        </div>
      </div>

      {/* User list */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        {users.length === 0 ? (
          <div
            data-ocid="user_mgmt.empty_state"
            className="py-10 text-center text-muted-foreground text-sm"
          >
            No regular users yet. Add one below.
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
            {users.map((user, idx) => {
              const rowNum = idx + 1;
              const isEditing = editingRow === user.username;
              const isConfirmingDelete = confirmDelete === user.username;

              return (
                <li
                  key={user.username}
                  data-ocid={`user_mgmt.item.${rowNum}`}
                  className="px-4 py-3 space-y-3"
                >
                  {/* User row header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary uppercase">
                          {user.username.slice(0, 2)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Regular User
                        </p>
                      </div>
                    </div>

                    {!isEditing && !isConfirmingDelete && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          data-ocid={`user_mgmt.edit_button.${rowNum}`}
                          onClick={() => handleStartEdit(user)}
                          className="h-8 px-3 text-xs"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          data-ocid={`user_mgmt.delete_button.${rowNum}`}
                          onClick={() => setConfirmDelete(user.username)}
                          className="h-8 px-3 text-xs text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Inline edit form */}
                  {isEditing && (
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Username</Label>
                        <Input
                          data-ocid={`user_mgmt.edit_username_input.${rowNum}`}
                          value={editState.username}
                          onChange={(e) =>
                            setEditState((prev) => ({
                              ...prev,
                              username: e.target.value,
                            }))
                          }
                          placeholder="Username"
                          className="h-9 text-sm"
                          autoFocus
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Password</Label>
                        <div className="relative">
                          <Input
                            data-ocid={`user_mgmt.edit_password_input.${rowNum}`}
                            type={editState.showPassword ? "text" : "password"}
                            value={editState.password}
                            onChange={(e) =>
                              setEditState((prev) => ({
                                ...prev,
                                password: e.target.value,
                              }))
                            }
                            placeholder="New password"
                            className="h-9 text-sm pr-10"
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                handleSaveEdit(user.username);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setEditState((prev) => ({
                                ...prev,
                                showPassword: !prev.showPassword,
                              }))
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {editState.showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          data-ocid={`user_mgmt.save_button.${rowNum}`}
                          onClick={() => handleSaveEdit(user.username)}
                          className="h-8 px-4 text-xs font-semibold"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          data-ocid={`user_mgmt.cancel_button.${rowNum}`}
                          onClick={handleCancelEdit}
                          className="h-8 px-4 text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Confirm delete */}
                  {isConfirmingDelete && (
                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 space-y-2">
                      <p className="text-xs text-destructive font-medium">
                        Delete user "{user.username}"? This cannot be undone.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          data-ocid="user_mgmt.confirm_button"
                          onClick={() => handleDeleteConfirm(user.username)}
                          className="h-8 px-4 text-xs font-semibold"
                        >
                          Delete
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          data-ocid={`user_mgmt.cancel_button.${rowNum}`}
                          onClick={() => setConfirmDelete(null)}
                          className="h-8 px-4 text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Add new user form */}
      <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <UserPlus className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">Add New User</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="new-username" className="text-xs font-medium">
              Username
            </Label>
            <Input
              id="new-username"
              data-ocid="user_mgmt.add_username_input"
              placeholder="e.g., Ramesh"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-password" className="text-xs font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                data-ocid="user_mgmt.add_password_input"
                type={showNewPassword ? "text" : "password"}
                placeholder="Set a password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-10 pr-10"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddUser();
                }}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
        <Button
          data-ocid="user_mgmt.add_button"
          onClick={handleAddUser}
          disabled={isAdding}
          className="w-full h-10 font-semibold text-sm"
        >
          {isAdding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </>
          )}
        </Button>
      </div>
    </section>
  );
}

// ─── Settings Page ─────────────────────────────────────────────────────────────

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

        {/* User Management – admin only */}
        {isAdmin() && (
          <>
            <Separator className="my-2" />
            <UserManagementSection />
          </>
        )}
      </div>
    </AppLayout>
  );
}
