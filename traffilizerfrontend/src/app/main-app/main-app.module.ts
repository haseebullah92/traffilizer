import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NotifierModule } from 'angular-notifier';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { OnInitDirective } from '../shared/directives/on-init.directive';
import { MainAppRoutingModule } from './main-app-routing.module';
import { MainAppComponent } from './main-app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FAQComponent } from './faq/faq.component';
import { TermsComponent } from './terms/terms.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';

@NgModule({
  imports: [
    CommonModule,
    MainAppRoutingModule,
    NgbDropdownModule.forRoot(),
    NotifierModule,
    FormsModule, 
    ReactiveFormsModule,
    NgbModule.forRoot(),
    MatProgressBarModule
  ],
  declarations: [
    MainAppComponent,
    DashboardComponent,
    LandingPageComponent,
    FAQComponent,
    TermsComponent,
    OnInitDirective,
    AdminPanelComponent
  ]
})
export class MainAppModule { }
