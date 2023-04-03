import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-disk-table',
  templateUrl: './disk-table.component.html',
  styleUrls: ['./disk-table.component.css']
})
export class DiskTableComponent implements OnInit {
  @Input() set datos(value: string) {
    this.actDatos(value); 
 }
  diskInfo: any;
  headers = ["Ficheros","Bloques","Disponibles","Usados","%","Montado"];
  constructor() { }

  ngOnInit(): void {
  }

  actDatos(value){
    if(value !== undefined)
    {
      this.diskInfo = value;
    }
    
  }
}
