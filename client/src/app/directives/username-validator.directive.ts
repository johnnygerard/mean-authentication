import { Directive } from "@angular/core";
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from "@angular/forms";

@Directive({
  selector: "[appUsernameValidator]",
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: UsernameValidatorDirective,
      multi: true,
    },
  ],
})
export class UsernameValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const username = control.value;

    if (typeof username !== "string" || /^\P{C}+$/u.test(username)) return null;
    return { usernamePattern: true };
  }
}
