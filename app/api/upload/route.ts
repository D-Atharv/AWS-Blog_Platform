import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.S3_BUCKET_NAME;

if (!accessKeyId || !secretAccessKey || !region || !bucketName) {
  throw new Error("Missing AWS S3 configuration environment variables.");
}

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileName = `uploads/${uuidv4()}-${file.name}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.type,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const filePath = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
    return NextResponse.json({ filePath });
  } catch (error) {
    console.error('Error uploading to S3:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}
