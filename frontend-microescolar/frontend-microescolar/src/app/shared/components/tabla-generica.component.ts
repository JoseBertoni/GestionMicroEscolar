import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { FormularioGenericoComponent, ConfigFormulario } from './formulario-generico.component';
import { DialogoConfirmacionComponent } from './dialogo-confirmacion.component';

export interface ColumnaTabla {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'actions';
}

export interface AccionBoton {
  label: string;
  color: 'primary' | 'accent' | 'warn';
  action: string;
}

@Component({
  selector: 'app-tabla-generica',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './tabla-generica.component.html',
  styleUrls: ['./tabla-generica.component.css']
})
export class TablaGenericaComponent {
  @Input() titulo: string = '';
  @Input() columnas: ColumnaTabla[] = [];
  @Input() datos: any[] = [];
  @Input() acciones: AccionBoton[] = [];
  @Input() configFormulario?: ConfigFormulario;
  @Input() mostrarBotonCrear: boolean = true;
  @Input() mostrarBotonCrearPersonalizado: boolean = false;
  @Output() crearElemento = new EventEmitter<void>();
  @Output() eliminarElemento = new EventEmitter<any>();
  @Output() modificarElemento = new EventEmitter<{original: any, modificado: any}>();
  @Output() accionPersonalizada = new EventEmitter<{accion: string, fila: any}>();

  constructor(private dialog: MatDialog) {}

  get displayedColumns(): string[] {
    const cols = this.columnas.map(col => col.key);
    if (this.acciones.length > 0) {
      cols.push('acciones');
    }
    return cols;
  }

  onAccionClick(accion: string, fila: any) {
    if (accion === 'crear' && this.mostrarBotonCrear && this.configFormulario) {
      this.abrirFormulario(accion, fila);
    } else if (accion === 'modificar' && this.configFormulario) {
      this.abrirFormulario(accion, fila);
    } else if (accion === 'eliminar') {
      this.confirmarEliminacion(fila);
    } else {
      // Emitir evento para acciones personalizadas
      this.accionPersonalizada.emit({ accion, fila });
    }
  }

  private abrirFormulario(accion: string, datosIniciales?: any) {
    if (!this.configFormulario) return;

    // Crear configuración específica para la acción
    const configFormulario = {
      ...this.configFormulario,
      titulo: accion === 'crear' ? this.configFormulario.titulo : `Modificar ${this.titulo.slice(0, -1)}`, // Remove 's' from plural
      accion: accion,
      datosIniciales: accion === 'modificar' ? datosIniciales : undefined
    };

    const dialogRef = this.dialog.open(FormularioGenericoComponent, {
      width: '500px',
      disableClose: true,
      data: configFormulario
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        console.log(`${accion === 'crear' ? 'Crear' : 'Modificar'} - Datos del formulario:`, resultado);
        if (accion === 'modificar') {
          console.log('Datos originales:', datosIniciales);
          this.modificarElemento.emit({
            original: datosIniciales,
            modificado: resultado.datos
          });
        }
        // Para crear, se maneja con el evento crearElemento existente
      }
    });
  }

  private confirmarEliminacion(fila: any): void {
    const nombreElemento = this.obtenerNombreElemento(fila);
    const tipoElemento = this.titulo.slice(0, -1).toLowerCase(); // Remove 's' and lowercase
    
    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      width: '400px',
      disableClose: true,
      data: {
        titulo: 'Confirmar Eliminación',
        mensaje: `¿Está seguro que desea eliminar ${tipoElemento === 'chico' ? 'al' : tipoElemento === 'chofer' ? 'al' : 'el'} ${tipoElemento} "${nombreElemento}"? Esta acción no se puede deshacer.`,
        textoBotonConfirmar: 'Eliminar',
        textoBotonCancelar: 'Cancelar',
        icono: 'delete',
        colorBotonConfirmar: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.eliminarElemento.emit(fila);
      } else {
        console.log('Eliminación cancelada');
      }
    });
  }

  private obtenerNombreElemento(fila: any): string {
    // Intenta obtener el nombre más representativo del elemento
    if (fila.nombre) return fila.nombre;
    if (fila.numero) return fila.numero;
    if (fila.patente) return fila.patente;
    if (fila.dni) return `DNI: ${fila.dni}`;
    return 'elemento';
  }

  esArray(valor: any): boolean {
    return Array.isArray(valor);
  }

  obtenerTooltipChicos(fila: any): string {
    if (fila.chicos && Array.isArray(fila.chicos) && fila.chicos.length > 0) {
      return fila.chicos.map((chico: any) => `• ${chico.nombre} (DNI: ${chico.dni})`).join('\n');
    }
    return 'No hay chicos asignados';
  }

  tieneChicos(fila: any): boolean {
    return fila.chicos && Array.isArray(fila.chicos) && fila.chicos.length > 0;
  }

  onCrearPersonalizado(): void {
    this.crearElemento.emit();
  }
}