import {Component, ViewEncapsulation, Input, ChangeDetectionStrategy, ViewChild, OnInit, AfterViewInit} from '@angular/core';
import {DeviceService} from './device.service';
import Dto = require("../../../model/DeviceAlert");

@Component({
  selector: 'alerts',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./alerts.scss')],
  template: require('./alerts.html'),
})
export class Alerts implements OnInit,AfterViewInit{
  
  selectedItem:Dto.DeviceAlert;
  public alerts:Array<Dto.DeviceAlert>;

  constructor(private _deviceService:DeviceService) {
  }

  ngOnInit () {
  }

  ngAfterViewInit () {
    this.getData();
  }

  selectItem = (item:Dto.DeviceAlert):void => {
    this.selectedItem = item;
  }

  isSelected = (item:Dto.DeviceAlert):boolean => {
    if(!this.selectedItem || !item) {
			return false;
		}
		return this.selectedItem.id ===  item.id ? true : false;

  }

  getData = () => {
    var me = this;
    me._deviceService.getLatestAlerts().subscribe(data => {
       me.alerts = data;
    },
    error => {
    },
    () => {
      //TODO: stuff?
    });
  }
}
