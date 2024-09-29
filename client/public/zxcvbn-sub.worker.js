/** @type {string[]} */
let dictionary;
let dictionaryLength = 0;

const getDictionary = (userInputs) => {
  // Remove previous user inputs by truncating the dictionary
  dictionary.length = dictionaryLength;

  dictionary.push(...userInputs);
  return dictionary;
};

/**
 * Validate the password's strength and send the result back to the parent worker
 * @param {MessageEvent} event
 */
const validatePassword = (event) => {
  const [password, userInputs] = event.data;
  const result = self.zxcvbn(password, getDictionary(userInputs));

  self.postMessage(result);
};

/**
 * Initialize the worker
 * @param {MessageEvent} event
 */
const initialize = async (event) => {
  dictionary = event.data["dictionary"];
  dictionaryLength = dictionary.length;
  await import(event.data["libraryBlobUrl"]);
  self.removeEventListener("message", initialize);
  self.addEventListener("message", validatePassword);
  self.postMessage("ready");
};

self.addEventListener("message", initialize);
