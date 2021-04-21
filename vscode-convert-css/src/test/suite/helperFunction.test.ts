import * as assert from "assert";
import {
  getProps,
  isUnitlessCssProperty,
  removeDuplicates,
  wrapWithQuotes,
} from "../../utils/conversionHelpers";
import { unitlessCssProperties } from "../../utils/unitlessCssProperties";

suite("Extension Utils Tests for wrapWithQuotes function", function () {
  test("Should wrap css within quotes", function () {
    const css = `.firstName, .lastName`;
    const result = `".firstName, .lastName"`;
    const convertedCss = wrapWithQuotes(css);

    assert.strictEqual(result, convertedCss);
  });
});

suite("Extension Utils Tests for removeDuplicates function", function () {
  test("Should remove duplicate values", function () {
    const duplicates = ["someProp", "someProp", "anotherProp"];
    const withoutDuplicates = ["someProp", "anotherProp"];
    const deduplicatedArr = removeDuplicates(duplicates);

    assert.deepStrictEqual(withoutDuplicates, deduplicatedArr);
  });
});

suite("Extension Utils Tests for getProps function", function () {
  test("Should return the correct props of the styled component as object", function () {
    const containsProps = true;
    const destructuredProps = ["someProp", "anotherProp"];
    const props = getProps(containsProps, destructuredProps);
    const result = {
      containsProps: true,
      destructuredProps: ["someProp", "anotherProp"],
    };

    assert.deepStrictEqual(props, result);
  });

  test("Should return the correct props of the styled component when only containing destructured props as object", function () {
    const containsProps = false;
    const destructuredProps = ["prop", "anotherProp"];
    const props = getProps(containsProps, destructuredProps);
    const result = {
      containsProps: false,
      destructuredProps: ["prop", "anotherProp"],
    };

    assert.deepStrictEqual(props, result);
  });

  suite(
    "Extension Utils Tests for isUnitlessCssProperty function",
    function () {
      test("Should return true for unitless css property", function () {
        const cssProperty = `zIndex`;
        const result = isUnitlessCssProperty(
          unitlessCssProperties,
          cssProperty
        );

        assert.strictEqual(result, true);
      });

      test("Should return false for css properties with units", function () {
        const cssProperty = `fontSize`;
        const result = isUnitlessCssProperty(
          unitlessCssProperties,
          cssProperty
        );

        assert.strictEqual(result, false);
      });
    }
  );
});
