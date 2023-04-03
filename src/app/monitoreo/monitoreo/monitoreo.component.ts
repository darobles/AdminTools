import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../services/token-storage.service';
import {  Router  } from '@angular/router';


@Component({
  selector: 'app-monitoreo',
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.css']
})
export class MonitoreoComponent implements OnInit {
  currentUser: any;
  datoSistema: string;
  ramUsage: string;
  cpuUsage: string;
  diskUsage: number;
  datosDisk: any;
  constructor(private token: TokenStorageService,
    private router: Router) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    if(this.currentUser != null)
    {
    }
    else{      
      this.router.navigate(['/authentication/login']);
    }
  }


  getDatos(evt){
    this.datoSistema = evt;
    //console.log(evt);
    var arr = evt.toString().split("\n");
    this.ramUsage = arr[4];
    this.cpuUsage = arr[8];
  }

  getDatosDisk(evt){
    
    this.datosDisk = evt;
    var reg = evt.find(c=>c.ficheros.includes("mapper"));
    this.diskUsage = reg.uso_per.substring(0,reg.uso_per.length-1); 
  }

}
