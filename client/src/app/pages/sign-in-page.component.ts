import { ChangeDetectionStrategy, Component } from "@angular/core";
import { SignInFormComponent } from "../components/sign-in-form/sign-in-form.component";

@Component({
  selector: "app-sign-in-page",
  standalone: true,
  imports: [SignInFormComponent],
  template: ` <app-sign-in-form /> `,
  styles: `
    :host {
      display: flex;
      justify-content: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInPageComponent {}
