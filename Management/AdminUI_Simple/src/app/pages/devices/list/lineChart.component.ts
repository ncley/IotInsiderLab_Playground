import {Component, ViewChild, ViewEncapsulation, Input, Output, ElementRef, EventEmitter, OnInit, AfterViewInit} from '@angular/core';
import {BaThemeConfigProvider, colorHelper, layoutPaths} from '../../../theme';
import {BaThemePreloader} from '../../../theme/services';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import {DeviceService} from './device.service';
import {BaAmChartThemeService} from './baAmChartTheme.service';

require('style-loader!ammap3/ammap/ammap.css');

require('amcharts3');
require('amcharts3/amcharts/plugins/responsive/responsive.js');
require('amcharts3/amcharts/serial.js');

require('ammap3');
require('ammap3/ammap/maps/js/worldLow');


@Component({
  selector: 'line-chart',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./lineChart.scss')],
  template: require('./lineChart.html'),
})
export class LineChart implements OnInit,AfterViewInit{
  baAmChartConfiguration:Object;
  
  @ViewChild('baAmChart') private _selector:ElementRef;

  chartData:Object;
  series:any;

  constructor (private _baConfig:BaThemeConfigProvider,private _baAmChartThemeService:BaAmChartThemeService, private _deviceService:DeviceService) {
    this._loadChartsLib();
  }

  ngOnInit () {
    AmCharts.themes.blur = this._baAmChartThemeService.getTheme();
//    this.getData();//should this move into after init?
  }

  ngAfterViewInit () {
    this.getData();//should this move into after init?
  }


  private _loadChartsLib = () => {
    BaThemePreloader.registerLoader(new Promise((resolve, reject) => {
      let amChartsReadyMsg = 'AmCharts ready';

      if (AmCharts.isReady) {
        resolve(amChartsReadyMsg);
      } else {
        AmCharts.ready(function () {
          resolve(amChartsReadyMsg);
        });
      }
    }));
  }

  initChart(chart:any) {
    // let zoomChart = () => {
    //   chart.zoomToDates(new Date(2013, 3), new Date(2014, 0));
    // };

    // chart.addListener('rendered', zoomChart);
    // zoomChart();

    // if (chart.zoomChart) {
    //   chart.zoomChart();
    // }
  }

  getData = () => {
    var me = this;
    //this._deviceService.getLatestAggregateMessageStats('minute').subscribe(data => {
    me._deviceService.getAllDevices().subscribe(data => {
      //  var series = data.map(function(item) {
      //     return { date: new Date(2013, 0), value: 15000, value0: 19000};//{date:item.windowendtime,value:item.min,value0:item.max};
      // });

        me.series = [
          { date: new Date(2012, 11), value: 0, value0: 0 },
          { date: new Date(2013, 0), value: 15000, value0: 19000},
          { date: new Date(2013, 1), value: 30000, value0: 20000},


          { date: new Date(2013, 2), value: 25000, value0: 22000},
          { date: new Date(2013, 3), value: 21000, value0: 25000},
          { date: new Date(2013, 4), value: 24000, value0: 29000},
          { date: new Date(2013, 5), value: 31000, value0: 26000},
          { date: new Date(2013, 6), value: 40000, value0: 25000},
          { date: new Date(2013, 7), value: 37000, value0: 20000},
          { date: new Date(2013, 8), value: 18000, value0: 22000},
          { date: new Date(2013, 9), value: 5000, value0: 26000},
          { date: new Date(2013, 10), value: 40000, value0: 30000},
          { date: new Date(2013, 11), value: 20000, value0: 25000},
          { date: new Date(2014, 0), value: 5000, value0: 13000},

          { date: new Date(2014, 1), value: 3000, value0: 13000},
          { date: new Date(2014, 2), value: 1800, value0: 13000},
          { date: new Date(2014, 3), value: 10400, value0: 13000},
          { date: new Date(2014, 4), value: 25500, value0: 13000},
          { date: new Date(2014, 5), value: 2100, value0: 13000},
          { date: new Date(2014, 6), value: 6500, value0: 13000},
          { date: new Date(2014, 7), value: 1100, value0: 13000},
          { date: new Date(2014, 8), value: 17200, value0: 13000},
          { date: new Date(2014, 9), value: 26900, value0: 13000},
          { date: new Date(2014, 10), value: 14100, value0: 13000},
          { date: new Date(2014, 11), value: 35300, value0: 13000},
          { date: new Date(2015, 0), value: 54800, value0: 13000},
          { date: new Date(2015, 1), value: 49800, value0: 13000}
        ];

      //this.chartData = this.buildChartFromSeries(series, layoutColors, graphColor);
      var foo = 1;
    },
    error => {
      var bar = 2;
    },
    () => {
      me.setChartObject(me.buildChartFromSeries(me.series));
      //me.chartData = me.buildChartFromSeries(me.series)
    });


    //this._deviceService.getAllDevices().subscribe(data => this.buildChartFromSeries());

    // var data = this._deviceService.getLatestAggregateMessageStats('minute');
    // var series = data.map(function(item) {
    //       return { date: new Date(2013, 0), value: 15000, value0: 19000};//{date:item.windowendtime,value:item.min,value0:item.max};
    //   });

      // var series = [
      //   { date: new Date(2012, 11), value: 0, value0: 0 },
      //   { date: new Date(2013, 0), value: 15000, value0: 19000},
      //   { date: new Date(2013, 1), value: 30000, value0: 20000},


      //   { date: new Date(2013, 2), value: 25000, value0: 22000},
      //   { date: new Date(2013, 3), value: 21000, value0: 25000},
      //   { date: new Date(2013, 4), value: 24000, value0: 29000},
      //   { date: new Date(2013, 5), value: 31000, value0: 26000},
      //   { date: new Date(2013, 6), value: 40000, value0: 25000},
      //   { date: new Date(2013, 7), value: 37000, value0: 20000},
      //   { date: new Date(2013, 8), value: 18000, value0: 22000},
      //   { date: new Date(2013, 9), value: 5000, value0: 26000},
      //   { date: new Date(2013, 10), value: 40000, value0: 30000},
      //   { date: new Date(2013, 11), value: 20000, value0: 25000},
      //   { date: new Date(2014, 0), value: 5000, value0: 13000},

      //   { date: new Date(2014, 1), value: 3000, value0: 13000},
      //   { date: new Date(2014, 2), value: 1800, value0: 13000},
      //   { date: new Date(2014, 3), value: 10400, value0: 13000},
      //   { date: new Date(2014, 4), value: 25500, value0: 13000},
      //   { date: new Date(2014, 5), value: 2100, value0: 13000},
      //   { date: new Date(2014, 6), value: 6500, value0: 13000},
      //   { date: new Date(2014, 7), value: 1100, value0: 13000},
      //   { date: new Date(2014, 8), value: 17200, value0: 13000},
      //   { date: new Date(2014, 9), value: 26900, value0: 13000},
      //   { date: new Date(2014, 10), value: 14100, value0: 13000},
      //   { date: new Date(2014, 11), value: 35300, value0: 13000},
      //   { date: new Date(2015, 0), value: 54800, value0: 13000},
      //   { date: new Date(2015, 1), value: 49800, value0: 13000}
      // ];
    
  }


