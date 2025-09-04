import { inquirerAskForOption } from '@/backup-restore/helpers/inquirer';
import { selectBackupsToDelete } from '@/backup-restore/maintenance/delete-selected-backups';
import { downloadBackups } from '@/backup-restore/maintenance/download-backups';
import { listAllBackups } from '@/backup-restore/maintenance/list-backups';

const maintenanceEntry = async (): Promise<void> => {
  const options: Record<string, string> = {
    delete: 'Select backup/s to delete',
    download: 'Download backups',
    list: 'List all backups',
  };

  const question = 'What would you like to do?';

  const selection = await inquirerAskForOption(question, options);

  if (selection === 'list') {
    await listAllBackups();
  } else if (selection === 'delete') {
    await selectBackupsToDelete();
  } else if (selection === 'download') {
    await downloadBackups();
  }
};

await maintenanceEntry();
