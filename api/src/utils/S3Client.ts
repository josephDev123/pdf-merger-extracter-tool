import dotenv from "dotenv";
import { S3Client } from "@aws-sdk/client-s3";

dotenv.config();
export const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});
