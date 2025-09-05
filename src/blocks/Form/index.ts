import { CheckboxBlock } from '@/blocks/Form/Checkbox';
import { EmailBlock } from '@/blocks/Form/Email';
import { TextBlock } from '@/blocks/Form/Text';
import { TextareaBlock } from '@/blocks/Form/Textarea';
import { Block } from 'payload';

export const FormBlocks: Block[] = [
  CheckboxBlock,
  EmailBlock,
  TextBlock,
  TextareaBlock,
];
