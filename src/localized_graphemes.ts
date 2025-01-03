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

export namespace LocalizedGraphemes {
  export type FromOptions = {
    locale?: string | Intl.Locale;
    //TODO normalize
    //TODO fallbackIfNotWellformed
  };

  // 分割はIntl.Segmenterに依存する
  // 孤立サロゲートは1書記素クラスターあつかいになるようだ
  export function fromString(
    value: string,
    options?: FromOptions,
  ): LocalizedGraphemes {
    assertString(value, "value");

    const { resolvedLocale, segments } = segmentGraphemes(
      value,
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
      value,
    });
  }
}
