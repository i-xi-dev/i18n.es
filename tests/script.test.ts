import { assertStrictEquals, fail, unreachable } from "@std/assert";
import { Script } from "../mod.ts";

Deno.test("Script.is()", () => {
  assertStrictEquals(Script.is("Latn"), true);

  assertStrictEquals(Script.is("Aaaaa"), false);
  assertStrictEquals(Script.is("Aaa"), false);
  assertStrictEquals(Script.is("AAAA"), false);
  assertStrictEquals(Script.is(""), false);

  assertStrictEquals(Script.is(null), false);
});

Deno.test("Script.assert()", () => {
  try {
    Script.assert("Latn", "test-1");
    Script.assert("Zxxx", "test-1");
  } catch (exception) {
    fail((exception as Error).toString());
  }

  try {
    Script.assert("Aaaaa", "test-1");
    unreachable();
  } catch {
    //
  }
});

Deno.test("Script.propertiesOf()", () => {
  const l = Script.propertiesOf("Latn");
  assertStrictEquals(l?.alpha4, "Latn");
  assertStrictEquals(l?.number, 215);
  assertStrictEquals(l?.name, "Latin");
  assertStrictEquals(l?.pva, "Latin");
  assertStrictEquals(l?.private, false);

  // const l2 = Script.propertiesOf("Latn", "ja");
  // assertStrictEquals(l2?.name, "ラテン文字"); 環境依存

  const s = Script.propertiesOf("Zsym");
  assertStrictEquals(s?.alpha4, "Zsym");
  assertStrictEquals(s?.number, 996);
  assertStrictEquals(s?.name, "Symbols");
  assertStrictEquals(s?.pva, "");
  assertStrictEquals(s?.private, false);

  const q = Script.propertiesOf("Qabc");
  assertStrictEquals(q?.alpha4, "Qabc");
  assertStrictEquals(q?.number, 928);
  assertStrictEquals(q?.name, "");
  assertStrictEquals(q?.pva, "");
  assertStrictEquals(q?.private, true);
});
