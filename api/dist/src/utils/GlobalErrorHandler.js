"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalError = void 0;
class GlobalError extends Error {
    constructor(message, statusCode, operational) {
        var _a;
        super(message);
        this.name = new.target.name; // Ensures correct class name in case of inheritance
        // Object.setPrototypeOf(this, new.target.prototype);
        this.statusCode = statusCode;
        this.operational = operational;
        (_a = Error.captureStackTrace) === null || _a === void 0 ? void 0 : _a.call(Error, this, this.constructor); // Improves stack trace readability
    }
}
exports.GlobalError = GlobalError;
