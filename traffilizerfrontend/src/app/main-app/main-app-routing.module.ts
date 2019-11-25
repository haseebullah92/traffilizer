import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';

import { MainAppComponent } from './main-app.component';
import { FAQComponent } from './faq/faq.component';
import { TermsComponent } from './terms/terms.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';

import { AuthGuard } from '../shared/guards/auth.guard';
import { UnAuthGuard } from '../shared/guards/un-auth.guard';
import { AdminGuard } from '../shared/guards/admin.guard';

const routes: Routes = [
  { path: '', redirectTo: 'app/landing', pathMatch: 'prefix' },
  { path: 'landing', component: MainAppComponent, children: [{ path: '', component: LandingPageComponent }] , canActivate: [UnAuthGuard] },
  { path: 'login', component: MainAppComponent, loadChildren: './login/login.module#LoginModule' },
  { path: 'dashboard', component: MainAppComponent, children: [{ path: '', component: DashboardComponent }], canActivate: [AuthGuard] },
  { path: 'admin', component: MainAppComponent, children: [{ path: '', component: AdminPanelComponent }], canActivate: [AuthGuard, AdminGuard], },
  { path: 'faq', component: MainAppComponent, children: [{ path: '', component: FAQComponent }] },
  { path: 'terms', component: MainAppComponent, children: [{ path: '', component: TermsComponent }] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainAppRoutingModule { }
