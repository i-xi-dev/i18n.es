import { script } from "./_.ts";

let _scriptNameDictionary: Intl.DisplayNames | null = null;

//TODO import
function isString(test: unknown): test is string {
  return (typeof test === "string");
}

//TODO import
const EMPTY_STRING = "";

export function getScriptName(
  script: script,
  nameLocale: Intl.UnicodeBCP47LocaleIdentifier | Intl.Locale = "en",
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
