import { Routes, RouterModule }  from '@angular/router';

import { Devices } from './devices.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Devices,
    children: [
    ]
  }
];

export const routing = RouterModule.forChild(routes);
