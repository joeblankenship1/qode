import { Injectable } from '@angular/core';
import { Line } from '../models/line.model';
import { Quote } from '../models/quote.model';
import { element } from 'protractor';
import { AppSettings } from '../../app.settings';


export class LineDefinition {

  constructor() { }

  // Create document lines from a raw string.
  public static createLines(text) {
    const lines = [];
    const li = text.split(/\n|\r/)
      .map(l => [l]);

    li.map((listLine, i) => {
      const nLines = this.shortenLine(listLine);
      lines[i] = nLines;
    });

    const newArray: Line[] = [];
    let lineId = 0;
    lines.forEach(list => {
      list.forEach( (item) => {
        newArray.push(new Line(lineId, item));
        lineId = (lineId + 1) % AppSettings.PAGE_SIZE;
      } );
    });
    if (newArray.length < AppSettings.PAGE_SIZE) {
      for (let index = newArray.length; index < AppSettings.PAGE_SIZE; index++) {
        newArray.push(new Line(index, ''));
      }
    }
  return newArray;
}

  // Insert a new quote at the lines defined in the indexList.
  public static updateLines(lines: Line[], indexList: boolean[], quote: Quote): Line[] {
    const updatedLines: Line[] = [];
    const borderIndex = this.getBorderIndex(indexList);
    lines.map((l, i) => {
      if (indexList[i]) {
        l.setQuoteId(quote.getId());
        // if ( borderIndex.max === i) {
        //   this.setBorderQuotes(l, 'bottom', quote);
        // }
        // if ( borderIndex.min === i ) {
        //   this.setBorderQuotes(l, 'top', quote);
        // }
      }
      updatedLines.push(l);
    });
    return updatedLines;
  }

  // Get the starting and ending index of a quote
  private static getBorderIndex(indexList) {
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
  private static shortenLine(listLine) {
    let text = listLine[0];
    listLine.splice(0);
    let end = false;
    while (text.length > AppSettings.LINE_SIZE && !end) {
      end = false;
      const indexBlank = text.indexOf(' ',  AppSettings.LINE_SIZE);
      if (indexBlank > -1 ) {
        listLine.push(text.substring(0, indexBlank));
        text = text.substring(indexBlank + 1);
      } else {
        end = true;
      }
    }
    listLine.push(text.substring(0));
    return listLine;
  }


}
