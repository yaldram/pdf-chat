export class APIError extends Error {
  statusCode: number;
  message: string;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}

export async function handleErrorResponse(
  response: Response,
): Promise<APIError> {
  const errorData = await response.json();
  const errorMessage = errorData.message || 'Unknown error occurred';
  return new APIError(response.status, errorMessage);
}
