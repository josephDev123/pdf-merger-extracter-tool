import { Router } from "express";
import { PDFMergerController } from "../controllers/PDFMergerController";
import multer from "multer";

export const MergeRouterPDF = Router(); // Create a new router
const upload = multer({ dest: "uploads/" });
const PDFMergerControllerImpl = new PDFMergerController();
MergeRouterPDF.post(
  "/merge",
  upload.array("file"),
  PDFMergerControllerImpl.merge
);
