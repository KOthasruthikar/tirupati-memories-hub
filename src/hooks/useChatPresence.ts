import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PresenceState {
  isOnline: boolean;
  isTyping: boolean;
  lastSeen: string | null;
}

export const useChatPresence = (
  conversationId: string,
  currentMemberUid: string,
  otherMemberUid: string
) => {
  const [otherUserPresence, setOtherUserPresence] = useState<PresenceState>({
    isOnline: false,
    isTyping: false,
    lastSeen: null,
  });
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!conversationId || !currentMemberUid) return;

    const channelName = `presence-${conversationId}`;
    const channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: currentMemberUid,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const otherPresence = state[otherMemberUid]?.[0] as {
          isTyping?: boolean;
          lastSeen?: string;
        } | undefined;

        setOtherUserPresence({
          isOnline: !!state[otherMemberUid],
          isTyping: otherPresence?.isTyping || false,
          lastSeen: otherPresence?.lastSeen || null,
        });
      })
      .on("presence", { event: "join" }, ({ key }) => {
        if (key === otherMemberUid) {
          setOtherUserPresence((prev) => ({ ...prev, isOnline: true }));
        }
      })
      .on("presence", { event: "leave" }, ({ key }) => {
        if (key === otherMemberUid) {
          setOtherUserPresence({
            isOnline: false,
            isTyping: false,
            lastSeen: new Date().toISOString(),
          });
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            isTyping: false,
            lastSeen: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      channel.unsubscribe();
    };
  }, [conversationId, currentMemberUid, otherMemberUid]);

  const setTyping = useCallback(
    async (isTyping: boolean) => {
      if (!channelRef.current) return;

      await channelRef.current.track({
        isTyping,
        lastSeen: new Date().toISOString(),
      });

      // Auto-clear typing after 3 seconds
      if (isTyping) {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(async () => {
          if (channelRef.current) {
            await channelRef.current.track({
              isTyping: false,
              lastSeen: new Date().toISOString(),
            });
          }
        }, 3000);
      }
    },
    []
  );

  return {
    otherUserPresence,
    setTyping,
  };
};

// Hook for tracking online status across the app
export const useOnlineMembers = () => {
  const [onlineMembers, setOnlineMembers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const channel = supabase.channel("online-members", {
      config: {
        presence: {
          key: "global",
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const online = new Set<string>();
        Object.values(state).forEach((presences: any[]) => {
          presences.forEach((p) => {
            if (p.uid) online.add(p.uid);
          });
        });
        setOnlineMembers(online);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return onlineMembers;
};

// Track current user's online status
export const useTrackOnlineStatus = (memberUid: string | undefined) => {
  useEffect(() => {
    if (!memberUid) return;

    const channel = supabase.channel("online-members", {
      config: {
        presence: {
          key: memberUid,
        },
      },
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({
          uid: memberUid,
          online_at: new Date().toISOString(),
        });
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [memberUid]);
};
