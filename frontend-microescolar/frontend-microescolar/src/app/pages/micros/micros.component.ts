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
    { key: 'chofer', label: 'Chofer Asignado' },
    { key: 'chicosAsignados', label: 'Chicos Asignados' }
  ];

  

  acciones: AccionBoton[] = [
    { label: 'Modificar', color: 'accent', action: 'modificar' },
    { label: 'Asignar', color: 'primary', action: 'asignar' },
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
        this.datos = micros;
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
      next: (nuevo) => {
        this.datos = [...this.datos, nuevo];
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

  private mostrarExito(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['success-snackbar'] });
  }

  private mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 5000, panelClass: ['error-snackbar'] });
  }
}
