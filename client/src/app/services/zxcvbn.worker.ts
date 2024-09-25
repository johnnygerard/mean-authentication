/// <reference lib="webworker" />
import { ZXCVBN } from "_server/types/zxcvbn";

declare global {
  interface WorkerGlobalScope {
    zxcvbn: ZXCVBN | undefined;
  }
}

let dictionary: string[];

const initialize = async (event: MessageEvent): Promise<void> => {
  const [_dictionary, library] = event.data as [string[], string];

  dictionary = _dictionary;
  await import(/* @vite-ignore */ library);
  removeEventListener("message", initialize);
  addEventListener("message", work);
  postMessage("Worker is ready");
};

const work = (event: MessageEvent): void => {
  const [password, userInputs] = event.data as [string, string[]];

  const result = self.zxcvbn!(password, userInputs);
  postMessage(result);
};

addEventListener("message", initialize);
