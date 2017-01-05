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
  public activations:Array<any>;

  constructor(private _baConfig:BaThemeConfigProvider, private _deviceService:DeviceService) {
    _deviceService.activationDeleted$.subscribe(deletedActivationId => {
        //find the device in the list and remove it
        var index = this.activations.findIndex(item => item.id == deletedActivationId);
        if (index > -1) {
            this.activations.splice(index, 1);
        }
        this.activations = this.activations.splice(0);//so Angular will detect the change
      });

  }
}
