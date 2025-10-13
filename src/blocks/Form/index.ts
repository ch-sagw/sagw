import { checkboxBlock } from '@/blocks/Form/Checkbox';
import { radioBlock } from '@/blocks/Form/Radio';
import { emailBlock } from '@/blocks/Form/Email';
import { textBlock } from '@/blocks/Form/Text';
import { textareaBlock } from '@/blocks/Form/Textarea';
import { Block } from 'payload';

export const FormBlocks: Block[] = [
  checkboxBlock(),
  radioBlock(),
  emailBlock(),
  textBlock(),
  textareaBlock(),
];
