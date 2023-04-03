import { Component, OnInit, AfterViewInit, ViewChild,Output, EventEmitter, OnDestroy } from '@angular/core';
import { MonitoreoService } from '../../../services/monitoreo.service';
import { BaseChartDirective } from 'ng2-charts';
import { TokenStorageService } from '../../../services/token-storage.service';
import { Router } from '@angular/router';
import { EventEmiterService } from '../../../services/event-emiter.service';

@Component({
  selector: 'app-grafico-cpujs',
  templateUrl: './grafico-cpujs.component.html',
  styleUrls: ['./grafico-cpujs.component.css']
})
export class GraficoCpujsComponent implements AfterViewInit, OnInit {
  constructor(private monitoreoWS: MonitoreoService, 
    private token: TokenStorageService,
    private router: Router, 
    private _eventEmiter: EventEmiterService) { }
  @ViewChild(BaseChartDirective)
  chart: BaseChartDirective;
  @Output() datos  : EventEmitter<any> = new EventEmitter<any>();
  // lineChart
  public lineChartData: Array<any> = [
    { data: [0], label: 'Uso CPU', fill: false }
  ];
  public lineChartLabels: Array<any> = [
    ''
  ];


  public lineChartOptions: any = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          suggestedMin: 0,
          suggestedMax: 100
        }
      }]
    }
  };
  public lineChartColors: Array<any> = [
    {
      // dark grey
      backgroundColor: 'rgb(41,98,255,.1)',
      borderColor: '#2962FF',
      pointBackgroundColor: '#2962FF',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#2962FF'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  currentUser: any;
  eventSubscription: any;


  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    if (this.currentUser != null) {
      this.eventSubscription = this._eventEmiter.dataStr.subscribe(data => 
          {
            this.monitoreoWS.close();
            this.obtCpuStatus(data);
          });
          this.obtCpuStatus(this.token.getUser().servidor_activo);
      
    }
    else {
      this.monitoreoWS.close();
    }
    
  }

  obtCpuStatus(id_servidor:number) {
    let i = 0;
    this.monitoreoWS.connect().subscribe(
      (message) => {
        //this.serverStatus = message;
        let par = message.split("\n");
        this.chart.chart.data.datasets[0].data.push(Number(par[8]));
        this.chart.chart.data.labels.push(this.getDate())
        if (this.chart.chart.data.datasets[0].data.length > 9) {
          this.chart.chart.data.datasets[0].data.shift();
          this.chart.chart.data.labels.shift();
        }
        this.chart.chart.update();
        this.datos.emit(message);
      },
      (err) => console.error(err)
    );

    this.monitoreoWS.sendMessage(id_servidor);

  }

  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }


  getDate() {
    var date = new Date;
    var hora = date.getHours().toString();
    var minutos = date.getMinutes().toString();
    var segundos = date.getSeconds().toString();
    if (hora.length == 1) {
      hora = "0" + hora;
    }
    if (minutos.length == 1) {
      minutos = "0" + minutos;
    }
    if (segundos.length == 1) {
      segundos = "0" + segundos;
    }

    return hora + ":" + minutos + ":" + segundos;

  }

  ngAfterViewInit() { }
  ngOnDestroy(){
    this.monitoreoWS.close();
    if(this.eventSubscription !== undefined)
      this.eventSubscription.unsubscribe();
  }
}