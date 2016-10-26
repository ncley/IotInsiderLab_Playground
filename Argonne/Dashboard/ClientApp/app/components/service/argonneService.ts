import Dto = require("../model/CampaignAdAggregateData");
import Dto1 = require("../model/AdAggregateData");

//import Dto = require("../model/ImpressionDto");
//import Dto1 = require("../model/CampaignDto");
//import Dto2 = require("../model/AdInCampaignDto");
//import Dto3 = require("../model/AdDto");
//import Dto5 = require("../model/FaceForImpressionDto");
//import Dto6 = require("../model/DeviceDto");
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';


@Injectable()
export class ArgonneService {
    private BASE_URI: string = '/api/data';

    constructor(private $http: Http) {
    }

    public getCampaignAggregate(campaignId: string, start: string = null, end: string = null): Observable<Dto1.AdAggregateData[]> {
        var url = this.BASE_URI + '/campaign/' + campaignId + '/impressions/aggregate';
        let params: URLSearchParams = new URLSearchParams();
        params.set('start', start);
        params.set('end', end);
        return this.$http.get(url, { search: params }).map(response => <Dto1.AdAggregateData[]>response.json());
    }

    public getCampaignAggregateByAd(campaignId: string): Observable<Dto.CampaignAdAggregateData[]> {
        var url = this.BASE_URI + '/campaign/' + campaignId + '/impressions/aggregatebyad';

        return this.$http.get(url).map(response => <Dto.CampaignAdAggregateData[]>response.json());
    }

}