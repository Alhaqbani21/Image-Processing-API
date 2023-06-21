"use strict";
// ImageID.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processImage = exports.loadImage = exports.getScaleImagePath = exports.getImageById = void 0;
var sharp_1 = __importDefault(require("sharp"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var images = [];
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
function processImage(id, width, height, fullFolderPath, thumbFolderPath) {
    return new Promise(function (resolve, reject) {
        var originalImageName = fs_1.default
            .readdirSync(fullFolderPath)
            .find(function (file) { return file.startsWith(id); });
        if (!originalImageName) {
            reject("Original image not found for ID ".concat(id));
            return;
        }
        var originalImagePath = path_1.default.join(fullFolderPath, originalImageName);
        var scaledImageFilename = "".concat(id, "_").concat(width, "x").concat(height, ".jpg");
        var scaledImagePath = path_1.default.join(thumbFolderPath, scaledImageFilename);
        if (fs_1.default.existsSync(scaledImagePath)) {
            resolve(scaledImagePath);
            return;
        }
        // Validate the width and height parameters
        if (!width || !height || isNaN(+width) || isNaN(+height)) {
            reject('Invalid width or height parameter');
            return;
        }
        (0, sharp_1.default)(originalImagePath)
            .resize(+width, +height)
            .toFile(scaledImagePath, function (error) {
            if (error) {
                reject("Error resizing and saving image: ".concat(error));
                return;
            }
            resolve(scaledImagePath);
        });
    });
}
exports.processImage = processImage;
