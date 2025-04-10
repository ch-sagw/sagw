/**
 * Requires the follwoing env-variables:
 * - RESEND_KEY
 * - MAIL_TO
 */

import '../../../.env/index';
import config from '../config';
import { Resend } from 'resend';

export default async (subject: string, message: string, failure: boolean): Promise<void> => {

  if (!process.env.RESEND_KEY || !process.env.MAIL_TO) {
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
      from: 'onboarding@resend.dev',
      html: messageContent,
      subject,
      to: process.env.MAIL_TO,
    });
  } catch (err) {
    console.log('Error sending mail');

    console.log(err);

  }
};
