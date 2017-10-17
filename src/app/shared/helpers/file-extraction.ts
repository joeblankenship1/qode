import pdfjs from 'pdfjs-dist';
import Docxtemplater from 'docxtemplater';
import JSZip from 'jszip';

export class FileExtraction {

  constructor() {

  }

  public extractText(content, type) {
    switch (type) {
      case 'plain': {
        return this.extractTextPlain(content);
      }
      case 'rtf': {
        return this.extractTextRtf(content);
      }
      case 'pdf': {
        return this.extractTextPDF(content);
      }
      case 'docx': {
        return this.extractTextDocx(content);
      }
      default: {
        console.error('Invalid type');
        break;
      }
    }
    return this.extractTextDocx(content);
  }

  private extractTextPlain(content): Promise<any> {
    return new Promise(resolve => resolve(content));
  }

  private extractTextRtf(content): Promise<any> {
    const rtf = content.replace(/\{\*?\\[^{}]+}|[{}]|\\\n?[A-Za-z]+\n?(?:-?\d+)?[ ]?/g, '').trim();
    return new Promise(resolve => resolve(rtf));
  }

  private extractTextDocx(content): Promise<any> {
    const doc = new Docxtemplater();
    const zip = new JSZip(content);
    doc.loadZip(zip);
    return new Promise(resolve => resolve(doc.getFullText()));
  }

  private extractTextPDF(content): Promise<any> {
    pdfjs.disableWorker = true;
    return pdfjs.getDocument({ data: content })
      .then(pdf => {
        const maxPages = pdf.pdfInfo.numPages;
        const countPromises = []; // collecting all page promises
        for (let j = 1; j <= maxPages; j++) {
          const page = pdf.getPage(j);

          const txt = '';
          countPromises.push(page.then(function (p) { // add page promise
            const textContent = p.getTextContent({ normalizeWhitespace: true });
            return textContent.then(function (text) { // return content promise
              let lastY = text.items[0].transform[5];
              const temp = text.items.map((s, i) => {
                if (s.transform && lastY !== s.transform[5]) {
                  lastY = s.transform[5];
                  return s.width === 0 ? '\n' : '\n' + s.str.trim() + ' ';
                }
                return s.width === 0 ? '' : s.str.trim();
              }); // value page text
              const cleanText = temp.filter(item => item !== '');
              return cleanText.join(' ');
            });
          }));
        }
        // Wait for all pages and join text
        return Promise.all(countPromises).then(function (texts) {
          return texts.join('\r\n');
        });
      });
  }

}
