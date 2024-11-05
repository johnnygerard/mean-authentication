import { AbstractControl, ValidationErrors } from "@angular/forms";
import { PasswordStrengthService } from "../services/password-strength.service";

export const passwordValidatorFactory = (
  passwordStrength: PasswordStrengthService,
) => {
  return async (control: AbstractControl): Promise<ValidationErrors | null> => {
    const username = control.get("username")?.value;
    const password = control.get("password")?.value;

    if (typeof password !== "string" || typeof username !== "string")
      return null;

    const userInputs = username ? [username] : [];
    return passwordStrength.validate(password, userInputs);
  };
};
