import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const pdfDir = path.join(process.cwd(), 'public/pdfs');
    const files = fs.readdirSync(pdfDir).filter(file => file.endsWith('.pdf'));
    res.status(200).json({ pdfs: files });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list PDFs' });
  }
}
