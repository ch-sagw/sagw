import type { JSX } from 'react';
import type { UIFieldServerProps } from 'payload';
import type {
  InterfaceAssetCandidate,
  InterfaceAssetKept,
  InterfaceAssetsCleanupReport,
  InterfaceAssetSnapshot,
  InterfaceDeletionResult,
  InterfaceTenantReport,
} from '@/jobs/assetsCleanup/types';
import {
  collectReportProblems,
  countDeletions,
  formatBytes,
  formatDate,
  getEnvLabel,
  getModeLabel,
  rowNumber,
  sumBytes,
  sumDeletedBytes,
  withSize,
} from '@/jobs/assetsCleanup/report';
import { assetsCleanupTaskSlug } from '@/jobs/assetsCleanup/task';
import { isRecord } from '@/jobs/assetsCleanup/collectGeneric';
import '@/components/admin/AssetsCleanupJobReport/styles.scss';

// ########################################################################
// Renders the report of an assets cleanup run inside the payload-jobs
// view. Replaces the raw json output.
// ########################################################################

interface InterfaceLogEntry {
  completedAt?: string;
  error?: unknown;
  executedAt?: string;
  output?: unknown;
  state?: string;
  taskSlug?: string;
}

const getLastLogEntry = (data: Record<string, unknown>): InterfaceLogEntry | undefined => {
  const log = Array.isArray(data.log)
    ? data.log as InterfaceLogEntry[]
    : [];

  return [...log]
    .reverse()
    .find((entry) => entry.taskSlug === assetsCleanupTaskSlug);
};

const getReport = (entry: InterfaceLogEntry | undefined): InterfaceAssetsCleanupReport | undefined => {
  if (!entry || !isRecord(entry.output) || !isRecord(entry.output.report)) {
    return undefined;
  }

  return entry.output.report as unknown as InterfaceAssetsCleanupReport;
};

const formatDateTime = (value: string | undefined): string => {
  if (!value) {
    return '-';
  }

  const parsed = Date.parse(value);

  if (Number.isNaN(parsed)) {
    return value;
  }

  return (new Date(parsed))
    .toISOString()
    .replace('T', ' ')
    .substring(0, 19);
};

const stringifyError = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (isRecord(error) && typeof error.message === 'string') {
    return error.message;
  }

  return JSON.stringify(error, null, 2);
};

const AssetRows = ({
  assets,
  extra,
}: {
  assets: (InterfaceAssetSnapshot | InterfaceAssetCandidate | InterfaceAssetKept)[];
  extra?: (asset: InterfaceAssetSnapshot) => string;
}): JSX.Element => (
  <>
    {assets.map((asset, index) => {
      const adminUrl = 'adminUrl' in asset && typeof asset.adminUrl === 'string'
        ? asset.adminUrl
        : '';

      return (
        <tr key={`${asset.collection}-${asset.id}`}>
          <td className='assets-cleanup-report__number'>{rowNumber(index)}</td>
          <td>{asset.collection}</td>
          <td>
            {adminUrl
              ? <a href={adminUrl}>{asset.filename}</a>
              : asset.filename}
          </td>
          <td>{asset.label}</td>
          <td>{formatBytes(asset.filesize)}</td>
          <td>{formatDate(asset.createdAt)}</td>
          <td>{formatDate(asset.updatedAt)}</td>
          {extra
            ? <td>{extra(asset)}</td>
            : null}
        </tr>
      );
    })}
  </>
);

