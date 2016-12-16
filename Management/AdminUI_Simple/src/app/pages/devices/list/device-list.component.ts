import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {BaThemeConfigProvider} from '../../../theme';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import {DeviceService} from './device.service';

@Component({
  selector: 'device-list',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./device-list.scss')],
  template: require('./device-list.html')
})
export class DeviceList implements OnInit{
  //public deviceList:Observable<Array<string>>;
  public deviceList:Array<any>;
  public newItemText:string = '';
  public selectedDevice:any;

  ngOnInit()    { this.getData(); }

  constructor(private _baConfig:BaThemeConfigProvider, private _deviceService:DeviceService) {
    _deviceService.deviceDeleted$.subscribe(deletedDeviceId => {
        //find the device in the list and remove it
        var index = this.deviceList.findIndex(item => item.deviceId == deletedDeviceId);
        if (index > -1) {
            this.deviceList.splice(index, 1);
        }
        this.deviceList = this.deviceList.splice(0);//so Angular will detect the change
      });
  }

  addItem = ($event) => {
    if (($event.which === 1 || $event.which === 13) && this.newItemText.trim() != '') {

      this._deviceService.createDevice(this.newItemText).subscribe(data => {
        this.deviceList.unshift(data);
        this.deviceList = this.deviceList.slice(0);//so Angular will detect the change
      });

      this.newItemText = '';
    }
  }


  showDetails = (item) => {
    this.selectedDevice = item;
  }

  getData = () => {
    this._deviceService.getAllDevices().subscribe(data => {
      this.deviceList = data;
    });
  }
}
