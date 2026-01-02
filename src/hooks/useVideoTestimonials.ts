import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface VideoTestimonial {
  id: string;
  owner_uid: string;
  video_url: string;
  thumbnail_url: string | null;
  title: string | null;
  description: string | null;
  duration_seconds: number | null;
  file_size_bytes: number | null;
  uploaded_at: string;
  owner_name?: string;
}

// Helper to get/set playback progress in localStorage
const PROGRESS_KEY = "video-playback-progress";

export const getPlaybackProgress = (videoId: string): number => {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (stored) {
      const progress = JSON.parse(stored);
      return progress[videoId] || 0;
    }
  } catch (e) {
    console.warn("Failed to get playback progress:", e);
  }
  return 0;
};

export const setPlaybackProgress = (videoId: string, time: number): void => {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    const progress = stored ? JSON.parse(stored) : {};
    progress[videoId] = time;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn("Failed to save playback progress:", e);
  }
};

export const clearPlaybackProgress = (videoId: string): void => {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (stored) {
      const progress = JSON.parse(stored);
      delete progress[videoId];
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    }
  } catch (e) {
    console.warn("Failed to clear playback progress:", e);
  }
};

export const useVideoTestimonials = (limit: number = 9) => {
  return useQuery({
    queryKey: ["video-testimonials", limit],
    queryFn: async () => {
      const { data: videos, error } = await supabase
        .from("video_testimonials")
        .select("*")
        .order("uploaded_at", { ascending: false })
        .limit(limit);

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
      durationSeconds,
      thumbnailBlob,
    }: {
      file: File;
      ownerUid: string;
      title?: string;
      description?: string;
      durationSeconds?: number;
      thumbnailBlob?: Blob;
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

      // Upload thumbnail if provided
      let thumbnailUrl: string | null = null;
      if (thumbnailBlob) {
        const thumbName = `${ownerUid}/thumb_${Date.now()}.jpg`;
        const { error: thumbError } = await supabase.storage
          .from("member-videos")
          .upload(thumbName, thumbnailBlob, {
            cacheControl: "3600",
            upsert: false,
            contentType: "image/jpeg",
          });

        if (!thumbError) {
          const { data: thumbUrlData } = supabase.storage
            .from("member-videos")
            .getPublicUrl(thumbName);
          thumbnailUrl = thumbUrlData.publicUrl;
        }
      }

      // Insert record
      const { data, error } = await supabase
        .from("video_testimonials")
        .insert({
          owner_uid: ownerUid,
          video_url: urlData.publicUrl,
          thumbnail_url: thumbnailUrl,
          title: title || null,
          description: description || null,
          file_size_bytes: file.size,
          duration_seconds: durationSeconds || null,
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
