import { AbstractControl, ValidationErrors } from "@angular/forms";
import { ZXCVBN_MIN_SCORE } from "_server/constants/password";
import { map, Observable, of } from "rxjs";
import { PasswordStrengthService } from "../services/password-strength.service";

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
      .pipe(
        map((result) =>
          result.score >= ZXCVBN_MIN_SCORE ? null : { strength: true },
        ),
      );
  };
};
