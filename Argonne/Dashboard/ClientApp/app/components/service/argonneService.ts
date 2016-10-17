import Dto = require("../model/ImpressionDto");
import Dto1 = require("../model/CampaignDto");
import Dto2 = require("../model/AdInCampaignDto");
import Dto3 = require("../model/AdDto");
import Dto4 = require("../model/AdAggregateData");
import Dto5 = require("../model/FaceForImpressionDto");
import Dto6 = require("../model/DeviceDto");
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

export class ArgonneService {
    // replace with valid service URL
    private BASE_URI: string = 'http://api-argonne.azurewebsites.net';

    constructor(private $http: Http) {
    }

    public getImpressionsForCampaign(campaignId: string, showAfter: string = null): Observable<Dto.ImpressionDto[]>{
        var url = this.BASE_URI + '/api/admin/Campaign/' + campaignId + '/Impressions/After';
        let params: URLSearchParams = new URLSearchParams();
        params.set('after', showAfter);
        params.set('PageSize', '1000');
        return this.$http.get(url, { search: params }).map(response => <Dto.ImpressionDto[]>response.json());
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
//    public getCampaignAggregate(campaignId: string, start: string = null, end: string = null): ng.IPromise<Dto4.AdAggregateData[]> {
//        //var url = '/api/campaign/aggregate/' + campaignId;
//        var url = this.BASE_URI + '/api/admin/Campaign/' + campaignId + '/impressions/aggregate';
//
////        return this.$http.get(url,
////            {
////                params: {
////                    start: start,
////                    end: end
////                }
////            })
////            .then(response => {
////                return response.data as Dto4.AdAggregateData[];
////            });
//    }
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