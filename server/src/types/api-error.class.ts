import { ErrorCode } from "../error-code.enum.js";

export class ApiError {
  constructor(
    public code: ErrorCode,
    public message?: string,
  ) {
    if (!message && typeof code === "string") {
      this.message = code;
    }
  }
}
