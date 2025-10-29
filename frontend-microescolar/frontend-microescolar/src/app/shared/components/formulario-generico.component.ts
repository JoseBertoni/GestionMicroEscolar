import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Inject } from '@angular/core';

export interface CampoFormulario {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email';
  required?: boolean;
  placeholder?: string;
  disabled?: boolean; 
}

export interface ConfigFormulario {
  titulo: string;
  campos: CampoFormulario[];
  accion: string;
  datosIniciales?: any;
}

@Component({
  selector: 'app-formulario-generico',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './formulario-generico.component.html',
  styleUrls: ['./formulario-generico.component.css']
})
export class FormularioGenericoComponent {
  formulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormularioGenericoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfigFormulario
  ) {
    this.formulario = this.crearFormulario();
  }

  private crearFormulario(): FormGroup {
    const group: any = {};
    
    this.data.campos.forEach(campo => {
      const validators = [];
      if (campo.required && !campo.disabled) {
        validators.push(Validators.required);
      }
      
      const valorInicial = this.data.datosIniciales ? 
        (this.data.datosIniciales[campo.key] || '') : '';
      
      group[campo.key] = [
        { value: valorInicial, disabled: campo.disabled || false }, 
        validators
      ];
    });

    return this.fb.group(group);
  }

  onSubmit(): void {
    if (this.formulario.valid) {
      const formValue = { ...this.formulario.value };
      
      this.data.campos.forEach(campo => {
        if (campo.disabled) {
          formValue[campo.key] = this.formulario.get(campo.key)?.value;
        }
      });
      
      this.dialogRef.close({
        accion: this.data.accion,
        datos: formValue
      });
    } else {
      Object.keys(this.formulario.controls).forEach(key => {
        this.formulario.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(campo: CampoFormulario): string {
    const control = this.formulario.get(campo.key);
    if (control?.hasError('required')) {
      return `${campo.label} es requerido`;
    }
    return '';
  }
}