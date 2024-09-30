import { Component, inject, OnInit } from "@angular/core";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { RouterOutlet } from "@angular/router";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { progressActivity } from "./svg/progress-activity";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, NavigationComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
  #iconRegistry = inject(MatIconRegistry);
  #sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    for (const name of ["visibility", "visibility_off", "info"]) {
      this.#registerIcon(name);
    }

    // Register progress icon as HTML to avoid sending an extra HTTP request
    this.#iconRegistry.addSvgIconLiteral(
      "progress_activity",
      this.#sanitizer.bypassSecurityTrustHtml(progressActivity),
    );
  }

  #registerIcon(name: string): void {
    this.#iconRegistry.addSvgIcon(
      name,
      this.#sanitizer.bypassSecurityTrustResourceUrl(`/icons/${name}.svg`),
    );
  }
}
