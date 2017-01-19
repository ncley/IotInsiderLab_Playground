import {Injectable} from '@angular/core';
import { Http, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import 'rxjs/Rx';
import Dto = require("../../../model/IotDevice");
import Dto1 = require("../../../model/Activation");
import Dto2 = require("../../../model/AggregateStats");
import Dto3 = require("../../../model/DeviceAlert");

@Injectable()
export class DeviceService {

    private BASE_URI: string = 'http://iotlab-activation-adminapi.azurewebsites.net/api';

    // Observable  sources
    private deviceDeletedSource = new Subject<any>();
    private deviceSelectedSource = new Subject<any>();
    private activationDeletedSource = new Subject<any>();
    private activationAddedSource = new Subject<any>();
    // Observable  streams
    deviceDeleted$ = this.deviceDeletedSource.asObservable();
    deviceSelected$ = this.deviceSelectedSource.asObservable();
    activationDeleted$ = this.activationDeletedSource.asObservable();
    activationAdded$ = this.activationAddedSource.asObservable();

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

    public selectDevice = (deviceId:string):void =>{
        this.deviceSelectedSource.next(deviceId);
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

    public sendMessageToDevice = (message:string, deviceId:string):Observable<string> =>{
        var url = this.BASE_URI + '/device/' + deviceId + "/send";
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.$http.post(url, JSON.stringify(message), options).map(response => {
            return message;
        });
    }

    public getAllActivationRecordsForDevice=(deviceId:string): Observable<Dto1.Activation[]> => {
        var url = this.BASE_URI + '/activation/device/' + deviceId;
        return this.$http.get(url).map(response => {
            return <Dto1.Activation[]>response.json();
        });
    }

    public deleteActivation = (activationId:string):Observable<string> =>{
        var url = this.BASE_URI + '/activation/' + activationId;
        return this.$http.delete(url).map(response => {
            this.activationDeletedSource.next(activationId);
            return activationId;
        });
    }

    public setActivationState= (activationId:string, enabled: boolean, reason: string): Observable<Dto1.Activation> =>{
        var url = this.BASE_URI + '/activation/' + activationId + '/enabled';
        let params: URLSearchParams = new URLSearchParams();
        params.set('enabled', enabled.toString());
        params.set('reason', reason);
        return this.$http.put(url,{}, { search: params }).map(response => {
            return <Dto1.Activation>response.json();
        });
    }

    public addActivationForDevice=(deviceId:string): Observable<Dto1.Activation> => {
        var url = this.BASE_URI + '/activation/device/' + deviceId;
        return this.$http.post(url,'').map(response => {
            var activation =  <Dto1.Activation>response.json();
            this.activationAddedSource.next(activation);
            return activation;
        });
    }

    public getLatestAggregateMessageStats=(windowSize:string): Observable<Dto2.AggregateStats[]> => {
        ///api/stats/aggregate/{windowsize}?limit=
        var url = this.BASE_URI + '/stats/aggregate/' + windowSize;
        let params: URLSearchParams = new URLSearchParams();
        params.set('limit', '120');

        return this.$http.get(url, { search: params }).map(response => {
            return <Dto2.AggregateStats[]>response.json();
        });
    }

    public getLatestAlerts=(): Observable<Dto3.DeviceAlert[]> => {
        //api/stats/alerts?limit=10
        var url = this.BASE_URI + '/stats/alerts/';
        let params: URLSearchParams = new URLSearchParams();
        params.set('limit', '5');
        return this.$http.get(url, { search: params }).map(response => {
            return <Dto3.DeviceAlert[]>response.json();
        });
    }

    // public getLatestAggregateMessageStats=(windowSize:string): Dto2.AggregateStats[] => {
    //     ///api/stats/aggregate/{windowsize}?limit=
    //     var url = this.BASE_URI + '/stats/aggregate/' + windowSize;
    //     let params: URLSearchParams = new URLSearchParams();
    //     params.set('limit', '100');

    //     var result;
    //     this.$http.get(url, { search: params }).map(response => {
    //         return <Dto2.AggregateStats[]>response.json();
    //     }).subscribe(data => {
    //         result = data;
    //     });
    //     return result;
    // }
}
