import FastifyPlugin from 'fastify-plugin';
import { S3, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import cuid from 'cuid';

const s3Plugin = FastifyPlugin(
  async function (fastify) {
    if (fastify.s3) {
      throw new Error('s3 has already been registered.');
    }

    try {
      // create the s3 client
      const s3Client = new S3({
        region: fastify.secrets.AWS_REGION,
        credentials: {
          accessKeyId: fastify.secrets.AWS_ACCESS_KEY_ID,
          secretAccessKey: fastify.secrets.AWS_SECRET_ACCESS_KEY,
        },
      });

      const generateSignedUrl = (filename: string, contentType: string) => {
        const objectName = `${cuid()}.${filename.split('.').slice(-1)}`;
        const bucketName = fastify.secrets.AWS_BUCKET_NAME;

        return getSignedUrl(
          s3Client,
          new PutObjectCommand({
            Bucket: bucketName,
            Key: objectName,
            ContentType: contentType,
          }),
          { expiresIn: 60 * 10 } // 600 seconds
        );
      };

      if (!fastify.s3) {
        fastify.decorate('s3', {
          generateSignedUrl,
        });
      }
    } catch (error) {
      fastify.log.error(`Error creating s3 client: ${error}`);
      throw new Error('Unable to create s3 client');
    }
  },
  {
    name: 's3-plugin',
    dependencies: ['env-plugin'],
  }
);

export default s3Plugin;
