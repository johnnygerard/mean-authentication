import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ApiError } from "_server/types/api-error.enum";
import { UserMessage } from "../types/user-message.enum";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  #snackBar = inject(MatSnackBar);

  /**
   * Display a notification message
   * @param message - Notification message
   */
  send(message: UserMessage | ApiError): void {
    this.#snackBar.open(message, "Close", {
      horizontalPosition: "center",
      verticalPosition: "top",
    });
  }
}
