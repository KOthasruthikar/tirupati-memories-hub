import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDeleteImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageId: string) => {
      const { error } = await supabase
        .from("gallery")
        .delete()
        .eq("id", imageId);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      queryClient.invalidateQueries({ queryKey: ["member-gallery"] });
    },
  });
};

export const useTagMembers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      galleryId,
      memberUids,
    }: {
      galleryId: string;
      memberUids: string[];
    }) => {
      // First delete existing tags
      await supabase
        .from("member_tags")
        .delete()
        .eq("gallery_id", galleryId);

      // Then insert new tags
      if (memberUids.length > 0) {
        const { error } = await supabase.from("member_tags").insert(
          memberUids.map((uid) => ({
            gallery_id: galleryId,
            member_uid: uid,
          }))
        );

        if (error) throw error;
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      queryClient.invalidateQueries({ queryKey: ["image-tags"] });
    },
  });
};

export const useImageTags = (galleryId: string) => {
  return {
    queryKey: ["image-tags", galleryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("member_tags")
        .select("*, members(name, uid)")
        .eq("gallery_id", galleryId);

      if (error) throw error;
      return data;
    },
    enabled: !!galleryId,
  };
};

export const downloadImage = async (url: string, filename: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
    throw error;
  }
};
