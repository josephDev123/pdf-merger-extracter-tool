import { NextFunction, Request, Response } from "express";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import { PdfMerger } from "../utils/merger";
import { GlobalError } from "../utils/GlobalErrorHandler";
export class PDFMergerController {
  public async merge(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length <= 1) {
        next(
          new GlobalError(
            "EmptyOrlimitedFileUpload",
            "Please upload at least two PDF files.",
            400,
            true
          )
        );
        return;
      }

      const mergedPdfBytes = await PdfMerger(files);

      // Clean up uploaded files
      files.forEach((file) => fs.unlinkSync(file.path));

      // Send the merged PDF as a downloadable file
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=merged.pdf`,
      });

      res.send(Buffer.from(mergedPdfBytes));
      // throw Error("Error merging PDFs");
    } catch (error: unknown) {
      if (error instanceof GlobalError) {
        next(
          new GlobalError(
            error.name,
            error.message,
            error.statusCode,
            error.operational
          )
        );
        return;
      }

      if (error instanceof Error) {
        next(new GlobalError(error.name, error.message, 500, false));
        return;
      }

      return next(
        new GlobalError("Unknown", "internal server error", 500, false)
      );
    }
  }
}
