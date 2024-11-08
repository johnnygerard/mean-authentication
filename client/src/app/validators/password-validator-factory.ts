import { AbstractControl, ValidationErrors } from "@angular/forms";
import { ZXCVBN_MIN_SCORE } from "_server/constants/password";
import { ZxcvbnResult } from "_server/types/zxcvbn-result";
import { map, Observable, of } from "rxjs";
import { PasswordStrengthService } from "../services/password-strength.service";

const getValidationErrors = (result: ZxcvbnResult): ValidationErrors | null =>
  result.score >= ZXCVBN_MIN_SCORE
    ? null
    : { strength: result.feedback.warning || "Vulnerable password" };

export const passwordValidatorFactory = (
  passwordStrength: PasswordStrengthService,
) => {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const username = control.get("username")?.value;
    const password = control.get("password")?.value;

    if (typeof password !== "string" || typeof username !== "string")
      return of(null);

    const userInputs = username ? [username] : [];

    return passwordStrength
      .validate(password, userInputs)
      .pipe(map((result) => getValidationErrors(result)));
  };
};
