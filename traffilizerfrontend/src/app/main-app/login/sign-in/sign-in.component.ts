import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HttpApiService } from '../../../shared/services/http-api.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})

export class SignInComponent implements OnInit {

  signIn: any = {
    email: "",
    password: ""
  }

  loading: boolean = false;

  constructor(private titleService: Title, private _httpService: HttpApiService,
    private notifierService: NotifierService) { }

  ngOnInit() {
    this.titleService.setTitle('Sign In - Traffilizer');
  }

  submitForm() {
    this.loading = true;
    this._httpService.anonymousPost("api/Account/Login", this.signIn).subscribe(result => {
      this.loading = false;
      localStorage.setItem('userName', result.userName);
      localStorage.setItem('userToken', result.access_token);
      localStorage.setItem('type', result.type);
      location.href = document.getElementsByTagName('base')[0].href + 'app/dashboard';
    }, error => {
      this.notifierService.notify('error', 'Whoops, Invalid email or password. Probably!');
      this.loading = false;
    });
  }

}
