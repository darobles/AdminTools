import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NetworkService } from '../../../services/network.service';
import { TokenStorageService } from '../../../services/token-storage.service';
import { Router } from '@angular/router';
import { EventEmiterService } from '../../../services/event-emiter.service';

@Component({
  selector: 'app-configurador-panel',
  templateUrl: './configurador-panel.component.html',
  styleUrls: ['./configurador-panel.component.css']
})
export class ConfiguradorPanelComponent implements OnInit {
  @Input() set datoRam(value: string) {
    this.setRamUsage(value);
  }
  @Input() set datoCpu(value: string) {
    this.setCpuUsage(value);
  }
  @Input() set datoDisk(value: string) {
    this.setDiskUsage(value);
  }

  constructor(private _eventEmiter: EventEmiterService,private networkWS: NetworkService, private token: TokenStorageService,
    private router: Router) { }
  servidor: number = 0;
  currentUser: any;
  ramUsage: string;
  cpuUsage: string;
  diskUsage: string;
  inNet: string = '0 kBit/s';
  outNet: string = '0 kBit/s';
  eventSubscription: any;

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    if (this.currentUser != null) {
      this.servidor = this.currentUser.servidor_activo;
      this.eventSubscription  = this._eventEmiter.dataStr.subscribe(data => 
        {
          this.networkWS.close();
          this.networkSub();
        });
      this.networkSub();
    }
    else{
      this.networkWS.close();
    }
  }

  networkSub(){
    var i = 0;
    this.networkWS.connect().subscribe(
      (message) => {
        if(message.indexOf('Avg') > 0)
        {
          if(i == 0)
          {
            this.inNet = message.split('Avg:')[1].split('/s')[0] + '/s';
            i++;
          }
          else{
            this.outNet = message.split('Avg:')[1].split('/s')[0] +'/s';
            i= 0;
          }            
        }
      },
      (err) => console.error(err)
    );
    this.networkWS.sendMessage(this.servidor);
  }

  setRamUsage(value) {
    if (value !== undefined) {
      this.ramUsage = value;
    }

  }

  setCpuUsage(value) {
    if (value !== undefined) {
      this.cpuUsage = value;
    }

  }

  setDiskUsage(value) {
    if (value !== undefined) {
      this.diskUsage = value;
    }

  }
  ngOnDestroy() {
    this.networkWS.close();
    if(this.eventSubscription !== undefined)
      this.eventSubscription.unsubscribe();
    // ...
  }

}
