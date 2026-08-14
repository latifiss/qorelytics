import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const endpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY;
const secretAccessKey = process.env.R2_SECRET_KEY;
const bucket = process.env.R2_BUCKET;

if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
  throw new Error(
    "R2_ENDPOINT, R2_ACCESS_KEY, R2_SECRET_KEY, and R2_BUCKET must be configured.",
  );
}

const r2 = new S3Client({
  region: "auto",
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<void> {
  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
}

export async function getFromR2(
  key: string,
): Promise<Buffer> {
  const response = await r2.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );

  if (!response.Body) {
    throw new Error("R2 returned an empty response.");
  }

  const bytes = await response.Body.transformToByteArray();

  return Buffer.from(bytes);
}

export async function deleteFromR2(
  key: string,
): Promise<void> {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}

export function createStorageKey(
  userId: string,
  fileName: string,
): string {
  const extension =
    fileName.split(".").pop()?.toLowerCase() ?? "file";

  return `datasets/${userId}/${crypto.randomUUID()}.${extension}`;
}