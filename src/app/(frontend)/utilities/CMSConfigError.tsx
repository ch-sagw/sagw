import React from 'react';

export const CMSConfigError = ({
  message,
}: { message: string; }): React.JSX.Element => (
  <div style={{
    border: '5px solid red',
    padding: '2rem',
  }}>
    <p>Configuration error in CMS:</p>
    <p style={{
      fontWeight: 'bold',
    }}>{message}</p>
  </div>
);
