import { ValidatorFn } from "@angular/forms";

export const distinctPasswordValidator: ValidatorFn = (control) => {
  const oldPassword = control.parent?.get("oldPassword")?.value;
  const newPassword = control.value;

  if (typeof oldPassword !== "string" || typeof newPassword !== "string")
    return null;

  return oldPassword === newPassword ? { samePassword: true } : null;
};
