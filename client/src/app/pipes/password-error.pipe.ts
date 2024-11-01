import { Pipe, PipeTransform } from "@angular/core";
import { ValidationErrors } from "@angular/forms";

@Pipe({
  name: "passwordError",
  standalone: true,
})
export class PasswordErrorPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(errors: ValidationErrors | null, ...args: unknown[]): string {
    if (!errors) return "";

    if (errors["required"]) return "This field is required";
    if (errors["maxlength"]) return "Maximum length exceeded";
    if (errors["strength"]) return errors["strength"];

    throw new Error(`Unexpected validation error: ${JSON.stringify(errors)}`);
  }
}
