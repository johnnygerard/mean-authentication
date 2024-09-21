import { Directive, inject } from "@angular/core";
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from "@angular/forms";
import { PasswordService } from "../services/password.service";
import { usernameHasValidType } from "_server/validation/username";
import { ZXCVBN_MIN_SCORE } from "_server/constants/password";

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
    const zxcvbn = window.zxcvbn;
    const usernameControl = form.get("username");
    const passwordControl = form.get("password");
    const username = usernameControl?.value;
    const password = passwordControl?.value;

    const canValidate =
      zxcvbn &&
      usernameControl &&
      passwordControl &&
      usernameHasValidType(username) &&
      typeof password === "string";

    if (!canValidate) return null;

    const result = zxcvbn(
      password,
      this.#passwordService.getDictionary(username),
    );
    this.#passwordService.result.set(result);

    if (result.score >= ZXCVBN_MIN_SCORE) return null;

    const validationMessage: string =
      result.feedback.warning || "Vulnerable password";

    passwordControl.setErrors({
      ...passwordControl.errors,
      strength: validationMessage,
    });

    return null;
  }
}
