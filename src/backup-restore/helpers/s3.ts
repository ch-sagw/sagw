/**
 * Requires the follwoing env-variables:
 * - OVH_OS_ACCESS_PUBLIC_KEY
 * - OVH_OS_ACCESS_PRIVATE_KEY
 * - OVH_OS_IMAGES_BACKUP_CONTAINER_ENDPOINT
 */

import '../../../.env/index';
import {
  type Bucket,
  CreateBucketCommand,
  type CreateBucketCommandInput,
  DeleteBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  paginateListBuckets,
  paginateListObjectsV2,
  type PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';

import { Upload } from '@aws-sdk/lib-storage';
import { sortBucketsNewestFirst } from './date';

export class S3Helper {
  private _client;

  public constructor() {
    this._client = new S3Client({
      credentials: {
        accessKeyId: process.env.OVH_OS_ACCESS_PUBLIC_KEY || '',
        secretAccessKey: process.env.OVH_OS_ACCESS_PRIVATE_KEY || '',

      },
      endpoint: process.env.OVH_OS_IMAGES_BACKUP_CONTAINER_ENDPOINT,
    });
  }

  // BUCKETS

  public createBucket = async (bucketName: string): Promise<void> => {
    const input: CreateBucketCommandInput = {
      ACL: 'private',
      Bucket: bucketName,
    };

    const command = new CreateBucketCommand(input);

    await this._client.send(command);
  };

  public deleteBucket = async (bucketName: string): Promise<void> => {
    await this.deleteAllObjects(bucketName);

    const command = new DeleteBucketCommand({
      Bucket: bucketName,
    });

    await this._client.send(command);
  };

  private _getAllBuckets = async (): Promise<[(Bucket | undefined)?]> => {
    const buckets: [Bucket?] = [];

    const paginator = paginateListBuckets(
      {
        client: this._client,
      },
      {},
    );

    for await (const page of paginator) {
      if (page.Buckets) {
        buckets.push(...page.Buckets);
      }
    }

    return buckets;
  };

  public getBucketsWithPrefixSorted = async (prefix: string): Promise<(string | undefined)[]> => {
    const buckets = await this._getAllBuckets();
    const filteredBuckets = buckets.filter((bucket) => bucket?.Name?.indexOf(prefix) !== -1);
    const bucketsSorted = sortBucketsNewestFirst(filteredBuckets);
    const bucketList = bucketsSorted
      .map((bucket) => bucket?.Name);

    return bucketList;
  };

  // OBJECTS

  public addObject = async (params: PutObjectCommandInput): Promise<void> => {
    const upload = new Upload({
      client: this._client,
      leavePartsOnError: false,
      params: {
        Body: params.Body,
        Bucket: params.Bucket,
        Key: params.Key,
      },
    });

    await upload.done();
  };

  public getObject = async (bucketName: string, fileName: string, base64: boolean): Promise<string | undefined> => {
    const response = await this._client.send(new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    }));

    const transformedResult = await response.Body?.transformToString(base64
      ? 'base64'
      : undefined);

    return transformedResult;
  };

  public listObjectsOfBucket = async (bucketName: string): Promise<[(string | undefined)?]> => {

    const pageSize = '100';
    const objects: [string?] = [];

    const paginator = paginateListObjectsV2(
      {
        client: this._client,
        pageSize: Number.parseInt(pageSize, 10),
      },
      {
        Bucket: bucketName,
      },
    );

    for await (const page of paginator) {
      if (page.Contents) {
        const pageObjects = page.Contents.map((o) => o.Key);

        objects.push(...pageObjects);
      }
    }

    return objects;
  };

  public deleteObject = async (bucketName: string, objectKey: string): Promise<void> => {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });

    await this._client.send(command);
  };

  public deleteAllObjects = async (bucketName: string): Promise<void> => {
    const objects = await this.listObjectsOfBucket(bucketName);

    await Promise.all(objects.map(async (object) => {
      if (object) {
        await this.deleteObject(bucketName, object);
      }
    }));
  };
}
