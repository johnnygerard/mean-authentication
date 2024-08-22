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
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordStrengthMeterComponent {
  password = input.required<string>();
  userInputs = input<string[]>([]);

  result = computed(() => zxcvbn(this.password(), this.userInputs()));
  strength = computed(() => this.result().score);
  guesses = computed(() => this.result().guesses);
}
