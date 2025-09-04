/**
 * Requires the following env-variables:
 * - DATABASE_URI
 */

import '../../../.env/index';

import {
  Collection,
  Db,
  type Document,
  MongoClient,
  type WithId,
} from 'mongodb';

export class DbHelper {
  private _client: MongoClient | undefined;

  public constructor () {
    if (process.env.DATABASE_URI) {
      this._client = new MongoClient(process.env.DATABASE_URI);
    }
  }

  public connect = async (): Promise<void> => {
    if (!this._client) {
      return;
    }

    await this._client.connect();
  };

  public getClient = (): MongoClient | undefined => this._client;

  public getDb = async (dbName: string): Promise<Db | undefined> => {
    if (this._client) {
      await this.connect();

      return this._client.db(dbName);
    }

    return undefined;
  };

  public getCollections = async (dbName: string): Promise<Collection<Document>[] | undefined> => {
    await this.connect();
    const db = await this.getDb(dbName);
    const collections = await db?.collections();

    return collections;
  };

  public getAllDocumentsOfCollection = async (collection: Collection): Promise<WithId<Document>[] | undefined> => {
    await this.connect();
    const results = await collection.find({})
      .toArray();

    return results;
  };

  public deleteCollection = async (dbName: string, collectionName: string): Promise<void> => {
    await this.connect();
    const db = await this.getDb(dbName);

    await db?.collection(collectionName)
      .drop();

  };

  public deleteAllCollections = async (dbName: string): Promise<void> => {
    await this.connect();
    const collections = await this.getCollections(dbName);

    if (!collections) {
      return;
    }

    const promises = [];

    for (const collection of collections) {
      if (!collection.collectionName.startsWith('system.')) {
        promises.push(this.deleteCollection(dbName, collection.collectionName));
      }
    }

    await Promise.all(promises);
  };

  public addDocumentsToCollection = async (dbName: string, collectionName: string, items: any): Promise<void> => {
    await this.connect();
    const db = await this.getDb(dbName);

    await db?.collection(collectionName)
      .insertMany(items);
  };

  // todo: add return type
  public getContentOfCollection = async (collection: Collection): Promise<any> => {
    await this.connect();
    const results = await collection.find({})
      .toArray();

    return results;
  };
}
