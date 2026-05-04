import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_key_here'
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const sendFeedbackRequest = async ({ clientEmail, clientName, projectName, sprintNumber, customMessage, feedbackUrl }) => {
  if (!resend) {
    const err = new Error('Resend API key is missing or invalid.');
    err.code = 'MISSING_API_KEY';
    throw err;
  }

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:40px auto;">
        <tr><td>
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#0A0A0F 0%,#1a1a2e 100%);border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
            <div style="color:#4ade80;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">ManagerZero</div>
            <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0;">Sprint Feedback Request</h1>
            <p style="color:#9ca3af;font-size:14px;margin:8px 0 0;">${projectName} &middot; ${sprintNumber}</p>
          </div>

          <!-- Body -->
          <div style="background:#ffffff;padding:32px 40px;border:1px solid #e5e7eb;border-top:none;">
            <p style="color:#374151;font-size:16px;margin:0 0 16px;">Hello <strong>${clientName}</strong>,</p>
            <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 24px;">${customMessage}</p>

            <!-- CTA Button -->
            <div style="text-align:center;margin:32px 0;">
              <a href="${feedbackUrl}"
                 style="display:inline-block;background:#4ade80;color:#0A0A0F;font-weight:800;font-size:16px;padding:16px 40px;border-radius:12px;text-decoration:none;letter-spacing:0.5px;">
                ⭐ Share Your Feedback →
              </a>
            </div>

            <p style="color:#9ca3af;font-size:13px;text-align:center;margin:0;">
              The form takes under 60 seconds to complete.
            </p>
          </div>

          <!-- Footer -->
          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
            <p style="color:#9ca3af;font-size:12px;margin:0;">
              Automated via <strong>ManagerZero Intelligence Layer</strong> &middot;
              <a href="${feedbackUrl}" style="color:#4ade80;text-decoration:none;">View Form</a>
            </p>
          </div>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [clientEmail],
      subject: `Feedback Request: ${projectName} — ${sprintNumber}`,
      html: htmlBody,
    });

    if (data.error) throw new Error(data.error.message);
    return { success: true, messageId: data.data?.id };
  } catch (error) {
    const err = new Error(error.message || 'Resend Email API Error');
    err.code = 'EMAIL_SEND_ERROR';
    throw err;
  }
};
