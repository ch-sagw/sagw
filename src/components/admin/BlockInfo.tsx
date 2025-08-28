import { UIFieldServerProps } from 'payload';
import { JSX } from 'react';

const BlockInfo = ({
  siblingData,
}: UIFieldServerProps): JSX.Element => <p>{siblingData?.message ?? 'Default text'}</p>;

export default BlockInfo;
