import { Router } from "express";
import multer from "multer";

import { PDFsplitController } from "../controllers/PDFsplitController";

const upload = multer({ dest: "uploads/" });

export const SplitRouterPDF = Router(); // Create a new router
const PDFsplitControllerImpl = new PDFsplitController();

// Split PDF route
SplitRouterPDF.post(
  "/split",
  upload.single("file"),
  PDFsplitControllerImpl.split
);
