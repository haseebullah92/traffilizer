import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AppComponent } from './app.component';
import { StartTrafficComponent } from './start-traffic/start-traffic.component';


const routes: Routes = [
    { path: '', redirectTo: 'app/landing', pathMatch: 'prefix' },
    { path: 'app', loadChildren: './main-app/main-app.module#MainAppModule' },
    { path: 'start', component: StartTrafficComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        preloadingStrategy: PreloadAllModules
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
