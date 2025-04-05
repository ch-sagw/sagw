// https://docs.slack.dev/messaging/sending-messages-using-incoming-webhooks/
import dotenv from 'dotenv';
import config from '../config';

dotenv.config();

const sendSlackMessage = async (texts: string[], failure: boolean): Promise<void> => {
  try {

    if (!process.env.SLACK_WEBHOOK_URL) {
      throw new Error('slack webhook url is not defined in environment.');
    }

    if (failure) {
      if (!config.sendSlackOnFailure) {
        return;
      }
    } else {
      if (!config.sendSlackOnSuccess) {
        return;
      }
    }

    const blocks = texts.map((text) => ({
      text: {
        text,
        type: 'mrkdwn',
      },
      type: 'section',
    }));

    const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
      body: JSON.stringify({
        blocks,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
  } catch (err) {
    console.log(err);
  }

};

export default sendSlackMessage;
