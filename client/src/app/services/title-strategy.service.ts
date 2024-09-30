import { inject, Injectable } from "@angular/core";
import { RouterStateSnapshot, TitleStrategy } from "@angular/router";
import { Title } from "@angular/platform-browser";

import { APP_NAME } from "_server/constants/app";

/**
 * Service that updates the title of the page based on the current route.
 * @see https://angular.dev/guide/routing/common-router-tasks#setting-the-page-title
 */
@Injectable({
  providedIn: "root",
})
export class TitleStrategyService extends TitleStrategy {
  #title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot);
    let fullTitle: string;

    switch (title) {
      case undefined:
        return;
      case APP_NAME:
        fullTitle = `${title} - The Future of Authentication`;
        break;
      default:
        fullTitle = `${title} | ${APP_NAME}`;
        break;
    }

    this.#title.setTitle(fullTitle);
  }
}
