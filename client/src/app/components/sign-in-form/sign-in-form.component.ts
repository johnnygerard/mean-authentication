import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  signal,
} from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { PasswordStrengthMeterComponent } from "../password-strength-meter/password-strength-meter.component";
import { PasswordValidatorDirective } from "../../directives/password-validator.directive";
import { Router, RouterLink } from "@angular/router";
import { UsernameValidatorDirective } from "../../directives/username-validator.directive";
import { AuthService } from "../../services/auth.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { FORBIDDEN } from "../../http-status-code";

@Component({
  selector: "app-sign-in-form",
  standalone: true,
  imports: [
    FormsModule,
    PasswordStrengthMeterComponent,
    PasswordValidatorDirective,
    RouterLink,
    UsernameValidatorDirective,
  ],
  templateUrl: "./sign-in-form.component.html",
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInFormComponent {
  #auth = inject(AuthService);
  #http = inject(HttpClient);
  #router = inject(Router);
  password = model("");
  username = model("");
  isPending = false;
  areCredentialsInvalid = signal(false);

  onSubmit(form: NgForm): void {
    if (form.invalid || this.isPending) return;
    this.isPending = true;
    this.areCredentialsInvalid.set(false);

    this.#http
      .post(
        `${environment.apiUrl}/session`,
        {
          username: this.username(),
          password: this.password(),
        },
        {
          withCredentials: true,
        },
      )
      .subscribe({
        next: async () => {
          this.#auth.isAuthenticated.set(true);
          await this.#router.navigate(["/"]);
        },
        error: (e: HttpErrorResponse) => {
          this.isPending = false;

          if (e.status === FORBIDDEN) {
            this.areCredentialsInvalid.set(true);
            return;
          }

          throw e;
        },
      });
  }
}
