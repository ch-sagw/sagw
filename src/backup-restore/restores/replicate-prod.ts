import chalk from 'chalk';
import dotenv from 'dotenv';
import { DbHelper } from '@/backup-restore/helpers/db';
import { inquirerAskForProceed } from '@/backup-restore/helpers/inquirer';
import { getErrorMessage } from '@/backup-restore/helpers/try-catch-error';
import {
  addBlob,
  deleteAllBlobs,
  getAllBlobs,
} from '@/backup-restore/helpers/blob';
import {
  Collection, Document,
} from 'mongodb';

const replicateDb = async (replicateTo: string, dbHelperSource: DbHelper, prodDbCollections: (Collection<Document>[] | undefined)): Promise<void> => {

  // ensure we start with prod env
  dotenv.config({
    override: true,
    path: '.env/.env.prod',
    quiet: true,
  });

  const prodUrl = process.env.DATABASE_URI;
  const prodDbName = process.env.DATABASE_NAME;

  // switch to other env
  dotenv.config({
    override: true,
    path: `.env/.env.${replicateTo}`,
    quiet: true,
  });

  const currentUrl = process.env.DATABASE_URI;
  const currentDbName = process.env.DATABASE_NAME;

  if (prodUrl === currentUrl) {
    throw new Error('Env-Var mismatch for DATABASE_URI. Aborting.');
  }

  const dbHelperTarget = new DbHelper();

  try {
    if (!currentDbName || !prodDbName) {
      throw new Error('Aborting. DATABASE_NAME is not defined in env.');
    }

    if (!prodDbCollections) {
      throw new Error('Aborting. No collections found in db.');
    }

    let collectionsCounter = 0;

    for await (const collection of prodDbCollections) {
      const {
        collectionName,
      } = collection;

      if (!collectionName.startsWith('system.')) {

        const results = await dbHelperSource.getContentOfCollection(collection);

        if (results.length > 0) {
          await dbHelperTarget.deleteCollection(currentDbName, collectionName);
          await dbHelperTarget.addDocumentsToCollection(currentDbName, collectionName, results);

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

    // ensure we start with prod env
    dotenv.config({
      override: true,
      path: '.env/.env.prod',
      quiet: true,
    });

    const prodToken = process.env.BLOB_READ_WRITE_TOKEN;

    const blobsProd = await getAllBlobs();

    // switch to other env
    dotenv.config({
      override: true,
      path: '.env/.env.test',
      quiet: true,
    });

    const testToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (prodToken === testToken) {
      throw new Error('Env-Var mismatch for BLOB_READ_WRITE_TOKEN. Aborting.');
    }

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
  let dbHelperSource;

  try {
    // Grab DATABASE_URI and BLOB_READ_WRITE_TOKEN from all environments
    // to make some configuration checks upfront.
    dotenv.config({
      override: true,
      path: '.env/.env.local',
      quiet: true,
    });

    const localDBUri = process.env.DATABASE_URI;
    const localBlobToken = process.env.BLOB_READ_WRITE_TOKEN;

    dotenv.config({
      override: true,
      path: '.env/.env.test',
      quiet: true,
    });

    const testDBUri = process.env.DATABASE_URI;
    const testBlobToken = process.env.BLOB_READ_WRITE_TOKEN;

    dotenv.config({
      override: true,
      path: '.env/.env.prod',
      quiet: true,
    });

    const prodDBUri = process.env.DATABASE_URI;
    const prodBlobToken = process.env.BLOB_READ_WRITE_TOKEN;
    const prodDbName = process.env.DATABASE_NAME;

    // Security checks. Make sure that local, test and prod have
    // different values for the env-vars.

    if (!prodDbName) {
      throw new Error('Env-Var DATABASE_NAME missing in prod environment.');
    }

    if (!localDBUri || !testDBUri || !prodDBUri) {
      throw new Error('Env-Var DATABASE_URI missing in one or more environments.');
    }

    if (!testBlobToken || !localBlobToken || !prodBlobToken) {
      throw new Error('Env-Var BLOB_READ_WRITE_TOKEN missing in one or more environments.');
    }

    if (
      localDBUri === testDBUri ||
      testDBUri === prodDBUri ||
      localDBUri === prodDBUri
    ) {
      throw new Error('Env-Var mismatch for for DATABASE_URI. Aborting.');
    }

    if (
      testBlobToken === prodBlobToken ||
      localBlobToken === prodBlobToken
    ) {
      throw new Error('Env-Var mismatch for for BLOB_READ_WRITE_TOKEN. Aborting.');
    }

    dbHelperSource = new DbHelper();

    const askForProceed = await inquirerAskForProceed('I will erase all collections in the local and test DB\'s, and replicate the collections from Prod to the Local and Test DB. Are you sure you want to continue?');

    if (!askForProceed) {
      throw new Error('Aborting.');
    }

    const askForProceed2 = await inquirerAskForProceed('I will delete all Blob data on Test and replicate all Blobs from Prod to test. Are you sure you want to continue?');

    if (!askForProceed2) {
      throw new Error('Aborting.');
    }

    // get prod db data
    const prodCollections = await dbHelperSource.getCollections(prodDbName);

    // replicate
    await replicateDb('test', dbHelperSource, prodCollections);
    await replicateDb('local', dbHelperSource, prodCollections);
    await replicateBlob();

  } catch (err) {
    console.log(chalk.bgRed(err));
  } finally {
    dbHelperSource?.getClient()
      ?.close();
  }
};

replicateProd();
