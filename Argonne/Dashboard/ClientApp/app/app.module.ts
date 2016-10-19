import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UniversalModule } from 'angular2-universal';
import { AppComponent } from './components/app/app.component'
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { CampaignManagerComponent } from './components/manage/campaignmanager.component';
import { DeviceManagerComponent } from './components/manage/devicemanager.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        NavMenuComponent,
        CampaignManagerComponent,
        DeviceManagerComponent,
        HomeComponent
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'manage-campaign', component: CampaignManagerComponent },
            { path: 'manage-device', component: DeviceManagerComponent },
            { path: '**', redirectTo: 'home' }
        ]),
        ChartsModule
    ]
})
export class AppModule {
}
