
import { Document } from '../types';

declare const pdfjsLib: any;

const readTextFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target?.result as string);
    };
    reader.onerror = (error) => {
      reject(new Error(`Error reading file ${file.name}: ${error}`));
    };
    reader.readAsText(file);
  });
};

const readPdfFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target?.result) {
        return reject(new Error('Failed to read PDF file.'));
      }
      try {
        const pdf = await pdfjsLib.getDocument({ data: event.target.result }).promise;
        let content = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          content += textContent.items.map((item: any) => item.str).join(' ');
          content += '\n';
        }
        resolve(content);
      } catch (error) {
        reject(new Error(`Error parsing PDF file ${file.name}: ${error}`));
      }
    };
    reader.onerror = (error) => {
      reject(new Error(`Error reading file ${file.name}: ${error}`));
    };
    reader.readAsArrayBuffer(file);
  });
};

export const processFiles = async (files: File[]): Promise<Document[]> => {
  const documentPromises = files.map(async (file) => {
    let content = '';
    if (file.type === 'text/plain') {
      content = await readTextFile(file);
    } else if (file.type === 'application/pdf') {
      content = await readPdfFile(file);
    } else {
      console.warn(`Unsupported file type: ${file.type}. Skipping file: ${file.name}`);
      return null;
    }
    return { name: file.name, content };
  });

  const results = await Promise.all(documentPromises);
  return results.filter((doc): doc is Document => doc !== null);
};
