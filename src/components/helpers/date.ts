interface InterfaceFormatDateToObjectProps {
  dateString: string;
  locale: string;
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
  });
  const month = date
    .toLocaleString(locale, {
      month: 'short',
    })
    .toUpperCase();
  const year = date.toLocaleString(locale, {
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

  // Helper to format parts consistently
  const formatDay = (date: Date): string => date.toLocaleString(locale, {
    day: '2-digit',
  });
  const formatMonth = (date: Date): string => date.toLocaleString(locale, {
    month: 'long',
  });
  const formatYear = (date: Date): string => date.toLocaleString(locale, {
    year: 'numeric',
  });

  return `${formatDay(inputDate)}. ${formatMonth(inputDate)} ${formatYear(inputDate)}`;
};

interface InterfaceFormatDateRangeToReadableStringProps {
  startString: string;
  endString: string;
  locale: string
}

export const formatDateRangeToReadableString = ({
  startString,
  endString,
  locale,
}: InterfaceFormatDateRangeToReadableStringProps): string => {
  const start = new Date(startString);
  const end = new Date(endString);

  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();
  const sameDay = sameMonth && start.getDate() === end.getDate();

  // Helper to format parts consistently
  const formatDay = (date: Date): string => date.toLocaleString(locale, {
    day: '2-digit',
  });
  const formatMonth = (date: Date): string => date.toLocaleString(locale, {
    month: 'long',
  });
  const formatYear = (date: Date): string => date.toLocaleString(locale, {
    year: 'numeric',
  });

  if (sameMonth && sameYear && sameDay) {
    // e.g. 27. Oktober 2025
    return `${formatDay(start)}. ${formatMonth(start)} ${formatYear(start)}`;
  } else if (sameMonth && sameYear) {
    // e.g. 27.-29. Oktober 2025
    return `${formatDay(start)}.-${formatDay(end)}. ${formatMonth(start)} ${formatYear(start)}`;
  } else if (sameYear) {
    // e.g. 27. Oktober - 01. November 2025
    return `${formatDay(start)}. ${formatMonth(start)} - ${formatDay(end)}. ${formatMonth(end)} ${formatYear(start)}`;
  }

  // e.g. 27. Oktober 2025 - 01. Januar 2026
  return `${formatDay(start)}. ${formatMonth(start)} ${formatYear(start)} - ${formatDay(end)}. ${formatMonth(end)} ${formatYear(end)}`;
};

interface InterfaceFormatTimeProps {
  dateString: string;
}

export const formatTime = ({
  dateString,
}: InterfaceFormatTimeProps): string => {
  const date = new Date(dateString);

  return date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
  });
};
