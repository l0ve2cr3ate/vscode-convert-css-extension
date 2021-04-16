import * as assert from "assert";
import { convertCssProperty } from "../../utils/conversionHelpers";

suite("Extension Utils Tests for converting css property]", function () {
  test("Should generate correct css converting css property", function () {
    const cssPropertyWithInterpolation = undefined;
    const cssProperty = "  color";
    const result = "  color";
    const convertedCssProperty = convertCssProperty(
      cssPropertyWithInterpolation,
      cssProperty
    );
    assert.strictEqual(result, convertedCssProperty);
  });

  test("Should generate correct css converting css property which contains hyphens", function () {
    const cssPropertyWithInterpolation = undefined;
    const cssProperty = "  flex-direction";
    const result = "  flexDirection";
    const convertedCssProperty = convertCssProperty(
      cssPropertyWithInterpolation,
      cssProperty
    );
    assert.strictEqual(result, convertedCssProperty);
  });

  test("Should generate correct css converting css property which contains multiple hyphens", function () {
    const cssPropertyWithInterpolation = undefined;
    const cssProperty = "  grid-template-columns";
    const result = "  gridTemplateColumns";
    const convertedCssProperty = convertCssProperty(
      cssPropertyWithInterpolation,
      cssProperty
    );
    assert.strictEqual(result, convertedCssProperty);
  });

  test("Should correctly convert css property containing vendor prefix", function () {
    const cssPropertyWithInterpolation = undefined;
    const cssProperty = "-webkit-background-clip";
    const result = "WebkitBackgroundClip";
    const convertedCssProperty = convertCssProperty(
      cssPropertyWithInterpolation,
      cssProperty
    );
    assert.strictEqual(result, convertedCssProperty);
  });

  test("Should generate correct css converting css property whith props", function () {
    const cssPropertyWithInterpolation =
      '${(props) => props.flex || "display: block"}';
    const cssProperty = '${(props) => props.flex || "display';
    const result = '[`${props.flex || "display"}`]';
    const convertedCssProperty = convertCssProperty(
      cssPropertyWithInterpolation,
      cssProperty
    );
    assert.strictEqual(result, convertedCssProperty);
  });

  test("Should generate correct css converting css property whith desctructured props", function () {
    const cssPropertyWithInterpolation =
      '${({ vertical }) => vertical && "flex-direction: column;"}';
    const cssProperty = '  ${({ vertical }) => vertical && "flex-direction';
    const result = '[`${vertical && "flex-direction"}`]';
    const convertedCssProperty = convertCssProperty(
      cssPropertyWithInterpolation,
      cssProperty
    );
    assert.strictEqual(result, convertedCssProperty);
  });

  test("Should convert css property containing variable correctly", function () {
    const cssPropertyWithInterpolation =
      '${someVar ? "margin-top" : "margin-left"}';
    const cssProperty = '  ${someVar ? "margin-top" ';
    const result = '[`${someVar ? "margin-top" : "margin-left"}`]';
    const convertedCssProperty = convertCssProperty(
      cssPropertyWithInterpolation,
      cssProperty
    );
    assert.strictEqual(result, convertedCssProperty);
  });
});
