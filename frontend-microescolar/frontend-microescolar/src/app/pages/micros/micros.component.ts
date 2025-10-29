import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TablaGenericaComponent, ColumnaTabla, AccionBoton } from '../../shared/components/tabla-generica.component';
import { ConfigFormulario, FormularioGenericoComponent } from '../../shared/components/formulario-generico.component';
import { MicrosService } from '../../services/micros.service';
import { Micro, MicroRequest } from '../../models/micro.model';

@Component({
  selector: 'app-micros',
  standalone: true,
  imports: [
    CommonModule,
    TablaGenericaComponent,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './micros.component.html',
  styleUrls: ['./micros.component.css']
})
export class MicrosComponent implements OnInit {
  titulo = 'Micros';
  datos: Micro[] = [];
  cargando = false;

  columnas: ColumnaTabla[] = [
    { key: 'patente', label: 'Patente' },
    { key: 'choferNombre', label: 'Chofer Asignado' },
    { key: 'cantidadChicos', label: 'Cantidad Chicos' }
  ];

  

  acciones: AccionBoton[] = [
    { label: 'Modificar', color: 'accent', action: 'modificar' },
    { label: 'Asignar Chofer', color: 'primary', action: 'asignar-chofer' },
    { label: 'Asignar Chico', color: 'primary', action: 'asignar-chico' },
    { label: 'Desasignar Chofer', color: 'accent', action: 'desasignar-chofer' },
    { label: 'Desasignar Chico', color: 'accent', action: 'desasignar-chico' },
    { label: 'Desasignar Chicos', color: 'accent', action: 'desasignar-chicos' },
    { label: 'Eliminar', color: 'warn', action: 'eliminar' }
  ];

  configFormulario: ConfigFormulario = {
    titulo: 'Crear Nuevo Micro',
    accion: 'crear',
    campos: [
      {
        key: 'patente',
        label: 'Patente',
        type: 'text',
        required: true,
        placeholder: 'Ingrese la patente del micro'
      }
    ]
  };

  constructor(
    private dialog: MatDialog,
    private microsService: MicrosService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarMicros();
  }

  cargarMicros(): void {
    this.cargando = true;
    this.microsService.obtenerMicros().subscribe({
      next: (micros) => {
        // Procesar los datos para mostrar correctamente en la tabla
        this.datos = micros.map(micro => ({
          ...micro,
          choferNombre: micro.chofer ? `${micro.chofer.nombre} (${micro.chofer.dni})` : 'Sin asignar',
          cantidadChicos: micro.chicos ? micro.chicos.length : 0
        }));
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarError('Error al cargar los micros: ' + error.message);
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
        this.crearMicro(resultado.datos);
      }
    });
  }

  private crearMicro(datos: MicroRequest): void {
    this.cargando = true;
    this.microsService.crearMicro(datos).subscribe({
      next: () => {
        this.cargarMicros(); // Recargar la lista completa después de crear
        this.mostrarExito('Micro creado exitosamente');
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarError('Error al crear el micro: ' + error.message);
        this.cargando = false;
      }
    });
  }

  eliminarMicro(micro: Micro): void {
    this.cargando = true;
    this.microsService.eliminarMicro(micro.patente).subscribe({
      next: () => {
        this.datos = this.datos.filter(m => m.patente !== micro.patente);
        this.mostrarExito('Micro eliminado exitosamente');
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarError('Error al eliminar el micro: ' + error.message);
        this.cargando = false;
      }
    });
  }

  desasignarChofer(micro: Micro): void {
    if (!micro.chofer) {
      this.mostrarError('Este micro no tiene chofer asignado');
      return;
    }

    this.cargando = true;
    this.microsService.desasignarChofer(micro.patente).subscribe({
      next: () => {
        this.cargarMicros(); // Recargar datos para actualizar la tabla
        this.mostrarExito('Chofer desasignado exitosamente');
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarError('Error al desasignar el chofer: ' + error.message);
        this.cargando = false;
      }
    });
  }

  desasignarTodosLosChicos(micro: Micro): void {
    if (!micro.chicos || micro.chicos.length === 0) {
      this.mostrarError('Este micro no tiene chicos asignados');
      return;
    }

    this.cargando = true;
    this.microsService.desasignarTodosLosChicos(micro.patente).subscribe({
      next: () => {
        this.cargarMicros(); // Recargar datos para actualizar la tabla
        this.mostrarExito('Todos los chicos desasignados exitosamente');
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarError('Error al desasignar los chicos: ' + error.message);
        this.cargando = false;
      }
    });
  }

  asignarChofer(micro: Micro): void {
    const dniChofer = prompt('Ingrese el DNI del chofer a asignar:');
    if (!dniChofer) {
      return;
    }

    this.cargando = true;
    this.microsService.asignarChofer(micro.patente, dniChofer).subscribe({
      next: () => {
        this.cargarMicros(); // Recargar datos para actualizar la tabla
        this.mostrarExito('Chofer asignado exitosamente');
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarError('Error al asignar el chofer: ' + error.message);
        this.cargando = false;
      }
    });
  }

  asignarChico(micro: Micro): void {
    const dniChico = prompt('Ingrese el DNI del chico a asignar:');
    if (!dniChico) {
      return;
    }

    this.cargando = true;
    this.microsService.asignarChico(micro.patente, dniChico).subscribe({
      next: () => {
        this.cargarMicros(); // Recargar datos para actualizar la tabla
        this.mostrarExito('Chico asignado exitosamente');
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarError('Error al asignar el chico: ' + error.message);
        this.cargando = false;
      }
    });
  }

  desasignarChicoIndividual(micro: Micro): void {
    const dniChico = prompt('Ingrese el DNI del chico a desasignar:');
    if (!dniChico) {
      return;
    }

    this.cargando = true;
    this.microsService.desasignarChico(dniChico).subscribe({
      next: () => {
        this.cargarMicros(); // Recargar datos para actualizar la tabla
        this.mostrarExito('Chico desasignado exitosamente');
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarError('Error al desasignar el chico: ' + error.message);
        this.cargando = false;
      }
    });
  }

  private mostrarExito(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['success-snackbar'] });
  }

  private mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 5000, panelClass: ['error-snackbar'] });
  }

  manejarAccion(evento: { accion: string, fila: any }): void {
    switch (evento.accion) {
      case 'desasignar-chofer':
        this.desasignarChofer(evento.fila);
        break;
      case 'desasignar-chico':
        this.desasignarChicoIndividual(evento.fila);
        break;
      case 'desasignar-chicos':
        this.desasignarTodosLosChicos(evento.fila);
        break;
      case 'asignar-chofer':
        this.asignarChofer(evento.fila);
        break;
      case 'asignar-chico':
        this.asignarChico(evento.fila);
        break;
      default:
        console.log('Acción no manejada:', evento.accion, evento.fila);
    }
  }
}
