import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { PasswordService } from "../../services/password.service";

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
  result = inject(PasswordService).result;
  warning = computed(() => this.result().feedback.warning);
  suggestions = computed(() => this.result().feedback.suggestions);
  isPasswordValid = computed(() => this.result().score >= 3);
}
