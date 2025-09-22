'use client';

import {
  createContext, useContext,
} from 'react';

const TenantContext = createContext<string | null>(null);

export const TenantProvider = ({
  tenant,
  children,
}: {
  tenant: string;
  children: React.ReactNode;
}): React.JSX.Element => (
  <TenantContext value={tenant}>
    {children}
  </TenantContext>
);

export const useTenant = (): string => {
  const ctx = useContext(TenantContext);

  if (!ctx) {
    throw new Error('useTenant must be used within TenantProvider');
  }

  return ctx;
};
