import { assertStrictEquals, fail, unreachable } from "@std/assert";
import { Language } from "../mod.ts";

Deno.test("Language.is()", () => {
  assertStrictEquals(Language.is("en"), true);

  assertStrictEquals(Language.is("EN"), false);
  assertStrictEquals(Language.is("En"), false);
  assertStrictEquals(Language.is("eN"), false);
  assertStrictEquals(Language.is(""), false);

  assertStrictEquals(Language.is(null), false);
});

Deno.test("Language.assert()", () => {
  try {
    Language.assert("en", "test-1");
  } catch (exception) {
    fail((exception as Error).toString());
  }

  try {
    Language.assert("EN", "test-1");
    unreachable();
  } catch {
    //
  }
});

Deno.test("Language.propertiesOf()", () => {
  const e = Language.propertiesOf("en");
  assertStrictEquals(e?.alpha2, "en");
  assertStrictEquals(e?.alpha3, "eng");
  assertStrictEquals(e?.alpha3b, "eng");
  assertStrictEquals(e?.name, "English");
  assertStrictEquals(e?.private, false);
  assertStrictEquals(e?.scope, "individual");
  assertStrictEquals(e?.type, "living");

  const n = Language.propertiesOf("nl");
  assertStrictEquals(n?.alpha2, "nl");
  assertStrictEquals(n?.alpha3, "nld");
  assertStrictEquals(n?.alpha3b, "dut");
  assertStrictEquals(n?.name, "Dutch, Flemish");
  assertStrictEquals(n?.private, false);

  const q = Language.propertiesOf("qqz");
  assertStrictEquals(q?.alpha2, "");
  assertStrictEquals(q?.alpha3, "qqz");
  assertStrictEquals(q?.alpha3b, "qqz");
  assertStrictEquals(q?.name, "");
  assertStrictEquals(q?.private, true);
});
