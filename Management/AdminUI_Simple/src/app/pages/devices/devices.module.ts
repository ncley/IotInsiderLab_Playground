import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { Devices } from './devices.component';
import { routing }       from './devices.routing';
import { ModalModule } from 'ng2-bootstrap/ng2-bootstrap';
import { DeviceList, DeviceDetails, DeviceActivations, ActivationDetails, LineChart } from './list';
import { DeviceService } from './list/device.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    ModalModule,
    routing
  ],
  declarations: [
    DeviceList,
    DeviceDetails,
    DeviceActivations,
    ActivationDetails,
    Devices,
    LineChart
  ],
  providers: [
    DeviceService,
  ]
})
export default class DevicesModule {}
