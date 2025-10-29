using GestionMicroEscolar.Exceptions;
using System.Net;
using System.Text.Json;

namespace GestionMicroEscolar.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;

        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred.");
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            
            // Importante: establecer estos headers ANTES de escribir la respuesta
            context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            context.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");

            var response = new ErrorResponse();

            switch (exception)
            {
                case BusinessException businessEx:
                    response.ErrorCode = businessEx.ErrorCode;
                    response.Message = businessEx.UserMessage;
                    response.Details = businessEx.Message;
                    
                    // Determinar el status code basado en el tipo de error
                    context.Response.StatusCode = businessEx.ErrorCode switch
                    {
                        "MICRO_NOT_FOUND" => (int)HttpStatusCode.NotFound,
                        "CHOFER_NOT_FOUND" => (int)HttpStatusCode.NotFound,
                        "CHICO_NOT_FOUND" => (int)HttpStatusCode.NotFound,
                        "MICRO_ALREADY_EXISTS" => (int)HttpStatusCode.Conflict,
                        "CHOFER_ALREADY_ASSIGNED" => (int)HttpStatusCode.Conflict,
                        "CHICO_ALREADY_ASSIGNED" => (int)HttpStatusCode.Conflict,
                        "CHOFER_NOT_ASSIGNED" => (int)HttpStatusCode.BadRequest,
                        "CHICO_NOT_ASSIGNED" => (int)HttpStatusCode.BadRequest,
                        "NO_CHILDREN_ASSIGNED" => (int)HttpStatusCode.BadRequest,
                        _ => (int)HttpStatusCode.BadRequest
                    };
                    break;

                default:
                    response.ErrorCode = "INTERNAL_ERROR";
                    response.Message = "Ha ocurrido un error interno del servidor.";
                    response.Details = exception.Message;
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    break;
            }

            var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            _logger.LogError("Enviando respuesta de error: {Response}", jsonResponse);

            await context.Response.WriteAsync(jsonResponse);
        }
    }

    public class ErrorResponse
    {
        public string ErrorCode { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}