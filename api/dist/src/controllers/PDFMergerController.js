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
exports.PDFMergerController = void 0;
const fs_1 = __importDefault(require("fs"));
const merger_1 = require("../utils/merger");
class PDFMergerController {
    merge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = req.files;
                if (!files || files.length < 2) {
                    return res
                        .status(400)
                        .json({ error: "Please upload at least two PDF files." });
                }
                // // Create a new PDFDocument to hold the merged content
                // const mergedPdf = await PDFDocument.create();
                // // Loop through uploaded PDFs and merge them
                // for (const file of files) {
                //   const pdfBytes = fs.readFileSync(file.path);
                //   const srcDoc = await PDFDocument.load(pdfBytes);
                //   const copiedPages = await mergedPdf.copyPages(
                //     srcDoc,
                //     srcDoc.getPageIndices()
                //   );
                //   copiedPages.forEach((page) => mergedPdf.addPage(page));
                // }
                // // Serialize the merged PDF to bytes
                // const mergedPdfBytes = await mergedPdf.save();
                const mergedPdfBytes = yield (0, merger_1.PdfMerger)(files);
                // Clean up uploaded files
                files.forEach((file) => fs_1.default.unlinkSync(file.path));
                // Send the merged PDF as a downloadable file
                res.set({
                    "Content-Type": "application/pdf",
                    "Content-Disposition": `attachment; filename=merged.pdf`,
                });
                res.send(Buffer.from(mergedPdfBytes));
            }
            catch (error) {
                console.error("Error merging PDFs:", error);
                res.status(500).json({ error: "Failed to merge PDFs" });
            }
        });
    }
}
exports.PDFMergerController = PDFMergerController;
