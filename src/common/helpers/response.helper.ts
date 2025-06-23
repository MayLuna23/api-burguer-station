import { ApiResponse } from '@/types/api-response.interface';

export function successResponse<T>(
  data: T,
  message = 'Operación exitosa',
  statusCode = 200,
): ApiResponse<T> {
  return {
    statusCode,
    message,
    data,
  };
}

export function errorResponse(
  message = 'Ocurrió un error en el servidor, contacta al equipo de Burguer Station',
  statusCode = 500,
  errors: any = null,
): ApiResponse {
  return {
    statusCode,
    message,
    errors,
  };
}
