import { Component, OnDestroy, OnInit } from '@angular/core';
//import Dto = require("../model/CampaignDto");
import Dto = require("../model/CampaignAdAggregateData");
//import AggregateData = require("../model/AdAggregateData");
import Service = require("../service/ArgonneService");
//import moment = require("moment");


@Component({
    selector: 'home',
    template: require('./home.component.html'),
    providers: [Service.ArgonneService]
})
export class HomeComponent implements OnInit, OnDestroy{

    intervalId = 0;

    public aggregateDataByAd: Dto.CampaignAdAggregateData[];

    // contains the webapi campaign ads aggregated data
    public campaignAggregateData: Dto.CampaignAdAggregateData;

    // current campaign id (default or passed in)
    public currentCampaignId: string;

    // Specify the default campaign
    private CAMPAIGN_ID = '3149351f-3c9e-4d0a-bfa5-d8caacfd77f0';

    constructor(private argonneService: Service.ArgonneService) {
        //this.currentAfterDate = moment.utc(); // initializes to the current time
        this.currentCampaignId = this.CAMPAIGN_ID;
        //this.getData();
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
        // get the web api aggregated data
        this.argonneService.getCampaignAggregateByAd(this.CAMPAIGN_ID).subscribe(serviceResponse => {
            this.aggregateDataByAd = serviceResponse;

            // save the campaign aggregated data
            if (this.aggregateDataByAd != null && this.aggregateDataByAd.length > 0) {

                //Sum the ad data at the campaign level
                var tempAg = JSON.parse(JSON.stringify(this.aggregateDataByAd[0]));

                //null out campaign name for ad objects (yes, this is hacky :( )
                for (var index = 0, len = this.aggregateDataByAd.length; index < len; index++) {
                    this.aggregateDataByAd[index].campaignName = null;
                }

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

                tempAg.adName = null;
                this.campaignAggregateData = tempAg;

            }
        });
    }


//    private getData() {
//        // format the timestamp
//        //var afterTimestamp = this.currentAfterDate.local().format("YYYY-MM-DDTHH:mm:ss");
//
//        var afterTimestamp = this.currentAfterDate.local().format("2016-10-13T00:00:00");
//
//        // get the web api aggregated data
//        this.argonneService.getCampaignAggregate(this.CAMPAIGN_ID, afterTimestamp).subscribe(serviceResponse => {
//            this.aggregateDataByAd = serviceResponse;
//
//            // save the campaign aggregated data
//            if (this.aggregateDataByAd != null && this.aggregateDataByAd.length > 0) {
//
//                //Sum the ad data at the campaign level
//                this.campaignAggregateData = this.aggregateDataByAd[0];
//
//                this.campaignAggregateData.ageBracket1 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket1');
//                this.campaignAggregateData.ageBracket2 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket2');
//                this.campaignAggregateData.ageBracket3 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket3');
//                this.campaignAggregateData.ageBracket4 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket4');
//                this.campaignAggregateData.ageBracket5 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket5');
//                this.campaignAggregateData.females = this.sumPropertyOnArray(this.aggregateDataByAd, 'females');
//                this.campaignAggregateData.males = this.sumPropertyOnArray(this.aggregateDataByAd, 'males');
//                this.campaignAggregateData.totalFaces = this.sumPropertyOnArray(this.aggregateDataByAd, 'totalFaces');
//                this.campaignAggregateData.uniqueFaces = this.sumPropertyOnArray(this.aggregateDataByAd, 'uniqueFaces');
//
//                this.barChartData[0].data[0] = this.campaignAggregateData.ageBracket1;
//                this.barChartData[0].data[1] = this.campaignAggregateData.ageBracket2;
//                this.barChartData[0].data[2] = this.campaignAggregateData.ageBracket3;
//                this.barChartData[0].data[3] = this.campaignAggregateData.ageBracket4;
//                this.barChartData[0].data[4] = this.campaignAggregateData.ageBracket5;
//
//                //hack to force chart to update so Y-axis scaling updates
//                this.barChartData = this.barChartData.slice();
//            }
//        });
//    }

}
