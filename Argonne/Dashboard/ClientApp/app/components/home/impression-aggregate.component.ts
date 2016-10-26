import { Component, Input } from '@angular/core';
import Dto = require("../model/CampaignAdAggregateData");

@Component({
    selector: 'impression-aggregate',
    template: require('./impression-aggregate.component.html'),
})
export class ImpressionAggregateComponent {
    public barChartOptions: any = {
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

    public barChartLabels: string[] = ['0-15', '16-19', '20s', '30s', '40s', '50s','60+'];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;

    public barChartData: any[] = [{
        data: [0,0,0,0,0,0,0],
            label: 'Females'
        },
        {
            data: [0, 0, 0, 0, 0, 0, 0],
            label: 'Males'
        },
    ];

    _aggregateData: Dto.CampaignAdAggregateData;

    @Input()
    set aggregateData(agData: Dto.CampaignAdAggregateData) {
        this._aggregateData = agData;
        if (this._aggregateData != null) {
            this.barChartData[0].data[0] = this.aggregateData.ageBracket0Females;
            this.barChartData[0].data[1] = this.aggregateData.ageBracket1Females;
            this.barChartData[0].data[2] = this.aggregateData.ageBracket2Females;
            this.barChartData[0].data[3] = this.aggregateData.ageBracket3Females;
            this.barChartData[0].data[4] = this.aggregateData.ageBracket4Females;
            this.barChartData[0].data[5] = this.aggregateData.ageBracket5Females;
            this.barChartData[0].data[6] = this.aggregateData.ageBracket6Females;

            this.barChartData[1].data[0] = this.aggregateData.ageBracket0Males;
            this.barChartData[1].data[1] = this.aggregateData.ageBracket1Males;
            this.barChartData[1].data[2] = this.aggregateData.ageBracket2Males;
            this.barChartData[1].data[3] = this.aggregateData.ageBracket3Males;
            this.barChartData[1].data[4] = this.aggregateData.ageBracket4Males;
            this.barChartData[1].data[5] = this.aggregateData.ageBracket5Males;
            this.barChartData[1].data[6] = this.aggregateData.ageBracket6Males;

            //hack to force chart to update so Y-axis scaling updates
            this.barChartData = this.barChartData.slice();            
        }
    }

    get aggregateData() { return this._aggregateData; }

}
