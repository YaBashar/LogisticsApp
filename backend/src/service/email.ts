import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_SECRET);

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  from: string = 'onboarding@resend.dev'
) => {
  try {
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });
    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};