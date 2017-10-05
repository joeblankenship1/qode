import { Line } from './line.model';
import { QuoteDisplay } from './quote-display';

export class Page {
  private id: number;
  private lines: Line[];
  private pageDisplay: [{
    quoteId: number,
    lines: {
      startLine: number;
      endLine: number
    },
    column: number
  }];

  constructor(id: number, lines?: Line[]) {
    this.id = id;
    this.lines = lines ? lines : [];
  }

  getId() {
    return this.id;
  }

  public setLine(line: Line) {
    this.lines.push(line);
  }

  setLines(lines: Line[]) {
    this.lines = lines;
  }

  getLines() {
    return this.lines;
  }

  public setPageDisplay(pageDisplay) {
    this.pageDisplay = pageDisplay;
    this.lines.map(l => {
      const quotes = this.pageDisplay.filter(p => {
        return this.lineHasQuote(p.lines, l.id);
      });
      if (quotes.length > 0) {
        const lineDisplay = quotes.map(p => {
          return this.getColumn(p, l.id);
        });
        l.setQuoteId(lineDisplay);
      }
    });
  }

  public lineHasQuote(lines, lineId) {
    return lines.startLine <= lineId && lineId <= lines.endLine;
  }

  public getColumn(pageDisplay, l) {
    return {
      quoteId: pageDisplay.quoteId,
      column: pageDisplay.column,
      borderTop: pageDisplay.lines.startLine === l,
      borderBottom: pageDisplay.lines.endLine === l
    };
  }


}

