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
  ...otherControls: AbstractControl[]
) => {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const password = control.value;

    if (typeof password !== "string") return of(null);

    const userInputs = otherControls
      .map((control) => control.value)
      .filter((value) => value && typeof value === "string") as string[];

    return passwordStrength
      .validate(password, userInputs)
      .pipe(map((result) => getValidationErrors(result)));
  };
};
