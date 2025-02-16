import { Request, Response } from "express";
import fs from "fs-extra";
import { splitPDF } from "../utils/spliter";

export class PDFsplitController {
  async split(req: Request, res: Response): Promise<any> {
    // PDF splitting route
    const { file } = req;
    const { pagesRange } = req.body;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!pagesRange) {
      return res.status(400).json({ error: "pagesRange value is required" });
    }
    if (
      pagesRange.split("-").length < 1 ||
      typeof Number(pagesRange.split("-")[0]) != "number" ||
      typeof Number(pagesRange.split("-")[1]) != "number"
    ) {
      return res.status(400).json({ error: "Invalid pagesRange value" });
    }

    const inputPath = file.path;
    const pageRangeFormat = {
      start: Number(pagesRange.split("-")[0]),
      end: Number(pagesRange.split("-")[1]),
    };

    try {
      // Splitted the PDF
      const splitedFile = await splitPDF(inputPath, pagesRange);

      res
        .status(200)
        .json({ message: "PDF split successfully", file: splitedFile });

      // Clean up uploaded file
      await fs.remove(inputPath);
    } catch (error) {
      res.status(500).json({ error: "Failed to split PDF" });
    }
  }
}
