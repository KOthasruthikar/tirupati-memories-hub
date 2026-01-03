import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Video, Play, Clock, User, Film, Sparkles, Loader2 } from "lucide-react";
import { useVideoTestimonials, VideoTestimonial, getPlaybackProgress } from "@/hooks/useVideoTestimonials";
import VideoUploadForm from "@/components/VideoUploadForm";
import VideoLightbox from "@/components/VideoLightbox";
import VideoDeleteDialog from "@/components/VideoDeleteDialog";
import VideoShareButtons from "@/components/VideoShareButtons";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

const VIDEOS_PER_PAGE = 9;

const VideoTestimonials = () => {
  const [limit, setLimit] = useState(VIDEOS_PER_PAGE);
  const { data: videos = [], isLoading, isError, refetch, isFetching } = useVideoTestimonials(limit);
  const [selectedVideo, setSelectedVideo] = useState<VideoTestimonial | null>(null);
  const [deleteVideo, setDeleteVideo] = useState<VideoTestimonial | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Check if there are more videos to load
  useEffect(() => {
    if (videos.length < limit) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [videos.length, limit]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setLimit((prev) => prev + VIDEOS_PER_PAGE);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  // Get watch progress for a video
  const getWatchProgress = useCallback((video: VideoTestimonial) => {
    const progress = getPlaybackProgress(video.id);
    if (!progress || !video.duration_seconds) return 0;
    return Math.min((progress / video.duration_seconds) * 100, 100);
  }, []);

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="container px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
            >
              <Film className="w-4 h-4" />
              <span className="text-sm font-medium">Video Testimonials</span>
            </motion.div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Share Your{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Sacred Journey
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              Record and share your experiences from the Kailash Mansarovar Yatra.
              Let your words inspire others to embark on this divine pilgrimage.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              <Video className="w-5 h-5" />
              {showUploadForm ? "Hide Upload Form" : "Upload Your Testimonial"}
              <Sparkles className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Upload Form Section */}
      {showUploadForm && (
        <section className="py-8">
          <div className="container px-4">
            <div className="max-w-lg mx-auto">
              <VideoUploadForm onSuccess={() => setShowUploadForm(false)} />
            </div>
          </div>
        </section>
      )}

      {/* Videos Grid */}
      <section className="py-16 md:py-24">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Yatri Experiences
            </h2>
            <p className="text-muted-foreground">
              Watch testimonials from fellow pilgrims
            </p>
          </motion.div>

          {isLoading ? (
            <LoadingState message="Loading testimonials..." size="lg" />
          ) : isError ? (
            <ErrorState message="Failed to load testimonials" onRetry={() => refetch()} />
          ) : videos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Testimonials Yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Be the first to share your sacred journey experience!
              </p>
              <button
                onClick={() => setShowUploadForm(true)}
                className="text-primary hover:underline"
              >
                Upload your testimonial →
              </button>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video, index) => {
                  const watchProgress = getWatchProgress(video);
                  return (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(index * 0.05, 0.3) }}
                      className="group"
                    >
                      <div
                        className="relative rounded-2xl overflow-hidden bg-card shadow-card border border-border cursor-pointer card-hover"
                        onClick={() => setSelectedVideo(video)}
                      >
                        {/* Video thumbnail */}
                        <div className="relative aspect-video bg-muted overflow-hidden">
                          {video.thumbnail_url ? (
                            <img
                              src={video.thumbnail_url}
                              alt={video.title || "Video thumbnail"}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <video
                              src={video.video_url}
                              className="w-full h-full object-cover"
                              preload="metadata"
                            />
                          )}
                          {/* Play overlay */}
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg"
                            >
                              <Play className="w-7 h-7 text-primary-foreground ml-1" />
                            </motion.div>
                          </div>
                          {/* Duration badge */}
                          {video.duration_seconds && (
                            <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-xs flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDuration(video.duration_seconds)}
                            </div>
                          )}
                          {/* Watch progress bar */}
                          {watchProgress > 0 && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                              <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${watchProgress}%` }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Video info */}
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground line-clamp-1 mb-1">
                                {video.title || "Untitled Testimonial"}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="w-3 h-3" />
                                <span>{video.owner_name}</span>
                                <span>•</span>
                                <span>{formatDate(video.uploaded_at)}</span>
                              </div>
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                              <VideoShareButtons videoId={video.id} title={video.title || "Video Testimonial"} />
                            </div>
                          </div>
                          {video.file_size_bytes && (
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatFileSize(video.file_size_bytes)}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Load more trigger */}
              <div ref={loadMoreRef} className="py-8 flex justify-center">
                {isFetching && hasMore && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading more...</span>
                  </div>
                )}
                {!hasMore && videos.length > 0 && (
                  <p className="text-muted-foreground text-sm">
                    You've seen all testimonials
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Video Lightbox */}
      {selectedVideo && (
        <VideoLightbox
          video={selectedVideo}
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          onDelete={(video) => {
            setSelectedVideo(null);
            setDeleteVideo(video);
          }}
        />
      )}

      {/* Delete Dialog */}
      <VideoDeleteDialog
        video={deleteVideo}
        isOpen={!!deleteVideo}
        onClose={() => setDeleteVideo(null)}
      />
    </div>
  );
};

export default VideoTestimonials;
