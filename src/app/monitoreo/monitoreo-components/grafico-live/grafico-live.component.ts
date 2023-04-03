import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {
	ApexAxisChartSeries,
	ApexChart,
	ChartComponent,
	ApexDataLabels,
	ApexYAxis,
	ApexLegend,
	ApexXAxis,
	ApexTheme,
	ApexGrid
} from 'ng-apexcharts';
import { MonitoreoService } from '../../../services/monitoreo.service';
import { TokenStorageService } from '../../../services/token-storage.service';
import { Router } from '@angular/router';
import { EventEmiterService } from '../../../services/event-emiter.service';

export type graphChartOptions = {
	series: ApexAxisChartSeries;
	chart: ApexChart;
	xaxis: ApexXAxis;
	yaxis: ApexYAxis;
	stroke: any;
	fill: any;
	theme: ApexTheme;
	tooltip: any;
	dataLabels: ApexDataLabels;
	legend: ApexLegend;
	colors: string[];
	markers: any;
	grid: ApexGrid;
	
};


@Component({
  selector: 'app-grafico-live',
  templateUrl: './grafico-live.component.html',
  styleUrls: ['./grafico-live.component.css']
})
export class GraficoLiveComponent implements OnInit {

  
	@ViewChild("chart", { static: false }) chart: ChartComponent;
	public graphChartOptions: Partial<graphChartOptions>;
 	constructor(private monitoreoWS: MonitoreoService,private token: TokenStorageService,
	private router: Router,
	private _eventEmiter: EventEmiterService) { 

    this.graphChartOptions = {
			series: [
				{
					name: 'CPU',
					data: [0, 0, 0, 0, 0, 0, 0, 0,0,0]
				},
				/*{
					name: 'RAM',
					data: [0, 10, 70, 10, 24, 18, 22, 14]
				},
				{
					name: 'Disco',
					data: [10,10, 10, 10, 10, 10, 10,10]
				}*/
			],
			chart: {
				height: 350,
				type: 'line',
				stacked: false,
				fontFamily: 'Montserrat,sans-serif',
				toolbar: {
					show: false
				}
			},
			dataLabels: {
				enabled: false
			},
			markers: {
				size: 0,
			},
			stroke: {
				curve: 'straight',
				width: '2',
			},
			fill: {
				type: "solid",
				colors: ['#004cab', '#00ab42', '#851b1c'],
				opacity: 1
			},
			colors: ['#004cab', '#00ab42', '#851b1c'],
			legend: {
				show: false,
			},
			grid: {
				show: true,
				strokeDashArray: 0,
				borderColor: 'rgba(0,0,0,0.1)',
			},
			xaxis: {
				type: 'category',
				categories: [
					'', '', '', '', '', '', '', '','', '',
				],
				labels: {
					style: {
						colors: '#a1aab2'
					}
				}
			},
			yaxis: {
				labels: {
					style: {
						colors: '#a1aab2'
					}
				}
			},
			tooltip: {
				theme: 'dark',
				fillColors: ['#e9edf2', '#398bf7', '#7460ee']
			},
		};
  }
  currentUser: any;
  eventSubscription:any;

  ngOnInit(): void {
	this.currentUser = this.token.getUser();
    if (this.currentUser != null) {
		this.eventSubscription  = this._eventEmiter.dataStr.subscribe(data => 
		{
		  this.monitoreoWS.close();
		  this.obtCpuStatus();
		});
	  this.obtCpuStatus();
    }
   
  }

  obtCpuStatus(){
	let i = 0;  
    this.monitoreoWS.connect().subscribe(
      (message) => {
        let par = message.split("\n");
	   var date = new Date;
	   this.graphChartOptions.series[0].data[this.graphChartOptions.series[0].data.length] = par[4];
	   this.graphChartOptions.xaxis.categories[this.graphChartOptions.xaxis.categories.length] = date.getHours() + ":" + date.getMinutes() + ":" +date.getSeconds();

	   
	   if(this.chart !== undefined)
	   {
		this.chart.updateOptions({
			series: [
				{
					name: 'CPU',
					data: this.graphChartOptions.series[0].data
				}],
			xaxis:{
				categories: this.graphChartOptions.xaxis.categories 
				}	
		   },false,true);
		   this.graphChartOptions.series[0].data.shift();
		   this.graphChartOptions.xaxis.categories.shift();
	   }
		//this.graphChartOptions.series[0].shift();
        //this.loadingScreenService.stopLoading();
      },
      (err) => console.error(err)
    );

    this.monitoreoWS.sendMessage(this.token.getUser().servidor_activo);

  }
  ngOnDestroy() {
    this.monitoreoWS.close();
	this.eventSubscription.unsubscribe();
    // ...
  }

}
