import { JSX } from 'react';
import './styles.scss';

const EnvIndicator = (): JSX.Element => {
  const dbName = process.env.DATABASE_NAME;
  const dbUri = process.env.DATABASE_URI;
  let env;

  if (dbName === 'sagwlocal' && dbUri?.indexOf('sagwlocal') !== -1) {
    env = 'local';
  } else if (dbName === 'sagwplaywright' && dbUri?.indexOf('sagwplaywright') !== -1) {
    env = 'playwright';
  } else if (dbName === 'sagwtest' && dbUri?.indexOf('sagwtest') !== -1) {
    env = 'test';
  } else if (dbName === 'sagwprod' && dbUri?.indexOf('sagwprod') !== -1) {
    env = 'prod';
  }

  if (env) {
    return <p className='env'>You are on <span className='env-name'>{env}</span> environment.</p>;
  }

  return <></>;

};

export default EnvIndicator;
