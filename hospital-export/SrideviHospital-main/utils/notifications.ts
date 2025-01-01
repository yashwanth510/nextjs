import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

interface NotificationProps {
  to: string;
  subject: string;
  text: string;
}

export const sendNotification = async ({ to, subject, text }: NotificationProps) => {
  if (!to || !subject || !text) {
    throw new Error('Missing required notification parameters');
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@hospital.com',
      to,
      subject,
      text,
      html: `<div style="font-family: Arial, sans-serif;">${text}</div>`,
    });
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Notification error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to send notification: ${error.message}`);
    } else {
      throw new Error('Failed to send notification: Unknown error');
    }
  }
};