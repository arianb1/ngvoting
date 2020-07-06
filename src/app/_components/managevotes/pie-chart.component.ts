import { Component, Input, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
})

export class PieChartComponent implements OnInit {

  @Input() chartdata: number[];
  @Input() chartlabels: string[];

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };

  public pieChartColors: any = [{
    borderColor: 'white',
    backgroundColor: ['green', 'red', 'blue', 'yellow', 'magenta', 'brown', 'orange', 'salmon', 'gray'],
    pointBackgroundColor: 'orange',
    pointBorderColor: 'blue,'
  }];

  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor() {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit() {
    this.pieChartLabels = this.chartlabels;
    this.pieChartData = this.chartdata;

  }

}
