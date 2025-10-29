namespace GestionMicroEscolar.Exceptions
{
    public class BusinessException : Exception
    {
        public string ErrorCode { get; }
        public string UserMessage { get; }

        public BusinessException(string errorCode, string userMessage) 
            : base(userMessage)
        {
            ErrorCode = errorCode;
            UserMessage = userMessage;
        }

        public BusinessException(string errorCode, string userMessage, Exception innerException) 
            : base(userMessage, innerException)
        {
            ErrorCode = errorCode;
            UserMessage = userMessage;
        }
    }

    // Excepciones específicas para el dominio
    public class MicroNotFoundException : BusinessException
    {
        public MicroNotFoundException(string patente) 
            : base("MICRO_NOT_FOUND", $"No se encontró el micro con patente '{patente}'.")
        {
        }
    }

    public class ChoferNotFoundException : BusinessException
    {
        public ChoferNotFoundException(string dni) 
            : base("CHOFER_NOT_FOUND", $"No se encontró el chofer con DNI '{dni}'.")
        {
        }
    }

    public class ChicoNotFoundException : BusinessException
    {
        public ChicoNotFoundException(string dni) 
            : base("CHICO_NOT_FOUND", $"No se encontró el alumno con DNI '{dni}'.")
        {
        }
    }

    public class ChoferAlreadyAssignedException : BusinessException
    {
        public ChoferAlreadyAssignedException(string dniChofer, string patenteMicro) 
            : base("CHOFER_ALREADY_ASSIGNED", 
                   $"No se puede asignar chofer. Este chofer ya fue asignado al micro con patente '{patenteMicro}'.")
        {
        }
    }

    public class ChicoAlreadyAssignedException : BusinessException
    {
        public ChicoAlreadyAssignedException(string dniChico, string patenteMicro) 
            : base("CHICO_ALREADY_ASSIGNED", 
                   $"El alumno con DNI '{dniChico}' ya está asignado al micro con patente '{patenteMicro}'. Un alumno solo puede viajar en un micro.")
        {
        }
    }

    public class MicroAlreadyExistsException : BusinessException
    {
        public MicroAlreadyExistsException(string patente) 
            : base("MICRO_ALREADY_EXISTS", 
                   $"Ya existe un micro registrado con la patente '{patente}'. Las patentes deben ser únicas.")
        {
        }
    }

    public class ChoferNotAssignedException : BusinessException
    {
        public ChoferNotAssignedException(string patente) 
            : base("CHOFER_NOT_ASSIGNED", 
                   $"El micro con patente '{patente}' no tiene ningún chofer asignado.")
        {
        }
    }

    public class ChicoNotAssignedException : BusinessException
    {
        public ChicoNotAssignedException(string dni) 
            : base("CHICO_NOT_ASSIGNED", 
                   $"El alumno con DNI '{dni}' no está asignado a ningún micro.")
        {
        }
    }

    public class NoChildrenAssignedException : BusinessException
    {
        public NoChildrenAssignedException(string patente) 
            : base("NO_CHILDREN_ASSIGNED", 
                   $"El micro con patente '{patente}' no tiene alumnos asignados.")
        {
        }
    }
}