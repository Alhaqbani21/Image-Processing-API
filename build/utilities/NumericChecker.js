"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumeric = void 0;
function isNumeric(value) {
    return /^-?\d+$/.test(value);
}
exports.isNumeric = isNumeric;