  setChartObject = (chObj) => {
    this.chartData = chObj;
    let chart = AmCharts.makeChart(this._selector.nativeElement, this.chartData);
    this.initChart(chart);
  }

  buildChartFromSeries = (series) => {
    var layoutColors = this._baConfig.get().colors;
    var graphColor = this._baConfig.get().colors.custom.dashboardLineChart;

    return {
      type: 'serial',
      theme: 'blur',
      marginTop: 15,
      marginRight: 15,
      responsive: {
        'enabled': true
      },
      dataProvider: series
      ,
      categoryField: 'date',
      categoryAxis: {
        parseDates: true,
        gridAlpha: 0,
        color: layoutColors.defaultText,
        axisColor: layoutColors.defaultText
      },
      valueAxes: [
        {
          minVerticalGap: 50,
          gridAlpha: 0,
          color: layoutColors.defaultText,
          axisColor: layoutColors.defaultText
        }
      ],
      graphs: [
        {
          id: 'g0',
          bullet: 'none',
          useLineColorForBulletBorder: true,
          lineColor: LineChart.hexToRgbA(graphColor, 0.3),
          lineThickness: 1,
          negativeLineColor: layoutColors.danger,
          type: 'smoothedLine',
          valueField: 'value0',
          fillAlphas: 1,
          fillColorsField: 'lineColor'
        },
        {
          id: 'g1',
          bullet: 'none',
          useLineColorForBulletBorder: true,
          lineColor: LineChart.hexToRgbA(graphColor, 0.15),
          lineThickness: 1,
          negativeLineColor: layoutColors.danger,
          type: 'smoothedLine',
          valueField: 'value',
          fillAlphas: 1,
          fillColorsField: 'lineColor'
        }
      ],
      chartCursor: {
        categoryBalloonDateFormat: 'MM YYYY',
        categoryBalloonColor: '#4285F4',
        categoryBalloonAlpha: 0.7,
        cursorAlpha: 0,
        valueLineEnabled: true,
        valueLineBalloonEnabled: true,
        valueLineAlpha: 0.5
      },
      dataDateFormat: 'MM YYYY',
      export: {
        enabled: true
      },
      creditsPosition: 'bottom-right',
      zoomOutButton: {
        backgroundColor: '#fff',
        backgroundAlpha: 0
      },
      zoomOutText: '',
      pathToImages: layoutPaths.images.amChart
    };
  }

  static hexToRgbA = (hex, alpha) => {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
    }
    throw new Error('Bad Hex');
  };

}
