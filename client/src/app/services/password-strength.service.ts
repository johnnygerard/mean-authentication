import { Injectable, signal } from "@angular/core";
import { zxcvbnDefaultResult } from "_server/constants/zxcvbn-default-result";

@Injectable({
  providedIn: "root",
})
export class PasswordStrengthService {
  isLoaded = signal(false);
  result = signal(zxcvbnDefaultResult);
  #worker = new Worker(
    new URL("../workers/password-strength.worker.js", import.meta.url),
    { type: "module" },
  );

  constructor() {}
}
