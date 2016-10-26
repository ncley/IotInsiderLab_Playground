import { Component } from '@angular/core';
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
    public barChartLabels: string[] = ['0-15', '16-19', '20s', '30s', '40s', '50s','60+'];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;

    public barChartData: any[] = [{
            data: [0,0,0,0,0,0,0],
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
//    private currentAfterDate: any;

    //public aggregateDataByAd: AggregateData.AdAggregateData[];

//    // stores the specified or default campaign
//    public currentCampaign: Dto.CampaignDto;

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
        this.getData();
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
                this.campaignAggregateData = this.aggregateDataByAd[0];

                this.campaignAggregateData.ageBracket0 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket0');
                this.campaignAggregateData.ageBracket1 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket1');
                this.campaignAggregateData.ageBracket2 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket2');
                this.campaignAggregateData.ageBracket3 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket3');
                this.campaignAggregateData.ageBracket4 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket4');
                this.campaignAggregateData.ageBracket5 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket5');
                this.campaignAggregateData.ageBracket6 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket6');
                this.campaignAggregateData.uniqueFemales = this.sumPropertyOnArray(this.aggregateDataByAd, 'uniqueFemales');
                this.campaignAggregateData.uniqueMales = this.sumPropertyOnArray(this.aggregateDataByAd, 'uniqueMales');
                this.campaignAggregateData.totalFaces = this.sumPropertyOnArray(this.aggregateDataByAd, 'totalFaces');
                this.campaignAggregateData.uniqueFaces = this.sumPropertyOnArray(this.aggregateDataByAd, 'uniqueFaces');

                this.barChartData[0].data[0] = this.campaignAggregateData.ageBracket0;
                this.barChartData[0].data[1] = this.campaignAggregateData.ageBracket1;
                this.barChartData[0].data[2] = this.campaignAggregateData.ageBracket2;
                this.barChartData[0].data[3] = this.campaignAggregateData.ageBracket3;
                this.barChartData[0].data[4] = this.campaignAggregateData.ageBracket4;
                this.barChartData[0].data[5] = this.campaignAggregateData.ageBracket5;
                this.barChartData[0].data[6] = this.campaignAggregateData.ageBracket6;

                //hack to force chart to update so Y-axis scaling updates
                this.barChartData = this.barChartData.slice();
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
