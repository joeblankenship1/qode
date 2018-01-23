import { Component, OnInit } from '@angular/core';
import { WorkSpaceService } from '../../shared/services/work-space.service';

@Component({
  selector: 'app-bottom-bar',
  templateUrl: './bottom-bar.component.html',
  styleUrls: ['./bottom-bar.component.css']
})
export class BottomBarComponent implements OnInit {

  isOpened = false;

  constructor(private workspaceService: WorkSpaceService) { }

  ngOnInit() {
    this.workspaceService.getBottomBar().subscribe( io => {
      this.isOpened = io;
    });
  }

}
