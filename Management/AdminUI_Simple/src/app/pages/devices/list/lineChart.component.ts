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
  series:Array<any>;
  bar:Array<any>;

  constructor (private _baConfig:BaThemeConfigProvider,private _baAmChartThemeService:BaAmChartThemeService, private _deviceService:DeviceService) {
    this._loadChartsLib();
  }

  ngOnInit () {
    AmCharts.themes.blur = this._baAmChartThemeService.getTheme();
  }

  ngAfterViewInit () {
    this.getData();
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
    me._deviceService.getLatestAggregateMessageStats('minute').subscribe(data => {
       me.series = data.map(function(item) {
          return {date: new Date(item.windowendtime),value:item.min,value0:item.median};
      });
    },
    error => {
      //var bar = 2;
    },
    () => {
      me.setChartObject(me.buildChartConfigFromSeries(me.series));
    });
  }


  setChartObject = (chObj) => {
    this.chartData = chObj;
    let chart = AmCharts.makeChart(this._selector.nativeElement, this.chartData);
    this.initChart(chart);
  }

  buildChartConfigFromSeries = (series) => {
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
      dataProvider: series,
      categoryField: 'date',
      categoryAxis: {
        "minPeriod": "mm",
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
    //   "legend": {
    //     "align": "center",
    //     "equalWidths": false,
    //     "periodValueText": "total: [[value.sum]]",
    //     "valueAlign": "left",
    //     "valueText": "[[value]] ([[percents]]%)",
    //     "valueWidth": 100
    // },
      graphs: [
        {
          "balloonText": "Max: <b>[[value]]</b>",
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
          "balloonText": "Median: <b>[[value]]</b>",
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
        //categoryBalloonText: '[[category]]',
        categoryBalloonDateFormat: 'JJ:NN, YYYY-MM-DD',
        categoryBalloonColor: '#4285F4',
        categoryBalloonAlpha: 0.7,
        cursorAlpha: 0,
        valueLineEnabled: true,
        valueLineBalloonEnabled: true,
        valueLineAlpha: 0.5
      },
      //dataDateFormat: 'YYYY-MM-DD HH:NN:SS',
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
