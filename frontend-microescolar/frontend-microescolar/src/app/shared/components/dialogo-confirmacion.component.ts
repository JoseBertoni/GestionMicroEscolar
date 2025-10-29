import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface DialogoConfirmacionData {
  titulo: string;
  mensaje: string;
  textoBotonConfirmar?: string;
  textoBotonCancelar?: string;
  icono?: string;
  colorBotonConfirmar?: 'primary' | 'accent' | 'warn';
}

@Component({
  selector: 'app-dialogo-confirmacion',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './dialogo-confirmacion.component.html',
  styleUrls: ['./dialogo-confirmacion.component.css']
})
export class DialogoConfirmacionComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogoConfirmacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogoConfirmacionData
  ) {
    // Valores por defecto
    this.data.textoBotonConfirmar = this.data.textoBotonConfirmar || 'Confirmar';
    this.data.textoBotonCancelar = this.data.textoBotonCancelar || 'Cancelar';
    this.data.icono = this.data.icono || 'warning';
    this.data.colorBotonConfirmar = this.data.colorBotonConfirmar || 'warn';
  }

  onConfirmar(): void {
    this.dialogRef.close(true);
  }

  onCancelar(): void {
    this.dialogRef.close(false);
  }
}
