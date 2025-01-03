import {
  assertStrictEquals,
  assertThrows,
  fail,
  unreachable,
} from "@std/assert";
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

Deno.test("Script.of()", () => {
  const l = Script.of("Latn");
  assertStrictEquals(l?.alpha4, "Latn");
  assertStrictEquals(l?.number, 215);
  assertStrictEquals(l?.name, "Latin");
  assertStrictEquals(l?.pva, "Latin");
  assertStrictEquals(l?.private, false);

  // const l2 = Script.of("Latn", "ja");
  // assertStrictEquals(l2?.name, "ラテン文字"); 環境依存

  const s = Script.of("Zsym");
  assertStrictEquals(s?.alpha4, "Zsym");
  assertStrictEquals(s?.number, 996);
  assertStrictEquals(s?.name, "Symbols");
  assertStrictEquals(s?.pva, "");
  assertStrictEquals(s?.private, false);

  const q = Script.of("Qabc");
  assertStrictEquals(q?.alpha4, "Qabc");
  assertStrictEquals(q?.number, 928);
  assertStrictEquals(q?.name, "");
  assertStrictEquals(q?.pva, "");
  assertStrictEquals(q?.private, true);
});

Deno.test("Script/includes()", () => {
  const k = Script.of("Kana");
  const h = Script.of("Hira");
  const l = Script.of("Latn");
  //const lc = Script.of(["Latn", "Zyyy"]);
  const lc = Script.of("Zyyy");

  const opEx = { excludeScx: true } as const;

  assertStrictEquals(k?.includes("ア"), true);
  assertStrictEquals(h?.includes("ア"), false);
  assertStrictEquals(k?.includes("ア", opEx), true);
  assertStrictEquals(h?.includes("ア", opEx), false);

  assertStrictEquals(k?.includes("あ"), false);
  assertStrictEquals(h?.includes("あ"), true);
  assertStrictEquals(k?.includes("あ", opEx), false);
  assertStrictEquals(h?.includes("あ", opEx), true);

  assertStrictEquals(k?.includes("ー"), true);
  assertStrictEquals(h?.includes("ー"), true);
  assertStrictEquals(k?.includes("ー", opEx), false);
  assertStrictEquals(h?.includes("ー", opEx), false);

  assertStrictEquals(l?.includes(""), false);
  assertStrictEquals(l?.includes("a"), true);
  assertStrictEquals(l?.includes("aa"), false);
  assertStrictEquals(l?.includes("1"), false);

  assertStrictEquals(lc?.includes(""), false);
  assertStrictEquals(lc?.includes("a"), false);
  assertStrictEquals(lc?.includes("aa"), false);
  assertStrictEquals(lc?.includes("1"), true);

  assertStrictEquals(l?.includes(null as unknown as "0"), false);

  assertThrows(
    () => {
      Script.of("Zsym")?.includes("a");
    },
    RangeError,
    "`Zsym` is not supported in Unicode property.",
  );
});

Deno.test("Script/includesAll()", () => {
  const k = Script.of("Kana");
  const h = Script.of("Hira");
  const l = Script.of("Latn");
  //const lc = Script.of(["Latn", "Zyyy"]);
  const lc = Script.of("Zyyy");

  const opEx = { excludeScx: true } as const;

  assertStrictEquals(k?.includesAll("ア"), true);
  assertStrictEquals(h?.includesAll("ア"), false);
  assertStrictEquals(k?.includesAll("ア", opEx), true);
  assertStrictEquals(h?.includesAll("ア", opEx), false);

  assertStrictEquals(k?.includesAll("あ"), false);
  assertStrictEquals(h?.includesAll("あ"), true);
  assertStrictEquals(k?.includesAll("あ", opEx), false);
  assertStrictEquals(h?.includesAll("あ", opEx), true);

  assertStrictEquals(k?.includesAll("ー"), true);
  assertStrictEquals(h?.includesAll("ー"), true);
  assertStrictEquals(k?.includesAll("ー", opEx), false);
  assertStrictEquals(h?.includesAll("ー", opEx), false);

  assertStrictEquals(k?.includesAll("か\u3099"), false);
  assertStrictEquals(h?.includesAll("か\u3099"), true);
  assertStrictEquals(k?.includesAll("か\u3099", opEx), false);
  assertStrictEquals(h?.includesAll("か\u3099", opEx), false);

  assertStrictEquals(k?.includesAll("カ\u3099"), true);
  assertStrictEquals(h?.includesAll("カ\u3099"), false);
  assertStrictEquals(k?.includesAll("カ\u3099", opEx), false);
  assertStrictEquals(h?.includesAll("カ\u3099", opEx), false);

  assertStrictEquals(l?.includesAll(""), true);
  assertStrictEquals(l?.includesAll("a"), true);
  assertStrictEquals(l?.includesAll("aa"), true);
  assertStrictEquals(l?.includesAll("1aa"), false);
  assertStrictEquals(l?.includesAll("a1a"), false);
  assertStrictEquals(l?.includesAll("aa1"), false);
  assertStrictEquals(l?.includesAll("aaa"), true);

  assertStrictEquals(l?.includesAll("", opEx), true);
  assertStrictEquals(l?.includesAll("a", opEx), true);
  assertStrictEquals(l?.includesAll("aa", opEx), true);
  assertStrictEquals(l?.includesAll("1aa", opEx), false);
  assertStrictEquals(l?.includesAll("a1a", opEx), false);
  assertStrictEquals(l?.includesAll("aa1", opEx), false);
  assertStrictEquals(l?.includesAll("aaa", opEx), true);

  assertStrictEquals(lc?.includesAll("", opEx), true);
  assertStrictEquals(lc?.includesAll("a", opEx), false);
  assertStrictEquals(lc?.includesAll("aa", opEx), false);
  assertStrictEquals(lc?.includesAll("1aa", opEx), false);
  assertStrictEquals(lc?.includesAll("a1a", opEx), false);
  assertStrictEquals(lc?.includesAll("aa1", opEx), false);
  assertStrictEquals(lc?.includesAll("aaa", opEx), false);

  assertStrictEquals(l?.includesAll(null as unknown as "0"), false);

  assertThrows(
    () => {
      Script.of("Zsym")?.includesAll("a");
    },
    RangeError,
    "`Zsym` is not supported in Unicode property.",
  );
});
