import { PDFDocument } from "pdf-lib";
import fs from "fs-extra";
// import { s3Client } from "./S3Client";
// import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { GlobalError } from "./GlobalErrorHandler";

// const bucketName = "pdf-splitter-merge-bucket";

// export const splitPDF = async (
//   inputPath: string,
//   pagesRange: Record<string, number>
// ) => {
//   try {
//     // Read and load the input PDF
//     const pdfBytes = await fs.readFile(inputPath);
//     const originalPdf = await PDFDocument.load(pdfBytes);

//     const totalPages = originalPdf.getPageCount();
//     const splitFiles: string[] = [];

//     // Loop through the pages in chunks
//     for (
//       let startPage = 0;
//       startPage < totalPages;
//       startPage += pagesRange.max
//     ) {
//       const endPage = Math.min(startPage + pagesRange.max, totalPages);

//       // Create a new PDF document for the split
//       const splitPdf = await PDFDocument.create();

//       // Copy the pages by their original indexes
//       const copiedPages = await splitPdf.copyPages(
//         originalPdf,
//         Array.from({ length: endPage - startPage }, (_, i) => startPage + i)
//       );

//       // Add the copied pages to the new PDF
//       copiedPages.forEach((page) => splitPdf.addPage(page));

//       // Save the split PDF as a buffer
//       const splitBuffer = await splitPdf.save();

//       // Upload the split PDF to S3
//       const fileName = `split_${Math.random()}-${startPage + 1}-${endPage}.pdf`;
//       const uploadParams: PutObjectCommandInput = {
//         Bucket: bucketName,
//         Key: fileName,
//         Body: splitBuffer,
//         ContentType: "application/pdf",
//       };

//       await s3Client.send(new PutObjectCommand(uploadParams));

//       // Add the S3 URL to the response
//       splitFiles.push(`${process.env.CLOUDFRONT_URL}/${fileName}`);
//     }

//     return splitFiles;
//   } catch (error) {
//     console.error("Error splitting PDF:", error);
//     throw error;
//   }
// };

export const splitPDF = async (
  inputPath: string,
  pagesRange: string // Accepts "start-end" or "singlePage"
) => {
  try {
    // Read and load the input PDF
    const pdfBytes = await fs.readFile(inputPath);
    const originalPdf = await PDFDocument.load(pdfBytes);
    const totalPages = originalPdf.getPageCount();
    let splitFiles: string;
    let extractedBufferResult: string;
    const cloudfrontURL =
      process.env.CLOUDFRONT_URL || "https://your-default-url.com";

    let pageIndices: number[] = [];

    if (pagesRange.includes("-")) {
      // Handle range "start-end"
      const [start, end] = pagesRange.split("-").map(Number);
      const startPage = Math.max(0, start - 1); // Convert to zero-based
      const endPage = Math.min(end, totalPages) - 1; // Ensure within bounds

      // Generate range of page indices
      pageIndices = Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      );
    } else {
      // Handle single-page selection
      const page = Number(pagesRange);
      if (page >= 1 && page <= totalPages) {
        pageIndices = [page - 1]; // Convert to zero-based index
      } else {
        // throw new Error(
        //   `Invalid page number: ${page}. Total pages: ${totalPages}`
        // );
        throw new GlobalError(
          "ExceedLimit",
          `Invalid page number: ${page}. Total pages: ${totalPages}`,
          400,
          true
        );
      }
    }

    // Create a new PDF document for the split
    const splitPdf = await PDFDocument.create();

    // Copy the selected pages
    const copiedPages = await splitPdf.copyPages(originalPdf, pageIndices);
    copiedPages.forEach((page) => splitPdf.addPage(page));

    // Save the split PDF as a buffer
    const splitBuffer = await splitPdf.save();
    // console.log(splitBuffer);

    // Upload the split PDF to S3
    // const fileName = `split_${Date.now()}-${pagesRange}.pdf`;
    // const uploadParams: PutObjectCommandInput = {
    //   Bucket: bucketName,
    //   Key: fileName,
    //   Body: splitBuffer,
    //   ContentType: "application/pdf",
    // };

    // await s3Client.send(new PutObjectCommand(uploadParams));

    // Add the S3 URL to the response
    // splitFiles = `${cloudfrontURL}/${fileName}`;
    // splitBufferResult = splitBuffer.;
    // splitFiles
    const base64PDF = Buffer.from(splitBuffer).toString("base64");
    extractedBufferResult = base64PDF;

    return extractedBufferResult;
  } catch (error) {
    console.error("Error splitting PDF:", error);
    if (error instanceof GlobalError) {
      throw new GlobalError(
        error.name,
        error.message,
        error.statusCode,
        error.operational
      );
    }

    if (error instanceof Error) {
      throw new GlobalError(error.name, error.message, 500, false);
    }

    throw new GlobalError("Unknown", "internal server error", 500, false);
  }
};
