import {Component, ViewEncapsulation, Input, ChangeDetectionStrategy} from '@angular/core';
import {BaThemeConfigProvider} from '../../../theme';

import {DeviceService} from './device.service';
import Dto = require("../../../model/Activation");

@Component({
  selector: 'activation-details',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./device-details.scss')],
  template: require('./activation-details.html'),
  //changeDetection:ChangeDetectionStrategy.OnPush
})
export class ActivationDetails {
  @Input()
  public activationRecord:Dto.Activation;

  constructor(private _baConfig:BaThemeConfigProvider, private _deviceService:DeviceService) {
  }

  delete= () => {
    if (window.confirm('Are you sure you want to delete?')) {
      // this._deviceService.deleteDevice(this.activationRecord.deviceId).subscribe(response =>{
      //   this.activationRecord = null;
      // });
    }
  }

 setEnabled = (newValue) => {
     var reason = !newValue ? 'admin console' : null;
    // this._deviceService.setDeviceState(this.activationRecord.deviceId, newValue, reason).subscribe(data =>{
    //   //TODO: don't subscribe like this, get the change at the whol device level from the same event that the list will also subscribe to from the service
    //   this.activationRecord.enabled = data.enabled;
    //   this.activationRecord.status = data.status;
    //   this.activationRecord.statusReason = data.statusReason; 
    // });
  }
}
