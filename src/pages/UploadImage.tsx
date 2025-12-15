import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import ImageUploadForm from "@/components/ImageUploadForm";

const UploadImage = () => {
  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container px-4 max-w-md mx-auto">
        {/* Back Button */}
        <Link
          to="/gallery"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
            Upload Photo
          </h1>
          <p className="text-muted-foreground">
            Share your memories from the trip
          </p>
        </motion.div>

        {/* Upload Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ImageUploadForm />
        </motion.div>
      </div>
    </div>
  );
};

export default UploadImage;
