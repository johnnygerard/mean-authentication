import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import zxcvbn from "zxcvbn";

@Component({
  selector: "app-password-strength-meter",
  standalone: true,
  imports: [],
  templateUrl: "./password-strength-meter.component.html",
  host: {
    class: "flex flex-col gap-[8px]",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordStrengthMeterComponent {
  password = input.required<string>();
  userInputs = input<string[]>([]);

  result = computed(() => zxcvbn(this.password(), this.userInputs()));
  feedback = computed(() => this.result().feedback);
  isPasswordValid = computed(() => this.result().score >= 3);
}
