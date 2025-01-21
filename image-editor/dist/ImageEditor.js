"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const args = process.argv.slice(2); // Slice to skip the first two arguments
if (args.length < 3) {
    console.error('Usage: node ImageEditor.js <input_file> <output_file> <filter>');
    process.exit(1);
}
const inputFilePath = args[0];
const outputFilePath = args[1];
const filter = args[2];
if (!['grayscale', 'invert', 'emboss', 'motionblur'].includes(filter)) {
    console.error('Invalid filter. Must be one of: grayscale, invert, emboss, motionblur');
    process.exit(1);
}
class PPM {
    width;
    height;
    maxColor;
    pixels; // Each pixel is [R, G, B]
    constructor(width, height, maxColor, pixels) {
        this.width = width;
        this.height = height;
        this.maxColor = maxColor;
        this.pixels = pixels;
    }
    displayInfo() {
        console.log(`PPM Image: ${this.width}x${this.height}, Max Color: ${this.maxColor}`);
    }
    writeToFile(filePath) {
        const header = `P3\n${this.width} ${this.height}\n${this.maxColor}\n`;
        const pixelData = this.pixels.map(pixel => pixel.join(' ')).join('\n');
        const content = header + pixelData + '\n';
        fs.writeFileSync(filePath, content, 'utf-8');
    }
}
function parsePPM(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.split(/\s+/).filter(line => line.length > 0);
    const magicNumber = lines.shift();
    if (magicNumber !== 'P3') {
        throw new Error('Invalid PPM file format. Please use P3 files only.');
    }
    const width = parseInt(lines.shift());
    const height = parseInt(lines.shift());
    const maxColor = parseInt(lines.shift());
    const pixels = [];
    while (lines.length >= 3) {
        const r = parseInt(lines.shift());
        const g = parseInt(lines.shift());
        const b = parseInt(lines.shift());
        pixels.push([r, g, b]);
    }
    if (pixels.length != width * height) {
        throw new Error('Pixel data does not match the specified width and height.');
    }
    return new PPM(width, height, maxColor, pixels);
}
try {
    const inputPPM = parsePPM(inputFilePath);
    inputPPM.writeToFile(outputFilePath);
}
catch (error) {
    console.error(error);
    process.exit(1);
}
//# sourceMappingURL=ImageEditor.js.map