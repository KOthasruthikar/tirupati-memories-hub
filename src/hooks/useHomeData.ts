import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useHomeMembers = (limit: number = 4) => {
  return useQuery({
    queryKey: ["home-members", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select("uid, name, profile_image, role")
        .order("uid")
        .limit(limit);
      
      if (error) throw error;
      return data;
    },
  });
};

export const useHomeGallery = (limit: number = 8) => {
  return useQuery({
    queryKey: ["home-gallery", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("id, src, caption")
        .order("uploaded_at", { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    },
  });
};

export const useGalleryCount = () => {
  return useQuery({
    queryKey: ["gallery-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("gallery")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });
};

export const useMembersCount = () => {
  return useQuery({
    queryKey: ["members-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("members")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });
};