const AssetTable = ({
  assets,
  extra,
  extraHeader,
  title,
}: {
  assets: (InterfaceAssetSnapshot | InterfaceAssetCandidate | InterfaceAssetKept)[];
  extra?: (asset: InterfaceAssetSnapshot) => string;
  extraHeader?: string;
  title: string;
}): JSX.Element | null => {
  if (assets.length < 1) {
    return null;
  }

  return (
    <div className='assets-cleanup-report__table'>
      <h4>{title} ({withSize(assets.length, sumBytes(assets), assets.length === 1
        ? 'asset'
        : 'assets')})</h4>
      <table>
        <thead>
          <tr>
            <th className='assets-cleanup-report__number'>#</th>
            <th>Type</th>
            <th>File</th>
            <th>Title / Alt</th>
            <th>Size</th>
            <th>Created</th>
            <th>Updated</th>
            {extraHeader
              ? <th>{extraHeader}</th>
              : null}
          </tr>
        </thead>
        <tbody>
          <AssetRows assets={assets} extra={extra} />
        </tbody>
      </table>
    </div>
  );
};

const deletionStateLabel = (deletion: InterfaceDeletionResult): string => `${deletion.state} – ${deletion.message}`;

const TenantSection = ({
  tenant,
}: {
  tenant: InterfaceTenantReport;
}): JSX.Element => {
  const counts = countDeletions(tenant.deletions);
  const deletionsByAssetId = new Map(tenant.deletions.map((deletion) => [
    deletion.candidate.id,
    deletion,
  ]));

  return (
    <section className='assets-cleanup-report__tenant'>
      <h3>{tenant.tenantName} <span className='assets-cleanup-report__muted'>({tenant.tenantSlug})</span></h3>
      <p>
        {tenant.assets.total} assets ({tenant.assets.images} images, {tenant.assets.videos} videos, {tenant.assets.documents} documents)
        {' · '}{withSize(tenant.candidates.length, sumBytes(tenant.candidates), 'candidates')}
        {' · '}{withSize(counts.deleted, sumDeletedBytes(tenant.deletions), 'deleted')}
        {' · '}{counts.failed} failed
        {' · '}{counts.skipped} skipped
        {' · '}{tenant.keptFresh.length} still in safety window
      </p>

      {tenant.fuses.length > 0
        ? (
          <ul className='assets-cleanup-report__fuses'>
            {tenant.fuses.map((fuse) => <li key={fuse}>Deletion blocked: {fuse}</li>)}
          </ul>
        )
        : null}

      {tenant.deletionPerformed
        ? (
          <AssetTable
            assets={tenant.candidates}
            extra={(asset) => {
              const deletion = deletionsByAssetId.get(asset.id);

              return deletion
                ? deletionStateLabel(deletion)
                : '-';
            }}
            extraHeader='Result'
            title='Deleted'
          />
        )
        : (
          <AssetTable
            assets={tenant.candidates}
            title='Candidates (not deleted)'
          />
        )}

      <AssetTable
        assets={tenant.keptFresh}
        extra={(asset) => ('reasons' in asset && Array.isArray(asset.reasons)
          ? asset.reasons.join(', ')
          : '-')}
        extraHeader='Reason'
        title='Unused, but still in safety window'
      />
    </section>
  );
};

