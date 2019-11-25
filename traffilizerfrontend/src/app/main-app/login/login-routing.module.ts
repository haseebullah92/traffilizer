import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { UnAuthGuard } from '../../shared/guards/un-auth.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'prefix' },
  { path: 'sign-in', component: SignInComponent, canActivate: [UnAuthGuard] },
  { path: 'sign-up', component: SignUpComponent, canActivate: [UnAuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [UnAuthGuard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
