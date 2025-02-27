"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeRouterPDF = void 0;
const express_1 = require("express");
const PDFMergerController_1 = require("../controllers/PDFMergerController");
const multer_1 = __importDefault(require("multer"));
exports.MergeRouterPDF = (0, express_1.Router)(); // Create a new router
const upload = (0, multer_1.default)({ dest: "uploads/" });
const PDFMergerControllerImpl = new PDFMergerController_1.PDFMergerController();
exports.MergeRouterPDF.post("/merge", upload.array("file"), PDFMergerControllerImpl.merge);
