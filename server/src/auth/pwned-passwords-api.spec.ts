import { isPasswordExposed } from "./pwned-passwords-api.js";
import { faker } from "@faker-js/faker";

fdescribe("The isPasswordExposed function", () => {
  it("should return true for a leaked password", async () => {
    const password = getLeakedPassword();
    await expectAsync(isPasswordExposed(password)).toBeResolvedTo(true);
  });

  it("should return false for a secure password", async () => {
    const password = faker.internet.password();
    await expectAsync(isPasswordExposed(password)).toBeResolvedTo(false);
  });
});

const getLeakedPassword = (): string => {
  const index = faker.number.int({ max: leakedPasswords.length - 1 });
  return leakedPasswords[index];
};

/**
 * List of 100 leaked passwords
 * @see https://github.com/danielmiessler/SecLists/blob/master/Passwords/Leaked-Databases/NordVPN.txt
 */
const leakedPasswords = [
  "011584wb",
  "0148068885",
  "0235842035",
  "03953538",
  "040191flo",
  "043222933",
  "0508rabbit88",
  "051004Cami",
  "06012005d",
  "1026steven8",
  "10393Ravens52",
  "1048050I",
  "10Vournl",
  "111126688",
  "1111oo11",
  "121200kk",
  "123213nba",
  "1234567Ks123",
  "12345cmt",
  "12345ecg",
  "1234test",
  "124103817",
  "12characters",
  "12qwaszx",
  "12tigers",
  "1415126t",
  "1468d1991bc",
  "15201204",
  "15975338",
  "15Feb1944",
  "15af5c3d4a",
  "18436572",
  "19871006",
  "1994.098",
  "199743had",
  "19june2004",
  "1Antysecas",
  "1Q2w3e4r",
  "1Qaz2wsx",
  "1at39jg4MTM",
  "1g2baMFm",
  "1love2hate",
  "1newpass2",
  "1o7tOr91",
  "1of12JOEjoe",
  "1ofakind",
  "1onenewman",
  "1qa2ws3ed",
  "1savage1",
  "1t2o3b4i5a6s",
  "1zeyA846",
  "2000Cbr600",
  "20042004",
  "200801121",
  "20701868",
  "224756am",
  "2391ndst",
  "23rmitkb",
  "2405love",
  "25Isaac25",
  "270brk44",
  "27ollerct",
  "32555110",
  "336477188",
  "3367amorc",
  "36250629Za",
  "3634819zhang",
  "39x9DRxL",
  "3awhitby",
  "3uhuuezvd",
  "406Mainst",
  "412497samloo",
  "440709380",
  "49rhino44",
  "4character",
  "4e5ftvkp",
  "4f2f69af",
  "4l0a6n8k6",
  "4lt415um",
  "4mytrouble",
  "503mrpelon",
  "50833000",
  "52lini4t",
  "54321Tbag",
  "5avril1996",
  "5eraphim",
  "643tmxdr48",
  "671987Rr",
  "69cougar",
  "753159aS",
  "78677867a",
  "7912Bethany",
  "79264833pc",
  "798465132741lL",
  "804139aq",
  "84lumber",
  "86transam",
  "89poiu89",
  "8d8swybas",
  "90945414",
];
