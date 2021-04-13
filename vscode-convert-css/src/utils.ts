import { unitlessCssProperties } from "./unitlessCssProperties";

let quote: "single" | "double" = "double";

export const matchStyledComponentFirstLine = (css: string) =>
  css.match(/(const )(.+)(= styled\.|styled\()([^\.|\(]+`)/);
export const matchStyledComponentLastLine = (css: string) => css.match(/`;$/);

export const matchDestructuredProps = (code: string) =>
  code.match(/(?<=\({\s?)([a-z-A-Z]+)(}\))?/g);

// regex match part between two characters: (?<=\:)(.*?)(?=\;) - https://stackoverflow.com/questions/1454913/regular-expression-to-find-a-string-included-between-two-characters-while-exclud
export const matchSingleHtmlTag = (css: string) =>
  css.match(/^((?!\:|,|\.|@|\$|>|~|\+|#)[a-z])*(\s?)(?={)/)?.[0];

export const matchCssSelector = (css: string) =>
  css.match(/(.+|\.?)([:&\.,@,>,~,+,#]|(\s?[a-z]+\s?))\s?[a-z]+\s?(?={)/);

export const hasTernary = (css: string) => css.match(/\s\?\s/g);

export const cssWithInterpolation = (css: string | undefined) =>
  css?.match(/^(\${).+(})/);

export const convertStyledComponentFirstLine = (
  firstLine: string,
  containsProps: boolean,
  destructuredProps: RegExpMatchArray | null
) => {
  if (containsProps) {
    return firstLine.replace("`", "(props => ({");
  } else if (destructuredProps) {
    if (destructuredProps.length === 1) {
      return firstLine.replace("`", `(({ ${destructuredProps} }) => ({`);
    }
    return firstLine.replace(
      "`",
      `(({ ${destructuredProps.join().replace(",", ", ")} }) => ({`
    );
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

export const convertInterpolationProperty = (
  css: string,
  hasTernary: boolean
) => {
  if (!hasTernary) {
    css = css.split(":")?.[0];
  }

  const convertedCssProperty = css.replace(
    /(?<=\${)(.*?)(=>\s?)|\(props\) => |\(|\)/g,
    ""
  );

  return hasTernary
    ? `[\`${convertedCssProperty}\`]`
    : `[\`${convertedCssProperty}\"}\`]`;
};

export const toCamelCase = (cssPropertyParts: string[]): string[] => {
  // remove hyphens and capitalize characters after hyphens (when index is not 0)
  return cssPropertyParts.map((propertyPart, index) =>
    index
      ? `${propertyPart.charAt(0).toUpperCase()}${propertyPart.slice(1)}`
      : propertyPart
  );
};

export const wrapWithQuotes = (value: string) => {
  if (quote === "double") {
    return `"${value}"`;
  }

  if (quote === "single") {
    return `'${value}'`;
  }
};

export const convertCssSelector = (css: string, singleHtmlTag?: boolean) => {
  if (singleHtmlTag) {
    return `${css.trim()}: {`;
  }
  return `${wrapWithQuotes(css.trim())}: {`;
};

export const convertToStyleObject = (code: string): string => {
  const cssLines = code.split("\n");

  console.log({ code });

  let convertedCssProperty: string;
  let convertedCssValue: string;
  const containsProps: boolean = code.includes("props");
  const destructuredProps: RegExpMatchArray | null = matchDestructuredProps(
    code
  );

  const convertedCode = cssLines
    .map((css) => {
      if (css === "") return;

      console.log({ css });

      const styledComponentFirstLine = matchStyledComponentFirstLine(css);
      const styledComponentLastLine = matchStyledComponentLastLine(css);

      const singleHtmlTag = matchSingleHtmlTag(css);
      const cssSelector = matchCssSelector(css);
      const closingTag = css.match(/^[^\$]*?}/);

      if (styledComponentFirstLine) {
        return convertStyledComponentFirstLine(
          styledComponentFirstLine[0],
          containsProps,
          destructuredProps
        );
      }

      if (singleHtmlTag) {
        return convertCssSelector(singleHtmlTag, true);
      }

      if (cssSelector) {
        return convertCssSelector(cssSelector[0]);
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

      const cssPropertyWithInterpolation = cssWithInterpolation(css);
      const cssProperty = css.match(/(?!&|:).+?(?=:)/);
      // (?:.(?!:))+$ will match only part after last colon, while (?<=:).* matches part after first colon.
      const cssValue = cssPropertyWithInterpolation
        ? css.match(/(?:.(?<!:))+$/)
        : css.match(/(?<=:).*/);
      const cssValueWithInterpolation = cssWithInterpolation(
        cssValue?.[0]?.trim()
      );

      console.log({ cssPropertyWithInterpolation });
      console.log({ cssProperty });
      console.log({ cssValue });

      if (!cssProperty || !cssValue) {
        return;
      }

      const unitlessCssValue = cssValue?.[0]
        .trimStart()
        .match(/^([+-]?([0-9]*)(\.([0-9]+))?)(?=;)/);

      if (cssPropertyWithInterpolation) {
        convertedCssProperty = convertInterpolationProperty(
          cssPropertyWithInterpolation[0],
          !!hasTernary(cssPropertyWithInterpolation[0])
        );
      }
      // convert css property to camelcase
      else if (cssProperty && cssProperty[0].includes("-")) {
        const cssPropertyParts = cssProperty[0].split("-");

        convertedCssProperty = toCamelCase(cssPropertyParts)
          .join(",")
          .replace(/,/g, "");
      } else if (cssProperty) {
        convertedCssProperty = cssProperty[0];
      }

      console.log({ cssValueWithInterpolation });

      if (cssValue) {
        // cssValue containing interpolation function, like: ${props => props.primary};
        if (cssValueWithInterpolation) {
          convertedCssValue = cssValueWithInterpolation[0].replace(
            /(?=\${)(.*?)(=>\s?)|(\${\(?props\)\s?=>\s?\(?)|\(|\)|}|/g,
            ""
          );
        }
        // if interpolation Property and no ternary, remove }; from css value.
        else if (
          cssPropertyWithInterpolation &&
          !hasTernary(cssPropertyWithInterpolation?.[0])
        ) {
          convertedCssValue = cssValue[0]
            .trim()
            .replace(/(;?)("?)('?)(}?)/g, "");
        } else {
          convertedCssValue = cssValue[0].trim().replace(";", "");
        }
      }

      if (
        (unitlessCssProperties.includes(convertedCssProperty.trim()) &&
          unitlessCssValue) ||
        cssValueWithInterpolation
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
