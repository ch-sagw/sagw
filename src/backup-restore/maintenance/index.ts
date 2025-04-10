import { inquirerAskForOption } from '../helpers/inquirer';
import { selectBackupsToDelete } from './delete-selected-backups';
import { downloadBackups } from './download-backups';
import { listAllBackups } from './list-backups';

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

maintenanceEntry();
