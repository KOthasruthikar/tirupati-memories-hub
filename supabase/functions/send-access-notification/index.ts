import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  requesterUid: string;
  ownerUid: string;
  requesterName: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured - skipping email notification");
      return new Response(
        JSON.stringify({ success: true, message: "Email notifications not configured" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { requesterUid, ownerUid, requesterName }: NotificationRequest = await req.json();

    // Get owner's details from database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: owner, error: ownerError } = await supabase
      .from("members")
      .select("name, uid, email")
      .eq("uid", ownerUid)
      .single();

    if (ownerError || !owner) {
      console.error("Owner not found:", ownerError);
      return new Response(
        JSON.stringify({ success: false, error: "Owner not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if owner has email set
    if (!owner.email) {
      console.log(`Owner ${owner.name} has no email set - skipping notification`);
      return new Response(
        JSON.stringify({ success: true, message: "Owner has no email configured" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Access request notification:
      From: ${requesterName} (${requesterUid})
      To: ${owner.name} (${ownerUid}) - ${owner.email}
    `);

    // Send email using Resend API directly
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Tirupati Trip <onboarding@resend.dev>",
        to: [owner.email],
        subject: `${requesterName} wants to view your photos`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #F97316; margin-bottom: 20px;">New Access Request</h1>
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Hi ${owner.name},
            </p>
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              <strong>${requesterName}</strong> (UID: ${requesterUid}) has requested access to view your photos on the Tirupati Trip website.
            </p>
            <div style="background: #FEF3C7; border-radius: 8px; padding: 16px; margin: 24px 0;">
              <p style="margin: 0; color: #92400E;">
                Log in to your dashboard to approve or deny this request.
              </p>
            </div>
            <p style="font-size: 14px; color: #6B7280; margin-top: 24px;">
              This is an automated notification from Tirupati Trip.
            </p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error("Email error:", errorData);
      return new Response(
        JSON.stringify({ success: true, message: "Request saved, email notification failed" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Email notification sent successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Notification sent" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-access-notification:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
