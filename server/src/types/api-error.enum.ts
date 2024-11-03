export const enum ApiError {
  BAD_CREDENTIALS = "Sorry, these credentials are incorrect. Please try again.",
  DATABASE_ERROR = "Your request failed due to a database error. Please try again later.",
  LEAKED_PASSWORD = "This password has been leaked in a data breach. Please choose a different one.",
  UNAUTHENTICATED = "Your session has expired. Please sign in again.",
  VALIDATION_MISMATCH = "Invalid request. Please check your input and try again.",
  WRONG_PASSWORD = "Sorry, this password is incorrect. Please try again.",
}
