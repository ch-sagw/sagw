import 'server-only';
import { JSX } from 'react';
import { Button } from '@/components/Button/Button';
import type { ButtonGroup as InterfaceButtonGroup } from '@/payload-types';

export const ButtonGroup = (props: InterfaceButtonGroup): JSX.Element => (
  <div className='button-group'>
    {props.buttons?.map((button) => (
      <Button
        key={button.id}
        {...button.button}
      ></Button>
    ))}
  </div>
);
