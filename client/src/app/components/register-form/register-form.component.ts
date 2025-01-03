import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  FormControl,
  NonNullableFormBuilder,
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
import { PASSWORD_MAX_LENGTH } from "_server/constants/password";
import { ClientSession } from "_server/types/client-session";
import {
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "_server/validation/username";
import { finalize } from "rxjs";
import { UsernameErrorPipe } from "../../pipes/username-error.pipe";
import { NotificationService } from "../../services/notification.service";
import { PasswordStrengthService } from "../../services/password-strength.service";
import { SessionService } from "../../services/session.service";
import { UserMessage } from "../../types/user-message.enum";
import { passwordValidatorFactory } from "../../validators/password-validator-factory";
import { usernamePatternValidator } from "../../validators/username-pattern-validator";
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
  ],
  templateUrl: "./register-form.component.html",
  styleUrl: "./register-form.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  readonly USERNAME_MAX_LENGTH = USERNAME_MAX_LENGTH;
  isLoading = signal(false);

  usernameControl = new FormControl("", {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(USERNAME_MIN_LENGTH),
      Validators.maxLength(USERNAME_MAX_LENGTH),
      usernamePatternValidator,
    ],
  });

  passwordControl = new FormControl("", {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.maxLength(PASSWORD_MAX_LENGTH),
    ],
    asyncValidators: passwordValidatorFactory(
      inject(PasswordStrengthService),
      this.usernameControl,
    ),
  });

  form = inject(NonNullableFormBuilder).group({
    username: this.usernameControl,
    password: this.passwordControl,
  });

  #destroyRef = inject(DestroyRef);
  #http = inject(HttpClient);
  #notifier = inject(NotificationService);
  #router = inject(Router);
  #session = inject(SessionService);

  constructor() {
    // Re-evaluate the password strength whenever the username changes
    this.usernameControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.passwordControl.updateValueAndValidity();
      });
  }

  onSubmit(): void {
    if (!this.form.valid || this.isLoading()) return;
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
}
