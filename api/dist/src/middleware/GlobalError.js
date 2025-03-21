"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalErrorMiddleware = void 0;
const GlobalErrorHandler_1 = require("../utils/GlobalErrorHandler");
const GlobalErrorMiddleware = (err, req, res, next) => {
    console.error("error", err);
    console.error("stack", err.stack);
    console.error("error message", err.message);
    if (err instanceof GlobalErrorHandler_1.GlobalError) {
        if (err.operational) {
            res.status(err.statusCode).json({
                name: err.name,
                message: err.message,
            });
            return;
        }
        else {
            res.status(500).json({
                name: err.name,
                message: "Something went wrong",
            });
            return;
        }
    }
    else {
        res.status(500).json({
            name: "error",
            message: "Internal Server Error",
        });
        return;
    }
};
exports.GlobalErrorMiddleware = GlobalErrorMiddleware;
