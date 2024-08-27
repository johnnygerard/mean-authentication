import { Pipe, PipeTransform } from "@angular/core";
import { ValidationErrors } from "@angular/forms";

@Pipe({
  name: "passwordError",
  standalone: true,
})
export class PasswordErrorPipe implements PipeTransform {
  transform(errors: ValidationErrors, ...args: unknown[]): string {
    if (errors["required"]) return "This field is required";
    if (errors["maxlength"]) return "Maximum length exceeded";
    if (errors["strength"]) return errors["strength"];
    throw new Error("Unexpected validation error");
  }
}
