import React from 'react';

type SafeHTMLProps<T extends React.ElementType> = {
  as?: T;
  html: string;
} & React.ComponentPropsWithoutRef<T>;

const SafeHtmlBase = <T extends React.ElementType = 'div'>({
  as,
  html,
  ...props
}: SafeHTMLProps<T>): React.ReactElement => {
  const Component = as || 'div';

  return <Component {...props} dangerouslySetInnerHTML={{
    /* eslint-disable @typescript-eslint/naming-convention */
    __html: html,
    /* eslint-enable @typescript-eslint/naming-convention */
  }} />;
};

export const SafeHtml = React.memo(SafeHtmlBase);
