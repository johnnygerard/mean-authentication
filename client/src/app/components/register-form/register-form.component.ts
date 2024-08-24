import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { CONFLICT } from "../../http-status-code";
import { AuthService } from "../../services/auth.service";
import { PasswordStrengthMeterComponent } from "../password-strength-meter/password-strength-meter.component";
import { UsernameValidatorDirective } from "../../directives/username-validator.directive";
import { PasswordValidatorDirective } from "../../directives/password-validator.directive";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatInput } from "@angular/material/input";

@Component({
  selector: "app-register-form",
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatInput,
    RouterLink,
    PasswordStrengthMeterComponent,
    UsernameValidatorDirective,
    PasswordValidatorDirective,
  ],
  templateUrl: "./register-form.component.html",
  styleUrl: "./register-form.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  #auth = inject(AuthService);
  #http = inject(HttpClient);
  #router = inject(Router);
  username = model("");
  password = model("");
  isPending = false;

  onSubmit(form: NgForm): void {
    if (form.invalid || this.isPending) return;
    this.isPending = true;

    this.#http
      .post(
        `${environment.apiUrl}/account`,
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
          await this.#router.navigateByUrl("/");
        },
        error: (e: HttpErrorResponse) => {
          this.isPending = false;
          if (e.status === CONFLICT) {
            window.alert("Sorry, this username is not available.");
            return;
          }
          throw e;
        },
      });
  }
}
