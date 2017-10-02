import { Injectable } from '@angular/core';
import { Line } from '../models/line.model';
import { Quote } from '../models/quote.model';

@Injectable()
export class LineService {

  constructor() { }

  public createLines(text) {
    const lines = [];
    const li = text.split(/\n|\r/)
      .map(l => [l]);

    li.map((listLine, i) => {
      const nLines = this.shortenLine(listLine);
      lines[i] = nLines;
    });

    const newArray: Line[] = [];
    lines.forEach(list => {
      list.forEach( item => {
        newArray.push(new Line(item));
      } );
    });
  return newArray;
}

  public updateLines(lines: Line[], indexList: boolean[], quote: Quote): Line[] {
    const updatedLines: Line[] = [];
    lines.map((l, i) => {
      if (indexList[i]) {
        l.setQuote(quote);
      }
      updatedLines.push(l);
    });
    this.updateSucessorQuotes(updatedLines, indexList, quote);
    return updatedLines;
  }

  public updateSucessorQuotes(lines: Line[], indexList: boolean[], quote: Quote) {
    lines.map((l, i) => {
      if (i > 0 && indexList[i - 1]) {
        l.setPredecessorQuote(quote);
      }
    });
  }

  private shortenLine(listLine) {
    let text = listLine[0];
    listLine.splice(0);
    while (text.length > 102) {
      const indexBlank = text.indexOf(' ', 102);
      listLine.push(text.substring(0, indexBlank));
      text = text.substring(indexBlank + 1);
    }
    listLine.push(text.substring(0));
    return listLine;
}

}
