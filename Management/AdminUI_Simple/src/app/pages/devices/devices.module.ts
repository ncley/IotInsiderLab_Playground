import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { Devices } from './devices.component';
import { routing }       from './devices.routing';

import { DeviceList, DeviceDetails, DeviceActivations, ActivationDetails } from './list';
import { DeviceService } from './list/device.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing
  ],
  declarations: [
    DeviceList,
    DeviceDetails,
    DeviceActivations,
    ActivationDetails,
    Devices
  ],
  providers: [
    DeviceService,
  ]
})
export default class DevicesModule {}
