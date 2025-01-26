import { Request, Response } from "express";
import fs from "fs-extra";
import { splitPDF } from "../utils/spliter";

export class PDFsplitController {
  async split(req: Request, res: Response): Promise<any> {
    // PDF splitting route
    const { file } = req;
    const { pagesPerSplit } = req.body;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!pagesPerSplit || isNaN(pagesPerSplit) || pagesPerSplit <= 0) {
      return res.status(400).json({ error: "Invalid pagesPerSplit value" });
    }

    const inputPath = file.path;

    try {
      // Splitted the PDF
      const totalChunks = await splitPDF(
        inputPath,
        parseInt(pagesPerSplit, 10)
      );

      // Send success response
      const splitFiles = [];
      for (let i = 0; i <= totalChunks.length; i++) {
        splitFiles.push(totalChunks[i]);
      }

      res
        .status(200)
        .json({ message: "PDF split successfully", files: splitFiles });

      // Clean up uploaded file
      await fs.remove(inputPath);
    } catch (error) {
      res.status(500).json({ error: "Failed to split PDF" });
    }
  }
}
