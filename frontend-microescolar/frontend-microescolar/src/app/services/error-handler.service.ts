import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

 
  extractErrorMessage(error: any): string {
    console.log('ErrorHandler - Error completo:', error);
    console.log('ErrorHandler - error.error:', error.error);
    console.log('ErrorHandler - error.status:', error.status);
    console.log('ErrorHandler - error.message:', error.message);
    
    if (error && error.error) {
      console.log('ErrorHandler - Tipo de error.error:', typeof error.error);
      
      if (typeof error.error === 'object' && error.error !== null) {
        console.log('ErrorHandler - error.error es objeto:', error.error);
        
        if (error.error.message) {
          console.log('ErrorHandler - Encontrado error.error.message:', error.error.message);
          return error.error.message;
        }
        
        if (error.error.Message) {
          console.log('ErrorHandler - Encontrado error.error.Message:', error.error.Message);
          return error.error.Message;
        }
        
        const objString = JSON.stringify(error.error);
        console.log('ErrorHandler - Objeto como string:', objString);
        
        // Intentar extraer el mensaje del JSON
        try {
          const parsed = JSON.parse(objString);
          if (parsed.message) {
            console.log('ErrorHandler - Mensaje del JSON parseado:', parsed.message);
            return parsed.message;
          }
        } catch (e) {
          console.log('ErrorHandler - Error al parsear JSON:', e);
        }
      }
      
      if (typeof error.error === 'string') {
        console.log('ErrorHandler - error.error es string:', error.error);
        
        try {
          const parsed = JSON.parse(error.error);
          if (parsed.message) {
            console.log('ErrorHandler - Mensaje del string parseado:', parsed.message);
            return parsed.message;
          }
        } catch (e) {
          console.log('ErrorHandler - String directo:', error.error);
          return error.error;
        }
      }
    }
    
    if (error.status === 409) {
      console.log('ErrorHandler - Status 409 detectado, usando mensaje específico');
      return 'No se puede asignar chofer. Este chofer ya fue asignado';
    }
    
    // Fallback a error.message
    if (error.message) {
      console.log('ErrorHandler - Usando error.message como fallback:', error.message);
      return error.message;
    }
    
    // Mensaje por defecto
    console.log('ErrorHandler - Usando mensaje por defecto');
    return 'Ha ocurrido un error inesperado';
  }

  private getMessageForStatus(status: number): string {
    switch (status) {
      case 404:
        return 'El recurso solicitado no fue encontrado';
      case 409:
        return 'No se puede completar la operación. Ya existe un conflicto con los datos enviados';
      case 400:
        return 'Los datos enviados no son válidos';
      case 500:
        return 'Error interno del servidor';
      default:
        return `Error HTTP ${status}: Error en el servidor`;
    }
  }


  extractErrorCode(error: any): string | null {
    if (error.error && error.error.errorCode) {
      return error.error.errorCode;
    }
    return null;
  }


  isNotFoundError(error: any): boolean {
    const errorCode = this.extractErrorCode(error);
    return error.status === 404 || 
           errorCode?.includes('_NOT_FOUND') || 
           false;
  }

 
  isConflictError(error: any): boolean {
    const errorCode = this.extractErrorCode(error);
    return error.status === 409 || 
           errorCode?.includes('_ALREADY_') || 
           errorCode?.includes('_EXISTS') ||
           false;
  }

 
  isValidationError(error: any): boolean {
    const errorCode = this.extractErrorCode(error);
    return error.status === 400 || 
           errorCode?.includes('_NOT_ASSIGNED') ||
           false;
  }
}