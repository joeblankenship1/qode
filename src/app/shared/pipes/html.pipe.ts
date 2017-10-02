import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'html'
})
export class HtmlPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value ? value.replace(/(?:\r\n|\r|\n)/g, '<br />') : value;
  }

}
