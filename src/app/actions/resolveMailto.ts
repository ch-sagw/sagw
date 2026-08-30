'use server';

import 'server-only';
import { checkBotId } from 'botid/server';
import { z } from 'zod';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';
import { InterfaceRte } from '@/components/base/types/rte';

const inputSchema = z.discriminatedUnion('source', [
  z.object({
    personId: z.string()
      .min(1),
    source: z.literal('person'),
  }),
  z.object({
    source: z.literal('footer'),
    tenantId: z.string()
      .min(1),
  }),
]);

export type InterfaceResolveMailtoInput = z.infer<typeof inputSchema>;

// Email addresses are intentionally never rendered into HTML / RSC
// payloads (see FooterContact, CtaContact, PeopleOverview). This action
// resolves the address from the database only when a visitor actually
// clicks a "write email" button, so scrapers can't harvest addresses
// from the served markup.
export const resolveMailto = async (input: InterfaceResolveMailtoInput): Promise<string | null> => {
  // Bot protection via Vercel BotID, same setup as submitForm.ts:
  // classification only happens on Vercel deployments, elsewhere
  // (local dev, docker, playwright) the check is skipped.
  if (process.env.VERCEL) {
    const verification = await checkBotId();

    if (verification.isBot) {
      return null;
    }
  }

  const parsed = inputSchema.safeParse(input);

  if (!parsed.success) {
    return null;
  }

  const payload = await getPayloadCached();

  if (parsed.data.source === 'person') {
    try {
      const person = await payload.findByID({
        collection: 'people',
        depth: 0,
        disableErrors: true,
        id: parsed.data.personId,
        select: {
          mail: true,
        },
      });

      return person?.mail || null;
    } catch {
      return null;
    }
  }

  const footerDocs = await payload.find({
    collection: 'footer',
    depth: 0,
    limit: 1,
    select: {
      contact: {
        mail: true,
      },
    },
    where: {
      tenant: {
        equals: parsed.data.tenantId,
      },
    },
  });

  const mail = rte1ToPlaintext(footerDocs.docs[0]?.contact?.mail as InterfaceRte | undefined);

  return mail || null;
};
