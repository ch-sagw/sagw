import type { Payload } from 'payload';
import type {
  InterfaceAssetsCleanupReport, InterfaceNotificationResult, InterfaceTenantReport,
} from '@/jobs/assetsCleanup/types';
import type { InterfaceAssetsCleanupConfig } from '@/jobs/assetsCleanup/config';
import {
  buildCombinedMailHtml, buildTenantMailHtml, getEnvLabel, getModeLabel,
} from '@/jobs/assetsCleanup/report';
import {
  tenantRoles, userRoles,
} from '@/collections/Plc/Users/roles';
import { isRecord } from '@/jobs/assetsCleanup/collectGeneric';

// ########################################################################
// Mail notification: one mail per tenant
//
// prod: tenant admins of the tenant (fallback: super admins)
// everything else: fallback address
// ########################################################################

const extractId = (value: unknown): string | null => {
  if (typeof value === 'string') {
    return value;
  }

  if (isRecord(value) && typeof value.id === 'string') {
    return value.id;
  }

  return null;
};

const getTenantAdminMails = async (payload: Payload, tenantId: string): Promise<string[]> => {
  const users = await payload.find({
    collection: 'users',
    depth: 0,
    limit: 500,
    pagination: false,
    where: {
      'tenants.tenant': {
        equals: tenantId,
      },
    },
  });

  const mails = users.docs
    .filter((user) => {
      const assignments = Array.isArray(user.tenants)
        ? user.tenants
        : [];

      return assignments.some((assignment) => extractId(assignment.tenant) === tenantId && Array.isArray(assignment.roles) && assignment.roles.includes(tenantRoles.admin));
    })
    .map((user) => user.email)
    .filter((mail): mail is string => typeof mail === 'string' && mail.length > 0);

  return [...new Set(mails)];
};

const getSuperAdminMails = async (payload: Payload): Promise<string[]> => {
  const users = await payload.find({
    collection: 'users',
    depth: 0,
    limit: 500,
    pagination: false,
    where: {
      roles: {
        contains: userRoles.admin,
      },
    },
  });

  const mails = users.docs
    .map((user) => user.email)
    .filter((mail): mail is string => typeof mail === 'string' && mail.length > 0);

  return [...new Set(mails)];
};

const resolveRecipients = async ({
  config,
  payload,
  tenantId,
}: {
  config: InterfaceAssetsCleanupConfig;
  payload: Payload;
  tenantId: string;
}): Promise<string[]> => {
  if (config.env !== 'prod') {
    return [config.fallbackMail];
  }

  const tenantAdmins = await getTenantAdminMails(payload, tenantId);

  if (tenantAdmins.length > 0) {
    return tenantAdmins;
  }

  const superAdmins = await getSuperAdminMails(payload);

  if (superAdmins.length > 0) {
    return superAdmins;
  }

  return [config.fallbackMail];
};

const sendTenantReportMail = async ({
  config,
  payload,
  report,
  tenant,
}: {
  config: InterfaceAssetsCleanupConfig;
  payload: Payload;
  report: InterfaceAssetsCleanupReport;
  tenant: InterfaceTenantReport;
}): Promise<InterfaceNotificationResult> => {
  let recipients: string[] = [];

  try {
    recipients = await resolveRecipients({
      config,
      payload,
      tenantId: tenant.tenantId,
    });

    await payload.sendEmail({
      html: buildTenantMailHtml(report, tenant),
      subject: `[${getEnvLabel(report.env)}] Assets cleanup - ${tenant.tenantName} - ${getModeLabel(report)} - ${tenant.candidates.length} candidate(s)`,
      to: recipients,
    });

    return {
      channel: 'mail',
      message: `Mail sent to ${recipients.join(', ')}`,
      ok: true,
      target: tenant.tenantName,
    };
  } catch (error) {
    return {
      channel: 'mail',
      message: `Mail to ${recipients.join(', ') || 'unknown recipients'} failed: ${error instanceof Error
        ? error.message
        : String(error)}`,
      ok: false,
      target: tenant.tenantName,
    };
  }
};

// on non-prod environments, everything goes into one combined mail to the
// fallback address, so nobody gets flooded with one mail per tenant.
const sendCombinedReportMail = async ({
  config,
  payload,
  report,
}: {
  config: InterfaceAssetsCleanupConfig;
  payload: Payload;
  report: InterfaceAssetsCleanupReport;
}): Promise<InterfaceNotificationResult> => {
  try {
    await payload.sendEmail({
      html: buildCombinedMailHtml(report),
      subject: `[${getEnvLabel(report.env)}] Assets cleanup - ${getModeLabel(report)} - ${report.totals.candidates} candidate(s) in ${report.tenants.length} tenant(s)`,
      to: [config.fallbackMail],
    });

    return {
      channel: 'mail',
      message: `Combined mail sent to ${config.fallbackMail}`,
      ok: true,
      target: 'all tenants',
    };
  } catch (error) {
    return {
      channel: 'mail',
      message: `Combined mail to ${config.fallbackMail} failed: ${error instanceof Error
        ? error.message
        : String(error)}`,
      ok: false,
      target: 'all tenants',
    };
  }
};

export const sendReportMails = async ({
  config,
  payload,
  report,
}: {
  config: InterfaceAssetsCleanupConfig;
  payload: Payload;
  report: InterfaceAssetsCleanupReport;
}): Promise<InterfaceNotificationResult[]> => {
  if (config.env !== 'prod') {
    return [
      await sendCombinedReportMail({
        config,
        payload,
        report,
      }),
    ];
  }

  const results: InterfaceNotificationResult[] = [];

  for await (const tenant of report.tenants) {
    results.push(await sendTenantReportMail({
      config,
      payload,
      report,
      tenant,
    }));
  }

  return results;
};
