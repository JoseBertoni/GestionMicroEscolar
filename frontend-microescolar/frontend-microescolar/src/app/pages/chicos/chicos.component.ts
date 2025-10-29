import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TablaGenericaComponent, ColumnaTabla, AccionBoton } from '../../shared/components/tabla-generica.component';
import { ConfigFormulario, FormularioGenericoComponent } from '../../shared/components/formulario-generico.component';
import { ChicosService } from '../../services/chicos.service';
import { MicrosService } from '../../services/micros.service';
import { Chico, ChicoRequest } from '../../models/chico.model';
import { Micro } from '../../models/micro.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-chicos',
  standalone: true,
  imports: [
    CommonModule,
    TablaGenericaComponent,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './chicos.component.html',
  styleUrls: ['./chicos.component.css']
})
export class ChicosComponent implements OnInit {
  titulo = 'Chicos';
  datos: Chico[] = [];
  cargando = false;
  
  columnas: ColumnaTabla[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'dni', label: 'DNI' },
    { key: 'microAsignado', label: 'Micro Asignado' }
  ];

  acciones: AccionBoton[] = [
    { 
      label: 'Modificar', 
      color: 'accent', 
      action: 'modificar',
      icon: 'edit',
      tooltip: 'Modificar información del chico'
    },
    { 
      label: 'Eliminar', 
      color: 'warn', 
      action: 'eliminar',
      icon: 'delete',
      tooltip: 'Eliminar chico del sistema'
    }
  ];

  configFormulario: ConfigFormulario = {
    titulo: 'Crear Nuevo Chico',
    accion: 'crear',
    campos: [
      {
        key: 'nombre',
        label: 'Nombre',
        type: 'text',
        required: true,
        placeholder: 'Ingrese el nombre completo'
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
    private chicosService: ChicosService,
    private microsService: MicrosService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarChicos();
  }

  cargarChicos(): void {
    this.cargando = true;
    
    forkJoin({
      chicos: this.chicosService.obtenerChicos(),
      micros: this.microsService.obtenerMicros()
    }).subscribe({
      next: ({ chicos, micros }) => {
        const chicoMicroMap = new Map<string, string>();
        micros.forEach(micro => {
          if (micro.chicos && micro.chicos.length > 0) {
            micro.chicos.forEach(chico => {
              chicoMicroMap.set(chico.dni, micro.patente);
            });
          }
        });

        this.datos = chicos.map(chico => ({
          ...chico,
          microAsignado: chicoMicroMap.get(chico.dni) || 'Sin asignar'
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
        this.crearChico(resultado.datos);
      }
    });
  }

  private crearChico(datosChico: ChicoRequest): void {
    this.cargando = true;
    this.chicosService.crearChico(datosChico).subscribe({
      next: (nuevoChico) => {
        // Agregar el campo microAsignado para mantener consistencia con la tabla
        const chicoConMicroAsignado = {
          ...nuevoChico,
          microAsignado: 'Sin asignar'
        };
        this.datos = [...this.datos, chicoConMicroAsignado];
        this.mostrarExito('Chico creado exitosamente');
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarError('Error al crear el chico: ' + error.message);
        this.cargando = false;
      }
    });
  }

  modificarChico(evento: {original: Chico, modificado: ChicoRequest}): void {
    this.cargando = true;
    const dniOriginal = evento.original.dni;
    const datosModificados = evento.modificado;
    
    this.chicosService.modificarChico(dniOriginal, datosModificados).subscribe({
      next: (chicoModificado) => {
        const index = this.datos.findIndex(c => c.dni === dniOriginal);
        if (index !== -1) {
          // Preservar el campo microAsignado que se calcula dinámicamente
          this.datos[index] = {
            ...chicoModificado,
            microAsignado: this.datos[index].microAsignado
          };
          this.datos = [...this.datos];
        }
        this.mostrarExito('Chico modificado exitosamente');
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarError('Error al modificar el chico: ' + error.message);
        this.cargando = false;
      }
    });
  }

  eliminarChico(chico: Chico): void {
    this.cargando = true;
    this.chicosService.eliminarChico(chico.dni).subscribe({
      next: () => {
        this.datos = this.datos.filter(c => c.dni !== chico.dni);
        this.mostrarExito('Chico eliminado exitosamente');
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarError('Error al eliminar el chico: ' + error.message);
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
