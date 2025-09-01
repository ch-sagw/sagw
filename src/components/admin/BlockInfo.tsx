import { UIFieldServerProps } from 'payload';
import { JSX } from 'react';

const BlockInfo = ({
  siblingData,
}: UIFieldServerProps): JSX.Element => <p style={{
  border: '1px solid var(--theme-elevation-800)',
  margin: '2rem 0',
  padding: '2rem',
  textAlign: 'center',
}}>{siblingData?.message ?? 'Default text'}</p>;

export default BlockInfo;
