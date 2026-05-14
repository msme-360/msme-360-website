import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[EMAIL_SERVICE] SMTP credentials not configured. Skipping email.');
    return { success: false, error: 'SMTP not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"MSME360" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('[EMAIL_SERVICE] Message sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[EMAIL_SERVICE] Error sending email:', error);
    return { success: false, error };
  }
}
