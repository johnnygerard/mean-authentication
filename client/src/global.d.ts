import type zxcvbn from "zxcvbn";

declare global {
  interface WorkerGlobalScope {
    zxcvbn: typeof zxcvbn | undefined;
  }
}
