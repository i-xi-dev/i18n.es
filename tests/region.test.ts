import { assertStrictEquals, fail, unreachable } from "@std/assert";
import { Region } from "../mod.ts";

Deno.test("Region.is()", () => {
  assertStrictEquals(Region.is("US"), true);

  assertStrictEquals(Region.is("us"), false);
  assertStrictEquals(Region.is("USS"), false);
  assertStrictEquals(Region.is("Us"), false);
  assertStrictEquals(Region.is("uS"), false);
  assertStrictEquals(Region.is(""), false);

  assertStrictEquals(Region.is(null), false);
});

Deno.test("Region.assert()", () => {
  try {
    Region.assert("US", "test-1");
  } catch (exception) {
    fail((exception as Error).toString());
  }

  try {
    Region.assert("us", "test-1");
    unreachable();
  } catch {
    //
  }
});

Deno.test("Region.propertiesOf()", () => {
  const l = Region.propertiesOf("US");
  assertStrictEquals(l?.alpha2, "US");
  assertStrictEquals(l?.number, 840);
  assertStrictEquals(l?.alpha3, "USA");
  assertStrictEquals(l?.name, "United States of America (the)");
  assertStrictEquals(l?.private, false);

  const q = Region.propertiesOf("XX");
  assertStrictEquals(q?.alpha2, "XX");
  assertStrictEquals(q?.number, Number.NaN);
  assertStrictEquals(q?.alpha3, "");
  assertStrictEquals(q?.name, "");
  assertStrictEquals(q?.private, true);
});
