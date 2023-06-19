"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var sharp_1 = __importDefault(require("sharp"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var nameImages_1 = require("../utilities/nameImages");
var router = express_1.default.Router();
router.get('/placeholder', function (req, res) {
    var _a = req.query, width = _a.width, height = _a.height, style = _a.style;
    var image = (0, sharp_1.default)({
        create: {
            width: parseInt(width) || 300,
            height: parseInt(height) || 150,
            channels: 3,
            background: style ? "#".concat(style) : '#f0f0f0',
        },
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
router.get('/image/:id', function (req, res) {
    var id = req.params.id;
    var _a = req.query, width = _a.width, height = _a.height;
    var fullFolderPath = path_1.default.join(__dirname, '../assets/full');
    var thumbFolderPath = path_1.default.join(__dirname, '../assets/thumb');
    if (!fs_1.default.existsSync(fullFolderPath)) {
        console.error("Full folder not found at ".concat(fullFolderPath));
        return res.status(500).send('Internal Server Error');
    }
    var originalImageName = fs_1.default.readdirSync(fullFolderPath).find(function (file) {
        return file.startsWith(id);
    });
    if (!originalImageName) {
        console.error("Original image not found for ID ".concat(id));
        return res.status(404).send('Image not found');
    }
    var originalImagePath = path_1.default.join(fullFolderPath, originalImageName);
    var scaledImagePath = path_1.default.join(thumbFolderPath, "".concat(id, "_").concat(width, "x").concat(height, ".jpg"));
    (0, sharp_1.default)(originalImagePath)
        .resize(parseInt(width), parseInt(height))
        .toFile(scaledImagePath, function (error) {
        if (error) {
            console.error('Error resizing and saving image:', error);
            return res.status(500).send('Internal Server Error');
        }
        res.sendFile(scaledImagePath);
    });
});
router.get('/', function (req, res) {
    var fileNames = (0, nameImages_1.getFileNames)();
    var options = fileNames.map(function (fileName) {
        return "<option value=\"".concat(fileName, "\">").concat(fileName, "</option>");
    });
    var html = "<div\n    style=\"\n      margin: 0 auto;\n      border: solid 3px red;\n      border-radius: 3%;\n      width: 50vw;\n      height: 50vh;\n      display: flex;\n      flex-direction: column;\n      padding: 10%;\n    \"\n  >\n    <label for=\"images\">Choose an Image ID</label>\n    <select name=\"images\" id=\"images\">\n      ".concat(options.join('\n'), "\n    </select>\n    <input type=\"number\" id=\"widthInput\" placeholder=\"width\" />\n    <input type=\"number\" id=\"heightInput\" placeholder=\"height\" />\n    <button type=\"button\" onclick=\"processImage()\">Process</button>\n  </div>\n  <script>\n    function processImage() {\n      const imageId = document.getElementById('images').value;\n      const width = document.getElementById('widthInput').value;\n      const height = document.getElementById('heightInput').value;\n      const url = '/image/' + imageId + '?width=' + width + '&height=' + height;\n\n      // Redirect to the /image/:id route\n      window.location.href = url;\n    }\n  </script>");
    res.send(html);
});
exports.default = router;
