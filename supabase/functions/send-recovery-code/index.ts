import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RecoveryRequest {
  code: string;
  email: string;
  name: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ success: false, error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { code, email, name }: RecoveryRequest = await req.json();

    console.log(`Sending recovery code to ${email} for ${name}`);

    // Send email using Resend API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Tirupati Trip <onboarding@resend.dev>",
        to: [email],
        subject: "Password Recovery Code - Tirupati Trip",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #F97316; margin-bottom: 20px;">Password Recovery</h1>
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Hi ${name},
            </p>
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              You requested to reset your password. Use the code below to complete the process:
            </p>
            <div style="background: #FEF3C7; border-radius: 8px; padding: 24px; margin: 24px 0; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #92400E; font-size: 14px;">Your recovery code:</p>
              <p style="margin: 0; font-size: 36px; font-weight: bold; color: #F97316; letter-spacing: 4px;">
                ${code}
              </p>
            </div>
            <p style="font-size: 14px; color: #6B7280;">
              This code will expire in 15 minutes. If you didn't request this, please ignore this email.
            </p>
            <p style="font-size: 14px; color: #6B7280; margin-top: 24px;">
              - Tirupati Trip Team
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

    console.log("Recovery code email sent successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Recovery code sent" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-recovery-code:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
