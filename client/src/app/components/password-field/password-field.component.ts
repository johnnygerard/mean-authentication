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
import { FormGroupDirective, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { PASSWORD_MAX_LENGTH } from "_server/constants/password";
import { PasswordErrorPipe } from "../../pipes/password-error.pipe";

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordFieldComponent implements OnInit {
  readonly PASSWORD_MAX_LENGTH = PASSWORD_MAX_LENGTH;
  autocomplete = input.required<"new-password" | "current-password">();
  ngForm = input.required<FormGroupDirective>();
  isPasswordVisible = signal(false);
  passwordControl = computed(() => this.ngForm().form.controls["password"]);
  visibilityTooltip = computed(
    () => `${this.isPasswordVisible() ? "Hide" : "Show"} password`,
  );
  #destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // Workaround to display password validation errors on form submission
    this.ngForm()
      .ngSubmit.pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.passwordControl().markAsTouched();
      });
  }

  togglePasswordVisibility(event: MouseEvent): void {
    this.isPasswordVisible.update((value) => !value);

    // Avoid losing focus due to event bubbling to the password input
    event.stopPropagation();
  }
}
