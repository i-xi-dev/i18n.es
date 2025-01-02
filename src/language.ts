import languageMap from "../dat/language_map.json" with {
  type: "json",
};
import { lang } from "./_.ts";
import { getLanguageName } from "./utils.ts";

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

  /** Localized name. */
  name: string;

  /** Reserved for local use */
  private: boolean;

  scope: Scope;

  type: Type;
};
//XXX individuals,...

function _scope(scopeCode: string): Scope {
  switch (scopeCode) {
    case "c":
      return Scope.COLLECTIVE;

    case "i":
      return Scope.INDIVIDUAL;

    case "p":
      return Scope.LOCAL;

    case "m":
      return Scope.MACROLANGUAGE;

    case "s":
      return Scope.SPECIAL;

    default:
      throw new Error("`language_map.json` is broken.");
  }
}

function _type(typeCode: string): Type {
  switch (typeCode) {
    case "c":
      return Type.CONSTRUCTED;

    case "x":
      return Type.EXTINCT;

    case "n":
      return Type.GENETIC;

    case "k":
      return Type.GENETIC_LIKE;

    case "r":
      return Type.GEOGRAPHIC;

    case "h":
      return Type.HISTORICAL;

    case "l":
      return Type.LIVING;

    case "s":
      return Type.SPECIAL;

    default:
      return Type.UNASSIGNED;
  }
}

export function propertiesOf(language: lang): Properties | null {
  if (is(language)) {
    const info = languageMap[language as _lang];
    const alpha3 = info[1] as string;
    const alpha3b = info[2] as string;
    const scopeCode = info[3] as string;
    const typeCode = info[4] as string;

    return {
      alpha2: info[0] as string,
      alpha3,
      alpha3b: (alpha3b.length > 0) ? alpha3b : alpha3,
      name: getLanguageName(language),
      private: (scopeCode === "p"),
      scope: _scope(scopeCode),
      type: _type(typeCode),
    };
  }

  return null;
}
