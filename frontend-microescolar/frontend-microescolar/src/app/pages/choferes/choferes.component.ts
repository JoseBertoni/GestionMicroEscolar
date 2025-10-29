import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TablaGenericaComponent, ColumnaTabla, AccionBoton } from '../../shared/components/tabla-generica.component';
import { ConfigFormulario, FormularioGenericoComponent } from '../../shared/components/formulario-generico.component';
import { ChoferesService } from '../../services/choferes.service';
import { Chofer, ChoferRequest } from '../../models/chofer.model';

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
    { key: 'micro', label: 'Micro Asignado' }
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
        label: 'Nombre',
        type: 'text',
        required: true,
        placeholder: 'Ingrese el nombre'
      },
      {
        key: 'apellido',
        label: 'Apellido',
        type: 'text',
        required: true,
        placeholder: 'Ingrese el apellido'
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
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarChoferes();
  }

  cargarChoferes(): void {
    this.cargando = true;
    this.choferesService.obtenerChoferes().subscribe({
      next: (choferes) => {
        this.datos = choferes;
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarError('Error al cargar los choferes: ' + error.message);
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
        // Componer nombreCompleto desde nombre + apellido si el backend devuelve sólo eso
        if (!(nuevo as any).nombreCompleto && (datos as any).nombre && (datos as any).apellido) {
          (nuevo as any).nombreCompleto = `${(datos as any).nombre} ${(datos as any).apellido}`;
        }
        this.datos = [...this.datos, nuevo];
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
