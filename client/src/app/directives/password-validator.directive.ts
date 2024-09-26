import { Directive, inject } from "@angular/core";
import {
  AbstractControl,
  AsyncValidator,
  NG_VALIDATORS,
  ValidationErrors,
} from "@angular/forms";
import { PasswordStrengthService } from "../services/password-strength.service";
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
export class PasswordValidatorDirective implements AsyncValidator {
  #passwordService = inject(PasswordStrengthService);

  async validate(form: AbstractControl): Promise<ValidationErrors | null> {
    const usernameControl = form.get("username");
    const passwordControl = form.get("password");
    const username = usernameControl?.value;
    const password = passwordControl?.value;

    const canValidate =
      usernameControl &&
      passwordControl &&
      usernameHasValidType(username) &&
      typeof password === "string" &&
      password;

    if (!canValidate) return null;

    const result = await this.#passwordService.zxcvbn(password, username);
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
