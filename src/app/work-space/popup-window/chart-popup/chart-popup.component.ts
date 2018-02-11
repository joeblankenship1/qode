import { Component, OnInit, ViewChild } from '@angular/core';
import { WorkSpaceService } from '../../../shared/services/work-space.service';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

@Component({
  selector: 'app-chart-popup',
  templateUrl: './chart-popup.component.html',
  styleUrls: ['./chart-popup.component.css']
})
export class ChartPopupComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  result = {docs: [], codes: [], cooc: false, coocmatrix: [[]] };
  width = 600;
  height = 400;
  public labels: string[] = [];
  public dataValues: any = [
    {data: [], label: ''}
  ];
  public colors = [];
  public barDocsLabels: string[] = [];
  public barDocsDataValues: any = [
    {data: [], label: ''}
  ];
  public barDocsColors = [];
  public view = 'chart';
  public type = 'radar';
  public optionsRadar: any = { responsive: true,
                                scale: {
                                  ticks: {
                                    beginAtZero: true,
                                    stepSize: 1
                                  }
                                }};
  public optionsBar: any = { responsive: true,
                              scales: {
                                yAxes: [{
                                  ticks: {
                                    beginAtZero: true,
                                    stepSize: 1
                                } }]
                              }};

  constructor(private workspaceService: WorkSpaceService) { }

  ngOnInit() {
    this.workspaceService.getMatrixResult().subscribe(
      matrixResult => {
        if (matrixResult) {
          this.result = matrixResult;
          this.labels = this.result.codes.map( c => c.name);
          if (matrixResult.cooc) {
            this.dataValues = this.result.coocmatrix.map( (arr, i) => ({data: arr, label: this.result.codes[i].name}));
            this.colors = this.generateCodesColor();
          }else {
            this.dataValues = this.result.docs.map( d => ({data: d.ocurrences, label: d.name}));
            this.barDocsLabels = this.result.docs.map( d => (d.name));
            this.barDocsDataValues = this.result.codes.map( (c, i) => {
              const dataVals = [];
              this.result.docs.forEach(
                d => dataVals.push(d.ocurrences[i])
              );
              return ({data: dataVals, label: c.name});
            });
            this.barDocsColors = this.generateCodesColor();
          }
        }
      }
    );
  }

  generateCodesColor() {
    return this.result.codes.map(c =>
      ({backgroundColor: (c.color ? c.color.replace(')', ',0.5)').replace('rgb', 'rgba') : 'rgba(10,10,10,0.5)' ),
          borderColor: c.color }) );
  }

  onClose() {
    this.result = null;
    this.workspaceService.setPopup(false);
  }

  onChangeChartType(type) {
    if (this.type === type) {
      return;
    }
    this.type = type;
  }

}
