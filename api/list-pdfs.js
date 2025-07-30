import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const pdfDir = path.join(process.cwd(), "public/pdfs");
  try {
    const files = fs.readdirSync(pdfDir).filter(file => file.endsWith(".pdf"));
    res.status(200).json({ pdfs: files });
  } catch (err) {
    res.status(500).json({ error: "Failed to read PDFs" });
  }
}