import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { hasValidUsernameCharacters } from "_server/validation/username";

export const usernamePatternValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const username = control.value;

  return typeof username === "string" && !hasValidUsernameCharacters(username)
    ? { pattern: true }
    : null;
};
