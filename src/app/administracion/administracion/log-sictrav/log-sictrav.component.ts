import { Component, OnInit,ViewChild,ElementRef,OnDestroy } from '@angular/core';
import { LogSictrav } from '../../../services/log-sictrav.service' 
import { TokenStorageService } from '../../../services/token-storage.service';
import { EventEmiterService } from '../../../services/event-emiter.service';


@Component({
  selector: 'app-log-sictrav',
  templateUrl: './log-sictrav.component.html',
  styleUrls: ['./log-sictrav.component.css']
})
export class LogSictravComponent implements OnInit {
  @ViewChild('logWall') logWall: ElementRef;
  constructor(private logSictravWS: LogSictrav, private token: TokenStorageService,
    private _eventEmiter: EventEmiterService) { }
  logSictrav: string;
  currentUser: any;
  eventSubscription : any;

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    if (this.currentUser != null) {
      this.eventSubscription  = this._eventEmiter.dataStr.subscribe(data => 
        {
          this.logSictrav = "";
          this.logSictravWS.close();
          this.obtLogSictrav();
        });
      this.obtLogSictrav();
    }
    else {
      this.logSictravWS.close();
    }
    
  }

  obtLogSictrav(){
    this.logSictravWS.connect().subscribe(
      (message) => {
        this.logSictrav += message;
        if(this.logSictrav.length > 5000)
        {
          this.logSictrav = this.logSictrav.substring(this.logSictrav.length-5000,this.logSictrav.length);
          this.logWall.nativeElement.scrollTo(0,1000);
        }
        
      },
      (err) => console.error(err)
    );

    this.logSictravWS.sendMessage(this.token.getUser().servidor_activo);

  }

  ngOnDestroy(): void {
    if(this.logSictravWS !== undefined)
    {
      this.logSictravWS.close();
    }
    if(this.eventSubscription !== undefined)
      this.eventSubscription.unsubscribe();
    // ...
  }

}
