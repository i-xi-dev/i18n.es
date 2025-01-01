import languageMap from "../dat/language_map.json" with {
  type: "json",
};
import { lang } from "./_.ts";

type _lang = keyof typeof languageMap;

// RFC 5646の言語サブタグであるか否か
export function is(test: unknown): test is lang {
  // RFC 5646の言語サブタグは、ISO 639-1 alpha2があればそれ。ISO 639-2 alpha3があればそれ。B/Tが異なる場合Tがそれ。
  // よってここでは、is("eng")はfalseとなる
  return Object.keys(languageMap).includes(test as string);
}

export function assert(test: unknown, label: string): void {
  if (is(test) !== true) {
    throw new TypeError(
      `\`${label}\` must be an ISO 639-1 language alpha-2 code or ISO 639-2 language alpha-3 code.`,
    );
  }
}

const Scope = {
  COLLECTIVE: "collective",
  INDIVIDUAL: "individual",
  LOCAL: "local",
  MACROLANGUAGE: "macrolanguage",
  SPECIAL: "special",
} as const;

export type Scope = typeof Scope[keyof typeof Scope];

const Type = {
  CONSTRUCTED: "constructed",
  EXTINCT: "extinct",
  GENETIC: "genetic",
  GENETIC_LIKE: "genetic-like",
  GEOGRAPHIC: "geographic",
  HISTORICAL: "historical",
  LIVING: "living",
  SPECIAL: "special",
  UNASSIGNED: "",
} as const;

export type Type = typeof Type[keyof typeof Type];

export type Properties = {
  /** ISO 639 Set-1 Alpha-2 code. */
  alpha2: string;

  /** ISO 639 Set-2(T)/3/5 Alpha-3 code. */
  alpha3: string;

  /** ISO 639 Set-2(B) Alpha-3 code. */
  alpha3b: string;

  /** ISO 639 English name. */
  name: string;

  /** Reserved for local use */
  private: boolean;

  scope: Scope;

  type: Type;
};
//XXX individuals,...

export function propertiesOf(language: lang): Properties | null {
  if (is(language)) {
    const info = languageMap[language as _lang];
    const alpha3 = info[1] as string;
    const alpha3b = info[2] as string;
    const scopeCode = info[4] as string;
    const typeCode = info[5] as string;
    let scope: Scope;
    switch (scopeCode) {
      case "c":
        scope = Scope.COLLECTIVE;
        break;
      case "i":
        scope = Scope.INDIVIDUAL;
        break;
      case "p":
        scope = Scope.LOCAL;
        break;
      case "m":
        scope = Scope.MACROLANGUAGE;
        break;
      case "s":
        scope = Scope.SPECIAL;
        break;
      default:
        throw new Error("`language_map.json` is broken.");
    }

    let type: Type;
    switch (typeCode) {
      case "c":
        type = Type.CONSTRUCTED;
        break;
      case "x":
        type = Type.EXTINCT;
        break;
      case "n":
        type = Type.GENETIC;
        break;
      case "k":
        type = Type.GENETIC_LIKE;
        break;
      case "r":
        type = Type.GEOGRAPHIC;
        break;
      case "h":
        type = Type.HISTORICAL;
        break;
      case "l":
        type = Type.LIVING;
        break;
      case "s":
        type = Type.SPECIAL;
        break;
      default:
        type = Type.UNASSIGNED;
        break;
    }

    return {
      alpha2: info[0] as string,
      alpha3,
      alpha3b: (alpha3b.length > 0) ? alpha3b : alpha3,
      name: info[3] as string,
      private: (scopeCode === "p"),
      scope,
      type,
    };
  }

  return null;
}
