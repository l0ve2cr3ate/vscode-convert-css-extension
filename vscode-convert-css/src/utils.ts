export const toCamelCase = (cssPropertyParts: string[]): string[] => {
  // remove hyphens and capitalize characters after hyphens (when index is not 0)
  return cssPropertyParts.map((propertyPart, index) =>
    index
      ? `${propertyPart.charAt(0).toUpperCase()}${propertyPart.slice(1)}`
      : propertyPart
  );
};

export const convertToStyleObject = (code: string): string => {
  const cssPropertyValuePairs = code.split("\n");

  let convertedCssProperty: string;
  let convertedCssValue: string;

  const convertedCode = cssPropertyValuePairs
    .map((css) => {
      if (css === "") return;
      // regex to match characters up until certain character(s): https://stackoverflow.com/questions/7124778/how-to-match-anything-up-until-this-sequence-of-characters-in-a-regular-expres
      // regex to get part before : /.+?(?=:)/
      // regex to get part after : /(?<=:).*/
      // regex match part between two characters: (?<=\:)(.*?)(?=\;) - https://stackoverflow.com/questions/1454913/regular-expression-to-find-a-string-included-between-two-characters-while-exclud
      const cssProperty = css.match(/.+?(?=:)/);
      const cssValue = css.match(/(?<=:).*/);

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

      return `${convertedCssProperty}: "${convertedCssValue}",`;
    })
    .join("\n");

  return convertedCode;
};

// convert camelcase to kebabcase: https://gist.github.com/nblackburn/875e6ff75bc8ce171c758bf75f304707
// const updatedCode = convertedCode
//   .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
//   .toLowerCase();
