import { Directive, inject } from "@angular/core";
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from "@angular/forms";
import { catchError, from, map, Observable, of, switchMap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import {
  prepareRequest,
  processResponse,
} from "_server/auth/pwned-passwords-api-helper";
import { PasswordHashingService } from "../services/password-hashing.service";

@Directive({
  selector: "[appPwnedPasswordsApiValidator]",
  standalone: true,
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: PwnedPasswordsApiValidatorDirective,
      multi: true,
    },
  ],
})
export class PwnedPasswordsApiValidatorDirective implements AsyncValidator {
  #hashService = inject(PasswordHashingService);
  #http = inject(HttpClient);

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const password = control.value;
    const canValidate = typeof password === "string" && password;

    if (!canValidate) return of(null);

    return from(this.#hashService.hash(password)).pipe(
      switchMap((digest) => this.#apiRequest$(digest)),
    );
  }

  #apiRequest$(digest: string): Observable<ValidationErrors | null> {
    const [url, validator] = prepareRequest(digest);

    return this.#http.get(url, { responseType: "text" }).pipe(
      map((text: string) => {
        return processResponse(text, validator) ? { exposed: true } : null;
      }),
      catchError((e) => {
        window.console.error(e);
        return of(null);
      }),
    );
  }
}
