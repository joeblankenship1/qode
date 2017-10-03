import { Injectable } from '@angular/core';
import { Line } from '../models/line.model';
import { Quote } from '../models/quote.model';
import { element } from 'protractor';

@Injectable()
export class LineService {

  constructor() { }

  // Create document lines from a raw string.
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
        newArray.push(new Line(item.id, item.text));
      } );
    });
  return newArray;
}

  // Insert a new quote at the lines defined in the indexList.
  public updateLines(lines: Line[], indexList: boolean[], quote: Quote): Line[] {
    const updatedLines: Line[] = [];
    const borderIndex = this.getBorderIndex(indexList);
    lines.map((l, i) => {
      if (indexList[i]) {
        l.setQuoteId(quote.getId());
        if ( borderIndex.max === i) {
          this.setBorderQuotes(l, 'bottom', quote);
        }
        if ( borderIndex.min === i ) {
          this.setBorderQuotes(l, 'top', quote);
        }
      }
      updatedLines.push(l);
    });
    //this.updateSucessorQuotes(updatedLines, indexList, quote);
    return updatedLines;
  }

  // Update the predecessor list from a line
  // private updateSucessorQuotes(lines: Line[], indexList: boolean[], quote: Quote) {
  //   lines.map((l, i) => {
  //     if (i > 0 && indexList[i - 1]) {
  //       l.setPredecessorQuote(quote);
  //     }
  //   });
  // }

  // Define if a line is the starting and/or ending of a quote.
  private setBorderQuotes(line: Line, type,  quote: Quote) {
    type === 'top' ? line.setBorderTopQuoteId(quote.getId()) : line.setBorderBottomQuoteId(quote.getId());
  }

  // Get the starting and ending index of a quote
  private getBorderIndex(indexList) {
    let min = 0;
    let minReady = false;
    let max = 0;
    for (let i = 0; i < indexList.length; i++) {
      const element = indexList[i];
      if (element && !minReady) {
        min = i;
        minReady = true;
      }
      if (minReady && (indexList[i + 1] === undefined || !indexList[i + 1])) {
          max = i;
          break;
      }
    }
    return {max: max, min: min};
  }

  // Shorten lines to fit in page
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
