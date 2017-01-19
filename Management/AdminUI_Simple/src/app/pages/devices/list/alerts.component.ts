import {Component, ViewEncapsulation, AfterViewInit, trigger, state, animate, transition, style} from '@angular/core';
import {DeviceService} from './device.service';
import Dto = require("../../../model/DeviceAlert");

@Component({
  selector: 'alerts',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./alerts.scss')],
  template: require('./alerts.html'),
  animations: [
    trigger('visibility', [
        state('shown', style({
            opacity: 1
        })),
        state('hidden', style({
            opacity: 0
        })),
        transition('* => *', animate('.5s'))
    ])
  ],
})
export class Alerts implements AfterViewInit{
  
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
    this._deviceService.selectDevice(item.deviceid);
  }

  acknowledge = (item:Dto.DeviceAlert):void => {
    this._deviceService.acknowledgeAlert(item.id);
    var temp:any = item;
    temp.visibility = 'hidden';
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
