import { ZXCVBN } from "_server/types/zxcvbn";

declare global {
  interface Window {
    zxcvbn: ZXCVBN | undefined;
  }
}
