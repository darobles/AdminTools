import { Component, OnInit,AfterViewInit,ViewChild,Output,EventEmitter,OnDestroy } from '@angular/core';
import { DiskService } from '../../../services/disk.service';
import { TokenStorageService } from '../../../services/token-storage.service';
import { BaseChartDirective } from 'ng2-charts';
import { EventEmiterService } from '../../../services/event-emiter.service';

@Component({
  selector: 'app-disk-pie',
  templateUrl: './disk-pie.component.html',
  styleUrls: ['./disk-pie.component.css']
})
export class DiskPieComponent implements AfterViewInit,OnInit {
  constructor(private token: TokenStorageService,
    private diskWS: DiskService,
    private _eventEmiter: EventEmiterService) {}

  @Output() datos  : EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(BaseChartDirective)
  chart: BaseChartDirective;
  diskInfo: any;
  currentUser: any;
  diskPrimary: number = 0;
  eventSubscription: any;
  
  // Pie
  public pieChartLabels: string[] = [
    'Espacio en uso',
    'Espacio disponible'
    
    
  ];
  public pieChartData: number[] = [0, 100-this.diskPrimary];
  public pieChartType = 'pie';
  public pieChartOptions: any = {
    tooltipEvents: [],
    showTooltips: true,
    onAnimationComplete: function() {
        this.showTooltip(this.segments, true);
    },
    tooltipTemplate: "<%= label %> - <%= value  %>",
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          var dataset = data.datasets[tooltipItem.datasetIndex];
          var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
            return Number(previousValue) + Number(currentValue);
          });
          var currentValue = dataset.data[tooltipItem.index];
          var percentage = Math.floor(((currentValue/total) * 100)+0.5);
    
          return percentage + "%";
        }
      }
    } 
  };

  ngOnInit(){
    this.currentUser = this.token.getUser();
    if (this.currentUser != null) {
      this.eventSubscription = this._eventEmiter.dataStr.subscribe(data => 
        {
          this.diskWS.close();
          this.obtDiskStatus(this.token.getUser().servidor_activo);
        });
        this.obtDiskStatus(this.token.getUser().servidor_activo);
    }

  }

  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }

  obtDiskStatus(id:number){
    this.diskWS.getDiskInfo(id).subscribe(resp=>
      {
        this.diskInfo = resp;
        var reg = this.diskInfo.find(c=>c.ficheros.includes("mapper"));
        this.diskPrimary = reg.uso_per.substring(0,reg.uso_per.length-1);   
        if(this.chart.chart !== undefined)
          this.chart.chart.data.datasets[0].data = [this.diskPrimary,100-this.diskPrimary];
        this.datos.emit(this.diskInfo);
      });

  }

  ngOnDestroy(){
    this.diskWS.close();
    if(this.eventSubscription !== undefined)
      this.eventSubscription.unsubscribe();

  }

  ngAfterViewInit() {}
}
