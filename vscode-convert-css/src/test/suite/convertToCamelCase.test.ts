import * as assert from "assert";
import { toCamelCase } from "../../utils/conversionHelpers";

suite("Extension Utils Tests for converting to camelCase", function () {
  test("Should generate correct camelCase for css property font-weight", function () {
    const cssProperty = ["font-weight"];
    const camelCaseProperty = "fontWeight";
    const cssPropertyParts = cssProperty[0].split("-");
    const convertedProperty = toCamelCase(cssPropertyParts)
      .join(",")
      .replace(/,/g, "");

    assert.strictEqual(camelCaseProperty, convertedProperty);
  });

  test("Should generate correct camelCase for css property z-index", function () {
    const cssProperty = ["z-index"];
    const camelCaseProperty = "zIndex";
    const cssPropertyParts = cssProperty[0].split("-");
    const convertedProperty = toCamelCase(cssPropertyParts)
      .join(",")
      .replace(/,/g, "");

    assert.strictEqual(camelCaseProperty, convertedProperty);
  });

  test("Should generate correct camelCase for css property grid-template-rows", function () {
    const cssProperty = ["grid-template-rows"];
    const camelCaseProperty = "gridTemplateRows";
    const cssPropertyParts = cssProperty[0].split("-");
    const convertedProperty = toCamelCase(cssPropertyParts)
      .join(",")
      .replace(/,/g, "");

    assert.strictEqual(camelCaseProperty, convertedProperty);
  });

  test("Should generate correct camelCase for css vendor prefix -webkit-transition", function () {
    const cssProperty = ["-webkit-transition"];
    const camelCasePrefix = "WebkitTransition";
    const cssPropertyParts = cssProperty[0].split("-");
    const convertedProperty = toCamelCase(cssPropertyParts)
      .join(",")
      .replace(/,/g, "");

    assert.strictEqual(camelCasePrefix, convertedProperty);
  });
});
