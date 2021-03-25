import { unitlessCssProperties } from "./unitlessCssProperties";

export const matchStyledComponentFirstLine = (css: string) =>
  css.match(/(const )(.+)(= styled\.|styled\()(.+`)/);
export const matchStyledComponentLastLine = (css: string) => css.match(/`;$/);

export const convertStyledComponentFirstLine = (firstLine: string) =>
  firstLine.replace("`", "({");

export const convertStyledComponentLastLine = (lastLine: string) =>
  lastLine.replace("`", "})");

export const toCamelCase = (cssPropertyParts: string[]): string[] => {
  // remove hyphens and capitalize characters after hyphens (when index is not 0)
  return cssPropertyParts.map((propertyPart, index) =>
    index
      ? `${propertyPart.charAt(0).toUpperCase()}${propertyPart.slice(1)}`
      : propertyPart
  );
};

export const convertToStyleObject = (code: string): string => {
  const cssLines = code.split("\n");

  console.log({ code });

  let convertedCssProperty: string;
  let convertedCssValue: string;

  const convertedCode = cssLines
    .map((css) => {
      if (css === "") return;

      console.log({ css });

      const styledComponentFirstLine = matchStyledComponentFirstLine(css);
      const styledComponentLastLine = matchStyledComponentLastLine(css);

      // regex match part between two characters: (?<=\:)(.*?)(?=\;) - https://stackoverflow.com/questions/1454913/regular-expression-to-find-a-string-included-between-two-characters-while-exclud
      const htmlTag = css.match(/^((?!\:|,|\.|@|\$|>|~|\+|#).)*(?={)/);
      // Match characters up to (but not including) {: /(.+|\.?)([:&\.,]+).+(?={)/ --> this will match css selectors,
      // like pseudo-selectors and classnames which need to be wrapped within quotes.
      const cssSelector = css.match(
        /(.+|\.?)([:&\.,@,>,~,+,#]+).+(?<!\$)(?={)/
      );
      const closingTag = css.match(/^[^\$]*?}/);

      if (styledComponentFirstLine) {
        return convertStyledComponentFirstLine(styledComponentFirstLine[0]);
      }

      if (htmlTag) {
        return `${htmlTag[0].trim()}: {`;
      }

      if (cssSelector) {
        return `"${cssSelector[0].trim()}": {`;
      }

      if (closingTag) {
        return closingTag[0];
      }

      if (styledComponentLastLine) {
        return convertStyledComponentLastLine(styledComponentLastLine[0]);
      }

      const cssProperty = css.match(/(?!&|:).+?(?=:)/);
      const cssValue = css.match(/(?<=:).*/);
      const propsCssValue = cssValue?.[0].match(/(\${props).+(?=;)/);

      if (!cssProperty || !cssValue) {
        return;
      }

      const unitlessCssValue = cssValue?.[0]
        .trimStart()
        .match(/^([+-]?([0-9]*)(\.([0-9]+))?)(?=;)/);

      // convert css property to camelcase
      if (cssProperty && cssProperty[0].includes("-")) {
        const cssPropertyParts = cssProperty[0].split("-");

        convertedCssProperty = toCamelCase(cssPropertyParts)
          .join(",")
          .replace(/,/g, "");
      } else if (cssProperty) {
        convertedCssProperty = cssProperty[0];
      }

      // remove white space and ; from css value
      if (cssValue) {
        // cssValue containing props, like: ${props => props.primary};
        if (propsCssValue) {
          convertedCssValue = propsCssValue[0].replace(/\$|{|}|;/g, "");
        } else {
          convertedCssValue = cssValue[0].trim().replace(";", "");
        }
      }

      if (
        (unitlessCssProperties.includes(convertedCssProperty.trim()) &&
          unitlessCssValue) ||
        propsCssValue
      ) {
        return `${convertedCssProperty}: ${convertedCssValue},`;
      }
      return `${convertedCssProperty}: "${convertedCssValue}",`;
    })
    .join("\n");

  console.log({ convertedCode });

  return convertedCode;
};

// convert camelcase to kebabcase: https://gist.github.com/nblackburn/875e6ff75bc8ce171c758bf75f304707
// const updatedCode = convertedCode
//   .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
//   .toLowerCase();
