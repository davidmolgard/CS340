import * as fs from 'fs';

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
    width: number;
    height: number;
    maxColor: number;
    pixels: number[][]; // Each pixel is [R, G, B]
  
    constructor(width: number, height: number, maxColor: number, pixels: number[][]) {
      this.width = width;
      this.height = height;
      this.maxColor = maxColor;
      this.pixels = pixels;
    }

    displayInfo(): void {
        console.log(`PPM Image: ${this.width}x${this.height}, Max Color: ${this.maxColor}`);
    }

    writeToFile(filePath: string): void {
        const header = `P3\n${this.width} ${this.height}\n${this.maxColor}\n`;
        const pixelData = this.pixels.map(pixel => pixel.join(' ')).join('\n');

        const content = header + pixelData + '\n';
        fs.writeFileSync(filePath, content, 'utf-8');
    }
}

function parsePPM(filePath: string): PPM {
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.split(/\s+/).filter(line => line.length > 0);
    
    const magicNumber = lines.shift();
    if (magicNumber !== 'P3') {
        throw new Error('Invalid PPM file format. Please use P3 files only.');
    }
    const width = parseInt(lines.shift()!);
    const height = parseInt(lines.shift()!);
    const maxColor = parseInt(lines.shift()!);

    const pixels: number[][] = [];
    while (lines.length >= 3) {
        const r = parseInt(lines.shift()!);
        const g = parseInt(lines.shift()!);
        const b = parseInt(lines.shift()!);
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
} catch (error) {
    console.error(error);
    process.exit(1);
}
