import { Component, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { TokenStorageService } from '../../services/token-storage.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Servidor } from '../../classes/servidor';
import { EventEmiterService } from '../../services/event-emiter.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-vertical-navigation',
  templateUrl: './vertical-navigation.component.html',
  styleUrls: ['./vertical-navigation.component.css']
})
export class VerticalNavigationComponent implements AfterViewInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() cambioServidor = new EventEmitter<String>();

  isLoggedIn = false;
  username: string;
  currentUser: any;
  servidores: Servidor[];
  servidorSel: Servidor;
  showComponent: boolean = true;
  color: string;
  loaded: boolean = false;
  public config: PerfectScrollbarConfigInterface = {};


  constructor(private tokenStorageService: TokenStorageService,
    private _eventEmiter: EventEmiterService,
     private router: Router) {
  }

  ngOnInit(): void {
    console.log('init nav');
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    console.log('este es ' + this.isLoggedIn)
    if (this.isLoggedIn) {
      this.loaded = true;
      this.currentUser = this.tokenStorageService.getUser();
      this.servidores = this.currentUser.servidores;
      this.username = this.currentUser.username;
      
      if(this.currentUser.servidor_activo == undefined)
      {
        this.servidorSel =  this.servidores.filter(x => x.activo == true)[0];
        this.currentUser.servidor_activo = this.servidorSel.id;
        this.tokenStorageService.saveUser(this.currentUser);
      }
      else{
        this.servidorSel =  this.servidores.filter(x => x.id == this.currentUser.servidor_activo)[0];
      }
      if(this.servidorSel.activo)
      {
        this.showComponent = true;
      }
      else{
        this.showComponent = false;
      }
      //this.refresh();
     // this.selectedDevice =  this.currentUser.servidor_activo;

    }
    else{
      this.loaded =false;
      this.router.navigate(['/authentication/login']);
    }
    
  }



  logout(): void {
    this.tokenStorageService.signOut();
    //window.location.reload();
    this.router.navigate(['/authentication/login']);
  }

  onChange(newValue) {
    
    //this.selectedDevice = newValue;
    this.currentUser.servidor_activo = Number(newValue);
    this.tokenStorageService.saveUser(this.currentUser);
    this._eventEmiter.sendMessage(Number(newValue));
    
    // ... do other stuff here ...
    
  }

  selServidor(newValue){
    this.currentUser.servidor_activo = Number(newValue);
    this.tokenStorageService.saveUser(this.currentUser);
    this._eventEmiter.sendMessage(Number(newValue));
    this.servidorSel =  this.servidores.filter(x => x.id == newValue)[0];
    if(this.servidorSel.activo)
    {
      this.showComponent = true;
    }
    else{
      this.showComponent = false;
    }
  }

  ngAfterViewInit() { }
}
