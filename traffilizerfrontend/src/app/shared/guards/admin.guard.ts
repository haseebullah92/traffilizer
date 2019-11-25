import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate() {
    if (localStorage.getItem('type') == "1") {
      return true;
    }

    this.router.navigate(['app/dashboard']);
    return false;
  }
}
