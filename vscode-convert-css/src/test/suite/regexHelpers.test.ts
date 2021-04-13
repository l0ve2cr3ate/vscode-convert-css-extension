import * as assert from "assert";
import {
  cssWithInterpolation,
  hasTernary,
  matchCssSelector,
  matchDestructuredProps,
  matchStyledComponentFirstLine,
  matchStyledComponentLastLine,
} from "../../utils";

suite("Tests for Extension Utils Regex", function () {
  test("Should match styled component first line", function () {
    const css = "const Button = styled.button`";
    const match = "const Button = styled.button`";

    const result = matchStyledComponentFirstLine(css);

    let matchResult;
    if (result) {
      matchResult = result[0];
    }

    assert.strictEqual(match, matchResult);
  });

  test("Should match styled component first line with typed props", function () {
    const css = "const Button = styled.button<ButtonProps>`";
    const match = "const Button = styled.button<ButtonProps>`";

    const result = matchStyledComponentFirstLine(css);

    let matchResult;
    if (result) {
      matchResult = result[0];
    }

    assert.strictEqual(match, matchResult);
  });

  test("Should match styled component first line styling another component", function () {
    const css = "const Button = styled(Btn)`";
    const match = "const Button = styled(Btn)`";
    const result = matchStyledComponentFirstLine(css);

    let matchResult;
    if (result) {
      matchResult = result[0];
    }

    assert.strictEqual(match, matchResult);
  });

  test("Should not match something that looks like styled component first line", function () {
    const css = "const Button = styledBtn)`";
    const match = null;
    const result = matchStyledComponentFirstLine(css);

    assert.strictEqual(match, result);
  });

  test("Should not match styled component first line with typo", function () {
    const css = "const Button = styled.(Btn)`";
    const match = null;
    const result = matchStyledComponentFirstLine(css);

    assert.strictEqual(match, result);
  });

  test("Should match styled component first line styling another component, with typed props", function () {
    const css = "const Button = styled(Btn)<ButtonProps>`";
    const match = "const Button = styled(Btn)<ButtonProps>`";

    const result = matchStyledComponentFirstLine(css);

    let matchResult;
    if (result) {
      matchResult = result[0];
    }

    assert.strictEqual(match, matchResult);
  });

  test("Should match styled component last line", function () {
    const css = "`;";
    const match = "`;";
    const result = matchStyledComponentLastLine(css);

    let matchResult;
    if (result) {
      matchResult = result[0];
    }

    assert.strictEqual(match, matchResult);
  });

  test("!!hasTernary should return true for css property with ternary", function () {
    const css =
      '${({ vertical }) => (vertical ? "margin-top" : "margin-left")}: 1rem;';

    assert.strictEqual(!!hasTernary(css), true);
  });

  test("!!hasTernary should return false for css with nullish coalescing operator", function () {
    const css = 'color: ${(props) => (props.primary ?? "purple")};';

    assert.strictEqual(!!hasTernary(css), false);
  });

  test("cssWithInterpolation should match for css value containing interpolation", function () {
    const cssValue = '${(props) => (props.primary ?? "purple")}';
    const match = cssWithInterpolation(cssValue);

    assert.strictEqual(cssValue, match?.[0]);
  });

  test("cssWithInterpolation should match for css value containing interpolation with destructured props", function () {
    const cssValue =
      '${({ destructeredProp }) => (destructeredProp ? "green" : "purple")}';
    const match = cssWithInterpolation(cssValue);

    assert.strictEqual(cssValue, match?.[0]);
  });

  test("cssWithInterpolation should match for css property containing interpolation", function () {
    const cssProperty =
      '${(props) => props.vertical && "flex-direction: column;"}';
    const match = cssWithInterpolation(cssProperty);

    assert.strictEqual(cssProperty, match?.[0]);
  });

  test("cssWithInterpolation should match for css property containing interpolation with destructured props", function () {
    const cssProperty =
      '${({ vertical }) => vertical && "flex-direction: column;"}';
    const match = cssWithInterpolation(cssProperty);

    assert.strictEqual(cssProperty, match?.[0]);
  });

  test("matchDestructuredProps should match destructured props in code fragment", function () {
    const code =
      'const DestructureTest = styled.div`\n  color: ${({ destructuredProp }) => (destructuredProp ? "green" : "purple")};\n  background-color: ${({ primary }) => (primary ? "white" : "gray")};\n`;';
    const destructuredProps = matchDestructuredProps(code);
    const match = ["destructuredProp", "primary"];

    assert.notStrictEqual(destructuredProps, match);
  });

  test("matchCssSelector should match single classname", function () {
    const css = ".name {";
    const match = ".name ";
    const result = matchCssSelector(css);

    assert.strictEqual(match, result?.[0]);
  });

  test("matchCssSelector should match multiple classnames", function () {
    const css = ".firstName, .lastName {";
    const match = ".firstName, .lastName ";
    const result = matchCssSelector(css);

    assert.strictEqual(match, result?.[0]);
  });

  test("matchCssSelector should match multiple htmlTags", function () {
    const css = "article a {";
    const match = "article a ";
    const result = matchCssSelector(css);

    assert.strictEqual(match, result?.[0]);
  });

  test("matchCssSelector should match pseudo-selector", function () {
    const css = "::before {";
    const match = "::before ";
    const result = matchCssSelector(css);

    assert.strictEqual(match, result?.[0]);
  });

  test("matchCssSelector should match child-selector", function () {
    const css = "> a {";
    const match = "> a ";
    const result = matchCssSelector(css);

    assert.strictEqual(match, result?.[0]);
  });
});