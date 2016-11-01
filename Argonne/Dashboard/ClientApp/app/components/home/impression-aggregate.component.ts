import { Component, Input } from '@angular/core';
import Dto = require("../model/CampaignAdAggregateData");
//import Dto1 = require("../model/AdSentimentData");

@Component({
    selector: 'impression-aggregate',
    template: require('./impression-aggregate.component.html'),
})
export class ImpressionAggregateComponent {
    public genderChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true,
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'number of viewers'
                },
                stacked:true
            }],
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'age range'
                },
                stacked:true
            }]
        }
    };

    public genderChartLabels: string[] = ['0-15', '16-19', '20s', '30s', '40s', '50s','60+'];
    public genderChartType: string = 'bar';
    public genderChartLegend: boolean = true;

    public genderChartData: any[] = [{
        data: [0,0,0,0,0,0,0],
            label: 'Females'
        },
        {
            data: [0, 0, 0, 0, 0, 0, 0],
            label: 'Males'
        },
    ];

    //sentiment chart
    public sentimentChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true,
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Relative Strength'
                },
                stacked: true
            }],
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Sentiment'
                },
                stacked: true
            }]
        }
    };

    public sentimentChartLabels: string[] = ['Anger', 'Contempt', 'Disgust', 'Fear', 'Happiness', 'Neutral', 'Sadness','Surprise'];
    public sentimentChartType: string = 'bar';
    public sentimentChartLegend: boolean = true;
    public sentimentChartColors: Array<any> = [
//        { // grey
//            backgroundColor: 'rgba(148,159,177,0.2)',
//            borderColor: 'rgba(148,159,177,1)',
//            pointBackgroundColor: 'rgba(148,159,177,1)',
//            pointBorderColor: '#fff',
//            pointHoverBackgroundColor: '#fff',
//            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
//        },
        { // dark grey
            backgroundColor: 'rgba(77,83,96,0.2)',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)'
        },
        { // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ];
    public sentimentChartData: any[] = [{
        data: [0, 0, 0, 0, 0, 0, 0, 0],
        label: 'Score'
    }];


    _aggregateData: Dto.CampaignAdAggregateData;
    
    @Input()
    set aggregateData(agData: Dto.CampaignAdAggregateData) {
        this._aggregateData = agData;
        if (this._aggregateData != null) {
            this.genderChartData[0].data[0] = this.aggregateData.ageBracket0Females;
            this.genderChartData[0].data[1] = this.aggregateData.ageBracket1Females;
            this.genderChartData[0].data[2] = this.aggregateData.ageBracket2Females;
            this.genderChartData[0].data[3] = this.aggregateData.ageBracket3Females;
            this.genderChartData[0].data[4] = this.aggregateData.ageBracket4Females;
            this.genderChartData[0].data[5] = this.aggregateData.ageBracket5Females;
            this.genderChartData[0].data[6] = this.aggregateData.ageBracket6Females;

            this.genderChartData[1].data[0] = this.aggregateData.ageBracket0Males;
            this.genderChartData[1].data[1] = this.aggregateData.ageBracket1Males;
            this.genderChartData[1].data[2] = this.aggregateData.ageBracket2Males;
            this.genderChartData[1].data[3] = this.aggregateData.ageBracket3Males;
            this.genderChartData[1].data[4] = this.aggregateData.ageBracket4Males;
            this.genderChartData[1].data[5] = this.aggregateData.ageBracket5Males;
            this.genderChartData[1].data[6] = this.aggregateData.ageBracket6Males;

            //hack to force chart to update so Y-axis scaling updates
            //this.barChartData = this.barChartData.slice();          

            //public sentimentChartLabels: string[] = ['Anger', 'Contempt', 'Disgust', 'Fear', 'Happiness', 'Neutral', 'Sadness','Surprise'];
            this.sentimentChartData[0].data[0] = this.aggregateData.totalAnger;
            this.sentimentChartData[0].data[1] = this.aggregateData.totalContempt;
            this.sentimentChartData[0].data[2] = this.aggregateData.totalDisgust;
            this.sentimentChartData[0].data[3] = this.aggregateData.totalFear;
            this.sentimentChartData[0].data[4] = this.aggregateData.totalHappiness;
            this.sentimentChartData[0].data[5] = this.aggregateData.totalNeutral;
            this.sentimentChartData[0].data[6] = this.aggregateData.totalSadness;
            this.sentimentChartData[0].data[6] = this.aggregateData.totalSurprise;
        }
    }

    get aggregateData() { return this._aggregateData; }
}
