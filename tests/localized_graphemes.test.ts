import { assertStrictEquals, assertThrows } from "@std/assert";
import { LocalizedGraphemes } from "../mod.ts";

function _iToS(iterable: Iterable<string | number>): string {
  return JSON.stringify([...iterable]);
}

Deno.test("LocalizedGraphemes.fromString()", () => {
  const g1 = LocalizedGraphemes.fromString("");
  assertStrictEquals(_iToS(g1.graphemes), `[]`);

  const g2 = LocalizedGraphemes.fromString("012");
  assertStrictEquals(_iToS(g2.graphemes), `["0","1","2"]`);

  const g3 = LocalizedGraphemes.fromString("あい");
  assertStrictEquals(_iToS(g3.graphemes), `["あ","い"]`);

  const g4 = LocalizedGraphemes.fromString("\u{2000B}");
  assertStrictEquals(_iToS(g4.graphemes), `["\u{2000B}"]`);

  const e1 = "`value` must be a `string`.";
  assertThrows(
    () => {
      LocalizedGraphemes.fromString(null as unknown as string, {
        allowMalformed: true,
      });
    },
    TypeError,
    e1,
  );

  const gx1 = LocalizedGraphemes.fromString("\u{dc0b}\u{d840}", {
    allowMalformed: true,
  });
  assertStrictEquals(_iToS(gx1.graphemes), `["\\udc0b","\\ud840"]`);

  const e2 = "`value` must be a `USVString`.";
  assertThrows(
    () => {
      LocalizedGraphemes.fromString(null as unknown as string);
    },
    TypeError,
    e2,
  );
  assertThrows(
    () => {
      LocalizedGraphemes.fromString("\u{dc0b}\u{d840}");
    },
    TypeError,
    e2,
  );

  const g5 = LocalizedGraphemes.fromString("0", { locale: "en" });
  assertStrictEquals(_iToS(g5.graphemes), `["0"]`);
  assertStrictEquals(g5.locale.baseName, "en");

  const g6 = LocalizedGraphemes.fromString("0", { locale: "en-US" });
  assertStrictEquals(_iToS(g6.graphemes), `["0"]`);
  assertStrictEquals(g6.locale.baseName, "en-US");

  const g7 = LocalizedGraphemes.fromString("0", { locale: "en-Latn-US" });
  assertStrictEquals(_iToS(g7.graphemes), `["0"]`);
  // assertStrictEquals(g7.locale.baseName, "en-Latn-US");

  const g8 = LocalizedGraphemes.fromString("0", { locale: "ja" });
  assertStrictEquals(_iToS(g8.graphemes), `["0"]`);
  assertStrictEquals(g8.locale.baseName, "ja");

  const g9 = LocalizedGraphemes.fromString("0", { locale: "ja-JP" });
  assertStrictEquals(_iToS(g9.graphemes), `["0"]`);
  assertStrictEquals(g9.locale.baseName, "ja-JP");

  const g10 = LocalizedGraphemes.fromString("0", { locale: "ja-Jpan-JP" });
  assertStrictEquals(_iToS(g10.graphemes), `["0"]`);
  // assertStrictEquals(g10.locale.baseName, "ja-Jpan-JP");

  const g11 = LocalizedGraphemes.fromString("g̈", { locale: "en" });
  assertStrictEquals(_iToS(g11.graphemes), `["\u0067\u0308"]`);

  const g12 = LocalizedGraphemes.fromString("각", { locale: "en" });
  assertStrictEquals(_iToS(g12.graphemes), `["\uAC01"]`);

  const g13 = LocalizedGraphemes.fromString("각", { locale: "en" });
  assertStrictEquals(_iToS(g13.graphemes), `["\u1100\u1161\u11A8"]`);

  const g14 = LocalizedGraphemes.fromString("ก", { locale: "en" });
  assertStrictEquals(_iToS(g14.graphemes), `["\u0E01"]`);

  const g15 = LocalizedGraphemes.fromString("நி", { locale: "en" });
  assertStrictEquals(_iToS(g15.graphemes), `["\u0BA8\u0BBF"]`);

  const g16 = LocalizedGraphemes.fromString("เ", { locale: "en" });
  assertStrictEquals(_iToS(g16.graphemes), `["\u0E40"]`);

  const g17 = LocalizedGraphemes.fromString("กำ", { locale: "en" });
  assertStrictEquals(_iToS(g17.graphemes), `["\u0E01\u0E33"]`);

  const g18 = LocalizedGraphemes.fromString("षि", { locale: "en" });
  assertStrictEquals(_iToS(g18.graphemes), `["\u0937\u093F"]`);

  const g19 = LocalizedGraphemes.fromString("क्षि", { locale: "en" });
  assertStrictEquals(_iToS(g19.graphemes), `["\u0915\u094D\u0937\u093F"]`);

  const g20 = LocalizedGraphemes.fromString("ำ", { locale: "en" });
  assertStrictEquals(_iToS(g20.graphemes), `["\u0E33"]`);

  const g21 = LocalizedGraphemes.fromString("ष", { locale: "en" });
  assertStrictEquals(_iToS(g21.graphemes), `["\u0937"]`);

  const g22 = LocalizedGraphemes.fromString("ि", { locale: "en" });
  assertStrictEquals(_iToS(g22.graphemes), `["\u093F"]`);

  const g23 = LocalizedGraphemes.fromString("ch", { locale: "en" });
  assertStrictEquals(_iToS(g23.graphemes), `["\u0063","\u0068"]`);

  // const g24 = LocalizedGraphemes.fromString("ch", { locale: "sk" });
  // assertStrictEquals(_iToS(g24.graphemes), `["\u0063\u0068"]`);

  const g25 = LocalizedGraphemes.fromString("kʷ", { locale: "en" });
  assertStrictEquals(_iToS(g25.graphemes), `["\u006B","\u02B7"]`);

  const g26 = LocalizedGraphemes.fromString("Ą́", { locale: "en" });
  assertStrictEquals(_iToS(g26.graphemes), `["\u0104\u0301"]`);

  const g27 = LocalizedGraphemes.fromString("𩸽が塚󠄁", { locale: "en" });
  assertStrictEquals(
    _iToS(g27.graphemes),
    `["\u{29E3D}","\u304b\u3099","\u585A\u{E0101}"]`,
  );

  const g27b = LocalizedGraphemes.fromString("𩸽が塚󠄁", {
    locale: "en",
    normalization: "NFC",
  });
  assertStrictEquals(
    _iToS(g27b.graphemes),
    `["\u{29E3D}","\u304C","\u585A\u{E0101}"]`,
  );
});
