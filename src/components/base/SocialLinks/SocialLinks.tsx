import React from 'react';
import styles from '@/components/base/SocialLinks/SocialLinks.module.scss';
import Facebook from '@/icons/social-media/facebook';
import Instagram from '@/icons/social-media/instagram';
import Linkedin from '@/icons/social-media/linkedin';
import Twitter from '@/icons/social-media/x';
import { useTranslations } from 'next-intl';

interface InterfaceSocialLinkItem {
  link: string;
  text: string;
  icon: 'linkedIn' | 'instagram' | 'facebook' | 'twitter';
}

export type InterfaceSocialLinksPropTypes = {
  items: InterfaceSocialLinkItem[];
  className?: string;
};

export const SocialLinks = ({
  items,
  className,
}: InterfaceSocialLinksPropTypes): React.JSX.Element => {
  const internalI18nA11y = useTranslations('a11y');
  const ariaLabel = `${internalI18nA11y('linkTarget')} ${internalI18nA11y('opensInNewWindow')}`;

  return (
    <ul
      className={`${styles.socialLinks} ${className}`}
    >
      {items.map((item, index) => (
        <li
          key={index}
          className={styles.item}
        >
          <a
            aria-label={`${item.text}. ${ariaLabel}`}
            target='_blank'
            href={item.link}
            className={styles.link}
          >
            {item.icon === 'facebook' &&
            <Facebook />
            }
            {item.icon === 'instagram' &&
            <Instagram />
            }
            {item.icon === 'linkedIn' &&
            <Linkedin />
            }
            {item.icon === 'twitter' &&
            <Twitter />
            }
          </a>
        </li>
      ))}
    </ul>
  );
};
