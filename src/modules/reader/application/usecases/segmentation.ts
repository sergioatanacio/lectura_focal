import type { SegmentationModeValue } from '../../domain/values/SegmentationMode';

const ABBREVIATIONS = ['Dr.', 'Sr.', 'Sra.', 'etc.', 'p.ej.'];

export function segmentText(
  text: string,
  mode: SegmentationModeValue
): string[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  if (mode === 'PARRAFO') {
    return segmentByParagraph(text);
  } else {
    return segmentBySentence(text);
  }
}

function segmentByParagraph(text: string): string[] {
  const paragraphs = text.split(/\n\s*\n+/);

  return paragraphs
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

function segmentBySentence(text: string): string[] {
  const normalized = text.replace(/\s+/g, ' ').trim();

  const sentences: string[] = [];
  let current = '';
  let i = 0;

  while (i < normalized.length) {
    const char = normalized[i];
    current += char;

    if (char === '.' || char === '?' || char === '!') {
      const nextChar = i + 1 < normalized.length ? normalized[i + 1] : '';

      const endsWithAbbreviation = ABBREVIATIONS.some((abbr) =>
        current.trimEnd().endsWith(abbr)
      );

      if (!endsWithAbbreviation && (nextChar === ' ' || nextChar === '')) {
        const sentence = current.trim();
        if (sentence.length > 0) {
          sentences.push(sentence);
        }
        current = '';
      }
    }

    i++;
  }

  if (current.trim().length > 0) {
    sentences.push(current.trim());
  }

  return sentences;
}
