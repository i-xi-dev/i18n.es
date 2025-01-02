import scriptMap from "../dat/script_map.json" with { type: "json" };
import { getScriptName } from "./utils.ts";
import { rune, script, usvstring } from "./_.ts";
import { Text } from "@i-xi-dev/type";

const { is: isRune } = Text.Rune;
const { is: isRuneSequence } = Text.RuneSequence;

type _script = keyof typeof scriptMap;

export interface Script {
  /** ISO 15924 Alpha-4 code. */
  alpha4: string;

  /** ISO 15924 Numeric code. */
  number: number;

  /** Localized name. */
  name: string;

  /** UCD alias. */
  pva: string;

  /** Reserved for private use */
  private: boolean;

  includes(rune: rune, options?: Script.IncludesOptions): rune is rune;
  includesAll(
    runeSequence: usvstring,
    options?: Script.IncludesOptions,
  ): runeSequence is usvstring;
}
//XXX dir,type,...

function _scriptToPattern(
  script: script,
  options?: Script.IncludesOptions,
): string {
  const or = [];
  or.push(`\\p{sc=${script}}`);
  if (options?.excludeScx !== true) {
    or.push(`\\p{scx=${script}}`);
  }
  return or.join("|");
}

function _includesRune(
  rune: rune,
  script: script,
  options?: Script.IncludesOptions,
): boolean {
  if (isRune(rune) !== true) {
    return false;
  }

  const pattern = _scriptToPattern(script, options);

  try {
    return (new RegExp(`^(?:${pattern})$`, "v")).test(rune);
  } catch {
    throw new RangeError(`\`${script}\` is not supported in Unicode property.`);
  }
}

function _includesRuneSequence(
  runeSequence: usvstring,
  script: script,
  options?: Script.IncludesOptions,
): boolean {
  if (isRuneSequence(runeSequence) !== true) {
    return false;
  }

  const pattern = _scriptToPattern(script, options);

  try {
    return (new RegExp(`^(?:${pattern})*$`, "v")).test(runeSequence);
  } catch {
    throw new RangeError(`\`${script}\` is not supported in Unicode property.`);
  }
}

export namespace Script {
  export function is(test: unknown): test is script {
    return Object.keys(scriptMap).includes(test as string);
  }

  export function assert(test: unknown, label: string): void {
    if (is(test) !== true) {
      throw new TypeError(
        `\`${label}\` must be an ISO 15924 script alpha-4 code.`,
      );
    }
  }

  export type IncludesOptions = {
    excludeScx?: boolean;
  };

  export function of(
    script: script,
    nameLocale?: Intl.UnicodeBCP47LocaleIdentifier | Intl.Locale,
  ): Script | null {
    if (is(script)) {
      const info = scriptMap[script as _script];

      return Object.freeze({
        alpha4: script,
        number: info[0] as number,
        name: getScriptName(script, nameLocale),
        pva: info[1] as string,
        private: info[2] as boolean,
        includes: (rune: rune, options?: IncludesOptions): rune is rune =>
          _includesRune(rune, script, options),
        includesAll: (
          runeSequence: usvstring,
          options?: Script.IncludesOptions,
        ): runeSequence is usvstring =>
          _includesRuneSequence(runeSequence, script, options),
      });
    }

    return null;
  }
}
