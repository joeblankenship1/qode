import { Component, OnInit } from '@angular/core';
import { WorkSpaceService } from '../../../shared/services/work-space.service';

@Component({
  selector: 'app-chart-popup',
  templateUrl: './chart-popup.component.html',
  styleUrls: ['./chart-popup.component.css']
})
export class ChartPopupComponent implements OnInit {

  result = {docs: [], codes: []};
  width = 600;
  height = 400;
  type = 'mscombi2d';
  dataFormat = 'json';
  dataSource = {'chart': {
                            'caption': 'Ocurrencia de códigos por documento',
                            'subcaption': '',
                            'xaxisname': 'Documento',
                            'yaxisname': 'Cantidad de ocurrencias',
                            'numberprefix': '',
                            'exportEnabled': '1',
                            'exportMode': 'client',
                            'theme': 'ocean'
                          },
                          'categories': [
                              {}
                          ],
                          'dataset': [
                              {}
                          ]};

  constructor(private workspaceService: WorkSpaceService) { }

  ngOnInit() {
    this.workspaceService.getMatrixResult().subscribe(
      matrixResult => {
        if (matrixResult) {
          this.result = matrixResult;
          const category = this.result.docs.map( d => ( {'label': d.name}));
          this.dataSource.categories = [{category}];
          const dataset = this.result.codes.map( (c , i) => {
            const data = [];
            this.result.docs.forEach(element => {
              data.push({ 'value': element.ocurrences[i] , 'color': c.color});
            });
            return { 'seriesname': c.name , 'color': c.color , 'data': data};
          });
          this.dataSource.dataset = dataset;
        }
      }
    );
  }

  onClose() {
    this.result = null;
    this.workspaceService.setPopup(false);
  }

}
