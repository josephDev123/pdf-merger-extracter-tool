"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mergeRoutes_1 = require("./routes/mergeRoutes");
const dotenv_1 = __importDefault(require("dotenv"));
const splitRouter_1 = require("./routes/splitRouter");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const allowedOrigins = ["http://localhost:3000"];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
}));
app.use("/api/", mergeRoutes_1.MergeRouterPDF);
app.use("/api/", splitRouter_1.SplitRouterPDF);
app.listen(port, () => {
    console.log("Server is running on http://localhost:" + port);
    console.log(process.env.PORT, process.env.AWS_ACCESS_KEY, process.env.AWS_SECRET_ACCESS_KEY, process.env.CLOUDFRONT_URL);
});
