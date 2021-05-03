import * as assert from "assert";
import {
  containsProps,
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

suite("Extension Utils Tests for containsProps function", function () {
  test("Should return true when (not destructured) props are present in styled component with style object syntax", function () {
    const code =
      'const PropsExample = styled.div((props) => ({\n  [`${props.vertical ? "margin-top" : "margin-left"}`]: "1rem",\n  [`${props.vertical && "margin-top"}`]: "10px",\n  [`${props.primary && "color"}`]: "blue",\n  fontSize: "12px",\n  zIndex: 0,\n}));';
    const match = containsProps(code);

    assert.strictEqual(match, true);
  });

  test("Should return true when (not destructured) props are present in styled component css property using css backticks syntax", function () {
    const code =
      'const PropsExample = styled.div`\n  ${(props) => props.flex || "display: block"};\n  ${(props) => props.vertical && "flex-direction: column;"};\n`;';
    const match = containsProps(code);

    assert.strictEqual(match, true);
  });

  test("Should return true when (not destructured) props are present in styled component containing css value using css backticks syntax", function () {
    const code =
      'const PropsExample = styled.div`\n  color: ${(props) => (props.green ? "green" : "purple")};\n`;';
    const match = containsProps(code);

    assert.strictEqual(match, true);
  });

  test("Should return true when (not destructured) props are present in css property using css backticks syntax", function () {
    const code = '${(props) => props.vertical && "flex-direction: column;"};';
    const match = containsProps(code);

    assert.strictEqual(match, true);
  });

  test("Should return true when (not destructured) props are present in css value using css backticks syntax", function () {
    const code = 'color: ${(props) => (props.green ? "green" : "purple")};';
    const match = containsProps(code);

    assert.strictEqual(match, true);
  });

  test("Should return true when (not destructured) props are present in css property using css style object syntax", function () {
    const code = '[`${props.vertical ? "margin-top" : "margin-left"}`]: "1rem"';
    const match = containsProps(code);

    assert.strictEqual(match, true);
  });

  test("Should return false when no props are present in styled component", function () {
    const code =
      'const VariableExample = styled.div`\n  background-color: ${someVar};\n  ${someVar && "flex-direction: column;"};\n  ${anotherVar ? "margin-top" : "margin-left"}: 1rem;\n`;';
    const match = containsProps(code);

    assert.strictEqual(match, false);
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
