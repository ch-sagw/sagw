'use client';

import React from 'react';
import { cva } from 'cva';
import styles from '@/components/global/Hero/Hero.module.scss';
import {
  InterfaceHeroField,
  InterfaceHeroFieldHome,
  InterfaceHeroFieldMagazineDetail,
  InterfaceHeroFieldNewsDetail,
} from '@/payload-types';
import {
  Breadcrumb, InterfaceBreadcrumbPropTypes,
} from '@/components/base/Breadcrumb/Breadcrumb';
import { InterfaceRte } from '@/components/base/types/rte';
import { rteToHtml } from '@/utilities/rteToHtml';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { Tag } from '@/components/base/Tag/Tag';
import { Button } from '@/components/base/Button/Button';
import { ColorMode } from '@/components/base/types/colorMode';
import { Icon } from '@/icons';
import { formatEventDetails } from '@/components/base/EventsListItem/helpers';
import {
  formatDateToReadableString,
  formatTime,
} from '@/components/helpers/date';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';
import { useLocale } from 'next-intl';

type BaseHeroProps = {
  breadcrumb?: InterfaceBreadcrumbPropTypes;
  optionalLinkUrl?: string;
};

export type InterfaceHeroPropTypes =
  | (BaseHeroProps & {
    type: 'home';
  } & InterfaceHeroFieldHome)
  | (BaseHeroProps & {
    type: 'generic';
  } & InterfaceHeroField)
  | (BaseHeroProps & {
    exportArticleText?: InterfaceRte;
    pdfGenerationToken?: string;
    pdfGenerationExpiresAt?: string;
    type: 'magazineDetail';
  } & InterfaceHeroFieldMagazineDetail)
  | (BaseHeroProps & {
    type: 'newsDetail';
  } & InterfaceHeroFieldNewsDetail)
  | (BaseHeroProps & {
    eventDetails?: {
      dateStart: string;
      dateEnd?: string;
      language?: string;
      time?: string;
      timeLabelText?: string;
      eventLocation?: string;
    };
    tag: string;
    type: 'eventDetail';
  } & InterfaceHeroField)
  | (BaseHeroProps & {
    descriptionHtml: string;
    homeButtonHtml: string;
    homeHref: string;
    titleHtml: string;
    type: 'error';
  });

