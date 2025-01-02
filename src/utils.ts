import { language, region, script } from "./_.ts";
import { Basics } from "@i-xi-dev/type";

const { EMPTY: EMPTY_STRING, is: isString } = Basics.StringType;

const _FALLBACK = "en";

let _languageNameDictionary: Intl.DisplayNames | null = null;

// `nameLocale`省略時は`language`で良いのでは → getScriptName,getRegionNameと整合性が取れないのでやめる
export function getLanguageName(
  language: language,
  nameLocale: Intl.UnicodeBCP47LocaleIdentifier | Intl.Locale = _FALLBACK,
): string {
  const reuse = _languageNameDictionary &&
    _languageNameDictionary.resolvedOptions().locale !==
      (isString(nameLocale) ? nameLocale : nameLocale.baseName);

  if (reuse !== true) {
    _languageNameDictionary = new Intl.DisplayNames(nameLocale, {
      fallback: "none",
      //XXX languageDisplay,
      //XXX style,
      type: "language",
    });
  }

  return _languageNameDictionary?.of(language) ?? EMPTY_STRING;
}

let _scriptNameDictionary: Intl.DisplayNames | null = null;

export function getScriptName(
  script: script,
  nameLocale: Intl.UnicodeBCP47LocaleIdentifier | Intl.Locale = _FALLBACK,
): string {
  const reuse = _scriptNameDictionary &&
    _scriptNameDictionary.resolvedOptions().locale !==
      (isString(nameLocale) ? nameLocale : nameLocale.baseName);

  if (reuse !== true) {
    _scriptNameDictionary = new Intl.DisplayNames(nameLocale, {
      fallback: "none",
      //XXX style,
      type: "script",
    });
  }

  return _scriptNameDictionary?.of(script) ?? EMPTY_STRING;
}

let _regionNameDictionary: Intl.DisplayNames | null = null;

export function getRegionName(
  region: region,
  nameLocale: Intl.UnicodeBCP47LocaleIdentifier | Intl.Locale = _FALLBACK,
): string {
  const reuse = _regionNameDictionary &&
    _regionNameDictionary.resolvedOptions().locale !==
      (isString(nameLocale) ? nameLocale : nameLocale.baseName);

  if (reuse !== true) {
    _regionNameDictionary = new Intl.DisplayNames(nameLocale, {
      fallback: "none",
      //XXX style,
      type: "region",
    });
  }

  return _regionNameDictionary?.of(region) ?? EMPTY_STRING;
}
