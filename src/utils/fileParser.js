import * as pdfjsLib from 'pdfjs-dist';

export const extractTextFromPDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const items = textContent.items.map(item => item.str);
    fullText += items.join(' ') + '\n';
  }
  return fullText;
};

export const generateSnippet = async (selectedFile, mode, MAX_LINES, MIN_LINES) => {
  let text = '';
  if (selectedFile.name.endsWith('.pdf')) {
    text = await extractTextFromPDF(selectedFile);
  } else {
    text = await selectedFile.text();
  }

  if (mode === 'TEXT') {
    const words = text.split(/\s+/).filter(w => w.trim().length > 0);
    if (words.length > 20) {
      const startIdx = Math.max(0, Math.floor(Math.random() * (words.length - 40)));
      const endIdx = Math.min(words.length, startIdx + Math.floor(Math.random() * 20) + 20);
      return words.slice(startIdx, endIdx).join(' ').trim();
    } else {
      return words.join(' ').trim();
    }
  } else {
    const lines = text.split('\n');
    // Allow empty files to not throw errors
    if(lines.length === 0) return '';
    const startIdx = Math.max(0, Math.floor(Math.random() * (lines.length - MAX_LINES)));
    const endIdx = Math.min(lines.length, startIdx + Math.floor(Math.random() * (MAX_LINES - MIN_LINES)) + MIN_LINES);

    let chunk = lines.slice(startIdx, endIdx);
    const indentMatch = chunk.filter(line => line.trim().length > 0).map(line => line.match(/^\s*/)?.[0]?.length || 0);
    if(indentMatch.length > 0){
      const minIndent = Math.min(...indentMatch);
      chunk = chunk.map(line => line.substring(minIndent).replace(/\r/g, ''));
    }
    
    return chunk.join('\n').trim();
  }
};

export const filterCodeFiles = (files) => {
  return files.filter(f =>
    !f.webkitRelativePath.includes('/node_modules/') &&
    !f.webkitRelativePath.includes('/dist/') &&
    !f.webkitRelativePath.includes('/.git/') &&
    !f.webkitRelativePath.includes('/build/') &&
    (f.name.endsWith('.js') || f.name.endsWith('.ts') || f.name.endsWith('.jsx') || f.name.endsWith('.tsx'))
  );
};

export const filterTextFiles = (files) => {
  return files.filter(f => {
    const name = f.name.toLowerCase();
    return name.endsWith('.txt') || name.endsWith('.pdf') || name.endsWith('.md');
  });
};
