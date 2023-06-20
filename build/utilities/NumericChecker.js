"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumeric = void 0;
function isNumeric(value) {
    if (typeof value === 'number' || typeof value === 'string') {
        return /^-?\d+$/.test(value.toString());
    }
    return false;
}
exports.isNumeric = isNumeric;
