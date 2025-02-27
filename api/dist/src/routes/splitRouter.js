"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitRouterPDF = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const PDFsplitController_1 = require("../controllers/PDFsplitController");
const upload = (0, multer_1.default)({ dest: "uploads/" });
exports.SplitRouterPDF = (0, express_1.Router)(); // Create a new router
const PDFsplitControllerImpl = new PDFsplitController_1.PDFsplitController();
// Split PDF route
exports.SplitRouterPDF.post("/split", upload.single("file"), PDFsplitControllerImpl.split);
