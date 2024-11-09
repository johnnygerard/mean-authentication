import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { PASSWORD_MAX_LENGTH } from "_server/constants/password";
import { zxcvbnDefaultResult } from "_server/constants/zxcvbn-default-result";
import { PasswordErrorPipe } from "../../pipes/password-error.pipe";
import { PasswordStrengthService } from "../../services/password-strength.service";

@Component({
  selector: "app-password-field",
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    PasswordErrorPipe,
    ReactiveFormsModule,
  ],
  templateUrl: "./password-field.component.html",
  styleUrl: "./password-field.component.scss",
  // Using the default change detection strategy as a workaround for displaying
  // password validation errors on form submission (see related issue below).
  // https://stackoverflow.com/questions/56584244/can-the-angular-material-errorstatematcher-detect-when-a-parent-form-is-submitte
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PasswordFieldComponent implements OnInit {
  readonly PASSWORD_MAX_LENGTH = PASSWORD_MAX_LENGTH;
  autocomplete = input.required<"new-password" | "current-password">();
  isPasswordVisible = signal(false);
  passwordControl = input.required<FormControl>();
  visibilityTooltip = computed(
    () => `${this.isPasswordVisible() ? "Hide" : "Show"} password`,
  );

  #destroyRef = inject(DestroyRef);
  #strength = inject(PasswordStrengthService);

  /**
   * Reset the password strength meter when the password input is empty.
   *
   * This is necessary because the "required" validator prevents the password
   * strength async validator from running when the input is empty.
   * @see https://angular.dev/guide/forms/form-validation#creating-asynchronous-validators
   */
  ngOnInit(): void {
    this.passwordControl()
      .valueChanges.pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((value) => {
        if (value === "") this.#strength.result$.next(zxcvbnDefaultResult);
      });
  }

  togglePasswordVisibility(event: MouseEvent): void {
    this.isPasswordVisible.update((value) => !value);

    // Avoid losing focus due to event bubbling to the password input
    event.stopPropagation();
  }
}
