import { grapheme } from "./_.ts";
import { segmentGraphemes } from "./utils.ts";
import { Basics } from "@i-xi-dev/type";

const { assert: assertString } = Basics.StringType;

export interface LocalizedGraphemes {
  locale: Intl.Locale;
  graphemes: grapheme[];
  value: string;
  //TODO isBelongToScripts(),
}

const _NormalizationForms = ["NFC", "NFD", "NFKC", "NFKD"] as const;

type _NormalizationForm = typeof _NormalizationForms[number];

export namespace LocalizedGraphemes {
  export type FromOptions = {
    locale?: string | Intl.Locale;
    normalization?: _NormalizationForm;
    //TODO fallbackIfNotWellformed
  };

  // 分割はIntl.Segmenterに依存する
  // 孤立サロゲートは1書記素クラスターあつかいになるようだ
  export function fromString(
    value: string,
    options?: FromOptions,
  ): LocalizedGraphemes {
    assertString(value, "value");
    let target = value;

    if (
      _NormalizationForms.includes(options?.normalization as _NormalizationForm)
    ) {
      target = target.normalize(options?.normalization);
    }

    const { resolvedLocale, segments } = segmentGraphemes(
      target,
      options?.locale,
    );
    const locale = new Intl.Locale(resolvedLocale);
    const graphemes = [...(function* () {
      for (const segment of segments) {
        yield segment.segment;
      }
    })()];

    return Object.freeze({
      locale,
      graphemes,
      value: target,
    });
  }
}
