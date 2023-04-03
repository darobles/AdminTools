import { Component, OnInit, AfterViewInit,ViewChild, Input,SimpleChanges } from '@angular/core';
import { MonitoreoService } from '../../../services/monitoreo.service';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-ram-doughnut',
  templateUrl: './ram-doughnut.component.html',
  styleUrls: ['./ram-doughnut.component.css']
})
export class RamDoughnutComponent implements AfterViewInit, OnInit {
  constructor() {}
  @Input() set datos(value: string) {
    this.actDatos(value); 
 }
 @ViewChild(BaseChartDirective)
 chart: BaseChartDirective;
  // Doughnut
  public doughnutChartLabels: string[] = [
    'RAM Cache',
    'RAM Usada',
    'RAM Libre'
  ];
  ramLibre: number = 0;
  ramUsada: number = 0;
  ramTotal: number = 0;
  ramCache: number = 0;
  public doughnutChartData: number[] = [this.ramLibre, this.ramUsada, this.ramTotal];
  public doughnutChartType = 'doughnut';

  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }

  ngOnInit(){
  }

  ngOnChanges(changes: SimpleChanges) {
}

actDatos(value){
  if(value !== undefined)
  {
    var str = value.split('\n');
    this.ramLibre = str[1];
    this.ramUsada = str[2];
    this.ramTotal = str[0];
    this.ramCache = str[3];
    this.chart.chart.data.datasets[0].data = [this.ramCache,this.ramUsada, this.ramLibre]
    this.chart.chart.update();
  }
  
}

  ngAfterViewInit() {}
}
