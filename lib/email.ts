/**
 * Email service for sending transactional emails
 *
 * This uses Resend as the email provider. If you prefer another provider:
 * - SendGrid: https://sendgrid.com
 * - Postmark: https://postmarkapp.com
 * - AWS SES: https://aws.amazon.com/ses/
 *
 * To set up Resend:
 * 1. Sign up at https://resend.com
 * 2. Verify your domain
 * 3. Get your API key
 * 4. Add RESEND_API_KEY to .env.local
 */

// Uncomment when you have Resend set up:
// import { Resend } from 'resend';
// const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email using the configured email provider
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if email service is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn(
        "⚠️  Email service not configured. Email would be sent to:",
        to,
      );
      console.warn("Subject:", subject);
      console.warn("Content:", text || html);

      // In development, we'll just log the email
      if (process.env.NODE_ENV === "development") {
        return { success: true };
      }

      return {
        success: false,
        error:
          "Email service not configured. Please add RESEND_API_KEY to .env.local",
      };
    }

    // TODO: Uncomment when Resend is set up
    // const { data, error } = await resend.emails.send({
    //   from: process.env.EMAIL_FROM || 'Upfolio <noreply@upfolio.app>',
    //   to,
    //   subject,
    //   html,
    //   text,
    // });

    // if (error) {
    //   console.error('Email send error:', error);
    //   return { success: false, error: error.message };
    // }

    // console.log('Email sent successfully:', data);
    // return { success: true };

    // Temporary: Log in development
    console.log("📧 Email would be sent:");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Content:", text || html);
    return { success: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  username: string,
): Promise<{ success: boolean; error?: string }> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/admin/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Upfolio</h1>
        </div>
        
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
          
          <p>Hi <strong>${username}</strong>,</p>
          
          <p>We received a request to reset your password for your Upfolio account. Click the button below to create a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600;">Reset Password</a>
          </div>
          
          <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="color: #667eea; font-size: 14px; word-break: break-all;">${resetUrl}</p>
          
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #856404; font-size: 14px;"><strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.</p>
          </div>
          
          <p style="color: #666; font-size: 14px;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This email was sent by Upfolio<br>
            If you have questions, contact us at support@upfolio.app
          </p>
        </div>
      </body>
    </html>
  `;

  const text = `
Reset Your Password

Hi ${username},

We received a request to reset your password for your Upfolio account.

Click the link below to create a new password:
${resetUrl}

⚠️ Important: This link will expire in 1 hour for security reasons.

If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

---
This email was sent by Upfolio
  `;

  return sendEmail({
    to: email,
    subject: "Reset Your Password - Upfolio",
    html,
    text,
  });
}

/**
 * Send password changed confirmation email
 */
export async function sendPasswordChangedEmail(
  email: string,
  username: string,
): Promise<{ success: boolean; error?: string }> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Changed</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Upfolio</h1>
        </div>
        
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Password Changed Successfully</h2>
          
          <p>Hi <strong>${username}</strong>,</p>
          
          <p>Your password has been changed successfully. You can now log in with your new password.</p>
          
          <div style="background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #155724; font-size: 14px;"><strong>✓ Confirmed:</strong> Your account is secure with your new password.</p>
          </div>
          
          <p style="color: #666; font-size: 14px;">If you didn't make this change, please contact our support team immediately.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This email was sent by Upfolio<br>
            If you have questions, contact us at support@upfolio.app
          </p>
        </div>
      </body>
    </html>
  `;

  const text = `
Password Changed Successfully

Hi ${username},

Your password has been changed successfully. You can now log in with your new password.

✓ Confirmed: Your account is secure with your new password.

If you didn't make this change, please contact our support team immediately.

---
This email was sent by Upfolio
  `;

  return sendEmail({
    to: email,
    subject: "Password Changed - Upfolio",
    html,
    text,
  });
}