const ReportView = ({
  report,
}: {
  report: InterfaceAssetsCleanupReport;
}): JSX.Element => {
  const problems = collectReportProblems(report);

  return (
    <>
      <div className='assets-cleanup-report__header'>
        <span className={`assets-cleanup-report__badge assets-cleanup-report__badge--${report.env}`}>{getEnvLabel(report.env)}</span>
        <span className={`assets-cleanup-report__badge ${report.deletionPerformed
          ? 'assets-cleanup-report__badge--delete'
          : 'assets-cleanup-report__badge--report'}`}
        >
          {getModeLabel(report)}
        </span>
        {problems.length > 0
          ? <span className='assets-cleanup-report__badge assets-cleanup-report__badge--problem'>WITH PROBLEMS</span>
          : null}
      </div>

      <dl className='assets-cleanup-report__facts'>
        <dt>Started</dt>
        <dd>{formatDateTime(report.startedAt)}</dd>
        <dt>Finished</dt>
        <dd>{formatDateTime(report.finishedAt)} ({Math.round(report.durationMs / 1000)}s)</dd>
        <dt>Scanned</dt>
        <dd>
          {report.scan.docs} documents in {report.scan.collections.length} collections,
          {' '}{report.scan.versions} versions in {report.scan.versionCollections.length} version collections
          <details className='assets-cleanup-report__inline-details'>
            <summary>Show collections</summary>
            <p><strong>Collections:</strong> {report.scan.collections.join(', ')}</p>
            <p><strong>Version collections:</strong> {report.scan.versionCollections.join(', ')}</p>
          </details>
        </dd>
        <dt>References found</dt>
        <dd>{report.scan.referencedIds} ids, {report.scan.referencedFilenames} filenames, {report.scan.autoProjects} auto-download projects</dd>
        <dt>Safety window</dt>
        <dd>{report.minAgeDays} day(s), cutoff {formatDate(report.cutoff)}</dd>
        <dt>Totals</dt>
        <dd>
          {report.totals.assets} assets, {withSize(report.totals.candidates, report.totals.candidatesBytes, 'candidates')},
          {' '}{withSize(report.totals.deleted, report.totals.deletedBytes, 'deleted')},
          {' '}{report.totals.failed} failed, {report.totals.skipped} skipped, {report.totals.keptFresh} in safety window
        </dd>
        <dt>Mode</dt>
        <dd>{report.modeReason}</dd>
      </dl>

      {report.fuseOverrides.length > 0
        ? (
          <ul className='assets-cleanup-report__overrides'>
            {report.fuseOverrides.map((override) => <li key={override}>Safety limit loosened: {override}</li>)}
          </ul>
        )
        : null}

      {report.globalFuses.length > 0
        ? (
          <ul className='assets-cleanup-report__fuses'>
            {report.globalFuses.map((fuse) => <li key={fuse}>Deletion blocked: {fuse}</li>)}
          </ul>
        )
        : null}

      {problems.length > 0
        ? (
          <div className='assets-cleanup-report__problems'>
            <h3>Problems</h3>
            <ul>
              {problems.map((problem) => <li key={problem}>{problem}</li>)}
            </ul>
          </div>
        )
        : null}

      {report.tenants.map((tenant) => <TenantSection key={tenant.tenantId} tenant={tenant} />)}

      {report.unassignedAssets.length > 0
        ? (
          <section className='assets-cleanup-report__tenant'>
            <h3>Assets without tenant <span className='assets-cleanup-report__muted'>(never deleted)</span></h3>
            <AssetTable assets={report.unassignedAssets} title='Assets' />
          </section>
        )
        : null}

      {report.notifications.length > 0
        ? (
          <section className='assets-cleanup-report__tenant'>
            <h3>Notifications</h3>
            <ul>
              {report.notifications.map((notification) => (
                <li key={`${notification.channel}-${notification.target}`}>
                  {notification.ok
                    ? '✓'
                    : '✗'} {notification.channel} → {notification.target}: {notification.message}
                </li>
              ))}
            </ul>
          </section>
        )
        : null}

      <details className='assets-cleanup-report__raw'>
        <summary>Raw report (JSON)</summary>
        <pre>{JSON.stringify(report, null, 2)}</pre>
      </details>
    </>
  );
};

const AssetsCleanupJobReport = ({
  data,
}: UIFieldServerProps): JSX.Element => {
  const doc = isRecord(data)
    ? data
    : {};
  const entry = getLastLogEntry(doc);
  const report = getReport(entry);
  const jobError = doc.hasError
    ? doc.error
    : undefined;

  return (
    <div className='assets-cleanup-report'>
      <h2>Assets cleanup report</h2>

      {report
        ? <ReportView report={report} />
        : null}

      {!report && !jobError && !entry
        ? <p className='assets-cleanup-report__muted'>This job has not produced a report (yet).</p>
        : null}

      {entry?.state === 'failed' || jobError
        ? (
          <div className='assets-cleanup-report__problems'>
            <h3>The run failed</h3>
            <pre>{stringifyError(entry?.error || jobError)}</pre>
          </div>
        )
        : null}
    </div>
  );
};

export default AssetsCleanupJobReport;
