import chalk from 'chalk';
import dotenv from 'dotenv';
import { DbHelper } from '../helpers/db';
import { inquirerAskForProceed } from '../helpers/inquirer';
import { getErrorMessage } from '../helpers/try-catch-error';
import {
  addBlob,
  deleteAllBlobs,
  getAllBlobs,
} from '../helpers/blob';

const replicateDb = async (replicateTo: string, dbHelperSource: DbHelper): Promise<void> => {
  dotenv.config({
    override: true,
    path: `.env/.env.${replicateTo}`,
  });

  const dbHelperTarget = new DbHelper();

  try {
    if (!process.env.DATABASE_NAME) {
      throw new Error('Aborting. DATABASE_NAME is not defined in env.');
    }

    const collections = await dbHelperSource.getCollections(process.env.DATABASE_NAME);

    if (!collections) {
      throw new Error('Aborting. No collections found in db.');
    }

    let collectionsCounter = 0;

    for (const collection of collections) {
      const {
        collectionName,
      } = collection;

      if (!collectionName.startsWith('system.')) {
        /* eslint-disable no-await-in-loop */
        const results = await dbHelperSource.getContentOfCollection(collection);

        if (results.length > 0) {
          await dbHelperTarget.deleteCollection(process.env.DATABASE_NAME, collectionName);
          await dbHelperTarget.addDocumentsToColletion(process.env.DATABASE_NAME, collectionName, results);

          collectionsCounter++;
        }

      }
    }

    console.log(chalk.bgGreen(`-->> Successfully restored ${collectionsCounter} collections from Prod to ${replicateTo}`));
  } catch (err) {
    console.log(chalk.bgRed('Error in DB replication.'));
    throw new Error(getErrorMessage(err));
  } finally {
    dbHelperTarget?.getClient()
      ?.close();
  }
};

const replicateBlob = async (): Promise<void> => {
  try {

    dotenv.config({
      override: true,
      path: '.env/.env.prod',
    });

    const blobsProd = await getAllBlobs();

    dotenv.config({
      override: true,
      path: '.env/.env.test',
    });

    await deleteAllBlobs();

    let blobCounter = 0;

    await Promise.all(blobsProd.map(async (blob) => {
      if (blob) {
        const res = await fetch(blob.url);

        if (res.body) {
          await addBlob(blob.pathname, res.body);

          blobCounter++;
        }
      }
    }));

    console.log(chalk.bgGreen(`-->> Successfully restored ${blobCounter} blobs from Prod to Test`));

  } catch (err) {
    console.log(chalk.bgRed('Error in Blob replication.'));
    throw new Error(getErrorMessage(err));
  }

};

const replicateProd = async (): Promise<void> => {
  const dbHelperSource = new DbHelper();

  try {
    const askForProceed = await inquirerAskForProceed('I will erase all collections in the local and test DB\'s, and replicate the collections from Prod to the Local and Test DB. Are you sure you want to continue?');

    if (!askForProceed) {
      throw new Error('Aborting.');
    }

    const askForProceed2 = await inquirerAskForProceed('I will delete all Blob data on Test and replicate all Blobs from Prod to test. Are you sure you want to continue?');

    if (!askForProceed2) {
      throw new Error('Aborting.');
    }

    await replicateDb('test', dbHelperSource);
    await replicateDb('local', dbHelperSource);
    await replicateBlob();

  } catch (err) {
    console.log(chalk.bgRed(err));
  } finally {
    dbHelperSource.getClient()
      ?.close();
  }
};

replicateProd();
