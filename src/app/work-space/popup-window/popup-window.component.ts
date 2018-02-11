import { Component, OnInit, ViewContainerRef, Inject, ViewChild } from '@angular/core';
import { PopupLoaderService } from '../../shared/services/popup-loader.service';
import { WorkSpaceService } from '../../shared/services/work-space.service';

@Component({
  selector: 'app-popup-window',
  templateUrl: './popup-window.component.html',
  styleUrls: ['./popup-window.component.css']
})
export class PopupWindowComponent implements OnInit {

  isOpened = false;
  service;
  height;
  width;
  margin;

  @ViewChild('dynamic', {
    read: ViewContainerRef
  }) viewContainerRef: ViewContainerRef;

  constructor(private workspaceService: WorkSpaceService,
    @Inject(PopupLoaderService) service) {

    this.service = service;
  }

  ngOnInit() {
    this.workspaceService.getPopup().subscribe( o => {
      this.isOpened = o;
      this.service.destroyComponent();
      if (o) {
        this.service.setRootViewContainerRef(this.viewContainerRef);
        const name = this.workspaceService.getPopupName();

        switch (name) {
          case 'SimpleQueryEditor': {
            this.service.loadSimpleQueryEditor();
            this.margin = '15%';
            break;
          }
          case 'ComplexQueryEditor': {
            this.service.loadComplexQueryEditor();
            break;
          }
          case 'ChartPopup': {
            this.service.loadChartPopup();
            break;
          }
          default: {
            console.error('No existe componente');
          }
        }
      } else {
        this.service.destroyComponent();
      }
    });
  }

}
