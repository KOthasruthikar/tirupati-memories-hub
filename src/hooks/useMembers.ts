import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DbMember } from "@/types/database";

export const useMembers = () => {
  return useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("uid");
      
      if (error) throw error;
      return data as DbMember[];
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};

export const useMember = (uid: string) => {
  return useQuery({
    queryKey: ["member", uid],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("uid", uid)
        .maybeSingle();
      
      if (error) throw error;
      return data as DbMember | null;
    },
    enabled: !!uid,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};

export const useMemberGallery = (uid: string) => {
  return useQuery({
    queryKey: ["member-gallery", uid],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .eq("owner_uid", uid)
        .order("uploaded_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!uid,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};

// Fetch images where member is tagged
export const useMemberTaggedImages = (uid: string) => {
  return useQuery({
    queryKey: ["member-tagged-images", uid],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("member_tags")
        .select("gallery_id, gallery(*)")
        .eq("member_uid", uid);
      
      if (error) throw error;
      return data?.map(tag => tag.gallery).filter(Boolean) as Array<{
        id: string;
        src: string;
        caption: string | null;
        owner_uid: string;
        uploaded_at: string;
      }>;
    },
    enabled: !!uid,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};
