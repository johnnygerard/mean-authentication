import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { Router, RouterLink } from "@angular/router";
import { CONFLICT } from "_server/constants/http-status-code";
import {
  PASSWORD_MAX_LENGTH,
  ZXCVBN_MIN_SCORE,
} from "_server/constants/password";
import { ClientSession } from "_server/types/client-session";
import {
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "_server/validation/username";
import { finalize } from "rxjs";
import { UsernameValidatorDirective } from "../../directives/username-validator.directive";
import { UsernameErrorPipe } from "../../pipes/username-error.pipe";
import { NotificationService } from "../../services/notification.service";
import { PasswordStrengthService } from "../../services/password-strength.service";
import { SessionService } from "../../services/session.service";
import { UserMessage } from "../../types/user-message.enum";
import { PasswordFieldComponent } from "../password-field/password-field.component";
import { PasswordStrengthMeterComponent } from "../password-strength-meter/password-strength-meter.component";

@Component({
  selector: "app-register-form",
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    PasswordFieldComponent,
    PasswordStrengthMeterComponent,
    ReactiveFormsModule,
    RouterLink,
    UsernameErrorPipe,
    UsernameValidatorDirective,
  ],
  templateUrl: "./register-form.component.html",
  styleUrl: "./register-form.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  readonly USERNAME_MAX_LENGTH = USERNAME_MAX_LENGTH;
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

  #destroyRef = inject(DestroyRef);
  #http = inject(HttpClient);
  #notifier = inject(NotificationService);
  #router = inject(Router);
  #session = inject(SessionService);
  #passwordStrength = inject(PasswordStrengthService);
  #shouldResubmit = false;

  constructor() {
    // Send form inputs to password strength validation worker service
    this.form.valueChanges
      .pipe(
        takeUntilDestroyed(),
        finalize(() => {
          // Reset strength meter when the component is destroyed
          this.#passwordStrength.validate("", []);
        }),
      )
      .subscribe((next) => {
        const { username, password } = next;

        if (typeof password !== "string") {
          return;
        }
        const userInputs = username ? [username] : [];
        this.#passwordStrength.validate(password, userInputs);
      });

    // Listen for password strength validation results from the worker service
    // and set validation errors on the password control
    effect(
      (): void => {
        try {
          const result = this.#passwordStrength.result();
          const control = this.form.controls.password;

          if (result.score >= ZXCVBN_MIN_SCORE) {
            this.#removeStrengthError(control);
            return;
          }

          // Add validation error
          control.setErrors({
            ...control.errors,
            strength: result.feedback.warning || "Vulnerable password",
          });
        } finally {
          if (this.#shouldResubmit) {
            this.#shouldResubmit = false;
            this.onSubmit();
          }
        }
      },
      { allowSignalWrites: true },
    );
  }

  onSubmit(): void {
    if (!this.form.valid || this.isLoading()) return;
    if (this.#passwordStrength.isWorkerBusy()) {
      this.#shouldResubmit = true;
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
        error: (response: HttpErrorResponse) => {
          if (response.status === CONFLICT) {
            this.#notifier.send(UserMessage.USERNAME_TAKEN);
            return;
          }

          console.error(response);
          this.#notifier.send(UserMessage.REGISTRATION_FAILED);
        },
      });
  }

  #removeStrengthError(control: FormControl): void {
    if (control.errors === null) return;

    delete control.errors["strength"];
    control.setErrors(
      Object.keys(control.errors).length ? control.errors : null,
    );
  }
}
