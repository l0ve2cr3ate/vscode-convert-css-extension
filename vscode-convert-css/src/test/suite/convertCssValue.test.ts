import * as assert from "assert";
import { convertCssValue } from "../../utils/conversionHelpers";

suite("Extension Utils Tests for converting css value", function () {
  test("Should generate correct css converting css value without interpolation", function () {
    const cssValue = "12px;";
    const cssValueWithInterpolation = undefined;
    const cssValueWithInterpolationBackticks = undefined;
    const cssPropertyWithInterpolation = undefined;
    const result = "12px";
    const convertedCssValue = convertCssValue(
      cssValue,
      cssValueWithInterpolation,
      cssValueWithInterpolationBackticks,
      cssPropertyWithInterpolation
    );
    assert.strictEqual(result, convertedCssValue);
  });

  test("Should generate correct css converting css value with partial interpolation and partial css", function () {
    const cssValue = "1px solid ${borderColor}";
    const cssValueWithInterpolation = "1px solid ${borderColor}";
    const cssValueWithInterpolationBackticks = undefined;
    const cssPropertyWithInterpolation = undefined;
    const result = "`1px solid ${borderColor}`";
    const convertedCssValue = convertCssValue(
      cssValue,
      cssValueWithInterpolation,
      cssValueWithInterpolationBackticks,
      cssPropertyWithInterpolation
    );
    assert.strictEqual(result, convertedCssValue);
  });

  test("Should generate correct css converting css value with interpolation containing backticks and props", function () {
    const cssValue = "${(props) => `1px solid ${props.borderColor}`};";
    const cssValueWithInterpolation =
      "${(props) => `1px solid ${props.borderColor}`};";
    const cssValueWithInterpolationBackticks =
      "${(props) => `1px solid ${props.borderColor}`};";
    const cssPropertyWithInterpolation = undefined;
    const result = "`1px solid ${props.borderColor}`";
    const convertedCssValue = convertCssValue(
      cssValue,
      cssValueWithInterpolation,
      cssValueWithInterpolationBackticks,
      cssPropertyWithInterpolation
    );
    assert.strictEqual(result, convertedCssValue);
  });

  test("Should generate correct css converting css value containing interpolation function", function () {
    const cssValue = '${getColor("border")}';
    const cssValueWithInterpolation = '${getColor("border")}';
    const cssValueWithInterpolationBackticks = undefined;
    const cssPropertyWithInterpolation = undefined;
    const result = 'getColor("border")';
    const convertedCssValue = convertCssValue(
      cssValue,
      cssValueWithInterpolation,
      cssValueWithInterpolationBackticks,
      cssPropertyWithInterpolation
    );
    assert.strictEqual(result, convertedCssValue);
  });

  test("Should generate correct css converting css value when css interpolation property is present", function () {
    const cssValue = 'column;"}';
    const cssValueWithInterpolation = undefined;
    const cssValueWithInterpolationBackticks = undefined;
    const cssPropertyWithInterpolation =
      '${({ vertical }) => vertical && "flex-direction: column;"}';
    const result = "column";
    const convertedCssValue = convertCssValue(
      cssValue,
      cssValueWithInterpolation,
      cssValueWithInterpolationBackticks,
      cssPropertyWithInterpolation
    );
    assert.strictEqual(result, convertedCssValue);
  });
});
