import { Line } from './line.model';
import { QuoteDisplay } from './quote-display';
import { AppSettings } from '../../app.settings';
import { Quote } from './quote.model';

export class Page {
  private id: number;
  private lines: Line[];
  private pageDisplay: [{
    quote: Quote,
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
      if (l) {
        const quotes = this.pageDisplay.filter(p => {
          return this.lineHasQuote(p.lines, l.id);
        });
        if (quotes.length > 0) {
          const lineDisplay = quotes.map(p => {
            return this.getColumn(p, l.id);
          });
          l.setRelatedQuotes(lineDisplay);
        }
      }
    });
  }

  public lineHasQuote(lines, lineId) {
    const line = lineId;
    if (lines.startLine === lines.endLine && lines.startLine === line) {
       return true;
    } else {
       return lines.startLine <= line && line <= lines.endLine;
    }
  }

  public getColumn(pageDisplay, l) {
    return {
      quote: pageDisplay.quote,
      column: pageDisplay.column,
      borderTop: pageDisplay.lines.startLine === l,
      borderBottom: pageDisplay.lines.endLine === l
    };
  }


}

