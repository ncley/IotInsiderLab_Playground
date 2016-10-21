import Dto = require("../model/ImpressionDto");
import Dto1 = require("../model/CampaignDto");
import Dto2 = require("../model/AdInCampaignDto");
import Dto3 = require("../model/AdDto");
import Dto4 = require("../model/AdAggregateData");
import Dto5 = require("../model/FaceForImpressionDto");
import Dto6 = require("../model/DeviceDto");
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class ArgonneService {
    private BASE_URI: string = '/api/data';
    //private BASE_URI: string = 'http://api-argonne.azurewebsites.net';

    constructor(private $http: Http) {
    }

//    public getImpressionsForCampaign(campaignId: string, showAfter: string = null): Observable<Dto.ImpressionDto[]>{
//        var url = this.BASE_URI + '/api/admin/Campaign/' + campaignId + '/Impressions/After';
//        let params: URLSearchParams = new URLSearchParams();
//        params.set('after', showAfter);
//        params.set('PageSize', '1000');
//        return this.$http.get(url, { search: params }).map(response => <Dto.ImpressionDto[]>response.json());
//    }

    public getCampaignAggregate(campaignId: string, start: string = null, end: string = null): Observable<Dto4.AdAggregateData[]> {
        //var url = this.BASE_URI + '/api/admin/Campaign/' + campaignId + '/impressions/aggregate';
        var url = this.BASE_URI + '/campaign/' + campaignId + '/impressions/aggregate';
        let params: URLSearchParams = new URLSearchParams();
        params.set('start', start);
        params.set('end', end);
        return this.$http.get(url, { search: params }).map(response => <Dto4.AdAggregateData[]>response.json());
    }

//    public getAllCampaigns(): Observable<Dto1.CampaignDto[]> {
//        var url = this.BASE_URI + '/api/admin/Campaign/';
//
////        return this.$http.get(url,)
////            .then(response => {
////                return response.data as Dto1.CampaignDto[];
////            });
//    }
//
//    public getCampaignAds(campaignId: string): ng.IPromise<Dto2.AdInCampaignDto[]> {
//        var url = this.BASE_URI + '/api/admin/Campaign/' + campaignId + '/Ads';
//
////        return this.$http.get(url,
////            {
////            })
////            .then(response => {
////                return response.data as Dto2.AdInCampaignDto[];
////            });
//    }
//
//    public getCampaignDetails(campaignId: string): ng.IPromise<Dto1.CampaignDto> {
//        var url = this.BASE_URI + '/api/admin/Campaign/' + campaignId;
////
////        return this.$http.get(url)
////            .then(response => {
////                return response.data as Dto1.CampaignDto;
////            });
//    }
//
//    public getAdDetails(adId: string): ng.IPromise<Dto3.AdDto> {
//        var url = this.BASE_URI + '/api/admin/Ad/' + adId;
//
////        return this.$http.get(url)
////            .then(response => {
////                return response.data as Dto3.AdDto;
////            });
//    }
//
//
//    public getAllAds(): ng.IPromise<Dto3.AdDto[]> {
//        var url = this.BASE_URI + '/api/admin/Ad';
//
////        return this.$http.get(url,
////            {            
////            })
////            .then(response => {
////                return response.data as Dto3.AdDto[];
////            });
//    }
}