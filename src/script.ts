import scriptMap from "../dat/script_map.json" with { type: "json" };
import { script } from "./_.ts";
import { getScriptName } from "./utils.ts";

type _script = keyof typeof scriptMap;

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

export type Properties = {
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
};
//XXX dir,type,...

export function propertiesOf(
  script: script,
  nameLocale?: Intl.UnicodeBCP47LocaleIdentifier | Intl.Locale,
): Properties | null {
  if (is(script)) {
    const info = scriptMap[script as _script];

    return {
      alpha4: script,
      number: info[0] as number,
      name: getScriptName(script, nameLocale),
      pva: info[1] as string,
      private: info[2] as boolean,
    };
  }

  return null;
}
