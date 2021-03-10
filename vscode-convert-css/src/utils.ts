import { unitlessCssProperties } from "./unitlessCssProperties";

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

  let convertedCssProperty: string;
  let convertedCssValue: string;

  const convertedCode = cssLines
    .map((css) => {
      if (css === "") return;
      // regex match part between two characters: (?<=\:)(.*?)(?=\;) - https://stackoverflow.com/questions/1454913/regular-expression-to-find-a-string-included-between-two-characters-while-exclud
      const htmlTag = css.match(/^((?!\:|,|\.|@).)*(?={)/);
      // Match characters up to (but not including) {: /(.+|\.?)([:&\.,]+).+(?={)/ --> this will match css selectors,
      // like pseudo-selectors and classnames which need to be wrapped within quotes.
      const cssSelector = css.match(/(.+|\.?)([:&\.,@]+).+(?={)/);
      const closingTag = css.match(/}/);

      if (htmlTag) {
        return `${htmlTag[0].trim()}: {`;
      }

      if (cssSelector) {
        return `"${cssSelector[0].trim()}": {`;
      }

      if (closingTag) {
        return closingTag[0];
      }

      const cssProperty = css.match(/(?!&|:).+?(?=:)/);
      const cssValue = css.match(/(?<=:).*/);
      const unitlessCssValue = cssValue?.[0]
        .trimStart()
        .match(/^([+-]?([0-9]*)(\.([0-9]+))?)(?=;)/);

      // convert css property to camelcase
      if (cssProperty && cssProperty[0].includes("-")) {
        const cssPropertyParts = cssProperty[0].split("-");

        convertedCssProperty = toCamelCase(cssPropertyParts)
          .join(",")
          .replace(",", "");
      } else if (cssProperty) {
        convertedCssProperty = cssProperty[0];
      }

      // remove white space and ; from css value
      if (cssValue) {
        convertedCssValue = cssValue[0].trimStart().replace(";", "");
      }

      if (
        unitlessCssProperties.includes(convertedCssProperty.trim()) &&
        unitlessCssValue
      ) {
        return `${convertedCssProperty}: ${convertedCssValue},`;
      }
      return `${convertedCssProperty}: "${convertedCssValue}",`;
    })
    .join("\n");

  return convertedCode;
};

// convert camelcase to kebabcase: https://gist.github.com/nblackburn/875e6ff75bc8ce171c758bf75f304707
// const updatedCode = convertedCode
//   .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
//   .toLowerCase();
