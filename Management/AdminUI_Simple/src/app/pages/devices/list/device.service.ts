import {Injectable} from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import 'rxjs/Rx';
import Dto = require("../../../model/IotDevice");
import Dto1 = require("../../../model/Activation");

@Injectable()
export class DeviceService {

    private BASE_URI: string = 'http://iotlab-activation-adminapi.azurewebsites.net/api';

    // Observable  sources
    private deviceDeletedSource = new Subject<any>();
    // Observable  streams
    deviceDeleted$ = this.deviceDeletedSource.asObservable();

    constructor(private $http: Http) {
    }

    private setDeviceEnabled(deviceInterface: Dto.IotDevice)
    {
        if(null != deviceInterface && null != deviceInterface.status)
        {
            deviceInterface.enabled = (deviceInterface.status.toLowerCase() == "enabled");
        }
    }

    public getAllDevices=(): Observable<Dto.IotDevice[]> => {
        var url = this.BASE_URI + '/device';
        return this.$http.get(url).map(response => {
            var results = <Dto.IotDevice[]>response.json();
            results.forEach(element => {
                this.setDeviceEnabled(element);
            });
            return results;
        });
        //return this.$http.get(url).map(response => <Dto.IotDevice[]>response.json());
    }


    public createDevice = (deviceId:string): Observable<Dto.IotDevice> =>{
        var url = this.BASE_URI + '/device/' + deviceId;
        return this.$http.post(url,'').map(response =>{ 
            var result = <Dto.IotDevice>response.json();
            this.setDeviceEnabled(result);
            return result;
        });
    }

    public deleteDevice = (deviceId:string):Observable<string> =>{
        var url = this.BASE_URI + '/device/' + deviceId;
        return this.$http.delete(url).map(response => {
            this.deviceDeletedSource.next(deviceId);
            return deviceId;
        });
    }

    public setDeviceState= (deviceId:string, enabled: boolean, reason: string): Observable<Dto.IotDevice> =>{
        var url = this.BASE_URI + '/device/' + deviceId + '/enabled';
        let params: URLSearchParams = new URLSearchParams();
        params.set('enabled', enabled.toString());
        params.set('reason', reason);
        return this.$http.put(url,{}, { search: params }).map(response => {
            var result = <Dto.IotDevice>response.json();
            this.setDeviceEnabled(result);
            return result;
        });
    }

    public getAllActivationRecordsForDevice=(deviceId:string): Observable<Dto1.Activation[]> => {
        var url = this.BASE_URI + '/activation/device/' + deviceId;
        return this.$http.get(url).map(response => {
            return <Dto1.Activation[]>response.json();
        });
    }
}
