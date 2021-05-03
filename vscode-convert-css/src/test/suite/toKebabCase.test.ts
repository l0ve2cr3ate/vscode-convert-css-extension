import * as assert from "assert";
import { toKebabCase } from "../../utils/conversionHelpers";

suite("Extension Utils Tests for converting to kebabCase", function () {
  test("Should generate correct kebabCase for css property font-weight", function () {
    const cssProperty = "fontWeight";
    const kebabCaseProperty = "font-weight";
    const convertedProperty = toKebabCase(cssProperty);

    assert.strictEqual(kebabCaseProperty, convertedProperty);
  });

  test("Should generate correct kebabCase for css property z-index", function () {
    const cssProperty = "zIndex";
    const kebabCaseProperty = "z-index";
    const convertedProperty = toKebabCase(cssProperty);

    assert.strictEqual(kebabCaseProperty, convertedProperty);
  });

  test("Should generate correct kebabCase for css property grid-template-rows", function () {
    const cssProperty = "gridTemplateRows";
    const kebabCaseProperty = "grid-template-rows";
    const convertedProperty = toKebabCase(cssProperty);

    assert.strictEqual(kebabCaseProperty, convertedProperty);
  });

  test("Should generate correct kebabCase for css vendor prefix -webkit-transition", function () {
    const cssProperty = "WebkitTransition";
    const kebabCasePrefix = "-webkit-transition";
    const convertedProperty = toKebabCase(cssProperty);

    assert.strictEqual(kebabCasePrefix, convertedProperty);
  });
});
