"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var sharp_1 = __importDefault(require("sharp"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var ImageProcess_1 = require("../utilities/ImageProcess");
var nameImages_1 = require("../utilities/nameImages");
var NumericChecker_1 = require("../utilities/NumericChecker");
var router = express_1.default.Router();
router.get('/placeholder', function (req, res) {
    var _a = req.query, width = _a.width, height = _a.height, style = _a.style;
    var image = (0, sharp_1.default)({
        create: {
            width: parseInt(width, 10) || 300,
            height: parseInt(height, 10) || 150,
            channels: 3,
            background: style ? "#".concat(style) : '#f0f0f0'
        }
    });
    image
        .toBuffer()
        .then(function (buffer) {
        res.set('Content-Type', 'image/jpeg');
        res.send(buffer);
    })
        .catch(function (error) {
        console.error('Error generating placeholder image:', error);
        res.status(500).send('Internal Server Error');
    });
});
router.get('/image/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, width, height, fullFolderPath, thumbFolderPath, originalImageName, scaledImageFilename, scaledImagePath, scaledImagePath_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                width = req.query.width;
                height = req.query.height;
                fullFolderPath = path_1.default.join(__dirname, '../assets/full');
                thumbFolderPath = path_1.default.join(__dirname, '../assets/thumb');
                if (!fs_1.default.existsSync(fullFolderPath)) {
                    console.error("Full folder not found at ".concat(fullFolderPath));
                    res.status(500).send('Internal Server Error');
                    return [2 /*return*/];
                }
                originalImageName = fs_1.default
                    .readdirSync(fullFolderPath)
                    .find(function (file) {
                    return file.startsWith(id);
                });
                if (!originalImageName) {
                    console.error("Original image not found for ID ".concat(id));
                    res.status(404).send('Image not found');
                    return [2 /*return*/];
                }
                scaledImageFilename = "".concat(id, "_").concat(width, "x").concat(height, ".jpg");
                scaledImagePath = path_1.default.join(thumbFolderPath, scaledImageFilename);
                if (fs_1.default.existsSync(scaledImagePath)) {
                    return [2 /*return*/, res.sendFile(scaledImagePath)];
                }
                // Validate the width and height parameters
                if (!width || !height || !(0, NumericChecker_1.isNumeric)(width) || !(0, NumericChecker_1.isNumeric)(height)) {
                    console.error("Invalid width or height parameter");
                    res.status(400).send('Invalid width or height parameter');
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, ImageProcess_1.processImage)(id, width, height, fullFolderPath, thumbFolderPath)];
            case 2:
                scaledImagePath_1 = _a.sent();
                res.sendFile(scaledImagePath_1);
                console.log('Resizing done');
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error('Error resizing and saving image:', error_1);
                res.status(500).send('Internal Server Error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/', function (req, res) {
    var fileNames = (0, nameImages_1.getFileNames)();
    var options = fileNames.map(function (fileName) {
        return "<option value=\"".concat(fileName, "\">").concat(fileName, "</option>");
    });
    var html = "<div\n    style=\"\n      margin: 0 auto;\n      border: solid 3px red;\n      border-radius: 3%;\n      width: 50vw;\n      height: 50vh;\n      display: flex;\n      flex-direction: column;\n      padding: 10%;\n    \"\n  >\n    <label for=\"images\">Choose an Image ID</label>\n    <select name=\"images\" id=\"images\">\n      ".concat(options.join('\n'), "\n    </select>\n    <input type=\"number\" id=\"widthInput\" placeholder=\"width\" />\n    <input type=\"number\" id=\"heightInput\" placeholder=\"height\" />\n    <button type=\"button\" onclick=\"processImage()\">Process</button>\n  </div>\n  <script>\n    function processImage() {\n      const imageId = document.getElementById('images').value;\n      const width = document.getElementById('widthInput').value;\n      const height = document.getElementById('heightInput').value;\n      const url = '/image/' + imageId + '?width=' + width + '&height=' + height;\n\n      // Redirect to the /image/:id route\n      window.location.href = url;\n    }\n  </script>");
    res.send(html);
});
exports.default = router;
