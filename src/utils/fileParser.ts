import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

// ── Worker setup for pdfjs-dist v4 ──────────────────────────────────────────
if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

// ── Tesseract lazy worker (reused across calls) ─────────────────────────────
let tesseractWorker: Tesseract.Worker | null = null;

const getTesseractWorker = async (): Promise<Tesseract.Worker> => {
  if (!tesseractWorker) {
    tesseractWorker = await Tesseract.createWorker('eng');
  }
  return tesseractWorker;
};

// ── OCR a single PDF page via canvas rendering ──────────────────────────────
const ocrPdfPage = async (
  page: Awaited<ReturnType<Awaited<ReturnType<typeof pdfjsLib.getDocument>['promise']>['getPage']>>,
): Promise<string> => {
  const scale = 2; // render at 2× for better OCR accuracy
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  await page.render({ canvasContext: ctx, viewport }).promise;

  const worker = await getTesseractWorker();
  const { data } = await worker.recognize(canvas);
  canvas.remove();
  return data.text;
};

// ── PDF text extraction (with OCR fallback) ─────────────────────────────────
export const extractTextFromPDF = async (file: File): Promise<string> => {
  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await file.arrayBuffer();
  } catch (err) {
    throw new Error(`Could not read file "${file.name}": ${String(err)}`);
  }

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    disableRange: true,
    disableStream: true,
    disableAutoFetch: true,
  });

  let pdf: Awaited<typeof loadingTask.promise>;
  try {
    pdf = await loadingTask.promise;
  } catch (err) {
    throw new Error(`PDF parsing failed for "${file.name}": ${String(err)}`);
  }

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);

    // Try digital text extraction first
    const textContent = await page.getTextContent();
    let pageText = textContent.items
      .map(item => ('str' in item ? item.str : ''))
      .join(' ')
      .trim();

    // Fallback to OCR if the page has little/no embedded text
    if (pageText.length < 10) {
      console.log(`[fileParser] Page ${i}: no embedded text, running OCR…`);
      pageText = await ocrPdfPage(page);
    }

    fullText += pageText + '\n';
  }

  await pdf.destroy();
  return fullText.trim();
};

// ── Snippet generator ───────────────────────────────────────────────────────
export const generateSnippet = async (
  selectedFile: File,
  mode: string,
  maxLines: number,
  minLines: number,
  wordRange: [number, number] = [20, 40],
): Promise<string> => {
  let text = '';

  if (selectedFile.name.toLowerCase().endsWith('.pdf')) {
    text = await extractTextFromPDF(selectedFile);
  } else {
    text = await selectedFile.text();
  }

  if (!text.trim()) return '';

  if (mode === 'TEXT') {
    const normalised = text.replace(/\s+/g, ' ').trim();
    const words = normalised.split(' ').filter(w => w.length > 0);
    if (words.length <= 10) return words.join(' ');

    const [minW, maxW] = wordRange;
    const count = minW + Math.floor(Math.random() * (maxW - minW));
    const startIdx = Math.floor(Math.random() * Math.max(0, words.length - count));
    return words.slice(startIdx, startIdx + count).join(' ').trim();

  } else {
    const lines = text.split('\n');
    if (lines.length === 0) return '';

    const lineCount = minLines + Math.floor(Math.random() * Math.max(1, maxLines - minLines));
    const startIdx = Math.floor(Math.random() * Math.max(0, lines.length - lineCount));
    const endIdx = Math.min(lines.length, startIdx + lineCount);
    let chunk = lines.slice(startIdx, endIdx);

    const indentLengths = chunk
      .filter(line => line.trim().length > 0)
      .map(line => line.match(/^\s*/)?.[0]?.length ?? 0);

    if (indentLengths.length > 0) {
      const minIndent = Math.min(...indentLengths);
      chunk = chunk.map(line => line.substring(minIndent).replace(/\r/g, ''));
    }

    return chunk.join('\n').trim();
  }
};

// ── File filters ────────────────────────────────────────────────────────────
export const filterCodeFiles = (files: File[]): File[] =>
  files.filter(f =>
    !f.webkitRelativePath.includes('/node_modules/') &&
    !f.webkitRelativePath.includes('/dist/') &&
    !f.webkitRelativePath.includes('/.git/') &&
    !f.webkitRelativePath.includes('/build/') &&
    /\.(js|ts|jsx|tsx)$/.test(f.name),
  );

export const filterTextFiles = (files: File[]): File[] =>
  files.filter(f => /\.(txt|pdf|md)$/i.test(f.name));
