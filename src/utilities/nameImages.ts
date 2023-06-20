import fs from 'fs';
import path from 'path';

const fullFolderPath = path.join(__dirname, '../assets/full');

if (!fs.existsSync(fullFolderPath)) {
    console.error(`Full folder not found at ${fullFolderPath}`);
}

export function getFileNames() {
    const fileNames = fs.readdirSync(fullFolderPath);
    return fileNames;
}
