import type { ZXCVBNResult } from "zxcvbn";

declare global {
  interface Window {
    zxcvbn: (password: string, userInputs?: string[]) => ZXCVBNResult;
  }
}
