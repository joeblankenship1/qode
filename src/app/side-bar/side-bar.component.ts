import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  sidenavCollapse() {
    console.log('asd');
    if (document.getElementById('sidenavCollapseBtn').className === 'opened') {
        document.getElementById('sidenavCollapseBtn').className = 'closed';
        document.getElementById('sidenavCollapseBtn').firstElementChild.className = 'glyphicon glyphicon-chevron-right';
        document.getElementById('main').style.marginLeft = '0%';
        document.getElementById('mysidenav').style.display = 'none';
    } else {
        document.getElementById('sidenavCollapseBtn').className = 'opened';
        document.getElementById('sidenavCollapseBtn').firstElementChild.className = 'glyphicon glyphicon-chevron-left';
        document.getElementById('mysidenav').style.width = '20%';
        document.getElementById('mysidenav').style.display = 'block';
    }
}

}
