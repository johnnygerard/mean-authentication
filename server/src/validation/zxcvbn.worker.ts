import zxcvbn from "zxcvbn";

export default (args: Parameters<typeof zxcvbn>) => zxcvbn(...args);
