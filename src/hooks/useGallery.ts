import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DbGalleryImage } from "@/types/database";

export const useGallery = () => {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("*, members(name)")
        .order("uploaded_at", { ascending: false });
      
      if (error) throw error;
      return data as (DbGalleryImage & { members: { name: string } | null })[];
    },
  });
};

export const useUploadImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      file,
      caption,
      ownerUid,
    }: {
      file: File;
      caption: string;
      ownerUid: string;
    }) => {
      // First validate UID exists
      const { data: member, error: memberError } = await supabase
        .from("members")
        .select("uid")
        .eq("uid", ownerUid)
        .maybeSingle();
      
      if (memberError) throw memberError;
      if (!member) throw new Error("Invalid member UID. Please enter a valid 4-digit UID.");

      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${ownerUid}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("member-images")
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("member-images")
        .getPublicUrl(fileName);

      // Insert gallery record
      const { error: insertError } = await supabase.from("gallery").insert({
        src: urlData.publicUrl,
        caption: caption || null,
        owner_uid: ownerUid,
      });

      if (insertError) throw insertError;

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      queryClient.invalidateQueries({ queryKey: ["member-gallery"] });
    },
  });
};

export const validateMemberUid = async (uid: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("members")
    .select("uid")
    .eq("uid", uid)
    .maybeSingle();
  
  if (error) return false;
  return !!data;
};
