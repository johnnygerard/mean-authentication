export class ApiError {
  private constructor(public readonly error: string) {}

  static readonly UNEXPECTED_ERROR = new ApiError("UNEXPECTED_ERROR");

  // Authentication errors
  static readonly NO_SESSION_COOKIE = new ApiError("NO_SESSION_COOKIE");
  static readonly TOKEN_EXPIRED = new ApiError("TOKEN_EXPIRED");
  static readonly INVALID_TOKEN = new ApiError("INVALID_TOKEN");

  // Validation errors
  static readonly INVALID_USERNAME = new ApiError("INVALID_USERNAME");
  static readonly INVALID_PASSWORD = new ApiError("INVALID_PASSWORD");
}
