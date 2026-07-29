import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { toast } from "sonner";

export interface InviteUserPayload {
  email: string;
  fullName: string;
  roleId: string;
}

export function useInviteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: InviteUserPayload) => {
      const res = await apiFetch("/api/users/invite", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to invite user");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User invited successfully", {
        description: "An invitation email has been sent to the user.",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to invite user", {
        description: error.message || "Please try again later.",
      });
    },
  });
}
