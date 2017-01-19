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
  public selectedDeviceActivationRecords:Array<any>;

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

    _deviceService.activationAdded$.subscribe(newRecord => {
        var index = this.selectedDeviceActivationRecords.push(newRecord);
        this.selectedDeviceActivationRecords = this.selectedDeviceActivationRecords.splice(0);//so Angular will detect the change
      });

    _deviceService.deviceSelected$.subscribe(deviceId => {
        var index = this.deviceList.findIndex(item => item.deviceId == deviceId);
        if (index > -1) {
            this.handleExternalSelection(this.deviceList[index]);
        }
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

  handleExternalSelection = (item) => {
    this.showDetails(item);
  }

  showDetails = (item) => {
    this.selectedDevice = item;
    this.getActivationsForCurrentDevice();
  }

  isSelected = (item):boolean => {
    if(!this.selectedDevice || !item) {
			return false;
		}
		return this.selectedDevice.deviceId ===  item.deviceId ? true : false;
  }

  getData = () => {
    this._deviceService.getAllDevices().subscribe(data => {
      this.deviceList = data;
    });
  }

  getActivationsForCurrentDevice = () => {
    if(null != this.selectedDevice){
      this._deviceService.getAllActivationRecordsForDevice(this.selectedDevice.deviceId).subscribe(data => {
        this.selectedDeviceActivationRecords = data;
      });
    }
  }
}
