import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Conversation } from "@/hooks/useChat";
import { useMembers } from "@/hooks/useMembers";
import { format } from "date-fns";

interface ConversationListProps {
  conversations: Conversation[];
  currentMemberUid: string;
  selectedConversationId?: string;
  onSelect: (conversation: Conversation) => void;
}

const ConversationList = ({
  conversations,
  currentMemberUid,
  selectedConversationId,
  onSelect,
}: ConversationListProps) => {
  const { data: members } = useMembers();

  const getOtherMember = (conversation: Conversation) => {
    const otherUid =
      conversation.participant_1_uid === currentMemberUid
        ? conversation.participant_2_uid
        : conversation.participant_1_uid;
    return members?.find((m) => m.uid === otherUid);
  };

  if (!conversations.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <MessageCircle className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-sm">No conversations yet</p>
        <p className="text-xs mt-1">Click on a member to start chatting</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {conversations.map((conversation) => {
        const otherMember = getOtherMember(conversation);
        const isSelected = selectedConversationId === conversation.id;

        return (
          <motion.button
            key={conversation.id}
            whileHover={{ backgroundColor: "hsl(var(--muted) / 0.5)" }}
            onClick={() => onSelect(conversation)}
            className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
              isSelected ? "bg-muted" : ""
            }`}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-muted shrink-0">
              {otherMember?.profile_image ? (
                <img
                  src={otherMember.profile_image}
                  alt={otherMember.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-muted-foreground">
                  {otherMember?.name?.charAt(0) || "?"}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{otherMember?.name || "Unknown"}</p>
              <p className="text-xs text-muted-foreground truncate">{otherMember?.role}</p>
            </div>

            <span className="text-xs text-muted-foreground shrink-0">
              {format(new Date(conversation.updated_at), "MMM d")}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default ConversationList;
