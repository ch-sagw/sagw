/**
 * Requires the following env-variables:
 * - RESEND_KEY
 * - MAIL_RECIPIENT_BACKUP_RESTORE
 */

import '../../../.env/index';
import { Resend } from 'resend';
import config from '@/backup-restore/config';

export default async (subject: string, message: string, failure: boolean): Promise<void> => {

  if (!process.env.RESEND_KEY || !process.env.MAIL_RECIPIENT_BACKUP_RESTORE || !process.env.MAIL_SENDER_ADDRESS) {
    return;
  }

  if (failure) {
    if (!config.sendMailOnFailure) {
      return;
    }
  } else {
    if (!config.sendMailOnSuccess) {
      return;
    }
  }

  const messageContent = typeof message === 'object'
    ? JSON.stringify(message)
    : message;

  try {
    const resend = new Resend(process.env.RESEND_KEY);

    await resend.emails.send({
      from: process.env.MAIL_SENDER_ADDRESS,
      html: messageContent,
      subject,
      to: process.env.MAIL_RECIPIENT_BACKUP_RESTORE,
    });
  } catch (err) {
    console.log('Error sending mail');

    console.log(err);

  }
};
