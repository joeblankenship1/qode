import { Component } from '@angular/core';
import { Document } from './shared/models/document.model';
import { DocumentService } from './shared/services/document.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor() { }

}
