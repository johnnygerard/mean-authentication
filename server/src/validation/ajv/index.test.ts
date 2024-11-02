import { faker } from "@faker-js/faker";
import { JTDParser } from "ajv/dist/types/index.js";
import { JTDSchemaType } from "ajv/dist/types/jtd-schema.js";
import assert from "node:assert/strict";
import { before, suite, test } from "node:test";
import { ajv } from "./index.js";

type Person = {
  fullName: string;
  isFamous: boolean;
};

const schema: JTDSchemaType<Person> = {
  properties: {
    fullName: { type: "string" },
    isFamous: { type: "boolean" },
  },
};

suite.only("ajv", () => {
  let parse: JTDParser<Person>;

  before(() => {
    parse = ajv.compileParser(schema);
  });

  test("parses valid data", () => {
    const person: Person = {
      fullName: faker.person.fullName(),
      isFamous: faker.datatype.boolean(),
    };

    const result = parse(JSON.stringify(person));

    assert.deepEqual(result, person);
    assert(!parse.message);
  });

  test("parses invalid data", () => {
    const invalidPerson = {
      fullName: faker.person.fullName(),
      isFamous: faker.datatype.boolean() ? "yes" : "no",
    };

    const result = parse(JSON.stringify(invalidPerson));

    assert(!result);
    assert(parse.message);
  });
});
