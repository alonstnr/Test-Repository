import * as fs from 'fs/promises';

interface EmailPayload {
  to: string;
  subject: string;
  body: string;
}

class EmailService {
  async sendEmail(payload: EmailPayload): Promise<void> {
    const logEntry = [
      '========================================',
      `Date: ${new Date().toISOString()}`,
      `To: ${payload.to}`,
      `Subject: ${payload.subject}`,
      `Body: ${payload.body}`,
      '========================================',
    ].join('\n');

    console.log('[SIMULATED EMAIL]');
    console.log(logEntry);

    try {
      await fs.appendFile('emails.log', logEntry + '\n');
    } catch {
      // File logging is optional
    }
  }
}

export const emailService = new EmailService();
