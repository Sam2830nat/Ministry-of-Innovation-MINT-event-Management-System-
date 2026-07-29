import { useState } from "react";
import { UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CemsButton } from "@/components/cems/CemsButton";
import { Input } from "@/components/ui/input";
import { useRoles } from "@/features/permissions/api/getRoles";
import { useInviteUser } from "../api/inviteUser";

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteUserDialog({ open, onOpenChange }: InviteUserDialogProps) {
  const { data: roles } = useRoles();
  const { mutateAsync: inviteUser, isPending } = useInviteUser();
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !roleId) return;

    try {
      await inviteUser({ fullName, email, roleId });
      setFullName("");
      setEmail("");
      setRoleId("");
      onOpenChange(false);
    } catch (e) {
      // Error handled by the hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-xl overflow-hidden p-0 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="p-6 bg-brand/5 dark:bg-brand/10 border-b border-brand/10 dark:border-brand/20 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-sm mb-4 text-brand">
            <UserPlus size={24} />
          </div>
          <DialogTitle className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            Invite <span className="text-brand">User</span>
          </DialogTitle>
          <DialogDescription className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-2 max-w-xs mx-auto leading-relaxed">
            Invite a new user to the system. They will receive an email with instructions to set their password.
          </DialogDescription>
        </div>

        <div className="p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="John Doe"
                className="h-11 bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-950"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="john@example.com"
                type="email"
                className="h-11 bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-950"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                required
                className="flex h-11 w-full rounded-md border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900/50 dark:focus-visible:ring-brand"
              >
                <option value="">Select a role...</option>
                {roles?.map((r: any) => (
                  <option key={r.id} value={r.id}>
                    {r.roleName}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <CemsButton 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="h-11 font-black uppercase tracking-widest text-[11px]"
              >
                Cancel
              </CemsButton>
              <CemsButton 
                type="submit" 
                cemsVariant="brand"
                disabled={isPending}
                className="h-11 shadow-lg shadow-brand/20 font-black uppercase tracking-widest text-[11px] px-6"
              >
                {isPending ? "Inviting..." : "Send Invite"}
              </CemsButton>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
