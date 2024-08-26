import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  model,
  signal,
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
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { PasswordErrorPipe } from "../../pipes/password-error.pipe";
import { UsernameErrorPipe } from "../../pipes/username-error.pipe";
import { finalize } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-register-form",
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatInput,
    RouterLink,
    PasswordStrengthMeterComponent,
    UsernameValidatorDirective,
    PasswordValidatorDirective,
    PasswordErrorPipe,
    UsernameErrorPipe,
  ],
  templateUrl: "./register-form.component.html",
  styleUrl: "./register-form.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  #auth = inject(AuthService);
  #destroyRef = inject(DestroyRef);
  #http = inject(HttpClient);
  #router = inject(Router);
  username = model("");
  password = model("");
  isLoading = signal(false);
  isPasswordVisible = signal(false);
  visibilityTooltip = computed(
    () => `${this.isPasswordVisible() ? "Hide" : "Show"} password`,
  );

  onSubmit(form: NgForm): void {
    if (!form.valid || this.isLoading()) return;
    this.isLoading.set(true);

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
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe({
        next: async () => {
          this.#auth.isAuthenticated.set(true);
          await this.#router.navigateByUrl("/");
        },
        error: (e: HttpErrorResponse) => {
          if (e.status === CONFLICT) {
            window.alert("Sorry, this username is not available.");
            return;
          }
          throw e;
        },
      });
  }

  togglePasswordVisibility(event: MouseEvent): void {
    this.isPasswordVisible.update((value) => !value);

    // Avoid losing focus due to event bubbling to the password input
    event.stopPropagation();
  }
}
