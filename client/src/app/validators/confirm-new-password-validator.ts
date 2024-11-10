import { ValidatorFn } from "@angular/forms";

export const confirmNewPasswordValidator: ValidatorFn = (control) => {
  const newPassword = control.parent?.get("newPassword")?.value;
  const confirmNewPassword = control.value;

  if (typeof newPassword !== "string" || typeof confirmNewPassword !== "string")
    return null;

  return newPassword === confirmNewPassword ? null : { passwordMismatch: true };
};
