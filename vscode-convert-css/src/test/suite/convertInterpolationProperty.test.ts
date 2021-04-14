import * as assert from "assert";
import { convertInterpolationProperty } from "../../utils/conversionHelpers";

suite(
  "Tests for Extension Utils convert css interpolation property function",
  function () {
    test("Should correctly convert css property when interpolation function contains both css property and value", function () {
      const interpolationProperty =
        '${(props) => props.vertical && "flex-direction: column;"};';
      const result = '[`${props.vertical && "flex-direction"}`]';

      const convertedProperty = convertInterpolationProperty(
        interpolationProperty,
        false
      );

      assert.strictEqual(result, convertedProperty);
    });

    test("Should correctly convert css property when interpolation function contains ternairy", function () {
      const interpolationProperty =
        '${(props) => (props.vertical ? "margin-top": "margin-left")}';
      const result = '[`${props.vertical ? "margin-top": "margin-left"}`]';

      const convertedProperty = convertInterpolationProperty(
        interpolationProperty,
        true
      );

      assert.strictEqual(result, convertedProperty);
    });

    test("Should correctly convert css property when interpolation function contains destructured props", function () {
      const interpolationProperty =
        '${({ vertical }) => vertical && "flex-direction: column;"};';
      const result = '[`${vertical && "flex-direction"}`]';

      const convertedProperty = convertInterpolationProperty(
        interpolationProperty,
        false
      );

      assert.strictEqual(result, convertedProperty);
    });

    test("Should correctly convert css property when interpolation function contains destructured props and ternary", function () {
      const interpolationProperty =
        '${({ vertical }) => (vertical ? "margin-top" : "margin-left")}';
      const result = '[`${vertical ? "margin-top" : "margin-left"}`]';

      const convertedProperty = convertInterpolationProperty(
        interpolationProperty,
        true
      );

      assert.strictEqual(result, convertedProperty);
    });

    test("Should correctly convert css property when interpolation function contains variable", function () {
      const interpolationProperty = '${someVar ? "margin-top" : "margin-left"}';
      const result = '[`${someVar ? "margin-top" : "margin-left"}`]';

      const convertedProperty = convertInterpolationProperty(
        interpolationProperty,
        true
      );

      assert.strictEqual(result, convertedProperty);
    });
  }
);
