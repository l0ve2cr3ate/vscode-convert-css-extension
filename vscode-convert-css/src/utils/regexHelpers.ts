export const matchStyledComponentFirstLine = (css: string) =>
  css.match(/(const )(.+)(= styled\.|styled\()([^\.|\(]+`)/)?.[0];
export const matchStyledComponentLastLine = (css: string) =>
  css.match(/`;$/)?.[0];

export const matchDestructuredProps = (code: string) =>
  code.match(/(?<=\({\s?)([a-z-A-Z]+)(}\))?/g);

// regex match part between two characters: (?<=\:)(.*?)(?=\;) - https://stackoverflow.com/questions/1454913/regular-expression-to-find-a-string-included-between-two-characters-while-exclud
export const matchSingleHtmlTag = (css: string) =>
  css.match(/^((?!\:|,|\.|@|\$|>|~|\+|#)[a-z])*(\s?)(?={)/)?.[0];

export const matchCssSelector = (css: string) =>
  css.match(/(.+|\.?)([:&\.,@,>,~,+,#]|(\s?[a-z]+\s?))\s?[a-z]+\s?(?={)/)?.[0];

export const hasTernary = (css: string) => css.match(/\s\?\s/g)?.length === 1;

export const cssWithInterpolation = (css: string | undefined) =>
  css?.match(/^(\${).+(})/)?.[0];
