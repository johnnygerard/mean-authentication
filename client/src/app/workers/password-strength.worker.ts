/// <reference lib="webworker" />
import "https://cdn.jsdelivr.net/npm/zxcvbn@4.4.2/dist/zxcvbn.js";
import { APP_NAME } from "_server/constants/app";
import { ZxcvbnInput } from "_server/types/zxcvbn-input";
import type zxcvbn from "zxcvbn";

declare global {
  interface WorkerGlobalScope {
    zxcvbn: typeof zxcvbn;
  }
}

const fetchDictionary = async (): Promise<string[]> => {
  const response = await fetch("app-dictionary.txt");
  const text = await response.text();
  const dictionary = text.split("\n");

  dictionary.push(APP_NAME);
  return dictionary;
};

/**
 * Top-level await is avoided because it is not supported by Angular.
 * This issue will be fixed with zoneless applications which is currently
 * experimental.
 * @see https://angular.dev/guide/experimental/zoneless
 */
fetchDictionary().then((dictionary) => {
  self.onmessage = (event: MessageEvent<ZxcvbnInput>): void => {
    const { password, userInputs } = event.data;
    const result = self.zxcvbn(password, userInputs.concat(dictionary));

    self.postMessage(result);
  };

  self.postMessage("Password strength worker initialized!");
});
