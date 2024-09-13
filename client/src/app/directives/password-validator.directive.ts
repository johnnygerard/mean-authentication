import { Directive, inject } from "@angular/core";
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from "@angular/forms";
import { PasswordService } from "../services/password.service";

/**
 * Password cross-field validator directive.
 *
 * Note that this validator always returns null.
 * The validation error is set on the password form control itself.
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

  validate(form: AbstractControl): ValidationErrors | null {
    const username = form.get("username");
    const password = form.get("password");

    if (
      typeof username?.value !== "string" ||
      typeof password?.value !== "string" ||
      typeof window.zxcvbn === "undefined"
    ) {
      return null;
    }

    const result = window.zxcvbn(password.value, [username.value]);
    this.#passwordService.result.set(result);

    if (result.score < 3) {
      password.setErrors({
        ...password.errors,
        strength: result.feedback.warning || "Vulnerable password",
      });
    }

    return null;
  }
}
