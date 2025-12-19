import 'server-only';
import React from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/CtaLink/CtaLink.module.scss';
import { Section } from '@/components/base/Section/Section';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';
import { InterfaceCtaLinkBlock } from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { TypedLocale } from 'payload';
import { getPageUrl } from '@/utilities/getPageUrl';
import { getLocale } from 'next-intl/server';
import { getPayloadCached } from '@/utilities/getPayloadCached';

export type InterfaceCtaLinkPropTypes = {} & InterfaceCtaLinkBlock;

const ctaLinkClasses = cva([
  styles.ctaLink,
  styles.dark,
]);

export const CtaLink = async (props: InterfaceCtaLinkPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;
  const payload = await getPayloadCached();

  const title = rteToHtml(props.title);
  const subtitle = rteToHtml(props.text);

  let linkText = '';
  let linkHref = '';

  if (props.linkType === 'external' && props.linkExternal) {
    linkText = rteToHtml(props.linkExternal.externalLinkText);
    linkHref = props.linkExternal.externalLink;
  } else if (props.linkType === 'internal' && props.linkInternal) {
    linkText = rteToHtml(props.linkInternal.linkText);

    linkHref = await getPageUrl({
      locale,
      pageId: props.linkInternal.internalLink.documentId,
      payload,
    });
  } else if (props.linkType === 'mail' && props.linkMail) {
    linkText = rteToHtml(props.linkMail.linkText);
    linkHref = props.linkMail.email;
  }

  return (
    <Section
      className={ctaLinkClasses()}
      title={title}
      subtitle={subtitle}
      showTopLine={true}
      colorMode='dark'
    >
      <Button
        className={styles.button}
        element='link'
        text={linkText}
        href={linkHref}
        target={props.linkType === 'internal'
          ? undefined
          : '_blank'
        }
        colorMode='dark'
        style='filled'
        iconInlineStart={props.linkType === 'internal'
          ? 'arrowRight' as keyof typeof Icon
          : 'externalLink' as keyof typeof Icon
        }
        prefetch={true}
      />
    </Section>
  );
};
