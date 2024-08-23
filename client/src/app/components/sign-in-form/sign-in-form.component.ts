import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-sign-in-form",
  standalone: true,
  imports: [],
  templateUrl: "./sign-in-form.component.html",
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInFormComponent {}
