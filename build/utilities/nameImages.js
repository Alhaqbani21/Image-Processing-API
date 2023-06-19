"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileNames = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var fullFolderPath = path_1.default.join(__dirname, '../assets/full');
if (!fs_1.default.existsSync(fullFolderPath)) {
    console.error("Full folder not found at ".concat(fullFolderPath));
}
function getFileNames() {
    var fileNames = fs_1.default.readdirSync(fullFolderPath);
    return fileNames;
}
exports.getFileNames = getFileNames;
