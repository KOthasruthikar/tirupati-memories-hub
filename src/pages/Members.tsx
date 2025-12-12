import { useState } from "react";
import { motion } from "framer-motion";
import { members, Member } from "@/data/seed";
import MemberCard from "@/components/MemberCard";
import MemberModal from "@/components/MemberModal";

const Members = () => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMember(null), 300);
  };

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container px-4">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Pilgrims
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the wonderful people who made this journey special
          </p>
        </motion.div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MemberCard member={member} onClick={() => openModal(member)} />
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16 py-12 px-6 bg-gradient-card rounded-2xl border border-border/50"
        >
          <span className="text-4xl mb-4 block">🙏</span>
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
            Thank You for Being Part of This Journey
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Each member brought their own unique energy and devotion, making this
            pilgrimage an unforgettable experience for everyone.
          </p>
        </motion.div>
      </div>

      {/* Member Modal */}
      <MemberModal
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default Members;
