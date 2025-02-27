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
exports.PdfMerger = PdfMerger;
const pdf_lib_1 = require("pdf-lib");
const fs_1 = __importDefault(require("fs"));
const paperSize_1 = require("../data.ts/paperSize");
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
function PdfMerger(files_1) {
    return __awaiter(this, arguments, void 0, function* (files, paperSize = "A4") {
        const mergedPdf = yield pdf_lib_1.PDFDocument.create();
        const [fixedWidth, fixedHeight] = paperSize_1.PAPER_SIZES[paperSize] || paperSize_1.PAPER_SIZES["A4"];
        for (const file of files) {
            const pdfBytes = fs_1.default.readFileSync(file.path);
            const srcDoc = yield pdf_lib_1.PDFDocument.load(pdfBytes);
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
                const copiedPage = yield mergedPdf.copyPages(srcDoc, [index]);
                const embeddedPage = yield mergedPdf.embedPage(copiedPage[0]);
                newPage.drawPage(embeddedPage, {
                    x: translateX,
                    y: translateY,
                    width: width * scale,
                    height: height * scale,
                });
            }
        }
        return yield mergedPdf.save();
    });
}
