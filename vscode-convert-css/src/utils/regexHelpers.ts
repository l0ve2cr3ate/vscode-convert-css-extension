export const matchStyledComponentFirstLine = (css: string) =>
  css.match(/(const )(.+)(= styled\.|styled\()([^\.|\(]+`)/)?.[0];
export const matchStyledComponentLastLine = (css: string) =>
  css.match(/`;$/)?.[0];

export const matchDestructuredProps = (code: string) =>
  code.match(/(?<=\({\s?)([a-z-A-Z]+)(}\))?/g);

// regex match part between two characters: (?<=\:)(.*?)(?=\;) - https://stackoverflow.com/questions/1454913/regular-expression-to-find-a-string-included-between-two-characters-while-exclud
export const matchSingleHtmlTag = (css: string) =>
  css.match(/^((?!\:|,|\.|@|\$|>|~|\+|#)[a-z])*(\s?)(?={)/g)?.[0];

export const matchCssSelector = (css: string) =>
  css.match(/(.+|\.?)([:&\.,@,>,~,+,#]|(\s?[a-z]+\s?))\s?[a-z]*\s?(?={)/)?.[0];

export const hasTernary = (css: string) => css.match(/\s\?\s/g)?.length === 1;

export const matchCssPropertyWithInterpolation = (css: string) =>
  css?.match(/^(\${).+(})/)?.[0];

export const matchCssValueWithInterpolation = (css: string) =>
  css.match(/(?<=:\s).*(\${).+(})/)?.[0];

// partial interpolation, partial css containing backticks, for syntax like: ${(props) => `1px solid ${props.borderColor}`}
export const matchInterpolationWithBackticks = (css: string) =>
  css.match(/(\${).+(\${).+(})/)?.[0];

export const startsAndEndsWithInterpolation = (css: string) =>
  css.match(/^(\${).+(};?\s?)$/g)?.length === 1;

export const matchClosingTag = (css: string) => css.match(/^[^\$]*?}/)?.[0];

export const matchCssProperty = (css: string) =>
  css.match(/(?!&|:).+?(?=:)/)?.[0];

// (?:.(?!:))+$ will match only part after last colon, while (?<=:).* matches part after first colon.
export const matchCssValue = (
  css: string,
  cssPropertyWithInterpolation: boolean
) =>
  cssPropertyWithInterpolation
    ? css.match(/(?:.(?<!:))+$/)?.[0]
    : css.match(/(?<=:).*/)?.[0];

export const isUnitlessCssValue = (cssValue: string) =>
  cssValue?.trimStart().match(/^([+-]?([0-9]*)(\.([0-9]+))?)(?=;)/g)?.length ===
  1;
