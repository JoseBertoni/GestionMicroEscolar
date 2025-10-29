import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  /**
   * Extrae el mensaje de error más específico del objeto de error HTTP
   * @param error - Error object from HTTP request
   * @returns string - Mensaje de error formateado
   */
  extractErrorMessage(error: any): string {
    console.log('ErrorHandler - Error completo:', error);
    console.log('ErrorHandler - error.error:', error.error);
    console.log('ErrorHandler - error.status:', error.status);
    console.log('ErrorHandler - error.message:', error.message);
    
    // Primero intentar obtener el mensaje del cuerpo de la respuesta
    if (error && error.error) {
      console.log('ErrorHandler - Tipo de error.error:', typeof error.error);
      
      // Si error.error es un objeto
      if (typeof error.error === 'object' && error.error !== null) {
        console.log('ErrorHandler - error.error es objeto:', error.error);
        
        // Buscar la propiedad message
        if (error.error.message) {
          console.log('ErrorHandler - Encontrado error.error.message:', error.error.message);
          return error.error.message;
        }
        
        // Buscar otras variantes
        if (error.error.Message) {
          console.log('ErrorHandler - Encontrado error.error.Message:', error.error.Message);
          return error.error.Message;
        }
        
        // Si es un objeto pero no tiene message, convertir a string
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
      
      // Si error.error es un string
      if (typeof error.error === 'string') {
        console.log('ErrorHandler - error.error es string:', error.error);
        
        // Intentar parsear como JSON
        try {
          const parsed = JSON.parse(error.error);
          if (parsed.message) {
            console.log('ErrorHandler - Mensaje del string parseado:', parsed.message);
            return parsed.message;
          }
        } catch (e) {
          // Si no es JSON válido, retornar el string directamente
          console.log('ErrorHandler - String directo:', error.error);
          return error.error;
        }
      }
    }
    
    // Si tenemos status 409, usar mensaje específico para chofer
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

  /**
   * Extrae el código de error específico si está disponible
   * @param error - Error object from HTTP request
   * @returns string | null - Código de error o null
   */
  extractErrorCode(error: any): string | null {
    if (error.error && error.error.errorCode) {
      return error.error.errorCode;
    }
    return null;
  }

  /**
   * Determina si el error es de tipo "no encontrado"
   * @param error - Error object from HTTP request
   * @returns boolean
   */
  isNotFoundError(error: any): boolean {
    const errorCode = this.extractErrorCode(error);
    return error.status === 404 || 
           errorCode?.includes('_NOT_FOUND') || 
           false;
  }

  /**
   * Determina si el error es de tipo "conflicto" (duplicado/ya asignado)
   * @param error - Error object from HTTP request
   * @returns boolean
   */
  isConflictError(error: any): boolean {
    const errorCode = this.extractErrorCode(error);
    return error.status === 409 || 
           errorCode?.includes('_ALREADY_') || 
           errorCode?.includes('_EXISTS') ||
           false;
  }

  /**
   * Determina si el error es de validación/datos inválidos
   * @param error - Error object from HTTP request
   * @returns boolean
   */
  isValidationError(error: any): boolean {
    const errorCode = this.extractErrorCode(error);
    return error.status === 400 || 
           errorCode?.includes('_NOT_ASSIGNED') ||
           false;
  }
}