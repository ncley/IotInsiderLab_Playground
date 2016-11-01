import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import Dto = require("../model/CampaignAdAggregateData");
import Dto1 = require("../model/AdAggregateData");
import Dto2 = require("../model/AdSentimentData");

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

    public getCampaignSentimentsAggregateByAd(campaignId: string): Observable<Dto2.AdSentimentData[]> {
        var url = this.BASE_URI + '/campaign/' + campaignId + '/sentiments/aggregatebyad';

        return this.$http.get(url).map(response => <Dto2.AdSentimentData[]>response.json());
    }

}