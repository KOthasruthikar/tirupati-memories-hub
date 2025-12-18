import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Edit2, Save, X, Loader2, Camera, Image, LogOut, Mail, Phone, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMemberGallery, useMemberTaggedImages } from "@/hooks/useMembers";
import LazyImage from "@/components/LazyImage";
import Lightbox from "@/components/Lightbox";
import ImageUploadForm from "@/components/ImageUploadForm";
import AccessRequestsPanel from "@/components/AccessRequestsPanel";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const { member, isLoading, logout, updateMember } = useAuth();
  const { data: ownedImages } = useMemberGallery(member?.uid || "");
  const { data: taggedImages } = useMemberTaggedImages(member?.uid || "");
  
  // Combine owned and tagged images, removing duplicates
  const allImages = [...(ownedImages || [])];
  const ownedIds = new Set(allImages.map(img => img.id));
  taggedImages?.forEach(img => {
    if (!ownedIds.has(img.id)) {
      allImages.push(img);
    }
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  
  const [editForm, setEditForm] = useState({
    name: "",
    role: "",
    memory: "",
    bio: "",
    email: "",
    phone: "",
  });
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const profileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (member) {
      setEditForm({
        name: member.name,
        role: member.role,
        memory: member.memory,
        bio: member.bio,
        email: member.email || "",
        phone: member.phone || "",
      });
    }
  }, [member]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !member) {
      navigate("/login");
    }
  }, [isLoading, member, navigate]);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateMember(editForm);
    setIsSaving(false);
    
    if (result.success) {
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } else {
      toast.error(result.error || "Failed to update profile");
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !member) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setIsUploadingProfile(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${member.uid}/profile.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("member-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("member-images")
        .getPublicUrl(fileName);

      // Update member profile
      const result = await updateMember({ profile_image: urlData.publicUrl });
      
      if (result.success) {
        toast.success("Profile picture updated!");
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload profile picture");
    } finally {
      setIsUploadingProfile(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully");
  };

  const lightboxImages = allImages.map((img) => ({
    url: img.src,
    caption: img.caption || "",
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!member) return null;

  const needsEmail = !member.email;

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container px-4 max-w-4xl mx-auto">
        {/* Header with Logout */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground">My Profile</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Email Required Banner */}
        {needsEmail && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-200">Add your email address</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Add an email to receive notifications when someone requests access to your photos.
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-2 text-sm font-medium text-amber-800 dark:text-amber-200 hover:underline"
              >
                Edit profile to add email →
              </button>
            </div>
          </motion.div>
        )}

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 md:p-8 shadow-card border border-border/50 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Image with Upload */}
            <div className="relative mx-auto md:mx-0">
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-primary/20">
                {member.profile_image && member.profile_image !== "/placeholder.svg" ? (
                  <LazyImage
                    src={member.profile_image}
                    alt={member.name}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <User className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
                
                {isUploadingProfile && (
                  <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
                  </div>
                )}
              </div>
              
              {/* Upload Profile Button */}
              <button
                onClick={() => profileInputRef.current?.click()}
                disabled={isUploadingProfile}
                className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                title="Change profile picture"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="hidden"
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-mono rounded-full">
                  UID: {member.uid}
                </span>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 hover:bg-muted rounded transition-colors"
                    title="Edit profile"
                  >
                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-heading text-xl"
                  />
                  <input
                    type="text"
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    placeholder="Your role"
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <input
                    type="text"
                    value={editForm.memory}
                    onChange={(e) => setEditForm({ ...editForm, memory: e.target.value })}
                    placeholder="Your favorite memory"
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="Your bio"
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        placeholder="Your email (for notifications)"
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        placeholder="Your phone number"
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({
                          name: member.name,
                          role: member.role,
                          memory: member.memory,
                          bio: member.bio,
                          email: member.email || "",
                          phone: member.phone || "",
                        });
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
                    {member.name}
                  </h2>
                  <p className="text-lg text-primary font-medium mb-4">{member.role}</p>
                  <div className="bg-muted/50 rounded-xl p-4 mb-4">
                    <p className="text-muted-foreground italic">"{member.memory}"</p>
                  </div>
                  <p className="text-foreground leading-relaxed mb-4">{member.bio}</p>
                  
                  {/* Contact Info */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    {member.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span>{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* My Photos Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <Image className="w-6 h-6 text-primary" />
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              My Photos ({allImages.length})
            </h2>
          </div>

          {allImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setLightboxOpen(true);
                  }}
                  className="relative aspect-square rounded-xl overflow-hidden shadow-card group focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <LazyImage
                    src={image.src}
                    alt={image.caption || "My photo"}
                    className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-muted/30 rounded-xl">
              <p className="text-muted-foreground">No photos uploaded yet</p>
            </div>
          )}
        </motion.div>

        {/* Upload Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <ImageUploadForm defaultUid={member.uid} />
        </motion.div>

        {/* Access Requests Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AccessRequestsPanel ownerUid={member.uid} />
        </motion.div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() =>
          setCurrentImageIndex((prev) => (prev + 1) % lightboxImages.length)
        }
        onPrev={() =>
          setCurrentImageIndex(
            (prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length
          )
        }
      />
    </div>
  );
};

export default Profile;
