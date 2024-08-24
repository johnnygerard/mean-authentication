import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RegisterFormComponent } from "../components/register-form/register-form.component";

@Component({
  selector: "app-register-page",
  standalone: true,
  imports: [RegisterFormComponent],
  template: ` <app-register-form /> `,
  styles: `
    :host {
      display: flex;
      justify-content: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {}
