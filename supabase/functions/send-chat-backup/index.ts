import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BackupRequest {
  conversationId: string;
  requesterUid: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ success: false, error: "Email service not configured" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { conversationId, requesterUid }: BackupRequest = await req.json();
    console.log(`Chat backup request: conversation=${conversationId}, requester=${requesterUid}`);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get conversation details
    const { data: conversation, error: convoError } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single();

    if (convoError || !conversation) {
      console.error("Conversation not found:", convoError);
      return new Response(
        JSON.stringify({ success: false, error: "Conversation not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify requester is part of conversation
    if (conversation.participant_1_uid !== requesterUid && conversation.participant_2_uid !== requesterUid) {
      return new Response(
        JSON.stringify({ success: false, error: "Not authorized" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get requester details
    const { data: requester, error: reqError } = await supabase
      .from("members")
      .select("name, email")
      .eq("uid", requesterUid)
      .single();

    if (reqError || !requester?.email) {
      console.error("Requester not found or no email:", reqError);
      return new Response(
        JSON.stringify({ success: false, error: "No email configured for your account" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get other participant
    const otherUid = conversation.participant_1_uid === requesterUid 
      ? conversation.participant_2_uid 
      : conversation.participant_1_uid;

    const { data: otherMember } = await supabase
      .from("members")
      .select("name")
      .eq("uid", otherUid)
      .single();

    // Get all messages
    const { data: messages, error: msgError } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (msgError) {
      console.error("Error fetching messages:", msgError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to fetch messages" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format messages for email
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const messagesHtml = messages?.map((msg) => {
      const senderName = msg.sender_uid === requesterUid ? requester.name : (otherMember?.name || "Other");
      const isOwn = msg.sender_uid === requesterUid;
      const bgColor = isOwn ? "#F97316" : "#E5E7EB";
      const textColor = isOwn ? "#FFFFFF" : "#374151";

      let content = "";
      if (msg.message_type === "text") {
        content = msg.content || "";
      } else if (msg.message_type === "voice") {
        content = `🎤 Voice message (${msg.duration_seconds || 0}s) - <a href="${msg.content}">Listen</a>`;
      } else if (msg.message_type === "video") {
        content = `🎥 Video message (${msg.duration_seconds || 0}s) - <a href="${msg.content}">Watch</a>`;
      }

      return `
        <div style="margin-bottom: 12px; ${isOwn ? "text-align: right;" : ""}">
          <div style="display: inline-block; max-width: 80%; background: ${bgColor}; color: ${textColor}; padding: 10px 14px; border-radius: 16px; text-align: left;">
            <div style="font-weight: bold; font-size: 12px; margin-bottom: 4px;">${senderName}</div>
            <div style="font-size: 14px; line-height: 1.4;">${content}</div>
            <div style="font-size: 10px; opacity: 0.7; margin-top: 4px;">${formatDate(msg.created_at)}</div>
          </div>
        </div>
      `;
    }).join("") || "<p>No messages in this conversation.</p>";

    console.log(`Sending backup email to ${requester.email} with ${messages?.length || 0} messages`);

    // Send email
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Tirupati Trip <onboarding@resend.dev>",
        to: [requester.email],
        subject: `Chat Backup: Conversation with ${otherMember?.name || "Member"}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #F97316; margin-bottom: 20px;">Chat Backup</h1>
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Hi ${requester.name},
            </p>
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Here's your conversation backup with <strong>${otherMember?.name || "Member"}</strong>.
            </p>
            <div style="background: #F9FAFB; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <h3 style="margin: 0 0 16px 0; color: #374151;">Messages (${messages?.length || 0})</h3>
              ${messagesHtml}
            </div>
            <p style="font-size: 12px; color: #9CA3AF; margin-top: 24px;">
              This backup was generated on ${formatDate(new Date().toISOString())}.<br>
              Tirupati Trip - Your Sacred Journey
            </p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error("Email error:", errorData);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to send email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Chat backup email sent successfully");

    return new Response(
      JSON.stringify({ success: true, message: `Backup sent to ${requester.email}` }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-chat-backup:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
