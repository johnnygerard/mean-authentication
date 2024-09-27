/** @type {string[]} */
let dictionary;

/**
 * Validate the password's strength and send the result back to the parent worker
 * @param {MessageEvent} event
 */
const validatePassword = (event) => {
  const [password, userInputs] = event.data;
  const result = self.zxcvbn(password, userInputs.concat(dictionary));

  self.postMessage(result);
};

/**
 * Initialize the worker
 * @param {MessageEvent} event
 */
const initialize = async (event) => {
  dictionary = event.data["dictionary"];
  await import(event.data["libraryBlobUrl"]);
  self.removeEventListener("message", initialize);
  self.addEventListener("message", validatePassword);
};

self.addEventListener("message", initialize);
