"use strict";
// ImageID.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadImage = exports.getScaleImagePath = exports.getImageById = void 0;
var path_1 = __importDefault(require("path"));
var images = [
    { id: '1', path: '/path/to/image1.jpg' },
    { id: '2', path: '/path/to/image2.jpg' }
    // Add more images as needed
];
function getImageById(id) {
    var image = images.find(function (img) { return img.id === id; });
    return image ? image.path : undefined;
}
exports.getImageById = getImageById;
var scaleDir = path_1.default.join(__dirname, 'scaled');
function getScaleImagePath(id, width, height) {
    var dimensions = "".concat(width, "x").concat(height);
    var fileName = "".concat(id, "_").concat(dimensions, ".jpg");
    return path_1.default.join(scaleDir, fileName);
}
exports.getScaleImagePath = getScaleImagePath;
function loadImage() {
    return new Promise(function (resolve) {
        setTimeout(function () {
            var image = {
                width: 800,
                height: 600,
                format: 'jpg'
            };
            resolve(image);
        }, 1000);
    });
}
exports.loadImage = loadImage;
