import { Component } from '@angular/core';

@Component({
  selector: 'app-main-app',
  templateUrl: './main-app.component.html',
  styleUrls: ['./main-app.component.css']
})
export class MainAppComponent {

  title = 'app';
  userName: string = "";
  type: string;
  mobileNavBar: boolean = false;

  constructor(){
    this.userName = localStorage.getItem("userName");
    this.type = localStorage.getItem("type");
  }

  showHideNavBar() {
    this.mobileNavBar = !this.mobileNavBar;
  }

  onLoggedout() {
    localStorage.removeItem('userName');
    localStorage.removeItem('userToken');
    localStorage.removeItem('duration');
    localStorage.removeItem('type');
    
    location.href = document.getElementsByTagName('base')[0].href + 'app/login';
  }

}
