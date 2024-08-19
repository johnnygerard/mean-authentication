class _ApiError {
  constructor(public error: string) {}
}

export class ApiError {
  static NO_SESSION_COOKIE = new _ApiError("NO_SESSION_COOKIE");
  static TOKEN_EXPIRED = new _ApiError("TOKEN_EXPIRED");
  static INVALID_TOKEN = new _ApiError("INVALID_TOKEN");

  // Validation errors
  static INVALID_USERNAME = new _ApiError("INVALID_USERNAME");
  static INVALID_PASSWORD = new _ApiError("INVALID_PASSWORD");
}
