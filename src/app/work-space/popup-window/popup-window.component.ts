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
  right;
  top;

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
            this.width = '450px';
            this.top = '15%';
            this.right = '30%';
            break;
          }
          case 'ComplexQueryEditor': {
            this.service.loadComplexQueryEditor();
            break;
          }
          case 'ChartPopup': {
            this.service.loadChartPopup();
            this.top = '5%';
            this.right = '10%';
            break;
          }
          case 'SearchInOpenDocs': {
            this.service.loadSearchInOpenDocs();
            this.top = '5%';
            this.right = '10%';
            this.width = '32%';
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
