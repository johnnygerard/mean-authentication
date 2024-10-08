import { Directive } from "@angular/core";
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from "@angular/forms";
import {
  usernameHasValidCharacters,
  usernameHasValidType,
} from "_server/validation/username";

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

    return usernameHasValidType(username) &&
      !usernameHasValidCharacters(username)
      ? { pattern: "Invalid characters" }
      : null;
  }
}
