import { PDFDocument } from "pdf-lib";
import fs from "fs";

export async function PdfMerger(files: Express.Multer.File[]) {
  // Create a new PDFDocument to hold the merged content
  const mergedPdf = await PDFDocument.create();

  // Loop through uploaded PDFs and merge them
  for (const file of files) {
    const pdfBytes = fs.readFileSync(file.path);
    const srcDoc = await PDFDocument.load(pdfBytes);

    const copiedPages = await mergedPdf.copyPages(
      srcDoc,
      srcDoc.getPageIndices()
    );
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  // Serialize the merged PDF to bytes
  const mergedPdfBytes = await mergedPdf.save();
  return mergedPdfBytes;
}
