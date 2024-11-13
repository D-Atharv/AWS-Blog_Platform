import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY as string);

interface EmailData {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export async function sendWelcomeEmail(userEmail: string): Promise<void> {
  try {
    // Create the email data object with typing
    const emailData: EmailData = {
      from: 'onboarding@resend.dev', // Use Resend's testing domain
      to: userEmail,
      subject: 'Welcome to Blog Platform!',
      html: '<p>Hello! Welcome to Blog Platform. We"re glad to have you here!</p>',
    };

    const response = await resend.emails.send(emailData);
    console.log('Welcome email sent:', response);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}
