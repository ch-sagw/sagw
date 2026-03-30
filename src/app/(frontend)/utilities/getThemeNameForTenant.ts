import 'server-only';
import { getThemeName } from './getThemeName';

export const getThemeNameForTenant = async ({
  tenantId,
  isSagw,
}: {
  tenantId: string;
  isSagw: boolean;
}): Promise<string> => {
  if (isSagw || !tenantId) {
    return 'sagw';
  }

  const theme = await getThemeName({
    id: tenantId,
  });

  return theme.docs[0]?.themeSelector || 'amber';
};
