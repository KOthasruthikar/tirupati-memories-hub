import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, Quote, Lock, Send, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { useMember, useMemberGallery, useMemberTaggedImages } from "@/hooks/useMembers";
import { useAuth } from "@/contexts/AuthContext";
import { useHasAccess, useAccessRequestStatus, useRequestAccess } from "@/hooks/useAccessRequests";
import LazyImage from "@/components/LazyImage";
import Lightbox from "@/components/Lightbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MemberDetail = () => {
  const { uid } = useParams<{ uid: string }>();
  const { member: currentUser } = useAuth();
  const { data: member, isLoading, error } = useMember(uid || "");
  const { data: ownedImages } = useMemberGallery(uid || "");
  const { data: taggedImages } = useMemberTaggedImages(uid || "");
  
  // Access control
  const { data: hasAccess, isLoading: accessLoading } = useHasAccess(
    currentUser?.uid || "",
    uid || ""
  );
  const { data: requestStatus } = useAccessRequestStatus(
    currentUser?.uid || "",
    uid || ""
  );
  const requestAccess = useRequestAccess();
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Check if current user is the owner
  const isOwner = currentUser?.uid === uid;

  // Combine owned and tagged images, removing duplicates
  const allImages = [...(ownedImages || [])];
  const ownedIds = new Set(allImages.map(img => img.id));
  taggedImages?.forEach(img => {
    if (!ownedIds.has(img.id)) {
      allImages.push(img);
    }
  });

  // Determine if images should be shown
  const canViewImages = isOwner || hasAccess;

  const lightboxImages = allImages.map((img) => ({
    url: img.src,
    caption: img.caption || "",
  }));

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleRequestAccess = async () => {
    if (!currentUser || !uid) {
      toast.error("Please login to request access");
      return;
    }

    try {
      await requestAccess.mutateAsync({
        requesterUid: currentUser.uid,
        ownerUid: uid,
        requesterName: currentUser.name,
      });
      toast.success("Access request sent!");
    } catch (error: any) {
      if (error.code === "23505") {
        toast.error("You already have a pending request");
      } else {
        toast.error("Failed to send request");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen py-12">
        <div className="container px-4 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
            Member Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            No member found with UID: {uid}
          </p>
          <Link
            to="/members"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Members
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container px-4 max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/members"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Members
        </Link>

        {/* Member Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 md:p-8 shadow-card border border-border/50 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Image */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto md:mx-0 rounded-full overflow-hidden ring-4 ring-primary/20 flex-shrink-0">
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
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-mono rounded-full">
                  UID: {member.uid}
                </span>
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                {member.name}
              </h1>
              <p className="text-lg text-primary font-medium mb-4">{member.role}</p>
              
              {/* Memory Quote */}
              <div className="relative bg-muted/50 rounded-xl p-4 mb-4">
                <Quote className="absolute -top-2 left-4 w-6 h-6 text-primary/40" />
                <p className="text-muted-foreground italic pl-6">
                  "{member.memory}"
                </p>
              </div>

              {/* Bio */}
              <p className="text-foreground leading-relaxed">
                {member.bio}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Member's Gallery - Access Controlled */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <Eye className="w-6 h-6 text-primary" />
            {member.name}'s Photos ({allImages.length})
          </h2>

          {accessLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
            </div>
          ) : canViewImages ? (
            // Show images if user has access
            allImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {allImages.map((image, index) => (
                  <motion.button
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => openLightbox(index)}
                    className="relative aspect-square rounded-xl overflow-hidden shadow-card group focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <LazyImage
                      src={image.src}
                      alt={image.caption || "Gallery image"}
                      className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    {image.caption && (
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-primary-foreground text-sm">
                            {image.caption}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/30 rounded-xl">
                <p className="text-muted-foreground">No photos available</p>
              </div>
            )
          ) : (
            // Access restricted view
            <div className="text-center py-12 bg-muted/30 rounded-xl border border-border/50">
              <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                Photos are Private
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {member.name} has kept their photos private. Request access to view their photos.
              </p>
              
              {currentUser ? (
                requestStatus ? (
                  <div className="flex items-center justify-center gap-2">
                    {requestStatus.status === "pending" && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
                        <Clock className="w-5 h-5" />
                        <span>Request Pending</span>
                      </div>
                    )}
                    {requestStatus.status === "denied" && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg">
                        <XCircle className="w-5 h-5" />
                        <span>Request Denied</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    onClick={handleRequestAccess}
                    disabled={requestAccess.isPending}
                    className="gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {requestAccess.isPending ? "Sending..." : "Request Access"}
                  </Button>
                )
              ) : (
                <Link to="/login">
                  <Button variant="outline" className="gap-2">
                    <User className="w-4 h-4" />
                    Login to Request Access
                  </Button>
                </Link>
              )}
            </div>
          )}
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

export default MemberDetail;
