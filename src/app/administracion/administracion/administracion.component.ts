import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Servidor } from '../../classes/servidor';
import { Schema } from '../../classes/schema';
import { DatabaseService } from '../../services/administracion/database.service';
import { SictravService } from '../../services/administracion/sictrav.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { NotifierService } from 'angular-notifier';
import { ModalDismissReasons, NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { UploadService } from 'src/app/services/administracion/upload.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { EventEmiterService } from '../../services/event-emiter.service';
import {  Router  } from '@angular/router';
import { FormGroup, FormControl  } from "@angular/forms";

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css']
})
export class AdministracionComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild('file') fileInput: ElementRef;
  modalReference: NgbModalRef;
  modalBody: string;
  modalTitle: string;
  private notifier: NotifierService;
  currentUser: any;
  schemas: Schema[];
  schemaSel: string = " Implementar un esquema";
  schemaEliSel: string = " Eliminar un esquema";
  modalMostrar: boolean = false;
  loadedSchema: string;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg',
    centered: true
  };
  pbVal: number = 0;
  pbMode: string = 'determinate';
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  eventSubscription: any;
  mostrarCancel: boolean = true;
  ownerBD: string = "";
  rangeFecLog: FormGroup;

  constructor(private dbService: DatabaseService,
    private sictravService: SictravService,
    private token: TokenStorageService,
    private upload: UploadService,
    private modalService: NgbModal,
    public dialog: MatDialog,
    notifier: NotifierService,
    private _eventEmiter: EventEmiterService,
    private router: Router) 
    {
    this.notifier = notifier;
    this.currentUser = this.token.getUser();
    if(this.currentUser == null || this.token.getUser().acceso !== 1)
    {
      this.router.navigate(['/authentication/login']);
    }
    else{

      this.eventSubscription = this._eventEmiter.dataStr.subscribe(data => {

        if (data == 2) {
          this.showAlertSecun();
        }
        this.obtSchemas(this.token.getUser().servidor_activo);

      });
      if (this.token.getUser().servidor_activo == 2) {
        this.showAlertSecun();
      }
      this.obtSchemas(this.token.getUser().servidor_activo);

    }

    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const day = Number(String(today.getDate()).padStart(2, '0'));

    this.rangeFecLog = new FormGroup({
      start: new FormControl(new Date(year, month, day-7)),
      end: new FormControl(new Date(year, month, day))
    });

  }

  ngOnInit(): void {
    
  }

  public obtSchemas(id_servidor: number) {
    this.dbService.obtSchemas(id_servidor).subscribe((resp: Schema[]) => {
      this.schemas = resp;
    }
    );
  }

  public iniciarSictrav() {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false

    });
    let servidor_elegido;
    let servidor_otro;
    for(var i = 0; i < this.token.getUser().servidores.length; i++){
      if( this.token.getUser().servidores[i].id == this.token.getUser().servidor_activo)
      {
        servidor_elegido  = this.token.getUser().servidores[i];
      }
      else{
        servidor_otro = this.token.getUser().servidores[i];
      }

    }
    this.dialogRef.disableClose = true;
    if(this.token.getUser().servidores.length > 1)
    {
      this.dialogRef.componentInstance.confirmMessage = "Al iniciar el servicio SICTRAV en " + servidor_elegido.nombre + ", este proceso será detenido en " + servidor_otro.nombre + ". ¿Desea continuar?";
    }
    else{

      this.dialogRef.componentInstance.confirmMessage = "Desea iniciar el servicio SICTRAV en " + servidor_elegido.nombre + "?";
    }
    this.dialogRef.componentInstance.confirmTittle = "Confirmación inicio de servicio SICTRAV";
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.openDialog();
        if(this.token.getUser().servidores.length > 1)
        {
          this.modalBody = "Deteniendo servicio SICTRAV en " + servidor_otro.nombre;
          this.pbVal = 40;
          this.sictravService.stopSictrav(servidor_otro.id).subscribe(resp => {
            this.modalBody = "SICTRAV ha sido detenido con exito en " + servidor_otro.nombre;
            //if (resp.includes("OK")) {
              setTimeout(() => {
                this.modalBody = "Iniciando servicio SICTRAV...";
                //this.modalReference.close();
              }, 1000);
              this.showNotification('info', "El servicio SICTRAV se ha detenido con exito");
              this.modalTitle = "Iniciando SICTRAV";
              
              this.sictravService.iniciarSictrav(this.token.getUser().servidor_activo).subscribe(resp => {
                if (resp.includes("OK")) {
                  this.pbVal = 100;
                  setTimeout(() => {
                    this.modalBody = "Servicio SICTRAV iniciado con exito"
                    this.modalReference.close();
      
                  }, 1000);
                  
                }
                else if (resp == "") {
                  this.pbVal = 100;
                  setTimeout(() => {
                    this.modalBody = "Servicio SICTRAV iniciado con exito"
                    this.modalReference.close();
                    this.showNotification('info', 'SICTRAV ha sido iniciado con exito.');
                  }, 90000);
                }
                else {
                  console.log("resp: " + resp +".");
                  this.showNotification('error', 'Ha ocurrido un error al iniciar SICTRAV.');
                }
              }
              );
           /* }
            else {
              this.showNotification('error', 'Ha ocurrido un error al iniciar SICTRAV.');
            }*/
  
          }
          );

        }
        else{
          this.modalBody = "Iniciando servicio SICTRAV...";
          this.pbVal = 40;
          this.sictravService.iniciarSictrav(this.token.getUser().servidor_activo).subscribe(resp => {
            if (resp.includes("OK")) {
              this.pbVal = 100;
              setTimeout(() => {
                this.modalBody = "Servicio SICTRAV iniciado con exito"
                this.modalReference.close();
  
              }, 1000);
              this.showNotification('info', 'SICTRAV ha sido iniciado con exito.');
            }
            else if (resp == "") {
              this.pbVal = 100;
              setTimeout(() => {
                this.modalBody = "Servicio SICTRAV iniciado con exito"
                this.modalReference.close();
  
              }, 15000);
              this.showNotification('info', 'SICTRAV ha sido iniciado con exito.');
            }
            else {
              console.log("resp1: " + resp +"-");
              this.showNotification('error', 'Ha ocurrido un error al iniciar SICTRAV.');
            }
          }
          );
        }

      }
      this.dialogRef = null;
      return result;
    });


  }

  public reiniciarSictrav() {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false

    });
    this.dialogRef.disableClose = true;
    this.dialogRef.componentInstance.confirmMessage = "Esta seguro que desea reiniciar el servicio SICTRAV?";
    this.dialogRef.componentInstance.confirmTittle = "Confirmación reinicio de sistema SICTRAV";
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.modalTitle = "Proceso de Reinicio SICTRAV.."
        this.modalBody = "Deteniendo servicio SICTRAV.."
        this.openDialog();
        this.pbVal = 10;
        this.sictravService.stopSictrav(this.token.getUser().servidor_activo).subscribe(resp => {
          if (resp.includes("OK")) {
            this.modalBody = "El servicio SICTRAV se ha detenido con exito..."
            this.pbVal = 35;
            setTimeout(() => {
              this.pbVal = 60;
              this.modalBody = "Iniciando servicio SICTRAV..."

            }, 3000);
            this.sictravService.iniciarSictrav(this.token.getUser().servidor_activo).subscribe(resp => {
              if (resp.includes("OK")) {
                this.pbVal = 100;
                this.modalBody = "SICTRAV ha sido iniciado con exito.";
                this.modalReference.close();
                this.showNotification('info', "El servidor Sictrav se ha reiniciado con exito");
              }
              else if(resp == "")
              {
                setTimeout(() => {
                  this.pbVal = 100;
                  this.modalBody = "SICTRAV ha sido iniciado con exito.";
                  this.modalReference.close();
                  this.showNotification('info', "El servidor Sictrav se ha reiniciado con exito");
    
                }, 90000);

              } 
              else {
                this.modalBody = "Ha ocurrido un error al iniciar SICTRAV: " + resp;
                this.showNotification('error', "⚠️ Error al reiniciar Sictrav ");
              }
            }
            );
          }
          else {
            this.modalBody = "Ha ocurrido un error al intentar detener el servicio..."
            this.showNotification('error', "⚠️ Error al reiniciar Sictrav ");
          }
        }
        );

      }
      this.dialogRef = null;
      return result;
    });


  }

  openDialog() {
    this.modalReference = this.modalService.open(this.modal, this.ngbModalOptions);
  }




  public detenerSictrav() {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false

    });
    this.dialogRef.disableClose = true;
    this.dialogRef.componentInstance.confirmMessage = "¿Esta seguro que desea detener el servicio SICTRAV?";
    this.dialogRef.componentInstance.confirmTittle = "Confirmar detención de servicio";
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.modalTitle = "Proceso de detención de SICTRAV"
        this.modalBody = "Deteniendo servicio SICTRAV..."
        this.pbVal = 40;
        this.openDialog();
        this.sictravService.stopSictrav(this.token.getUser().servidor_activo).subscribe(resp => {
          if (resp.includes("OK")) {
            this.pbVal = 100;
            setTimeout(() => {
              this.modalBody = "SICTRAV ha sido detenido con exito.";
              this.modalReference.close();

            }, 1000);

            this.showNotification('info', "El servicio SICTRAV se ha detenido con exito");
          }
          else {
            this.showNotification('error', 'Ha ocurrido un error al reiniciar SICTRAV.');
          }

        }
        );

      }
      this.dialogRef = null;
      return result;
    });


  }

  changeValue(item) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false

    });
    this.dialogRef.disableClose = true;
    this.dialogRef.componentInstance.confirmMessage = "Esta seguro que desea implementar el esquema en SICTRAV? Esto reiniciará el servidor";
    this.dialogRef.componentInstance.confirmTittle = "Confirmación de implementación de esquema";
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // do confirmation actions
        this.schemaSel = item.nombre;
        this.implementarSchema();
      }
      this.dialogRef = null;
      return result;
    });

  }

  eliSchema(item)
  {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false

    });
    
    this.dialogRef.disableClose = true;
    this.dialogRef.componentInstance.confirmMessage = "Esta seguro que desea eliminar el esquema en "+item.nombre+"? Esta acción no puede ser revertida";
    this.dialogRef.componentInstance.confirmTittle = "Confirmación de eliminación de esquema";
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // do confirmation actions
        this.modalTitle = "Eliminando schema " + item.nombre + "  de SICTRAV";
        this.openDialog();
        
        this.pbMode = 'indeterminate';
        this.pbVal = 80;
        this.eliminarSchema(item.nombre);
      }
      this.dialogRef = null;
      return result;
    });


  }

  eliminarSchema(nombre)
  {
    
    this.dbService.eliSchemas(this.token.getUser().servidor_activo, nombre).subscribe(resp => {
        console.log('resp ' + resp);
        this.obtSchemas(this.token.getUser().servidor_activo);
        if(resp == 'Ok')
        {
          this.modalBody = "El esquema se ha eliminado con exito "
          setTimeout(() => {
            this.showNotification('info', "El esquema "+ nombre + " se ha eliminado con exito");
            this.modalReference.close();
          }, 1500);
         
         
        }
        else{
          setTimeout(() => {
            this.showNotification('error', "El esquema "+ nombre + " no se ha eliminado");
          }, 1500);
          this.modalBody = "El esquema no se ha podido eliminar porque se encuentra en uso por otro usuario."

        }
        

    });

  }

  public showNotification(type: string, message: string): void {
    this.notifier.notify(type, message);
  }

  public fileEvent($event) {
    this.pbVal = 10;
    this.modalTitle = "Proceso de carga de Esquema";
    this.modalBody = "Cargando archivo al sistema...";
    this.openDialog();
    const fileSelected: File = $event.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      var splitFile = fileReader.result.toString().split("\n");
      if(splitFile.length > 0)
      {
        this.ownerBD = splitFile[1].substring(1,splitFile[1].length);
      }
      
      
    }
    fileReader.readAsText(fileSelected);
    this.dbService.uploadFile(this.token.getUser().servidor_activo, fileSelected)
      .subscribe((response) => {
        this.loadedSchema = $event.target.files[0].name;
        this.pbVal = 30;
        this.modalBody = "Archivo cargado con exito";
        this.cargarEnBD();
        return response;
      },
        (error) => {

        });
  }

  cargarEnBD() {
    this.modalMostrar = false;
    this.modalTitle = "Proceso de carga de Esquema"
    this.modalBody = "Cargando archivo en la BD...";
    this.schemaSel = this.loadedSchema;
    this.upload.connect().subscribe(resp => {
      this.modalBody = resp;
      if (resp.includes('creado')) {
        this.pbVal = 40;
      }
      if (resp.includes('sinonimos..')) {
        this.pbVal = 60;
      }
      if (resp.includes('esquema..')) {
        this.pbVal = 80;
      }
      if (resp.includes('exito')) {
        this.pbVal = 100;
        setTimeout(() => {
          this.upload.close();
          this.cancelarModal();
          this.obtSchemas(this.token.getUser().servidor_activo);
          this.showNotification('info', "El nuevo esquema se ha cargado con éxito");

        }, 1000);

      }
    });
    let msg = this.loadedSchema.toString() + "-" + this.token.getUser().servidor_activo + "-" + this.ownerBD;
    this.upload.sendMessage(msg);

  }

  public expEsqActual() {
    this.modalTitle = "Respaldo de Esquema"
    this.modalBody = "Generando Esquema..."
    this.pbMode = 'indeterminate';
    this.pbVal = 80;
    this.openDialog();
    //this.mode = 'determinate';
    //this.value = 80;
    this.dbService.exportarBd(this.token.getUser().servidor_activo).subscribe(resp => {
      {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(resp.body);
        a.download = resp.headers.get('Content-Disposition').split("=")[1];
        // start download
        a.click();
        this.modalReference.close();
      }
    });
  }



  public showAlertSecun() {
    this.mostrarCancel = false;

    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false

    });
    this.dialogRef.disableClose = true;
    this.dialogRef.componentInstance.mostrarCancelar = false;
    this.dialogRef.componentInstance.confirmMessage = "Esta realizando modificaciones sobre el servidor secundario.";
    this.dialogRef.componentInstance.confirmTittle = "Atención!";
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // do confirmation actions

      }
      this.dialogRef.componentInstance.mostrarCancelar = true;
      this.dialogRef = null;
      return result;
    });
  }


  public implementarSchema() {

    if (this.schemaSel !== " Implementar un esquema") {

      this.pbVal = 20;
      setTimeout(() => {
        this.pbVal = 60;
      }, 2500);
      this.modalTitle = "Implementado Esquema " + this.schemaSel;
      this.modalBody = "Registrando esquema en SICTRAV..."
      this.openDialog();
      setTimeout(() => {
        this.modalBody = "Reiniciando el servicio SICTRAV...";
      }, 2500);
      this.dbService.implementSchema(this.token.getUser().servidor_activo, this.schemaSel).subscribe(resp => {
        this.sictravService.reiniciarSictrav(this.token.getUser().servidor_activo).subscribe(resp => {
          this.obtSchemas(this.token.getUser().servidor_activo);

          setTimeout(() => {
            this.showNotification('info', "El nuevo esquema se ha cargado con éxito");
            this.schemaSel = " Implementar un esquema";
            this.obtSchemas;
          }, 1500);
          this.modalBody = "El esquema se ha cargado con exito en SICTRAV"
          this.modalReference.close();
        }
        );

      });

    }

  }



  reiniciarServidor() {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false

    });
    this.dialogRef.disableClose = true;
    this.dialogRef.componentInstance.confirmMessage = "Esta seguro que desea reiniciar SICTRAV?";
    this.dialogRef.componentInstance.confirmTittle = "Confirmación reinicio de sistema";
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // do confirmation actions
        this.sictravService.reiniciarServidor(this.token.getUser().servidor_activo).subscribe(resp => {
          if (resp == "La base de datos se ha inicado con exito.") {
            setTimeout(() => {
              this.showNotification('info', "El servidor se ha reiniciado con exito");
            }, 2000);

          }
          else {
            console.log(resp);
          }


        });
      }
      this.dialogRef = null;
      return result;
    });

  }

  exportarLog(){
    this.modalTitle = "Respaldo de Log de Sistema"
    this.modalBody = "Generando Log..."
    this.pbMode = 'indeterminate';
    this.pbVal = 80;
    var date1 = new Date(this.rangeFecLog.get('start').value);
    var date2 = new Date(this.rangeFecLog.get('end').value);
    var day1= String(date1.getDate()).padStart(2, '0');
    var month1= String(date1.getMonth() + 1);
    if(day1.length == 1){
      day1 = '0' + day1;
    }
    if(month1.length == 1)
    {
      month1 = '0' + month1;
    }
    var fec1 = day1 + '-' + month1 + '-' + date1.getFullYear();
    var day2= String(date2.getDate()).padStart(2, '0');
    var month2= String(date2.getMonth() + 1);
    if(day2.length == 1){
      day2 = '0' + day1;
    }
    if(month2.length == 1)
    {
      month2 = '0' + month2;
    }
    var fec2 = day2 + '-' + month2 + '-' + date2.getFullYear();
    this.openDialog();
    //this.mode = 'determinate';
    //this.value = 80;
    this.sictravService.expLogSictrav(this.token.getUser().servidor_activo, fec1, fec2).subscribe(resp => {
      {
        var a = document.createElement("a");
       // console.log('resp ' + resp);
        a.href = URL.createObjectURL(resp.body);
        a.download = resp.headers.get('Content-Disposition').split("=")[1];
        // start download
        a.click();
        this.modalReference.close();
      }
    });
  }

  cancelarModal() {
    this.fileInput.nativeElement.value = '';
    //this.fileInput.nativeElement.value = '';
    this.modalReference.close();
  }

  //Base de datos

  iniciarBD() {
    this.modalTitle = "Base de Datos"
    this.modalBody = "Iniciando Base de Datos..."
    this.pbMode = 'indeterminate';
    this.pbVal = 80;
    this.openDialog();
    this.sictravService.iniciarBD(this.token.getUser().servidor_activo).subscribe(resp => {
      setTimeout(() => {
        this.modalReference.close();
        this.showNotification('info', "La base de datos se ha iniciado con exito");
      }, 1500);
    });

  }

  detenerBD() {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false

    });
    this.dialogRef.disableClose = true;
    this.dialogRef.componentInstance.confirmMessage = "Esta seguro que desea reiniciar SICTRAV?";
    this.dialogRef.componentInstance.confirmTittle = "Confirmación reinicio de sistema";
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.modalTitle = "Base de Datos"
        this.modalBody = "Deteniendo Base de Datos..."
        this.pbMode = 'indeterminate';
        this.pbVal = 80;
        this.openDialog();
        this.sictravService.detenerBD(this.token.getUser().servidor_activo).subscribe(resp => {
          if (resp.includes("Oracle Net Listener stopped.")) {
            setTimeout(() => {
              this.modalReference.close();
              this.showNotification('info', "La base de datos se ha detenido con exito");
            }, 1500);

          }
          else if (resp.trim() === "Oracle Database instance XE is already stopped.") {
            setTimeout(() => {
              this.modalReference.close();
              this.showNotification('info', "La base de datos ya se encuentra detenida");
            }, 1500);


          }
        });
      }
      this.dialogRef = null;
      return result;
    });


  }


  ngOnDestroy(): void {
    if (this.eventSubscription !== undefined)
      this.eventSubscription.unsubscribe();
    // ...
  }

}
