import { Component } from '@angular/core';
import Dto = require("../model/CampaignDto");
import AggregateData = require("../model/AdAggregateData");
import Service = require("../service/ArgonneService");
import moment = require("moment");

@Component({
    selector: 'home',
    template: require('./home.component.html'),
    providers: [Service.ArgonneService]
})
export class HomeComponent {
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true,
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'number of viewers'
                }
            }],
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'age range'
                }
            }]
        }
    };
    public barChartLabels: string[] = ['0-15', '16-19', '20s', '30s', '40s', '50+'];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;

    public barChartData: any[] = [{
            data: [65, 59, 80, 81, 56, 55, 40],
            label: 'Viewers'
//            backgroundColor: [
//                'rgba(255, 99, 132, 0.2)',
//                'rgba(54, 162, 235, 0.2)',
//                'rgba(255, 206, 86, 0.2)',
//                'rgba(75, 192, 192, 0.2)',
//                'rgba(153, 102, 255, 0.2)',
//                'rgba(255, 159, 64, 0.2)'
//            ],
    }];

    // contains the timestamp of when the page was loaded.
    private currentAfterDate: any;

    public aggregateDataByAd: AggregateData.AdAggregateData[];

    // stores the specified or default campaign
    public currentCampaign: Dto.CampaignDto;

    // triggers auto pooling of the code
    public enableLiveStream: boolean = true;

//    // $timeout promise to control pooling function
//    public liveStreamTimer: ng.IPromise<any>;

    // contains the webapi campaign ads aggregated data
    public campaignAgData: AggregateData.AdAggregateData;

    // gender chart properties
    public chartAdGenderData: any[][];
    public chartAdGenderOptions: any;
    public chartAdGenderLabels: string[];
    public chartAdGenderSeries: string[];
    public chartAdGenderType: string;
    public chartAdGenderDatasetOverride: any[];

    // impression chart properites
    public chartImpressionSentimentType: string = 'line';
    public chartImpressionSentimentData: any[];
    public chartImpressionSentimentLabels: string[];
    public chartImpressionSentimentSeries: string[];
    public chartImpressionSentimentOption: any;
    public chartImpressionSentitmentDatasetOverride: any[];

    // current campaign id (default or passed in)
    public currentCampaignId: string;

    // Specify the default campaign
    private CAMPAIGN_ID = '3149351f-3c9e-4d0a-bfa5-d8caacfd77f0';

    constructor(private argonneService: Service.ArgonneService) {
        this.currentAfterDate = moment.utc(); // initializes to the current time
        this.currentCampaignId = this.CAMPAIGN_ID;
        this.getData();
    }

    private sumPropertyOnArray(theArray, propertyName) {
        return theArray.reduce((currentSum, nextItem) => (currentSum + nextItem[propertyName]), 0);
    };

    private getData() {
        // format the timestamp
        //var afterTimestamp = this.currentAfterDate.local().format("YYYY-MM-DDTHH:mm:ss");

        var afterTimestamp = this.currentAfterDate.local().format("2016-10-13T00:00:00");

        // get the web api aggregated data
        this.argonneService.getCampaignAggregate(this.CAMPAIGN_ID, afterTimestamp).subscribe(serviceResponse => {
            this.aggregateDataByAd = serviceResponse;

            // save the campaign aggregated data
            if (this.aggregateDataByAd != null && this.aggregateDataByAd.length > 0) {

                //Sum the ad data at the campaign level
                this.campaignAgData = this.aggregateDataByAd[0];

                this.campaignAgData.ageBracket1 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket1');
                this.campaignAgData.ageBracket2 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket2');
                this.campaignAgData.ageBracket3 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket3');
                this.campaignAgData.ageBracket4 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket4');
                this.campaignAgData.ageBracket5 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket5');
                this.campaignAgData.females = this.sumPropertyOnArray(this.aggregateDataByAd, 'females');
                this.campaignAgData.males = this.sumPropertyOnArray(this.aggregateDataByAd, 'males');
                this.campaignAgData.totalFaces = this.sumPropertyOnArray(this.aggregateDataByAd, 'totalFaces');
                this.campaignAgData.uniqueFaces = this.sumPropertyOnArray(this.aggregateDataByAd, 'uniqueFaces');

                this.barChartData[0].data[0] = this.campaignAgData.ageBracket1;
                this.barChartData[0].data[1] = this.campaignAgData.ageBracket2;
                this.barChartData[0].data[2] = this.campaignAgData.ageBracket3;
                this.barChartData[0].data[3] = this.campaignAgData.ageBracket4;
                this.barChartData[0].data[4] = this.campaignAgData.ageBracket5;

                //hack to force chart to update so Y-axis scaling updates
                this.barChartData = this.barChartData.slice();
            }
        });
    }

}
