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
      this._deviceService.deleteActivation(this.activationRecord.id).subscribe(response =>{
        this.activationRecord = null;
      });
    }
  }

  setEnabled = (newValue) => {
    var reason = !newValue ? 'admin console' : null;
    this._deviceService.setActivationState(this.activationRecord.id, newValue, reason).subscribe(data =>{
      this.activationRecord.enabled = data.enabled;
      this.activationRecord.reason = data.reason;
      this.activationRecord.activatedDate = data.activatedDate;
    });
  }
}
