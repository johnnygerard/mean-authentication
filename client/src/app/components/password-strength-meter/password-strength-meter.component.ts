import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { PasswordStrengthService } from "../../services/password-strength.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-password-strength-meter",
  standalone: true,
  imports: [MatIconModule, MatTooltipModule],
  templateUrl: "./password-strength-meter.component.html",
  styleUrl: "./password-strength-meter.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordStrengthMeterComponent {
  result = inject(PasswordStrengthService).result;
  suggestions = computed(() => this.result().feedback.suggestions);
  isPasswordValid = computed(() => this.result().score >= 3);
  ariaValueText = computed(() => {
    const score = this.result().score;

    switch (score) {
      case 0:
        return "Unacceptable";
      case 1:
        return "Very weak";
      case 2:
        return "Weak";
      case 3:
        return "Acceptable";
      case 4:
        return "Strong";
      default:
        return ((_: never) => _)(score); // Exhaustive check
    }
  });

  tooltip = computed(() => {
    // Hide tooltip when the password is empty
    if (this.result().password === "") return "";

    const estimation =
      this.result().crack_times_display.offline_slow_hashing_1e4_per_second;

    return `Estimated time to crack: ${estimation}`;
  });
}
