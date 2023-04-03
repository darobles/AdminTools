export class Schema {
    nombre: String;
    fecha: String;
    estado: String;
    activo: boolean;
    implementado: String = "No";  
    icono: String = "1";
    transicion: boolean = false;  

    constructor(nombre: String, fecha: String, estado:String, activo: boolean){
        this.nombre = nombre;
        this.fecha = fecha;
        this.estado = estado;
        this.activo = activo;
    }
    
    public implementar(){
      console.log('Implementar acción ' + this.nombre);
    }

}
