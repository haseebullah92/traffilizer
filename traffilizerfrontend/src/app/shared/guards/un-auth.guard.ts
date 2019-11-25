import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UnAuthGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate() {
    if (localStorage.getItem('userToken')) {
      this.router.navigate(['app/dashboard']);
      return false;
    }
    
    return true;
  }
}
