import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface VideoTestimonial {
  id: string;
  owner_uid: string;
  video_url: string;
  title: string | null;
  description: string | null;
  duration_seconds: number | null;
  file_size_bytes: number | null;
  uploaded_at: string;
  owner_name?: string;
}

export const useVideoTestimonials = () => {
  return useQuery({
    queryKey: ["video-testimonials"],
    queryFn: async () => {
      const { data: videos, error } = await supabase
        .from("video_testimonials")
        .select("*")
        .order("uploaded_at", { ascending: false });

      if (error) throw error;

      // Fetch owner names
      const ownerUids = [...new Set(videos?.map((v) => v.owner_uid) || [])];
      const { data: members } = await supabase
        .from("members")
        .select("uid, name")
        .in("uid", ownerUids);

      const memberMap = new Map(members?.map((m) => [m.uid, m.name]) || []);

      return (videos || []).map((video) => ({
        ...video,
        owner_name: memberMap.get(video.owner_uid) || "Unknown",
      })) as VideoTestimonial[];
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};

export const useUploadVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      ownerUid,
      title,
      description,
    }: {
      file: File;
      ownerUid: string;
      title?: string;
      description?: string;
    }) => {
      // Validate member exists
      const { data: member, error: memberError } = await supabase
        .from("members")
        .select("uid")
        .eq("uid", ownerUid)
        .single();

      if (memberError || !member) {
        throw new Error("Invalid member UID. Please check your ID.");
      }

      // Upload to storage
      const fileName = `${ownerUid}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("member-videos")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("member-videos")
        .getPublicUrl(fileName);

      // Insert record
      const { data, error } = await supabase
        .from("video_testimonials")
        .insert({
          owner_uid: ownerUid,
          video_url: urlData.publicUrl,
          title: title || null,
          description: description || null,
          file_size_bytes: file.size,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video-testimonials"] });
      toast.success("Video uploaded successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload video");
    },
  });
};

export const useDeleteVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      videoId,
      ownerUid,
      password,
    }: {
      videoId: string;
      ownerUid: string;
      password: string;
    }) => {
      // Verify password via member_login RPC
      const { data: loginResult, error: loginError } = await supabase.rpc(
        "member_login",
        {
          p_uid: ownerUid,
          p_password: password,
        }
      );

      if (loginError) throw new Error("Authentication failed");

      const result = loginResult as { success: boolean; error?: string };
      if (!result.success) {
        throw new Error(result.error || "Invalid credentials");
      }

      // Get video to verify ownership and get storage path
      const { data: video, error: videoError } = await supabase
        .from("video_testimonials")
        .select("*")
        .eq("id", videoId)
        .single();

      if (videoError || !video) {
        throw new Error("Video not found");
      }

      if (video.owner_uid !== ownerUid) {
        throw new Error("You can only delete your own videos");
      }

      // Extract storage path from URL
      const url = new URL(video.video_url);
      const pathParts = url.pathname.split("/member-videos/");
      if (pathParts[1]) {
        await supabase.storage
          .from("member-videos")
          .remove([decodeURIComponent(pathParts[1])]);
      }

      // Delete record
      const { error: deleteError } = await supabase
        .from("video_testimonials")
        .delete()
        .eq("id", videoId);

      if (deleteError) throw deleteError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video-testimonials"] });
      toast.success("Video deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete video");
    },
  });
};
