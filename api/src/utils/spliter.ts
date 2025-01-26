import { PDFDocument } from "pdf-lib";
import fs from "fs-extra";
import { s3Client } from "./S3Client";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";

const bucketName = "pdf-splitter-merge-bucket";

export const splitPDF = async (inputPath: string, pagesPerSplit: number) => {
  try {
    // Read and load the input PDF
    const pdfBytes = await fs.readFile(inputPath);
    const originalPdf = await PDFDocument.load(pdfBytes);

    const totalPages = originalPdf.getPageCount();
    const splitFiles: string[] = [];

    // Loop through the pages in chunks
    for (
      let startPage = 0;
      startPage < totalPages;
      startPage += pagesPerSplit
    ) {
      const endPage = Math.min(startPage + pagesPerSplit, totalPages);

      // Create a new PDF document for the split
      const splitPdf = await PDFDocument.create();

      // Copy the pages by their original indexes
      const copiedPages = await splitPdf.copyPages(
        originalPdf,
        Array.from({ length: endPage - startPage }, (_, i) => startPage + i)
      );

      // Add the copied pages to the new PDF
      copiedPages.forEach((page) => splitPdf.addPage(page));

      // Save the split PDF as a buffer
      const splitBuffer = await splitPdf.save();

      // Upload the split PDF to S3
      const fileName = `split_${Math.random()}-${startPage + 1}-${endPage}.pdf`;
      const uploadParams: PutObjectCommandInput = {
        Bucket: bucketName,
        Key: fileName,
        Body: splitBuffer,
        ContentType: "application/pdf",
      };

      await s3Client.send(new PutObjectCommand(uploadParams));

      // Add the S3 URL to the response
      splitFiles.push(`${process.env.CLOUDFRONT_URL}/${fileName}`);
    }

    return splitFiles;
  } catch (error) {
    console.error("Error splitting PDF:", error);
    throw error;
  }
};
