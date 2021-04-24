import { unitlessCssProperties } from "./unitlessCssProperties";
import {
  matchCssPropertyWithInterpolation,
  hasTernary,
  matchClosingTag,
  matchCssProperty,
  matchCssSelector,
  matchCssValueWithInterpolation,
  matchDestructuredProps,
  matchSingleHtmlTag,
  matchStyledComponentFirstLine,
  matchStyledComponentLastLine,
  matchInterpolationWithBackticks,
  startsAndEndsWithInterpolation,
  matchCssValue,
  isUnitlessCssValue,
} from "./regexHelpers";

let quote: "single" | "double" = "double";

export type Props = {
  containsProps: boolean;
  destructuredProps: RegExpMatchArray | null;
};

export const convertStyledComponentFirstLine = (
  firstLine: string,
  props: Props
) => {
  const { containsProps, destructuredProps } = props;
  if (containsProps && destructuredProps) {
    return firstLine.replace(
      "`",
      `(({ ${destructuredProps.join().replace(",", ", ")}, ...props }) => ({`
    );
  } else if (containsProps) {
    return firstLine.replace("`", "(props => ({");
  } else if (destructuredProps) {
    return firstLine.replace(
      "`",
      `(({ ${destructuredProps.join().replace(",", ", ")} }) => ({`
    );
  }
  return firstLine.replace("`", "({");
};

export const convertStyledComponentLastLine = (
  lastLine: string,
  props: Props
) => {
  const { containsProps, destructuredProps } = props;
  if (containsProps || destructuredProps) {
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

export const removeDuplicates = (arr: any[] | null) => {
  if (arr) {
    return [...new Set(...[arr])];
  }
  return null;
};

export const getProps = (
  containsProps: boolean,
  destructuredProps: RegExpMatchArray | null
) => ({
  containsProps,
  destructuredProps,
});

export const isUnitlessCssProperty = (
  unitlessCssProperties: string[],
  cssProperty: string
) => unitlessCssProperties.includes(cssProperty);

export const convertCssProperty = (
  cssPropertyWithInterpolation: string | undefined,
  cssProperty: string | undefined
) => {
  if (cssPropertyWithInterpolation) {
    return convertInterpolationProperty(
      cssPropertyWithInterpolation,
      hasTernary(cssPropertyWithInterpolation)
    );
  }
  // convert css property to camelcase
  else if (cssProperty?.includes("-")) {
    const cssPropertyParts = cssProperty.split("-");

    return toCamelCase(cssPropertyParts).join(",").replace(/,/g, "");
  } else if (cssProperty) {
    return cssProperty;
  }
};

export const convertCssSelector = (css: string, singleHtmlTag?: boolean) => {
  if (singleHtmlTag) {
    return `${css.trim()}: {`;
  }
  return `${wrapWithQuotes(css.trim())}: {`;
};

export const convertCssValue = (
  cssValue: string,
  cssValueWithInterpolation: string | undefined,
  cssValueWithInterpolationBackticks: string | undefined,
  cssPropertyWithInterpolation: string | undefined
) => {
  // cssValue containing interpolation function, like: ${props => props.primary};
  if (cssValueWithInterpolation) {
    // check for css syntax like: 1px solid ${borderColor};
    if (!startsAndEndsWithInterpolation(cssValueWithInterpolation.trim())) {
      return `\`${cssValueWithInterpolation}\``;
      // check for syntax like: border: ${(props) => `1px solid ${props.borderColor}`};
    } else if (cssValueWithInterpolationBackticks) {
      return cssValueWithInterpolationBackticks.replace(
        /(?=\${)(.*?)(=>\s?)|(\${\(?props\)\s?=>\s?\(?)|(};?\s*?)$/g,
        ""
      );
    } else {
      return cssValueWithInterpolation
        .replace(
          /(?=\${)(.*?)(=>\s?\()([a-zA-Z0-9,.,?,\",\s,:]+)\)?|(?=\${)(.*?)(=>\s?\(?)/,
          "$3"
        )
        .replace(/^(\${)|(}?;?\s*?)$/g, "");
    }
  }
  // if interpolation property and no ternary, remove }; from css value.
  else if (
    cssPropertyWithInterpolation &&
    !hasTernary(cssPropertyWithInterpolation)
  ) {
    return cssValue.trim().replace(/(;?)("?)('?)(}?)/g, "");
  } else {
    return cssValue.trim().replace(";", "");
  }
};

export const convertToStyleObject = (code: string): string => {
  const cssLines = code.split("\n");

  console.log({ code });

  const containsProps: boolean = code.includes("props");
  const destructuredProps: RegExpMatchArray | null = removeDuplicates(
    matchDestructuredProps(code)
  );

  const props = getProps(containsProps, destructuredProps);

  const convertedCode = cssLines
    .map((css) => {
      if (css === "") return;

      console.log({ css });

      const styledComponentFirstLine = matchStyledComponentFirstLine(css);
      const styledComponentLastLine = matchStyledComponentLastLine(css);

      const singleHtmlTag = matchSingleHtmlTag(css.trimStart());
      const cssSelector = matchCssSelector(css);
      const closingTag = matchClosingTag(css);

      if (styledComponentFirstLine) {
        return convertStyledComponentFirstLine(styledComponentFirstLine, props);
      }

      if (singleHtmlTag) {
        return convertCssSelector(singleHtmlTag, true);
      }

      console.log({ singleHtmlTag });
      console.log({ cssSelector });

      if (cssSelector) {
        return convertCssSelector(cssSelector);
      }

      if (closingTag) {
        return `${closingTag},`;
      }

      if (styledComponentLastLine) {
        return convertStyledComponentLastLine(styledComponentLastLine, props);
      }

      const cssPropertyWithInterpolation = matchCssPropertyWithInterpolation(
        css.trim()
      );
      const cssProperty = matchCssProperty(css);

      const cssValue = matchCssValue(css, !!cssPropertyWithInterpolation);
      const cssValueWithInterpolation = matchCssValueWithInterpolation(css);
      const cssValueWithInterpolationBackticks = matchInterpolationWithBackticks(
        css
      );

      console.log({ cssPropertyWithInterpolation });
      console.log({ cssProperty });
      console.log({ cssValue });

      if (!cssProperty || !cssValue) {
        return;
      }

      const convertedCssProperty = convertCssProperty(
        cssPropertyWithInterpolation,
        cssProperty
      );

      const unitlessCssValue = isUnitlessCssValue(cssValue);
      const unitlessCssProperty = isUnitlessCssProperty(
        unitlessCssProperties,
        convertedCssProperty!.trim()
      );

      console.log({ cssValueWithInterpolation });

      const convertedCssValue = convertCssValue(
        cssValue,
        cssValueWithInterpolation,
        cssValueWithInterpolationBackticks,
        cssPropertyWithInterpolation
      );

      if (
        (unitlessCssProperty && unitlessCssValue) ||
        cssValueWithInterpolation
      ) {
        return `${convertedCssProperty}: ${convertedCssValue},`;
      }
      return `${convertedCssProperty}: ${wrapWithQuotes(convertedCssValue)},`;
    })
    .join("\n");

  console.log({ convertedCode });

  return convertedCode;
};

// convert camelcase to kebabcase: https://gist.github.com/nblackburn/875e6ff75bc8ce171c758bf75f304707
// const updatedCode = convertedCode
//   .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
//   .toLowerCase();
