import { Basics, Text } from "@i-xi-dev/type";
import { grapheme } from "./_.ts";
import { segmentGraphemes } from "./utils.ts";

const { assert: assertString } = Basics.StringType;
const { assert: assertRuneSequence } = Text.RuneSequence;

export interface GraphemeSequence {
  locale: Intl.Locale;
  graphemes: grapheme[];
  value: string;
  //TODO isBelongToScripts(),
}

const _NormalizationForms = ["NFC", "NFD", "NFKC", "NFKD"] as const;

type _NormalizationForm = typeof _NormalizationForms[number];

export namespace GraphemeSequence {
  export type FromOptions = {
    allowMalformed?: boolean;
    locale?: string | Intl.Locale;
    normalization?: _NormalizationForm;
  };

  // 分割はIntl.Segmenterに依存する
  // 孤立サロゲートは1書記素クラスターあつかいになるようだ
  export function fromString(
    value: string,
    options?: FromOptions,
  ): GraphemeSequence {
    if (options?.allowMalformed === true) {
      assertString(value, "value");
    } else {
      assertRuneSequence(value, "value");
    }

    let normalized = value;
    if (
      _NormalizationForms.includes(options?.normalization as _NormalizationForm)
    ) {
      normalized = normalized.normalize(options?.normalization);
    }

    const { resolvedLocale, segments } = segmentGraphemes(
      normalized,
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
      value: normalized,
    });
  }
}
