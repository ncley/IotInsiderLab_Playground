import {Component, ViewEncapsulation, Input, ChangeDetectionStrategy, ViewChild} from '@angular/core';
import {BaThemeConfigProvider} from '../../../theme';
import {ModalDirective } from 'ng2-bootstrap/ng2-bootstrap';
import {DeviceService} from './device.service';
import Dto = require("../../../model/IotDevice");
import Dto1 = require("../../../model/DeviceState");

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
  @Input()
  public deviceState:Dto1.DeviceState;


  @ViewChild('msgModal') msgModal: ModalDirective;
  public messageToSend:string;

  constructor(private _baConfig:BaThemeConfigProvider, private _deviceService:DeviceService) {
  }

  delete= () => {
    if (window.confirm('Are you sure you want to delete?')) {
      this._deviceService.deleteDevice(this.device.deviceId).subscribe(response =>{
        this.device = null;
      });
    }
  }

  addActivation= () => {
      this._deviceService.addActivationForDevice(this.device.deviceId).subscribe(data =>{
        //TODO: how do we tell parent about this??
        //this.device = null;
      });
  }

 setEnabled = (newValue) => {
    var reason = !newValue ? 'admin console' : null;
    this._deviceService.setDeviceState(this.device.deviceId, newValue, reason).subscribe(data =>{
      //TODO: don't subscribe like this, get the change at the whole device level from the same event that the list will also subscribe to from the service???
      this.device.enabled = data.enabled;
      this.device.status = data.status;
      this.device.statusReason = data.statusReason; 
    });
  }

   sendMessage = () => {
    if(null != this.messageToSend && '' != this.messageToSend){
      this.msgModal.hide();
      this._deviceService.sendMessageToDevice(this.messageToSend, this.device.deviceId).subscribe(data =>{
        //TODO: handle response?
        this.messageToSend = null;
      });
    }
    else{

      //TODO: tell user they need to input something
    }
  }
}
