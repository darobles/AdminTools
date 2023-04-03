import { Component, OnInit } from '@angular/core';
import { MonitoreoService } from '../../../services/monitoreo.service';
import { TokenStorageService } from '../../../services/token-storage.service';


@Component({
  selector: 'app-user-cpu-usage',
  templateUrl: './user-cpu-usage.component.html',
  styleUrls: ['./user-cpu-usage.component.css']
})
export class UserCpuUsageComponent implements OnInit {

  constructor(private token: TokenStorageService,
    private monService: MonitoreoService) { }
  
  currentUser: any;
  cpuInfo: any;
  headers = ["Usuario","PID","CMD","MEM %","CPU %"];
  interval : any;
  eventSubscription: any;

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.obtCpuUsers(this.token.getUser().servidor_activo);
    if (this.currentUser != null) {
      this.interval = setInterval(() => {
          this.obtCpuUsers(this.token.getUser().servidor_activo);
        }, 3000);
        
      }
  }

  obtCpuUsers(id:number){
    this.eventSubscription = this.monService.getCpuUserInfo(id).subscribe(resp=>
      {
        this.cpuInfo = resp;
      },(err) => 
      {
        clearInterval(this.interval);
        //this.router.navigate(['/authentication/login']);
      }
      );

  }

  ngOnDestroy(){
    if(this.interval !== undefined)
      clearInterval(this.interval);

    if(this.eventSubscription !== undefined)
      this.eventSubscription.unsubscribe();  
  }
}
