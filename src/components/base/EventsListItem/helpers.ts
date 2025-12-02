import { formatDateRangeToReadableString } from '@/components/helpers/date';
import { Locale } from 'next-intl';

interface InterfaceFormatEventDetailsProps {
  dateStart: string;
  dateEnd?: string;
  language?: string;
  pageLanguage: Locale,
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
