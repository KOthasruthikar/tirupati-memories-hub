import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AccessRequest {
  id: string;
  requester_uid: string;
  owner_uid: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Get all access requests for an owner (incoming requests)
export const useIncomingAccessRequests = (ownerUid: string) => {
  return useQuery({
    queryKey: ["access-requests-incoming", ownerUid],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("access_requests")
        .select("*, requester:members!access_requests_requester_uid_fkey(uid, name, profile_image)")
        .eq("owner_uid", ownerUid)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!ownerUid,
  });
};

// Get all access requests made by a user (outgoing requests)
export const useOutgoingAccessRequests = (requesterUid: string) => {
  return useQuery({
    queryKey: ["access-requests-outgoing", requesterUid],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("access_requests")
        .select("*, owner:members!access_requests_owner_uid_fkey(uid, name, profile_image)")
        .eq("requester_uid", requesterUid)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!requesterUid,
  });
};

// Check if user has access to view another user's images
export const useHasAccess = (requesterUid: string, ownerUid: string) => {
  return useQuery({
    queryKey: ["has-access", requesterUid, ownerUid],
    queryFn: async () => {
      // Self always has access
      if (requesterUid === ownerUid) return true;
      
      const { data, error } = await supabase
        .from("access_requests")
        .select("status")
        .eq("requester_uid", requesterUid)
        .eq("owner_uid", ownerUid)
        .eq("status", "approved")
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return !!data;
    },
    enabled: !!requesterUid && !!ownerUid,
  });
};

// Get access request status between two users
export const useAccessRequestStatus = (requesterUid: string, ownerUid: string) => {
  return useQuery({
    queryKey: ["access-request-status", requesterUid, ownerUid],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("access_requests")
        .select("*")
        .eq("requester_uid", requesterUid)
        .eq("owner_uid", ownerUid)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data as AccessRequest | null;
    },
    enabled: !!requesterUid && !!ownerUid,
  });
};

// Request access to view someone's images
export const useRequestAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requesterUid,
      ownerUid,
      requesterName,
    }: {
      requesterUid: string;
      ownerUid: string;
      requesterName: string;
    }) => {
      const { data, error } = await supabase
        .from("access_requests")
        .insert({
          requester_uid: requesterUid,
          owner_uid: ownerUid,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      // Send email notification (non-blocking)
      supabase.functions.invoke("send-access-notification", {
        body: { requesterUid, ownerUid, requesterName },
      }).catch((err) => console.error("Failed to send notification:", err));

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["access-request-status", variables.requesterUid, variables.ownerUid],
      });
      queryClient.invalidateQueries({
        queryKey: ["access-requests-outgoing", variables.requesterUid],
      });
    },
  });
};

// Update access request status (approve/deny)
export const useUpdateAccessRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      status,
    }: {
      requestId: string;
      status: "approved" | "denied";
    }) => {
      const { data, error } = await supabase
        .from("access_requests")
        .update({ status })
        .eq("id", requestId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access-requests-incoming"] });
      queryClient.invalidateQueries({ queryKey: ["has-access"] });
    },
  });
};

// Delete access request
export const useDeleteAccessRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from("access_requests")
        .delete()
        .eq("id", requestId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access-requests-incoming"] });
      queryClient.invalidateQueries({ queryKey: ["access-requests-outgoing"] });
      queryClient.invalidateQueries({ queryKey: ["has-access"] });
    },
  });
};
