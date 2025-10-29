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
    { label: 'Modificar', color: 'accent', action: 'modificar' },
    { label: 'Eliminar', color: 'warn', action: 'eliminar' }
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
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['success-snackbar'] });
  }

  private mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 5000, panelClass: ['error-snackbar'] });
  }
}
