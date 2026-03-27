import { Locale } from 'next-intl';

const timeZone = 'Europe/Zurich';

interface InterfaceFormatDateToObjectProps {
  dateString: string;
  locale: Locale;
}

interface InterfaceFormatDateToObjectResponse {
  day: string;
  month: string;
  year: string;
}

export const formatDateToObject = ({
  dateString,
  locale,
}: InterfaceFormatDateToObjectProps): InterfaceFormatDateToObjectResponse => {
  const date = new Date(dateString);

  const day = date.toLocaleString(locale, {
    day: '2-digit',
    timeZone,
  });
  const month = date
    .toLocaleString(locale, {
      month: 'short',
      timeZone,
    })
    .toUpperCase();
  const year = date.toLocaleString(locale, {
    timeZone,
    year: '2-digit',
  });

  return {
    day,
    month,
    year,
  };
};

interface InterfaceFormatDateToReadableStringProps {
  dateString: string;
  locale: string
}

export const formatDateToReadableString = ({
  dateString,
  locale,
}: InterfaceFormatDateToReadableStringProps): string => {
  const inputDate = new Date(dateString);

  const formattedDate = inputDate.toLocaleString(locale, {
    day: '2-digit',
    month: 'long',
    timeZone,
    year: 'numeric',
  });

  return formattedDate;
};

interface InterfaceFormatDateRangeToReadableStringProps {
  startString: string;
  endString: string;
  locale: string;
}

export const formatDateRangeToReadableString = ({
  startString,
  endString,
  locale,
}: InterfaceFormatDateRangeToReadableStringProps): string => {
  const start = new Date(startString);
  const end = new Date(endString);

  const formatter = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    timeZone,
    year: 'numeric',
  });

  // ensure leading zeroes
  const parts = formatter.formatRangeToParts(start, end);

  return parts
    .map((part) => {
      if (part.type === 'day') {
        // Ensure 2-digit format with leading zero
        return part.value.padStart(2, '0');
      }

      return part.value;
    })
    .join('');
};

interface InterfaceFormatTimeProps {
  dateString: string;
  locale: string;
}

export const formatTime = ({
  dateString,
  locale,
}: InterfaceFormatTimeProps): string => {
  const date = new Date(dateString);

  const formattedTime = date.toLocaleTimeString(`${locale}-${locale.toUpperCase()}`, {
    hour: 'numeric',
    // hour12: false,
    minute: '2-digit',
    timeZone,
  });

  if (locale.toLowerCase()
    .startsWith('en') || locale.toLowerCase()
    .startsWith('de')) {
    return formattedTime.replace(':', '.');
  }

  if (locale.toLowerCase()
    .startsWith('fr')) {
    const frenchFormattedTime = formattedTime.replace(':', ' h ');

    return frenchFormattedTime.replace(/ h 00$/u, ' h');
  }

  return formattedTime;
};
