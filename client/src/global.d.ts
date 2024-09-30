import { ZXCVBN } from "_server/types/zxcvbn";

declare global {
  interface WorkerGlobalScope {
    zxcvbn: ZXCVBN | undefined;
  }
}
