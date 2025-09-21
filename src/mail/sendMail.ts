import { Resend } from 'resend';

interface InterfaceSendMail {
  to: string;
  subject: string;
  from: string;
  content: string;
}

export const sendMail = async ({
  to,
  subject,
  from,
  content,
}: InterfaceSendMail): Promise<boolean> => {
  try {
    const resend = new Resend(process.env.RESEND_KEY);

    const sendResponse = await resend.emails.send({
      from,
      html: content,
      subject,
      to,
    });

    if (!sendResponse.error) {
      return true;
    }

    throw new Error(sendResponse.error.message);

  } catch (e) {
    console.log(e);

    return false;
  }
};
