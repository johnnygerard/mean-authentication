import { Pipe, PipeTransform } from "@angular/core";
import { ValidationErrors } from "@angular/forms";
import { ValidationError } from "../types/validation-error.enum";

@Pipe({
  name: "usernameError",
  standalone: true,
})
export class UsernameErrorPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(errors: ValidationErrors | null, ...args: unknown[]): string {
    if (!errors) return "";

    if (errors["required"]) return ValidationError.REQUIRED;
    if (errors["maxlength"]) return ValidationError.MAX_LENGTH;
    if (errors["pattern"]) return ValidationError.PATTERN;

    throw new Error("Unexpected validation error");
  }
}
