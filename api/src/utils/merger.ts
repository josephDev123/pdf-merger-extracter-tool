import { PDFDocument } from "pdf-lib";
import fs from "fs";
import { PAPER_SIZES } from "../data.ts/paperSize";

// export async function PdfMerger(files: Express.Multer.File[]) {
//   // Create a new PDFDocument to hold the merged content
//   const mergedPdf = await PDFDocument.create();

//   // Loop through uploaded PDFs and merge them
//   for (const file of files) {
//     const pdfBytes = fs.readFileSync(file.path);
//     const srcDoc = await PDFDocument.load(pdfBytes);

//     const copiedPages = await mergedPdf.copyPages(
//       srcDoc,
//       srcDoc.getPageIndices()
//     );
//     copiedPages.forEach((page) => mergedPdf.addPage(page));
//   }

//   // Serialize the merged PDF to bytes
//   const mergedPdfBytes = await mergedPdf.save();
//   return mergedPdfBytes;
// }

export async function PdfMerger(
  files: Express.Multer.File[],
  paperSize: string = "A4"
) {
  const mergedPdf = await PDFDocument.create();

  const [fixedWidth, fixedHeight] = PAPER_SIZES[paperSize] || PAPER_SIZES["A4"];

  for (const file of files) {
    const pdfBytes = fs.readFileSync(file.path);
    const srcDoc = await PDFDocument.load(pdfBytes);

    for (const [index, page] of srcDoc.getPages().entries()) {
      const { width, height } = page.getSize();

      // Create a new page in the merged PDF with fixed dimensions
      const newPage = mergedPdf.addPage([fixedWidth, fixedHeight]);

      // Calculate scale factors to fit content inside the new page
      const scaleX = fixedWidth / width;
      const scaleY = fixedHeight / height;
      const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio

      const translateX = (fixedWidth - width * scale) / 2;
      const translateY = (fixedHeight - height * scale) / 2;

      // Draw the existing page onto the new standardized page
      const copiedPage = await mergedPdf.copyPages(srcDoc, [index]);
      const embeddedPage = await mergedPdf.embedPage(copiedPage[0]);
      newPage.drawPage(embeddedPage, {
        x: translateX,
        y: translateY,
        width: width * scale,
        height: height * scale,
      });
    }
  }

  return await mergedPdf.save();
}
