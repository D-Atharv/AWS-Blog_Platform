import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const bucketName = process.env.S3_BUCKET_NAME as string;

export async function POST(req: Request) {
  const data = await req.formData();
  const file = data.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const fileName = `${uuidv4()}-${file.name}`;
  const fileBuffer = await file.arrayBuffer();

  const params = {
    Bucket: bucketName, // Bucket is now assured to be a string
    Key: `uploads/${fileName}`, // Folder in S3 where the file will be stored
    Body: Buffer.from(fileBuffer),
    ContentType: file.type, // Set content type based on the file
    ACL: 'public-read', // Makes the file publicly accessible
  };

  try {
    const uploadResult = await s3.upload(params).promise();
    return NextResponse.json({ filePath: uploadResult.Location }); // Return the S3 URL of the uploaded file
  } catch (error) {
    console.error('Error uploading to S3:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}