export const Hero = (props: InterfaceHeroPropTypes): React.JSX.Element => {
  const locale = useLocale();
  const heroClasses = cva([styles.hero], {
    variants: {
      animated: {
        false: undefined,
        true: [styles.animated],
      },
      colorMode: {
        dark: [styles.dark],
        light: [styles.light],
        white: [styles.white],
      },
      magazineDetail: {
        false: undefined,
        true: [styles.magazineDetail],
      },
      titleIndent: {
        false: undefined,
        true: [styles.titleIndent],
      },
    },
  });

  let heroColorMode: ColorMode;

  if (props.type === 'home') {
    heroColorMode = 'dark';
  } else if (props.type === 'error') {
    heroColorMode = 'light';
  } else {
    heroColorMode = props.colorMode;
  }

  let eventDetailsString;

  if (props.type === 'eventDetail' && props.eventDetails) {
    let timeValue;

    if (props.eventDetails.time) {
      timeValue = `${formatTime({
        dateString: props.eventDetails.time || '',
        locale,
      })}`;

      if (locale === 'de' && props.eventDetails.timeLabelText) {
        timeValue += ` ${props.eventDetails.timeLabelText}`;
      }
    }

    eventDetailsString = formatEventDetails({
      dateEnd: props.eventDetails.dateEnd,
      dateStart: props.eventDetails.dateStart,
      eventLocation: props.eventDetails.eventLocation,
      language: props.eventDetails.language,
      pageLanguage: locale,
      time: timeValue || '',
    });
  }

  const [
    isExporting,
    setIsExporting,
  ] = React.useState(false);

  const handleExport = (): void => {
    if (typeof window === 'undefined' || props.type !== 'magazineDetail') {
      return;
    }

    if (!props.pdfGenerationToken || !props.pdfGenerationExpiresAt || isExporting) {
      return;
    }
    const token = props.pdfGenerationToken;
    const expiresAt = props.pdfGenerationExpiresAt;

    const downloadPdf = async (): Promise<void> => {
      setIsExporting(true);

      try {
        const exportUrl = new URL('/api/magazine-pdf', window.location.origin);

        exportUrl.searchParams.set('path', `${window.location.pathname}${window.location.search}`);
        exportUrl.searchParams.set('token', token);
        exportUrl.searchParams.set('expiresAt', expiresAt);

        const response = await fetch(exportUrl.toString());

        if (!response.ok) {
          const errorMessage = await response.text();

          throw new Error(`Failed to export PDF (${response.status}): ${errorMessage}`);
        }

        const contentDisposition = response.headers.get('content-disposition') || '';
        const filenameMatch = contentDisposition.match(/filename="(?<filename>[^"]+)"/u);
        const filename = filenameMatch?.groups?.filename || 'magazine-detail.pdf';
        const pdfBlob = await response.blob();
        const blobUrl = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');

        link.href = blobUrl;
        link.download = filename;
        document.body.append(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error(error);
      } finally {
        setIsExporting(false);
      }
    };

    downloadPdf()
      .catch((error) => {
        console.error(error);
        setIsExporting(false);
      });
  };

  const rootClassName = [
    heroClasses({
      animated: 'animated' in props
        ? props.animated
        : false,
      colorMode: heroColorMode,
      magazineDetail: props.type === 'magazineDetail',
      titleIndent: props.type === 'magazineDetail',
    }),
    props.type === 'error'
      ? styles.errorPage
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClassName}>
      {props.type === 'error'
        ? (
          <>
            <div className={styles.leftColumn}>
              <div className={styles.errorLeftStack}>
                <p className={styles.errorStatus}>
                  404
                </p>
                <Icon
                  className={styles.errorIcon}
                  name='errorPage'
                />
              </div>
            </div>
            <div className={styles.rightColumn}>
              <SafeHtml
                as='h1'
                className={styles.title}
                html={props.titleHtml}
                id='content'
              />
              <SafeHtml
                as='p'
                className={styles.lead}
                html={props.descriptionHtml}
              />
              <Button
                className={styles.link}
                colorMode='light'
                element='link'
                href={props.homeHref}
                iconInlineStart={'arrowRight' as keyof typeof Icon}
                prefetch={true}
                style='text'
                text={props.homeButtonHtml}
              />
            </div>
          </>
        )
        : (
          <>
            {/* Left Column */}
            <div className={styles.leftColumn}>

              {/* Breadcrumb */}
              {props.breadcrumb &&
                <div data-magazine-breadcrumb='true'>
                  <Breadcrumb
                    {...props.breadcrumb}
                    className={styles.breadcrumb}
                  />
                </div>
              }

              {/* Side Title */}
              {'sideTitle' in props && props.sideTitle &&
                <SafeHtml
                  as='p'
                  html={rteToHtml(props.sideTitle)}
                  className={styles.sideTitle}
                />
              }
            </div>

            <div className={styles.rightColumn}>
              {/* Event Detail tag */}
              {props.type === 'eventDetail' && props.tag && (
                <Tag
                  className={styles.tag}
                  colorTheme={heroColorMode === 'light'
                    ? 'primary'
                    : 'secondary'
                  }
                  large={true}
                  text={props.tag}
                />
              )}

              {/* Title */}
              <SafeHtml
                as='h1'
                className={styles.title}
                html={rteToHtml(props.title)}
                id='content'
              />

              {/* Lead */}
              {props.lead &&
                <SafeHtml
                  as='p'
                  className={styles.lead}
                  html={rteToHtml(props.lead)}
                />
              }

              {/* News detail: date */}
              {props.type === 'newsDetail' && props.date &&
                <p className={styles.newsDate} data-testid='news-date'>{formatDateToReadableString({
                  dateString: props.date,
                  locale,
                })}</p>
              }

              {/* Event detail: event detail summary */}
              {eventDetailsString &&
                <p
                  className={styles.eventDetails}
                  data-testid='eventdetails'
                >{eventDetailsString}</p>
              }

              {/* Magazine detail: author, date & export button */}
              {props.type === 'magazineDetail' &&
                <div className={styles.magazineDetailExtras} data-magazine-detail-extras='true'>
                  <p className={styles.authorDate}>
                    <SafeHtml
                      as='span'
                      className={styles.author}
                      html={rteToHtml(props.author)}
                    />
                    <span className={styles.date}>{formatDateToReadableString({
                      dateString: props.date,
                      locale,
                    })}</span>
                  </p>
                  <Button
                    className={styles.exportButtonLarge}
                    colorMode={heroColorMode}
                    element='button'
                    iconInlineStart={'exportIcon' as keyof typeof Icon}
                    isLoading={isExporting}
                    onClick={handleExport}
                    style={isExporting
                      ? 'loading'
                      : 'outlined'
                    }
                    text={rteToHtml(props.exportArticleText)}
                  />

                  <Button
                    ariaLabel={rte1ToPlaintext(props.exportArticleText)}
                    className={styles.exportButtonSmall}
                    colorMode={heroColorMode}
                    element='button'
                    iconInlineStart={isExporting
                      ? undefined
                      : 'exportIcon' as keyof typeof Icon
                    }
                    isLoading={isExporting}
                    onClick={handleExport}
                    style={isExporting
                      ? 'loading'
                      : 'icon'
                    }
                    text=''
                  />
                </div>
              }

              {/* Link */}
              {'optionalLink' in props && props.optionalLink && props.optionalLink.includeLink && props.optionalLink.link &&
                <Button
                  className={styles.link}
                  colorMode={heroColorMode}
                  element='link'
                  href={props.optionalLinkUrl || props.optionalLink.link.internalLink.slug}
                  iconInlineStart={'arrowRight' as keyof typeof Icon}
                  prefetch={true}
                  style='text'
                  text={rteToHtml(props.optionalLink.link.linkText)}
                />
              }
            </div>
          </>
        )}
    </div>
  );
};
