import React from 'react';
import { cva } from 'cva';
import styles from '@/components/global/Hero/Hero.module.scss';
import {
  Config,
  InterfaceHeroField, InterfaceHeroFieldHome, InterfaceHeroFieldMagazineDetail, InterfaceHeroFieldNewsDetail,
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
import { formatDateToReadableString } from '@/components/helpers/date';

type BaseHeroProps = {
  breadcrumb?: InterfaceBreadcrumbPropTypes;
  pageLanguage: Config['locale'];
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
      eventLocation?: string;
    };
    tag: string;
    type: 'eventDetail';
  } & InterfaceHeroField);

export const Hero = (props: InterfaceHeroPropTypes): React.JSX.Element => {
  const heroClasses = cva([styles.hero], {
    variants: {
      colorMode: {
        dark: [styles.dark],
        light: [styles.light],
        white: [styles.white],
      },
    },
  });

  let heroColorMode: ColorMode;

  if (props.type === 'home') {
    heroColorMode = 'dark';
  } else {
    heroColorMode = props.colorMode;
  }

  let eventDetailsString;

  if (props.type === 'eventDetail' && props.eventDetails) {
    eventDetailsString = formatEventDetails({
      dateEnd: props.eventDetails.dateEnd,
      dateStart: props.eventDetails.dateStart,
      eventLocation: props.eventDetails.eventLocation,
      language: props.eventDetails.language,
      pageLanguage: props.pageLanguage,
      time: props.eventDetails.time,
    });
  }

  return (
    <div className={heroClasses({
      colorMode: heroColorMode,
    })}>

      {/* Breadcrumb */}
      {props.breadcrumb &&
        <Breadcrumb
          {...props.breadcrumb}
          className={styles.breadcrumb}
        />
      }

      {/* Side Title */}
      {'sideTitle' in props && props.sideTitle &&
        <SafeHtml
          as='p'
          html={rteToHtml(props.sideTitle)}
          className={styles.sideTitle}
        />
      }

      {/* Event Detail tag */}
      {props.type === 'eventDetail' && props.tag &&
        <Tag
          text={props.tag}
          colorTheme='secondary'
          className={styles.tag}
        />
      }

      {/* Title */}
      <SafeHtml
        as='h1'
        html={rteToHtml(props.title)}
        className={styles.title}
      />

      {/* Lead */}
      {props.lead &&
        <SafeHtml
          as='p'
          html={rteToHtml(props.lead)}
          className={styles.lead}
        />
      }

      {/* News detail: date */}
      {props.type === 'newsDetail' && props.date &&
        <p className={styles.newsDate}>{formatDateToReadableString({
          dateString: props.date,
          locale: props.pageLanguage,
        })}</p>
      }

      {/* Event detail: event detail summary */}
      {eventDetailsString &&
        <p className={styles.eventDetails}>{eventDetailsString}</p>
      }

      {/* Magazine detail: author, date & export button */}
      {props.type === 'magazineDetail' &&
        <div className={styles.magazineDetailExtras}>
          <p className={styles.authorDate}>
            <SafeHtml
              as='span'
              html={rteToHtml(props.author)}
              className={styles.author}
            />
            <span className={styles.date}>{props.date}</span>
          </p>
          <Button
            element='button'
            text={rteToHtml(props.exportArticleText)}
            colorMode={heroColorMode}
            className={styles.exportButton}
            style='outlined'
            iconInlineStart={'exportIcon' as keyof typeof Icon}
            onClick={() => {

              // TODO
              console.log('export clicked');
            }}
          />
        </div>
      }

      {/* Link */}
      {'optionalLink' in props && props.optionalLink && props.optionalLink.includeLink && props.optionalLink.link &&
        <Button
          className={styles.link}
          element='link'
          href={props.optionalLink.link.internalLink}
          text={rteToHtml(props.optionalLink.link.linkText)}
          colorMode={heroColorMode}
          style='text'
          pageLanguage={props.pageLanguage}
          iconInlineStart={'arrowLeft' as keyof typeof Icon}
          ariaCurrent={true}
        />
      }
    </div >
  );
};
