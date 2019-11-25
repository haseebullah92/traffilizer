import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HttpApiService } from '../../../shared/services/http-api.service';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  signUp: any = {
    email: "",
    password: "",
    confirmPassword: ""
  }
  loading: boolean = false;

  constructor(private titleService: Title, private _httpService: HttpApiService,
    private notifierService: NotifierService, private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle('Sign Up - Traffilizer');
  }

  submitForm() {
    this.loading = true;
    this._httpService.anonymousPost("api/Account/Register", this.signUp).subscribe(result => {
      this.notifierService.notify('success', 'User Created Successfully!');
      this.loading = false;
      this.router.navigate(['app/login']);
    }, error => {
      this.loading = false;
      if (error.json().hasOwnProperty("ModelState") && error.json().ModelState["model.Password"]) {
        this.notifierService.notify('error', error.json().ModelState["model.Password"][0]);
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
