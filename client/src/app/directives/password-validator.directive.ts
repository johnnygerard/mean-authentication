import { Directive, inject } from "@angular/core";
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from "@angular/forms";
import { PasswordService } from "../services/password.service";
import zxcvbn from "zxcvbn";

/**
 * Password cross-field validator directive.
 */
@Directive({
  selector: "[appPasswordValidator]",
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordValidatorDirective,
      multi: true,
    },
  ],
})
export class PasswordValidatorDirective implements Validator {
  #passwordService = inject(PasswordService);

  validate(control: AbstractControl): ValidationErrors | null {
    const username = control.get("username")?.value;
    const password = control.get("password")?.value;

    if (typeof username !== "string" || typeof password !== "string")
      return null;

    const result = zxcvbn(password, [username]);
    this.#passwordService.result.set(result);

    return result.score >= 3 ? null : { password: true };
  }
}
