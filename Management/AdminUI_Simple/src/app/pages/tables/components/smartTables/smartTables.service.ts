import {Injectable} from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import Dto = require("../../../../model/IotDevice");

@Injectable()
export class SmartTablesService {

    private BASE_URI: string = 'http://iotlab-activation-adminapi.azurewebsites.net/api';

    constructor(private $http: Http) {
    }

    public getAllDevices(): Observable<Dto.IotDevice[]> {
        var url = this.BASE_URI + '/device';
        return this.$http.get(url).map(response => <Dto.IotDevice[]>response.json());
    }

    public createDevice(deviceId:string): Observable<Dto.IotDevice[]> {
        var url = this.BASE_URI + '/device/' + deviceId;
        return this.$http.post(url,'').map(response => <Dto.IotDevice[]>response.json());
    }

  smartTableData = [
    {
      deviceId: 'foo',
      connectionState: 'disconnected',
      status: 'true',
      statusReason: 'na',
      lastActivityTime: null,
    },
  ];

  metricsTableData = [
    {
      image: 'app/browsers/chrome.svg',
      browser: 'Google Chrome',
      visits: '10,392',
      isVisitsUp: true,
      purchases: '4,214',
      isPurchasesUp: true,
      percent: '45%',
      isPercentUp: true
    },
    {
      image: 'app/browsers/firefox.svg',
      browser: 'Mozilla Firefox',
      visits: '7,873',
      isVisitsUp: true,
      purchases: '3,031',
      isPurchasesUp: false,
      percent: '28%',
      isPercentUp: true
    },
    {
      image: 'app/browsers/ie.svg',
      browser: 'Internet Explorer',
      visits: '5,890',
      isVisitsUp: false,
      purchases: '2,102',
      isPurchasesUp: false,
      percent: '17%',
      isPercentUp: false
    },
    {
      image: 'app/browsers/safari.svg',
      browser: 'Safari',
      visits: '4,001',
      isVisitsUp: false,
      purchases: '1,001',
      isPurchasesUp: false,
      percent: '14%',
      isPercentUp: true
    },
    {
      image: 'app/browsers/opera.svg',
      browser: 'Opera',
      visits: '1,833',
      isVisitsUp: true,
      purchases: '83',
      isPurchasesUp: true,
      percent: '5%',
      isPercentUp: false
    }
  ];

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.smartTableData);
      }, 2000);
    });
  }
}
