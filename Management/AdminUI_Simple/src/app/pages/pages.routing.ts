import { Routes, RouterModule }  from '@angular/router';
import { Pages } from './pages.component';
// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'devices', pathMatch: 'full' },
      { path: 'devices', loadChildren: () => System.import('./devices/devices.module') },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
