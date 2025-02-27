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
exports.PDFsplitController = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const spliter_1 = require("../utils/spliter");
class PDFsplitController {
    split(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // PDF splitting route
            const { file } = req;
            const { pagesRange } = req.body;
            if (!file) {
                return res.status(400).json({ error: "No file uploaded" });
            }
            if (!pagesRange) {
                return res.status(400).json({ error: "pagesRange value is required" });
            }
            if (pagesRange.split("-").length < 1 ||
                typeof Number(pagesRange.split("-")[0]) != "number" ||
                typeof Number(pagesRange.split("-")[1]) != "number") {
                return res.status(400).json({ error: "Invalid pagesRange value" });
            }
            const inputPath = file.path;
            // const pageRangeFormat = {
            //   start: Number(pagesRange.split("-")[0]),
            //   end: Number(pagesRange.split("-")[1]),
            // };
            try {
                // Splitted the PDF
                const splitedFile = yield (0, spliter_1.splitPDF)(inputPath, pagesRange);
                res
                    .status(200)
                    .json({ message: "PDF split successfully", file: splitedFile });
                // Clean up uploaded file
                yield fs_extra_1.default.remove(inputPath);
            }
            catch (error) {
                res.status(500).json({ error: "Failed to split PDF" });
            }
        });
    }
}
exports.PDFsplitController = PDFsplitController;
