import React from 'react';
import styles from '@/components/base/SocialLinks/SocialLinks.module.scss';
import Facebook from '@/icons/social-media/facebook';
import Instagram from '@/icons/social-media/instagram';
import Linkedin from '@/icons/social-media/linkedin';
import Twitter from '@/icons/social-media/x';

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
}: InterfaceSocialLinksPropTypes): React.JSX.Element => (
  <ul
    className={`${styles.socialLinks} ${className}`}
  >
    {items.map((item, index) => (
      <li
        key={index}
        className={styles.item}
      >
        <a
          target='_blank'
          href={item.link}
          className={styles.link}
        >
          <span className={styles.text}>{item.text}</span>
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
