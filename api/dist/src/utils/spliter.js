"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitPDF = void 0;
const pdf_lib_1 = require("pdf-lib");
const fs_extra_1 = __importDefault(require("fs-extra"));
const S3Client_1 = require("./S3Client");
const client_s3_1 = require("@aws-sdk/client-s3");
const GlobalErrorHandler_1 = require("./GlobalErrorHandler");
const bucketName = "pdf-splitter-merge-bucket";
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
const splitPDF = (inputPath, pagesRange // Accepts "start-end" or "singlePage"
) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Read and load the input PDF
        const pdfBytes = yield fs_extra_1.default.readFile(inputPath);
        const originalPdf = yield pdf_lib_1.PDFDocument.load(pdfBytes);
        const totalPages = originalPdf.getPageCount();
        let splitFiles;
        const cloudfrontURL = process.env.CLOUDFRONT_URL || "https://your-default-url.com";
        let pageIndices = [];
        if (pagesRange.includes("-")) {
            // Handle range "start-end"
            const [start, end] = pagesRange.split("-").map(Number);
            const startPage = Math.max(0, start - 1); // Convert to zero-based
            const endPage = Math.min(end, totalPages) - 1; // Ensure within bounds
            // Generate range of page indices
            pageIndices = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
        }
        else {
            // Handle single-page selection
            const page = Number(pagesRange);
            if (page >= 1 && page <= totalPages) {
                pageIndices = [page - 1]; // Convert to zero-based index
            }
            else {
                // throw new Error(
                //   `Invalid page number: ${page}. Total pages: ${totalPages}`
                // );
                throw new GlobalErrorHandler_1.GlobalError("ExceedLimit", `Invalid page number: ${page}. Total pages: ${totalPages}`, 400, true);
            }
        }
        // Create a new PDF document for the split
        const splitPdf = yield pdf_lib_1.PDFDocument.create();
        // Copy the selected pages
        const copiedPages = yield splitPdf.copyPages(originalPdf, pageIndices);
        copiedPages.forEach((page) => splitPdf.addPage(page));
        // Save the split PDF as a buffer
        const splitBuffer = yield splitPdf.save();
        // Upload the split PDF to S3
        const fileName = `split_${Date.now()}-${pagesRange}.pdf`;
        const uploadParams = {
            Bucket: bucketName,
            Key: fileName,
            Body: splitBuffer,
            ContentType: "application/pdf",
        };
        yield S3Client_1.s3Client.send(new client_s3_1.PutObjectCommand(uploadParams));
        // Add the S3 URL to the response
        splitFiles = `${cloudfrontURL}/${fileName}`;
        return splitFiles;
    }
    catch (error) {
        console.error("Error splitting PDF:", error);
        if (error instanceof GlobalErrorHandler_1.GlobalError) {
            throw new GlobalErrorHandler_1.GlobalError(error.name, error.message, error.statusCode, error.operational);
        }
        if (error instanceof Error) {
            throw new GlobalErrorHandler_1.GlobalError(error.name, error.message, 500, false);
        }
        throw new GlobalErrorHandler_1.GlobalError("Unknown", "internal server error", 500, false);
    }
});
exports.splitPDF = splitPDF;
