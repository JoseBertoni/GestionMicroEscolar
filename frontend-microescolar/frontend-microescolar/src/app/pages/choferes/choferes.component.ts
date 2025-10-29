import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TablaGenericaComponent, ColumnaTabla, AccionBoton } from '../../shared/components/tabla-generica.component';
import { ConfigFormulario, FormularioGenericoComponent } from '../../shared/components/formulario-generico.component';
import { ChoferesService } from '../../services/choferes.service';
import { MicrosService } from '../../services/micros.service';
import { Chofer, ChoferRequest } from '../../models/chofer.model';
import { Micro } from '../../models/micro.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-choferes',
  standalone: true,
  imports: [
    CommonModule,
    TablaGenericaComponent,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './choferes.component.html',
  styleUrls: ['./choferes.component.css']
})
export class ChoferesComponent implements OnInit {
  titulo = 'Choferes';
  datos: Chofer[] = [];
  cargando = false;

  columnas: ColumnaTabla[] = [
    { key: 'nombreCompleto', label: 'Nombre y Apellido' },
    { key: 'dni', label: 'DNI' },
    { key: 'microAsignado', label: 'Micro Asignado' }
  ];

  

  acciones: AccionBoton[] = [
    { 
      label: 'Modificar', 
      color: 'accent', 
      action: 'modificar',
      icon: 'edit',
      tooltip: 'Modificar información del chofer'
    },
    { 
      label: 'Eliminar', 
      color: 'warn', 
      action: 'eliminar',
      icon: 'delete',
      tooltip: 'Eliminar chofer del sistema'
    }
  ];

  configFormulario: ConfigFormulario = {
    titulo: 'Crear Nuevo Chofer',
    accion: 'crear',
    campos: [
      {
        key: 'nombre',
        label: 'Nombre y Apellido',
        type: 'text',
        required: true,
        placeholder: 'Ingrese el nombre y apellido completo'
      },
      {
        key: 'dni',
        label: 'DNI',
        type: 'text',
        required: true,
        placeholder: 'Ingrese el DNI'
      }
    ]
  };

  constructor(
    private dialog: MatDialog,
    private choferesService: ChoferesService,
    private microsService: MicrosService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarChoferes();
  }

  cargarChoferes(): void {
    this.cargando = true;
    
    // Hacer ambas llamadas en paralelo
    forkJoin({
      choferes: this.choferesService.obtenerChoferes(),
      micros: this.microsService.obtenerMicros()
    }).subscribe({
      next: ({ choferes, micros }) => {
        // Crear un mapa de DNI chofer -> patente micro
        const choferMicroMap = new Map<string, string>();
        micros.forEach(micro => {
          if (micro.chofer && micro.chofer.dni) {
            choferMicroMap.set(micro.chofer.dni, micro.patente);
          }
        });

        // Mapear los datos para mostrar correctamente en la tabla
        this.datos = choferes.map(chofer => ({
          ...chofer,
          nombreCompleto: chofer.nombre || 'Sin nombre',
          microAsignado: choferMicroMap.get(chofer.dni) || 'Sin asignar'
        }));
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarError('Error al cargar los datos: ' + error.message);
        this.cargando = false;
      }
    });
  }

  abrirFormularioCrear(): void {
    const dialogRef = this.dialog.open(FormularioGenericoComponent, {
      width: '500px',
      disableClose: true,
      data: this.configFormulario
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.crearChofer(resultado.datos);
      }
    });
  }

  private crearChofer(datos: ChoferRequest): void {
    this.cargando = true;
    this.choferesService.crearChofer(datos).subscribe({
      next: (nuevo) => {
        this.cargarChoferes(); // Recargar datos para actualizar la tabla
        this.mostrarExito('Chofer creado exitosamente');
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarError('Error al crear el chofer: ' + error.message);
        this.cargando = false;
      }
    });
  }

  modificarChofer(evento: {original: Chofer, modificado: ChoferRequest}): void {
    this.cargando = true;
    const dniOriginal = evento.original.dni;
    const datosModificados = evento.modificado;
    
    this.choferesService.modificarChofer(dniOriginal, datosModificados).subscribe({
      next: (choferModificado) => {
        const index = this.datos.findIndex(c => c.dni === dniOriginal);
        if (index !== -1) {
          this.datos[index] = { ...choferModificado, nombreCompleto: choferModificado.nombre, microAsignado: this.datos[index].microAsignado };
          this.datos = [...this.datos];
        }
        this.mostrarExito('Chofer modificado exitosamente');
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarError('Error al modificar el chofer: ' + error.message);
        this.cargando = false;
      }
    });
  }

  eliminarChofer(chofer: Chofer): void {
    this.cargando = true;
    this.choferesService.eliminarChofer(chofer.dni).subscribe({
      next: () => {
        this.datos = this.datos.filter(c => c.dni !== chofer.dni);
        this.mostrarExito('Chofer eliminado exitosamente');
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarError('Error al eliminar el chofer: ' + error.message);
        this.cargando = false;
      }
    });
  }

  private mostrarExito(mensaje: string): void {
    this.snackBar.open(`✅ ${mensaje}`, 'Cerrar', { 
      duration: 4000, 
      panelClass: ['success-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  private mostrarError(mensaje: string): void {
    this.snackBar.open(`❌ ${mensaje}`, 'Cerrar', { 
      duration: 6000, 
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  private mostrarAdvertencia(mensaje: string): void {
    this.snackBar.open(`⚠️ ${mensaje}`, 'Cerrar', {
      duration: 5000,
      panelClass: ['warning-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  private mostrarInfo(mensaje: string): void {
    this.snackBar.open(`ℹ️ ${mensaje}`, 'Cerrar', {
      duration: 4000,
      panelClass: ['info-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
