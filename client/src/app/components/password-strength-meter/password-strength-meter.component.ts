import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { PasswordService } from "../../services/password.service";
import { MatError } from "@angular/material/form-field";

@Component({
  selector: "app-password-strength-meter",
  standalone: true,
  imports: [MatError],
  templateUrl: "./password-strength-meter.component.html",
  styleUrl: "./password-strength-meter.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordStrengthMeterComponent {
  result = inject(PasswordService).result;
  warning = computed(() => this.result().feedback.warning);
  suggestions = computed(() => this.result().feedback.suggestions);
  isPasswordValid = computed(() => this.result().score >= 3);
}
