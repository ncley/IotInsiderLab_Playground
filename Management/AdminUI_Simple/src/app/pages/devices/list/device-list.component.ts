import {Component, ViewEncapsulation} from '@angular/core';
import {BaThemeConfigProvider} from '../../../theme';

import {DeviceService} from './device.service';

@Component({
  selector: 'device-list',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./device-list.scss')],
  template: require('./device-list.html')
})
export class DeviceList {
  public deviceList:Array<any>;
  public newItemText:string = '';

  constructor(private _baConfig:BaThemeConfigProvider, private _deviceService:DeviceService) {
    this.getData();
  }

  addItem = ($event) => {
    this._deviceService.createDevice(this.newItemText).subscribe(data => {
      this.deviceList.push(data);
    });
  }
  
  deleteItem= (item) => {
    //TODO: code this
  }

  toggleEnabled = (item, $event) => {
    //$event.target.checked
    var reason = !item.enabled ? 'admin console' : null;
    this._deviceService.setDeviceState(item.deviceId, !item.enabled, reason).subscribe(data =>{
      item.enabled = data.enabled;
      item.status = data.status;
      item.statusReason = data.statusReason; 
    });

    //TODO: call the service
    // if(item.status == "enabled"){
    //   item.status = "disabled";
    // }
    // else{
    //   item.status = "enabled";
    // }
  }

  getData = () => {
    this._deviceService.getAllDevices().subscribe(data => {
      this.deviceList = data;
    });
  }
}
