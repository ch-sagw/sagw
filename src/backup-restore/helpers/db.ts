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

  public constructor() {
    if (process.env.DATABASE_URI) {
      this._client = new MongoClient(process.env.DATABASE_URI);
      this._client.connect();
    }
  }

  public getClient = (): MongoClient | undefined => this._client;

  public getDb = (dbName: string): Db | undefined => {
    if (this._client) {
      return this._client.db(dbName);
    }

    return undefined;
  };

  public getCollections = async (dbName: string): Promise<Collection<Document>[] | undefined> => {
    const db = this.getDb(dbName);
    const collections = await db?.collections();

    return collections;
  };

  public getAllDocumentsOfCollection = async (collection: Collection): Promise<WithId<Document>[] | undefined> => {
    const results = await collection.find({})
      .toArray();

    return results;
  };

  public deleteCollection = async (dbName: string, collectionName: string): Promise<void> => {
    const db = this.getDb(dbName);

    await db?.collection(collectionName)
      .drop();

  };

  public deleteAllCollections = async (dbName: string): Promise<void> => {
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
    const db = this.getDb(dbName);

    await db?.collection(collectionName)
      .insertMany(items);
  };

  // todo: add return type
  public getContentOfCollection = async (collection: Collection): Promise<any> => {
    const results = await collection.find({})
      .toArray();

    return results;
  };
}
