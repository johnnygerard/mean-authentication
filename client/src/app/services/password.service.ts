import { Injectable, signal } from "@angular/core";
import zxcvbn from "zxcvbn";

/**
 * This service's main purpose is to share password strength results between
 * the password validator directive and the password strength meter component.
 */
@Injectable({
  providedIn: "root",
})
export class PasswordService {
  result = signal(zxcvbn(""));
}
