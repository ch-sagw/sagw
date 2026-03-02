import type {
  EventDetailPage, EventDetailPageSelect,
} from '@/payload-types';
import type { TaskConfig } from 'payload';

export const eventMaintenanceQueue = 'event-maintenance';
const zurichTimeZone = 'Europe/Zurich';

const getDateKeyInTimeZone = (date: Date): string => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: zurichTimeZone,
    year: 'numeric',
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    throw new Error('Unable to format date parts for timezone comparison.');
  }

  return `${year}-${month}-${day}`;
};

const isZurichOneAM = (): boolean => {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    hour12: false,
    timeZone: zurichTimeZone,
  });

  return formatter.format(new Date()) === '01';
};

const resolveEventEndDate = (doc: EventDetailPage): string => {
  if (doc.eventDetails.multipleDays && doc.eventDetails.dateEnd) {
    return doc.eventDetails.dateEnd;
  }

  return doc.eventDetails.date;
};

export const unpublishExpiredEventDetailPagesTask: TaskConfig = {
  handler: async ({
    input, req,
  }) => {
    const forceRun = Boolean((input as { forceRun?: boolean } | undefined)?.forceRun);

    if (!forceRun && !isZurichOneAM()) {
      return {
        output: {
          checked: 0,
          errors: [] as string[],
          reason: 'Skipped run outside 01:00 Europe/Zurich window.',
          unpublished: 0,
          unpublishedIDs: [] as string[],
        },
      };
    }

    const todayKey = getDateKeyInTimeZone(new Date());
    const unpublishedIDs: string[] = [];
    const errors: string[] = [];
    const result = await req.payload.find({
      collection: 'eventDetailPage',
      depth: 0,
      pagination: false,
      req,
      select: {
        eventDetails: true,
        id: true,
      } as EventDetailPageSelect,
      where: {
        /* eslint-disable @typescript-eslint/naming-convention */
        _status: {
          equals: 'published',
        },
        /* eslint-enable @typescript-eslint/naming-convention */
      },
    });

    const docs = result.docs as EventDetailPage[];
    const checked = docs.length;
    let unpublished = 0;
    const expiredDocs: string[] = [];

    for (const doc of docs) {
      try {
        const eventEndDateString = resolveEventEndDate(doc);
        const eventEndDate = new Date(eventEndDateString);

        if (Number.isNaN(eventEndDate.getTime())) {
          errors.push(`Skipping ${doc.id}: invalid date value "${eventEndDateString}".`);
        } else {
          const eventEndDateKey = getDateKeyInTimeZone(eventEndDate);

          if (eventEndDateKey < todayKey) {
            expiredDocs.push(doc.id);
          }
        }
      } catch (error) {
        const message = error instanceof Error
          ? error.message
          : String(error);

        errors.push(`Failed to process ${doc.id}: ${message}`);
      }
    }

    const updatePromises = [];

    for (const doc of expiredDocs) {
      updatePromises.push(req.payload.update({
        collection: 'eventDetailPage',
        data: {
          /* eslint-disable @typescript-eslint/naming-convention */
          _status: 'draft',
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        id: doc,
        req,
      }));
    }

    const updateResults = await Promise.allSettled(updatePromises);

    for (let index = 0; index < updateResults.length; index += 1) {
      const updateResult = updateResults[index];
      const doc = expiredDocs[index];

      if (updateResult.status === 'fulfilled') {
        unpublished += 1;
        unpublishedIDs.push(doc);
      } else {
        const message = updateResult.reason instanceof Error
          ? updateResult.reason.message
          : String(updateResult.reason);

        errors.push(`Failed to unpublish ${doc}: ${message}`);
      }
    }

    return {
      output: {
        checked,
        errors,
        unpublished,
        unpublishedIDs,
      },
    };
  },
  inputSchema: [
    {
      name: 'forceRun',
      required: false,
      type: 'checkbox',
    },
  ],
  label: 'Unpublish Expired Event Detail Pages',
  outputSchema: [
    {
      name: 'checked',
      required: true,
      type: 'number',
    },
    {
      name: 'unpublished',
      required: true,
      type: 'number',
    },
    {
      hasMany: true,
      name: 'unpublishedIDs',
      required: true,
      type: 'text',
    },
    {
      hasMany: true,
      name: 'errors',
      required: true,
      type: 'text',
    },
    {
      name: 'reason',
      required: false,
      type: 'text',
    },
  ],
  retries: 2,
  schedule: [
    {
      cron: '0 * * * *',
      queue: eventMaintenanceQueue,
    },
  ],
  slug: 'unpublishExpiredEventDetailPages',
};
