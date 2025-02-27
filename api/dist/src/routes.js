"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeRouterPDF = void 0;
const express_1 = require("express");
const PDFMergerController_1 = require("./controllers/PDFMergerController");
exports.MergeRouterPDF = (0, express_1.Router)(); // Create a new router
const PDFMergerControllerImpl = new PDFMergerController_1.PDFMergerController();
exports.MergeRouterPDF.get("/merge", PDFMergerControllerImpl.merge);
