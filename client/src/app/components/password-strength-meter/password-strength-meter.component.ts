import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { PasswordService } from "../../services/password.service";
import { MatError } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: "app-password-strength-meter",
  standalone: true,
  imports: [MatError, MatTooltipModule],
  templateUrl: "./password-strength-meter.component.html",
  styleUrl: "./password-strength-meter.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordStrengthMeterComponent {
  result = inject(PasswordService).result;
  warning = computed(() => this.result().feedback.warning);
  suggestions = computed(() => this.result().feedback.suggestions);
  isPasswordEmpty = input.required<boolean>();
  isPasswordValid = computed(() => this.result().score >= 3);

  tooltip = computed(() => {
    // Hide tooltip if password field is empty
    if (this.isPasswordEmpty()) return "";

    const estimation =
      this.result().crack_times_display.offline_slow_hashing_1e4_per_second;

    return `Estimated time to crack: ${estimation}`;
  });
}
