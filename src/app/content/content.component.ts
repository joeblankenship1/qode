import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  openCity(cityName) {
    let i;
    const x = document.getElementsByClassName('city');
    for (i = 0; i < x.length; i++) {
        x[i].setAttribute('style', 'display:none;');
    }
    document.getElementById(cityName).style.display = 'block';
}
}
