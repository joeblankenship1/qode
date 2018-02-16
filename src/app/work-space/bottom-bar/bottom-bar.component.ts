import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorkSpaceService } from '../../shared/services/work-space.service';
import { QuotesRetrievalService } from '../../shared/services/quotes-retrieval.service';

@Component({
  selector: 'app-bottom-bar',
  templateUrl: './bottom-bar.component.html',
  styleUrls: ['./bottom-bar.component.css']
})
export class BottomBarComponent implements OnInit {

  isOpened = false;

  constructor(private workspaceService: WorkSpaceService,
  private quoteretrievalService: QuotesRetrievalService) { }

  ngOnInit() {
    this.workspaceService.getBottomBar().subscribe( io => {
      this.isOpened = io;
    });
  }

  onRefresh() {
    this.quoteretrievalService.refreshRetrievedQuotes();
  }

  onClose() {
    this.isOpened = false;
    this.quoteretrievalService.cleanRetrievedQuotes();
  }

}
