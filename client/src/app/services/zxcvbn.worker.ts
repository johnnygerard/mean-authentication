/// <reference lib="webworker" />
import { APP_NAME } from "_server/constants/app";

let dictionary: string[];
let libraryBlobUrl: string;
let subworker: Worker;
let subworkerIsBusy = false;

/**
 * Create a new subworker instance.
 */
const createSubworker = (): Worker => {
  /**
   * Because the Angular build system does not process subworkers (aka nested
   * workers), the subworker is written in JavaScript and loaded as a separate
   * static asset.
   * @see https://angular.dev/tools/cli/build-system-migration#type-checking-of-web-worker-code-and-processing-of-nested-web-workers
   */
  return new Worker(new URL("zxcvbn-sub.worker.js", import.meta.url), {
    type: "module",
  });
};

/**
 * Initialize the subworker.
 *
 * `zxcvbn` results are forwarded to the main thread.
 */
const initSubworker = (): void => {
  subworker.postMessage({
    dictionary,
    libraryBlobUrl,
  });

  subworker.addEventListener("message", ({ data }) => {
    subworkerIsBusy = false;
    self.postMessage(data);
  });
};

const restartSubworker = (): void => {
  subworker.terminate();
  subworker = createSubworker();
  initSubworker();
};

const loadDictionary = async (): Promise<string[]> => {
  const response = await fetch("app-dictionary.txt");
  const text = await response.text();
  const dictionary = text.split("\n");

  dictionary.push(APP_NAME);
  return dictionary;
};

const loadLibrary = async (): Promise<string> => {
  const response = await fetch(
    "https://cdn.jsdelivr.net/npm/zxcvbn@4.4.2/dist/zxcvbn.js",
    {
      integrity: "sha256-9CxlH0BQastrZiSQ8zjdR6WVHTMSA5xKuP5QkEhPNRo=",
    },
  );
  const blob = await response.blob();

  return URL.createObjectURL(blob);
};

/**
 * An IIFE is used because Angular currently does not support top-level awaits.
 * This issue will be fixed with zoneless applications which is currently
 * experimental.
 * @see https://angular.dev/guide/experimental/zoneless
 */
(async () => {
  subworker = createSubworker();

  [dictionary, libraryBlobUrl] = await Promise.all([
    loadDictionary(),
    loadLibrary(),
  ]);

  initSubworker();

  addEventListener("message", (event) => {
    if (subworkerIsBusy) restartSubworker();
    else subworkerIsBusy = true;
    subworker.postMessage(event.data);
  });
})();
