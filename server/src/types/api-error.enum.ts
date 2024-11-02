export const enum ApiError {
  BAD_CREDENTIALS = "Sorry, these credentials are incorrect. Please try again.",
  LEAKED_PASSWORD = "This password has been leaked in a data breach. Please choose a different one.",
  PARSE_ERROR = "Invalid request. Please check your input and try again.",
  UNAUTHENTICATED = "Your session has expired. Please sign in again.",
  WEAK_PASSWORD = "This password is too weak. Please choose a stronger one.",
  WRONG_PASSWORD = "Sorry, this password is incorrect. Please try again.",
}
