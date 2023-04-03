import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent  {

  constructor(public dialogRef: MatDialogRef<any>) {}

  public confirmMessage:string;

  public confirmTittle:string;

  public mostrarCancelar: boolean = true;
}