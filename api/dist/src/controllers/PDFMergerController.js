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
const GlobalErrorHandler_1 = require("../utils/GlobalErrorHandler");
class PDFMergerController {
    merge(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = req.files;
                if (!files || files.length < 2) {
                    throw new GlobalErrorHandler_1.GlobalError("Please upload at least two PDF files.", 400, true);
                }
                const mergedPdfBytes = yield (0, merger_1.PdfMerger)(files);
                // Clean up uploaded files
                files.forEach((file) => fs_1.default.unlinkSync(file.path));
                // Send the merged PDF as a downloadable file
                res.set({
                    "Content-Type": "application/pdf",
                    "Content-Disposition": `attachment; filename=merged.pdf`,
                });
                res.send(Buffer.from(mergedPdfBytes));
                // throw Error("Error merging PDFs");
            }
            catch (error) {
                return next(error);
            }
        });
    }
}
exports.PDFMergerController = PDFMergerController;
