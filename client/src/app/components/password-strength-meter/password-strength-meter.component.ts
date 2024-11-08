import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { zxcvbnDefaultResult } from "_server/constants/zxcvbn-default-result";
import { PasswordStrengthService } from "../../services/password-strength.service";

@Component({
  selector: "app-password-strength-meter",
  standalone: true,
  imports: [MatIconModule, MatTooltipModule],
  templateUrl: "./password-strength-meter.component.html",
  styleUrl: "./password-strength-meter.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordStrengthMeterComponent {
  result = toSignal(inject(PasswordStrengthService).result$, {
    initialValue: zxcvbnDefaultResult,
  });

  score = computed(() => this.result().score);
  ariaValueText = computed(() => this.#scoreLabel);
  isPasswordValid = computed(() => this.score() >= 3);
  suggestions = computed(() => this.result().feedback.suggestions);
  tooltip = computed(() => this.#tooltipText);

  get #scoreLabel(): string {
    const score = this.score();

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
  }

  get #tooltipText(): string {
    // Hide tooltip when the password is empty
    if (this.result().password === "") return "";

    const estimation =
      this.result().crack_times_display.offline_slow_hashing_1e4_per_second;

    return `Estimated time to crack: ${estimation}`;
  }
}
