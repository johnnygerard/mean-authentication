import { Pipe, PipeTransform } from "@angular/core";
import { ValidationErrors } from "@angular/forms";
import { ValidationError } from "../types/validation-error.enum";

@Pipe({
  name: "passwordError",
  standalone: true,
})
export class PasswordErrorPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(errors: ValidationErrors | null, ...args: unknown[]): string {
    if (!errors) return "";

    if (errors["required"]) return ValidationError.REQUIRED;
    if (errors["maxlength"]) return ValidationError.MAX_LENGTH;
    if (errors["strength"]) return ValidationError.PASSWORD_STRENGTH;
    if (errors["passwordMismatch"]) return ValidationError.PASSWORD_MISMATCH;
    if (errors["samePassword"]) return ValidationError.SAME_PASSWORD;

    throw new Error(`Unexpected validation error: ${JSON.stringify(errors)}`);
  }
}
