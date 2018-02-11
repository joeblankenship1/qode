import { Component } from '@angular/core';
import { Document } from './shared/models/document.model';
import { DocumentService } from './shared/services/document.service';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { NotificationsService } from 'angular2-notifications';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';
  public options = {
    position: ['top', 'right'],
    lastOnBottom: true,
    pauseOnHover: true,
    clickToClose: true,
    timeOut: 4000,
    showProgressBar: false,
    theClass: 'myClass'
  };

  constructor(public router: Router, public auth: AuthService, private _service: NotificationsService,
    private _hotkeysService: HotkeysService) {
    auth.handleAuthentication();
    this._hotkeysService.add(new Hotkey('Cmd+f', (event: KeyboardEvent): boolean => {
      console.log('Cmd + f');
      return false; // Prevent bubbling
    }));

  }

}
