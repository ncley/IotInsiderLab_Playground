import { Component, OnDestroy, OnInit } from '@angular/core';
import Dto = require("../model/CampaignAdAggregateData");
import Dto1 = require("../model/AdSentimentData");
import Service = require("../service/ArgonneService");


@Component({
    selector: 'home',
    template: require('./home.component.html'),
    providers: [Service.ArgonneService]
})
export class HomeComponent implements OnInit, OnDestroy{

    intervalId = 0;

    public perAdData = [];

    //public sentimentDataByAd: Dto1.AdSentimentData[];
    //public campaignSentimentData: Dto1.AdSentimentData;

    public aggregateDataByAd: Dto.CampaignAdAggregateData[];
    public campaignAggregateData: Dto.CampaignAdAggregateData;

    public currentCampaignId: string;
    private CAMPAIGN_ID = '3149351f-3c9e-4d0a-bfa5-d8caacfd77f0';

    constructor(private argonneService: Service.ArgonneService) {
        //this.currentAfterDate = moment.utc(); // initializes to the current time
        this.currentCampaignId = this.CAMPAIGN_ID;
    }


    ngOnInit() { this.startPolling(); }
    ngOnDestroy() { this.stopPolling(); }

    startPolling() {
        this.getData();

        this.intervalId = window.setInterval(() => {
            this.getData();
        }, 20000);
    }

    stopPolling() {
        clearInterval(this.intervalId);
    }

    private sumPropertyOnArray(theArray, propertyName) {
        return theArray.reduce((currentSum, nextItem) => (currentSum + nextItem[propertyName]), 0);
    };

    private getData() {
        this.argonneService.getCampaignAggregateByAd(this.CAMPAIGN_ID).subscribe(serviceResponse => {
            this.aggregateDataByAd = serviceResponse;

            if (this.aggregateDataByAd != null && this.aggregateDataByAd.length > 0) {
                //make a copy of the first result to use as the campaign aggregate model
                var tempAg = JSON.parse(JSON.stringify(this.aggregateDataByAd[0]));

                //null out campaign name for ad objects (yes, this is hacky :( )
                for (var index = 0, len = this.aggregateDataByAd.length; index < len; index++) {
                    this.aggregateDataByAd[index].campaignName = null;
                }

                //Sum the ad data at the campaign level
                tempAg.ageBracket0 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket0');
                tempAg.ageBracket0Females = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket0Females');
                tempAg.ageBracket0Males = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket0Males');

                tempAg.ageBracket1 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket1');
                tempAg.ageBracket1Females = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket1Females');
                tempAg.ageBracket1Males = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket1Males');

                tempAg.ageBracket2 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket2');
                tempAg.ageBracket2Females = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket2Females');
                tempAg.ageBracket2Males = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket2Males');

                tempAg.ageBracket3 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket3');
                tempAg.ageBracket3Females = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket3Females');
                tempAg.ageBracket3Males = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket3Males');

                tempAg.ageBracket4 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket4');
                tempAg.ageBracket4Females = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket4Females');
                tempAg.ageBracket4Males = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket4Males');

                tempAg.ageBracket5 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket5');
                tempAg.ageBracket5Females = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket5Females');
                tempAg.ageBracket5Males = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket5Males');

                tempAg.ageBracket6 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket6');
                tempAg.ageBracket6Females = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket6Females');
                tempAg.ageBracket6Males = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket6Males');

                tempAg.uniqueFemales = this.sumPropertyOnArray(this.aggregateDataByAd, 'uniqueFemales');
                tempAg.uniqueMales = this.sumPropertyOnArray(this.aggregateDataByAd, 'uniqueMales');
                tempAg.totalFaces = this.sumPropertyOnArray(this.aggregateDataByAd, 'totalFaces');
                tempAg.uniqueFaces = this.sumPropertyOnArray(this.aggregateDataByAd, 'uniqueFaces');

                //Sum the ad data at the campaign level
                tempAg.totalAnger = this.sumPropertyOnArray(this.aggregateDataByAd, 'totalAnger');
                tempAg.totalContempt = this.sumPropertyOnArray(this.aggregateDataByAd, 'totalContempt');
                tempAg.totalDisgust = this.sumPropertyOnArray(this.aggregateDataByAd, 'totalDisgust');
                tempAg.totalFear = this.sumPropertyOnArray(this.aggregateDataByAd, 'totalFear');
                tempAg.totalHappiness = this.sumPropertyOnArray(this.aggregateDataByAd, 'totalHappiness');
                tempAg.totalNeutral = this.sumPropertyOnArray(this.aggregateDataByAd, 'totalNeutral');
                tempAg.totalSadness = this.sumPropertyOnArray(this.aggregateDataByAd, 'totalSadness');
                tempAg.totalSurprise = this.sumPropertyOnArray(this.aggregateDataByAd, 'totalSurprise');

                tempAg.adName = null;
                this.campaignAggregateData = tempAg;
            }
        });

//        // get the web api aggregated data
//        this.argonneService.getCampaignSentimentsAggregateByAd(this.CAMPAIGN_ID).subscribe(serviceResponse => {
//            this.sentimentDataByAd = serviceResponse;
//
//            if (this.sentimentDataByAd != null && this.sentimentDataByAd.length > 0) {
//                //make a copy of the first result to use as the campaign aggregate model
//                var tempAg = JSON.parse(JSON.stringify(this.sentimentDataByAd[0]));
//
//                //Sum the ad data at the campaign level
//                tempAg.anger = this.sumPropertyOnArray(this.sentimentDataByAd, 'anger');
//                tempAg.contempt = this.sumPropertyOnArray(this.sentimentDataByAd, 'contempt');
//                tempAg.disgust = this.sumPropertyOnArray(this.sentimentDataByAd, 'disgust');
//                tempAg.fear = this.sumPropertyOnArray(this.sentimentDataByAd, 'fear');
//                tempAg.happiness = this.sumPropertyOnArray(this.sentimentDataByAd, 'happiness');
//                tempAg.neutral = this.sumPropertyOnArray(this.sentimentDataByAd, 'neutral');
//                tempAg.sadness = this.sumPropertyOnArray(this.sentimentDataByAd, 'sadness');
//                tempAg.surprise = this.sumPropertyOnArray(this.sentimentDataByAd, 'surprise');
//
//                this.campaignAggregateData = tempAg;
//            }
//        });
    }
}
