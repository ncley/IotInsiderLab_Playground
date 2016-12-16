import {Component, ViewEncapsulation, Input, ChangeDetectionStrategy} from '@angular/core';
import {BaThemeConfigProvider} from '../../../theme';

import {DeviceService} from './device.service';
import Dto = require("../../../model/IotDevice");

@Component({
  selector: 'device-details',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./device-details.scss')],
  template: require('./device-details.html'),
  //changeDetection:ChangeDetectionStrategy.OnPush
})
export class DeviceDetails {
  @Input()
  public device:Dto.IotDevice;

  constructor(private _baConfig:BaThemeConfigProvider, private _deviceService:DeviceService) {
  }

  delete= () => {
    //TODO: code this
  }

 setEnabled = (newValue) => {
    var reason = !newValue ? 'admin console' : null;
    this._deviceService.setDeviceState(this.device.deviceId, newValue, reason).subscribe(data =>{
      //TODO: don't subscribe like this, get the change at the whol device level from the same event that the list will also subscribe to from the service
      this.device.enabled = data.enabled;
      this.device.status = data.status;
      this.device.statusReason = data.statusReason; 
    });
  }
}
