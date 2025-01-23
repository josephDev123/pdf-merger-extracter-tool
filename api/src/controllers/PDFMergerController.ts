import { Request, Response } from "express";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";

export class PDFMergerController {
  public async merge(req: Request, res: Response): Promise<any> {
    // PDF merging route

    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length < 2) {
        return res
          .status(400)
          .json({ error: "Please upload at least two PDF files." });
      }

      // Create a new PDFDocument to hold the merged content
      const mergedPdf = await PDFDocument.create();

      // Loop through uploaded PDFs and merge them
      for (const file of files) {
        const pdfBytes = fs.readFileSync(file.path);
        const pdf = await PDFDocument.load(pdfBytes);

        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      // Serialize the merged PDF to bytes
      const mergedPdfBytes = await mergedPdf.save();

      // Clean up uploaded files
      files.forEach((file) => fs.unlinkSync(file.path));

      // Send the merged PDF as a downloadable file
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=merged.pdf`,
      });

      res.send(mergedPdfBytes);
    } catch (error) {
      console.error("Error merging PDFs:", error);
      res.status(500).json({ error: "Failed to merge PDFs" });
    }
  }
}
