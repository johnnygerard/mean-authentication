import { Pipe, PipeTransform } from "@angular/core";
import { ValidationErrors } from "@angular/forms";

@Pipe({
  name: "usernameError",
  standalone: true,
})
export class UsernameErrorPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(errors: ValidationErrors | null, ...args: unknown[]): string {
    if (!errors) return "";

    if (errors["required"]) return "This field is required";
    if (errors["maxlength"]) return "Maximum length exceeded";
    if (errors["pattern"]) return errors["pattern"];
    throw new Error("Unexpected validation error");
  }
}
