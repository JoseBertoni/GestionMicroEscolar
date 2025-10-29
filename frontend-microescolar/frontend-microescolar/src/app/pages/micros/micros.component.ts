import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TablaGenericaComponent, ColumnaTabla, AccionBoton } from '../../shared/components/tabla-generica.component';
import { ConfigFormulario, FormularioGenericoComponent } from '../../shared/components/formulario-generico.component';
import { MicrosService } from '../../services/micros.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
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
    { 
      label: 'Asignar Chofer', 
      color: 'primary', 
      action: 'asignar-chofer',
      icon: 'person_add',
      tooltip: 'Asignar chofer al micro'
    },
    { 
      label: 'Asignar Chico', 
      color: 'primary', 
      action: 'asignar-chico',
      icon: 'group_add',
      tooltip: 'Asignar chico al micro'
    },
    { 
      label: 'Desasignar Chofer', 
      color: 'accent', 
      action: 'desasignar-chofer',
      icon: 'person_remove',
      tooltip: 'Desasignar chofer del micro'
    },
    { 
      label: 'Desasignar Chico', 
      color: 'accent', 
      action: 'desasignar-chico',
      icon: 'group_remove',
      tooltip: 'Desasignar un chico específico'
    },
    { 
      label: 'Desasignar Chicos', 
      color: 'accent', 
      action: 'desasignar-chicos',
      icon: 'clear_all',
      tooltip: 'Desasignar todos los chicos del micro'
    },
    { 
      label: 'Eliminar', 
      color: 'warn', 
      action: 'eliminar',
      icon: 'delete',
      tooltip: 'Eliminar micro del sistema'
    }
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
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService
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
        this.mostrarExito('Micro eliminado exitosamente. El chofer y todos los chicos han sido desasignados automáticamente.');
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
        this.mostrarExito(`✅ Chofer desasignado exitosamente del micro ${micro.patente}`);
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error completo:', error);
        
        let mensaje = 'Error al desasignar el chofer';
        
        // Intentar extraer el mensaje del backend
        if (error.error && error.error.message) {
          mensaje = error.error.message;
        } else if (error.message) {
          mensaje = error.message;
        } else if (typeof error.error === 'string') {
          mensaje = error.error;
        }
        
        this.mostrarError(`❌ ${mensaje}`);
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
        this.cargarMicros();
        this.mostrarExito(`✅ Chofer asignado exitosamente al micro ${micro.patente}`);
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error completo en componente:', error);
        console.error('Error.error:', error.error);
        console.error('Error.message:', error.message);
        console.error('Error.status:', error.status);
        
        let mensaje = 'Error al asignar el chofer';
        
        if (error.error && error.error.message) {
          mensaje = error.error.message;
        } else if (error.status === 409) {
          mensaje = 'No se puede asignar chofer. Este chofer ya fue asignado';
        } else {
          const extractedMessage = this.errorHandler.extractErrorMessage(error);
          mensaje = extractedMessage;
        }
        
        console.log('Mensaje final a mostrar:', mensaje);
        this.mostrarError(mensaje);
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
        this.cargarMicros(); 
        this.mostrarExito(`✅ Alumno con DNI ${dniChico} asignado exitosamente al micro ${micro.patente}`);
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error completo:', error);
        
        let mensaje = 'Error al asignar el alumno';
        
        if (error.error && error.error.message) {
          mensaje = error.error.message;
        } else if (error.message) {
          mensaje = error.message;
        } else if (typeof error.error === 'string') {
          mensaje = error.error;
        }
        
        this.mostrarError(`❌ ${mensaje}`);
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
        this.cargarMicros(); 
        this.mostrarExito(`✅ Alumno con DNI ${dniChico} desasignado exitosamente`);
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error completo:', error);
        
        let mensaje = 'Error al desasignar el alumno';
        
        if (error.error && error.error.message) {
          mensaje = error.error.message;
        } else if (error.message) {
          mensaje = error.message;
        } else if (typeof error.error === 'string') {
          mensaje = error.error;
        }
        
        this.mostrarError(`❌ ${mensaje}`);
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
