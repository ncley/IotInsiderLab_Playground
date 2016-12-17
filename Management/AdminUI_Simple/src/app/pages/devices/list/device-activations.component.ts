import {Component, ViewEncapsulation, Input, ChangeDetectionStrategy} from '@angular/core';
import {BaThemeConfigProvider} from '../../../theme';

import {DeviceService} from './device.service';
import Dto = require("../../../model/IotDevice");

@Component({
  selector: 'device-activations',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./device-details.scss')],
  template: require('./device-activations.html'),
  //changeDetection:ChangeDetectionStrategy.OnPush
})
export class DeviceActivations {
  @Input()
  public device:Dto.IotDevice;

  constructor(private _baConfig:BaThemeConfigProvider, private _deviceService:DeviceService) {
  }
}
