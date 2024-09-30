import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { PasswordStrengthMeterComponent } from "../password-strength-meter/password-strength-meter.component";
import { UsernameValidatorDirective } from "../../directives/username-validator.directive";
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
import { NotificationService } from "../../services/notification.service";
import { CONFLICT } from "_server/constants/http-status-code";
import { SessionService } from "../../services/session.service";
import { ClientSession } from "_server/types/client-session";
import {
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "_server/validation/username";

import {
  PASSWORD_MAX_LENGTH,
  ZXCVBN_MIN_SCORE,
} from "_server/constants/password";
import { PasswordStrengthService } from "../../services/password-strength.service";

@Component({
  selector: "app-register-form",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatInput,
    RouterLink,
    PasswordStrengthMeterComponent,
    UsernameValidatorDirective,
    PasswordErrorPipe,
    UsernameErrorPipe,
  ],
  templateUrl: "./register-form.component.html",
  styleUrl: "./register-form.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  #destroyRef = inject(DestroyRef);
  #http = inject(HttpClient);
  #notifier = inject(NotificationService);
  #router = inject(Router);
  #session = inject(SessionService);
  #passwordStrength = inject(PasswordStrengthService);

  readonly USERNAME_MAX_LENGTH = USERNAME_MAX_LENGTH;
  readonly PASSWORD_MAX_LENGTH = PASSWORD_MAX_LENGTH;

  form = inject(FormBuilder).group({
    username: [
      "",
      [
        Validators.required,
        Validators.minLength(USERNAME_MIN_LENGTH),
        Validators.maxLength(USERNAME_MAX_LENGTH),
      ],
    ],
    password: [
      "",
      [Validators.required, Validators.maxLength(PASSWORD_MAX_LENGTH)],
    ],
  });

  isLoading = signal(false);
  isPasswordVisible = signal(false);
  visibilityTooltip = computed(
    () => `${this.isPasswordVisible() ? "Hide" : "Show"} password`,
  );

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe((next) => {
      const { username, password } = next;

      if (!password) return;
      const userInputs = username ? [username] : [];
      this.#passwordStrength.validate(password, userInputs);
    });

    effect((): void => {
      const result = this.#passwordStrength.result();
      if (result.score >= ZXCVBN_MIN_SCORE) return;
      const passwordControl = this.form.controls.password;

      passwordControl.setErrors({
        ...passwordControl.errors,
        strength: result.feedback.warning || "Vulnerable password",
      });
    });
  }

  onSubmit(): void {
    if (
      !this.form.valid ||
      this.isLoading() ||
      this.#passwordStrength.workerIsBusy()
    ) {
      return;
    }
    this.isLoading.set(true);

    this.#http
      .post<ClientSession>("/api/account", this.form.value)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe({
        next: async (user) => {
          this.#session.store(user);
          await this.#router.navigateByUrl("/");
        },
        error: (e: HttpErrorResponse) => {
          if (e.status === CONFLICT) {
            this.#notifier.send("Sorry, this username is not available.");
            return;
          }

          console.error(e);
          this.#notifier.send("Registration failed. Please try again later.");
        },
      });
  }

  togglePasswordVisibility(event: MouseEvent): void {
    this.isPasswordVisible.update((value) => !value);

    // Avoid losing focus due to event bubbling to the password input
    event.stopPropagation();
  }
}
