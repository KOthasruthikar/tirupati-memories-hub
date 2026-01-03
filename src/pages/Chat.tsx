import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConversationList from "@/components/chat/ConversationList";
import ChatWindow from "@/components/chat/ChatWindow";
import { useAuth } from "@/contexts/AuthContext";
import { useConversations, useGetOrCreateConversation, Conversation } from "@/hooks/useChat";
import { toast } from "sonner";

const Chat = () => {
  const { member } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  
  const { data: conversations, isLoading } = useConversations(member?.uid || "");
  const getOrCreateConversation = useGetOrCreateConversation();

  // Handle starting chat with a specific member from URL param
  useEffect(() => {
    const withUid = searchParams.get("with");
    if (withUid && member?.uid && withUid !== member.uid) {
      getOrCreateConversation.mutate(
        { myUid: member.uid, otherUid: withUid },
        {
          onSuccess: (conversation) => {
            setSelectedConversation(conversation);
            setSearchParams({});
          },
          onError: () => {
            toast.error("Could not start conversation");
          },
        }
      );
    }
  }, [searchParams, member?.uid]);

  // Redirect to login if not authenticated
  if (!member) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Login Required</h1>
            <p className="text-muted-foreground mb-4">Please login to access chat</p>
            <button
              onClick={() => navigate("/login")}
              className="text-primary hover:underline"
            >
              Go to Login
            </button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  const getOtherMemberUid = (conversation: Conversation) => {
    return conversation.participant_1_uid === member.uid
      ? conversation.participant_2_uid
      : conversation.participant_1_uid;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex flex-col">
        <div className="container max-w-4xl mx-auto flex-1 flex flex-col">
          {/* Mobile: Show either list or chat */}
          <div className="flex-1 flex flex-col md:flex-row md:gap-4 md:py-4">
            {/* Conversation List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`md:w-80 md:shrink-0 border-r border-border bg-card md:rounded-lg md:border overflow-hidden ${
                selectedConversation ? "hidden md:block" : ""
              }`}
            >
              <div className="p-4 border-b border-border">
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Messages
                </h1>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <ConversationList
                  conversations={conversations || []}
                  currentMemberUid={member.uid}
                  selectedConversationId={selectedConversation?.id}
                  onSelect={setSelectedConversation}
                />
              )}
            </motion.div>

            {/* Chat Window */}
            <div
              className={`flex-1 flex flex-col bg-card md:rounded-lg md:border overflow-hidden ${
                !selectedConversation ? "hidden md:flex" : ""
              }`}
            >
              {selectedConversation ? (
                <ChatWindow
                  conversationId={selectedConversation.id}
                  currentMemberUid={member.uid}
                  otherMemberUid={getOtherMemberUid(selectedConversation)}
                  onBack={() => setSelectedConversation(null)}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-center p-8">
                  <div>
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg font-medium text-muted-foreground">
                      Select a conversation
                    </p>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                      Or click on a member's profile to start chatting
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Chat;
