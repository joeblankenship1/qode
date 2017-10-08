import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataFilter'
})
export class DataFilterPipe implements PipeTransform {

  transform(array: any[], query: string): any {
    if (query) {
      console.log(query + ' ' + _.filter(array, row => row.name.indexOf(query) > -1));
      return _.filter(array, row => row.name.indexOf(query) > -1);
    }
    return array;
  }
}
