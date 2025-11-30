'use client';

import { Icon } from '@/icons';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';
import { rteToHtml } from '@/utilities/rteToHtml';
import styles from '@/components/blocks/BibliographicReference/BibliographicReference.module.scss';
import { InterfaceRte } from '@/components/base/types/rte';
import { Button } from '@/components/base/Button/Button';

export type InterfaceBibliographicReferenceClientPropTypes = {
  text: InterfaceRte;
  buttonText: InterfaceRte;
};

export const BibliographicReferenceClient = ({
  text,
  buttonText,
}: InterfaceBibliographicReferenceClientPropTypes): React.JSX.Element => {
  const handleCopy = async (): Promise<void> => {
    await navigator.clipboard.writeText(rte1ToPlaintext(text));
  };

  return (
    <Button
      element='button'
      className={styles.button}
      onClick={handleCopy}
      text={rteToHtml(buttonText)}
      colorMode='white'
      style='text'
      iconInlineStart={'copy' as keyof typeof Icon}
    />
  );
};
