import { formatDateRangeToReadableString } from '@/components/helpers/date';
import { Config } from '@/payload-types';

interface InterfaceFormatEventDetailsProps {
  dateStart: string;
  dateEnd?: string;
  language?: string;
  pageLanguage: Config['locale'],
  time?: string;
  eventLocation?: string;
}

export const formatEventDetails = ({
  dateStart,
  dateEnd,
  language,
  pageLanguage,
  time,
  eventLocation,
}: InterfaceFormatEventDetailsProps): string => {
  let details = formatDateRangeToReadableString({
    endString: dateEnd || dateStart,
    locale: pageLanguage,
    startString: dateStart,
  });

  if (time) {
    details += ` — ${time}`;
  }

  if (eventLocation) {
    details += ` — ${eventLocation}`;
  }

  if (language) {
    details += ` — ${language}`;
  }

  return details;
};
