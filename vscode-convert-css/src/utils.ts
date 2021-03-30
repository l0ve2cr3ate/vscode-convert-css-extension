import { unitlessCssProperties } from "./unitlessCssProperties";

export const matchStyledComponentFirstLine = (css: string) =>
  css.match(/(const )(.+)(= styled\.|styled\()([^\.|\(]+`)/);
export const matchStyledComponentLastLine = (css: string) => css.match(/`;$/);

export const convertStyledComponentFirstLine = (
  firstLine: string,
  containsProps: boolean
) => {
  if (containsProps) {
    return firstLine.replace("`", "(props => ({");
  }
  return firstLine.replace("`", "({");
};

export const convertStyledComponentLastLine = (
  lastLine: string,
  containsProps: boolean
) => {
  if (containsProps) {
    return lastLine.replace("`", "}))");
  }

  return lastLine.replace("`", "})");
};

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
  const containsProps: boolean = code.includes("props");

  const convertedCode = cssLines
    .map((css) => {
      if (css === "") return;

      console.log({ css });

      const styledComponentFirstLine = matchStyledComponentFirstLine(css);
      const styledComponentLastLine = matchStyledComponentLastLine(css);

      // regex match part between two characters: (?<=\:)(.*?)(?=\;) - https://stackoverflow.com/questions/1454913/regular-expression-to-find-a-string-included-between-two-characters-while-exclud
      const htmlTag = css.match(/^((?!\:|,|\.|@|\$|>|~|\+|#)[a-z])*(\s?)(?={)/);
      // Match characters up to (but not including) {: /(.+|\.?)([:&\.,]+).+(?={)/ --> this will match css selectors,
      // like pseudo-selectors and classnames which need to be wrapped within quotes.
      const cssSelector = css.match(
        /(.+|\.?)([:&\.,@,>,~,+,#]|(\s[a-z]\s?)+).+(?<!\$)(?={)/
      );
      const closingTag = css.match(/^[^\$]*?}/);

      if (styledComponentFirstLine) {
        return convertStyledComponentFirstLine(
          styledComponentFirstLine[0],
          containsProps
        );
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
        return convertStyledComponentLastLine(
          styledComponentLastLine[0],
          containsProps
        );
      }

      const cssProperty = css.match(/(?!&|:).+?(?=:)/);
      const cssValue = css.match(/(?<=:).*/);
      const propsCssValue = cssValue?.[0].match(/(props\.).+(?=})/);

      console.log({cssProperty})
      console.log({cssValue})

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

      if (cssValue) {
        // cssValue containing props, like: ${props => props.primary};
        if (propsCssValue) {
          convertedCssValue = propsCssValue[0];
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
