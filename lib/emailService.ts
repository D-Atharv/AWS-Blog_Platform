import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY as string);

async function sendWelcomeEmail(userEmail: string): Promise<void> {
  try {
    const emailData = {
      from: 'onboarding@resend.dev', // Resend's testing domain or your verified domain
      to: userEmail,
      subject: 'Welcome to Blog Platform!',
      html: '<p>Hello! Welcome to Blog Platform again. We"re glad to have you here!</p>',
    };

    const response = await resend.emails.send(emailData);
    console.log('Welcome email sent:', response);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw new Error('Email sending failed');
  }
}

export {sendWelcomeEmail}