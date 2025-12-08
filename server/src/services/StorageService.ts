import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '../config';
import { randomUUID } from 'crypto';

export class StorageService {
    private s3Client: S3Client;

    constructor() {
        this.s3Client = new S3Client({
            region: config.aws.region,
            credentials: {
                accessKeyId: config.aws.accessKeyId,
                secretAccessKey: config.aws.secretAccessKey,
            },
        });
    }

    async generatePresignedUrl(contentType: string = 'application/octet-stream', expiresIn: number = 3600) {
        const ext = contentType.split('/').pop() || '';
        const filename = `${randomUUID()}.${ext}`;
        const key = filename;

        const command = new PutObjectCommand({
            Bucket: config.aws.bucket,
            Key: key,
            ContentType: contentType,
        });

        try {
            const url = await getSignedUrl(this.s3Client, command, { expiresIn });
            return { url, key, filename };
        } catch (error) {
            console.error('Error generating presigned URL:', error);
            throw new Error('Could not generate presigned URL');
        }
    }
}
