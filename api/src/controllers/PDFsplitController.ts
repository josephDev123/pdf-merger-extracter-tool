import { NextFunction, Request, Response } from "express";
import fs from "fs-extra";
import { splitPDF } from "../utils/spliter";
import { GlobalError } from "../utils/GlobalErrorHandler";

export class PDFsplitController {
  async split(req: Request, res: Response, next: NextFunction): Promise<any> {
    // PDF splitting route
    const { file } = req;
    const { pagesRange } = req.body;

    if (!file) {
      next(new GlobalError("EmptyFileUpload", "No file uploaded", 400, true));
      return;
    }

    if (!pagesRange) {
      next(
        new GlobalError(
          "EmptyPagesRange",
          "pagesRange value is required",
          400,
          true
        )
      );
      return;
    }
    if (
      pagesRange.split("-").length < 1 ||
      typeof Number(pagesRange.split("-")[0]) != "number" ||
      typeof Number(pagesRange.split("-")[1]) != "number"
    ) {
      next(
        new GlobalError(
          "InvalidPagesRange",
          "Invalid pagesRange value",
          400,
          true
        )
      );
      return;
    }

    const inputPath = file.path;

    try {
      // Splitted the PDF
      const splitedFile = await splitPDF(inputPath, pagesRange);

      res
        .status(200)
        .json({ message: "PDF split successfully", file: splitedFile });

      // Clean up uploaded file
      await fs.remove(inputPath);
    } catch (error) {
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
      // res.status(500).json({ error: "Failed to split PDF" });
    }
  }
}
