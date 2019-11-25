import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HttpApiService } from '../../../shared/services/http-api.service';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  constructor(private titleService: Title, private _httpService: HttpApiService,
    private notifierService: NotifierService, private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle('Change Password - Traffilizer');
  }

  changePassword: any = {
    OldPassword: "",
    NewPassword: "",
    ConfirmPassword: ""
  }

  loading: boolean = false;

  submitForm() {
    this.loading = true;
    this._httpService.masterPost("api/Account/ChangePassword", this.changePassword).subscribe(result => {
      this.notifierService.notify('success', 'Password Changed Successfully!');
      this.loading = false;
      this.router.navigate(['app/dashboard']);
    }, error => {
      this.loading = false;
      if (error.json().hasOwnProperty("ModelState") && error.json().ModelState["model.NewPassword"]) {
        this.notifierService.notify('error', error.json().ModelState["model.NewPassword"][0]);
      }
      else if (error.json().hasOwnProperty("ModelState") && error.json().ModelState[""]) {
        if (error.json().ModelState[""][1]) {
          this.notifierService.notify('error', error.json().ModelState[""][1]);
        }
        else {
          this.notifierService.notify('error', error.json().ModelState[""][0]);
        }
      }
      else {
        this.notifierService.notify('error', "Invalid request!");
      }
    });
  }

}
