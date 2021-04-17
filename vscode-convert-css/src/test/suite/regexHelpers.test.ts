import * as assert from "assert";
import {
  matchCssPropertyWithInterpolation,
  hasTernary,
  matchClosingTag,
  matchCssProperty,
  matchCssSelector,
  matchDestructuredProps,
  matchSingleHtmlTag,
  matchStyledComponentFirstLine,
  matchStyledComponentLastLine,
  matchCssValueWithInterpolation,
} from "../../utils/regexHelpers";

suite(
  "Tests for Extension Utils Regex matchStyledComponentFirstLine ",
  function () {
    test("Should match styled component first line", function () {
      const css = "const Button = styled.button`";
      const match = "const Button = styled.button`";

      const result = matchStyledComponentFirstLine(css);

      assert.strictEqual(match, result);
    });

    test("Should match styled component first line with typed props", function () {
      const css = "const Button = styled.button<ButtonProps>`";
      const match = "const Button = styled.button<ButtonProps>`";

      const result = matchStyledComponentFirstLine(css);

      assert.strictEqual(match, result);
    });

    test("Should match styled component first line styling another component", function () {
      const css = "const Button = styled(Btn)`";
      const match = "const Button = styled(Btn)`";
      const result = matchStyledComponentFirstLine(css);

      assert.strictEqual(match, result);
    });

    test("Should not match something that looks like styled component first line", function () {
      const css = "const Button = styledBtn)`";
      const match = undefined;
      const result = matchStyledComponentFirstLine(css);

      assert.strictEqual(match, result);
    });

    test("Should not match styled component first line with typo", function () {
      const css = "const Button = styled.(Btn)`";
      const match = undefined;
      const result = matchStyledComponentFirstLine(css);

      assert.strictEqual(match, result);
    });

    test("Should match styled component first line styling another component, with typed props", function () {
      const css = "const Button = styled(Btn)<ButtonProps>`";
      const match = "const Button = styled(Btn)<ButtonProps>`";

      const result = matchStyledComponentFirstLine(css);

      assert.strictEqual(match, result);
    });
  }
);

suite(
  "Tests for Extension Utils Regex matchStyledComponentLastLine ",
  function () {
    test("Should match styled component last line", function () {
      const css = "`;";
      const match = "`;";
      const result = matchStyledComponentLastLine(css);

      assert.strictEqual(match, result);
    });
  }
);

suite("Tests for Extension Utils Regex hasTernary", function () {
  test("hasTernary should return true for css property with ternary", function () {
    const css =
      '${({ vertical }) => (vertical ? "margin-top" : "margin-left")}: 1rem;';

    assert.strictEqual(hasTernary(css), true);
  });

  test("hasTernary should return false for css with nullish coalescing operator", function () {
    const css = 'color: ${(props) => (props.primary ?? "purple")};';

    assert.strictEqual(hasTernary(css), false);
  });
});

suite("Tests for Extension Utils Regex matchCssProperty", function () {
  test("matchCssProperty should match css property", function () {
    const css =
      'color: ${({ destructeredProp }) => (destructeredProp ? "green" : "purple")};';
    const result = matchCssProperty(css);
    const match = "color";

    assert.strictEqual(match, result);
  });
  test("matchCssProperty should match vendor prefix css property", function () {
    const css = "-webkit-background-clip: text;";
    const result = matchCssProperty(css);
    const match = "-webkit-background-clip";

    assert.strictEqual(match, result);
  });

  test("matchCssProperty should match css property with containing hyphens", function () {
    const css = "  grid-template-columns: 60px 60px;";
    const result = matchCssProperty(css);
    const match = "  grid-template-columns";

    assert.strictEqual(match, result);
  });
});

suite(
  "Tests for Extension Utils Regex cssPropertyWithInterpolation",
  function () {
    test("cssPropertyWithInterpolation should match for css property containing interpolation", function () {
      const cssProperty =
        '${(props) => props.vertical && "flex-direction: column;"}';
      const match = matchCssPropertyWithInterpolation(cssProperty);

      assert.strictEqual(cssProperty, match);
    });

    test("cssPropertyWithInterpolation should match for css property containing interpolation with destructured props", function () {
      const cssProperty =
        '${({ vertical }) => vertical && "flex-direction: column;"}';
      const match = matchCssPropertyWithInterpolation(cssProperty);

      assert.strictEqual(cssProperty, match);
    });
  }
);

suite("Tests for Extension Utils Regex matchDestructuredProps", function () {
  test("matchDestructuredProps should match destructured props in code fragment", function () {
    const code =
      'const DestructureTest = styled.div`\n  color: ${({ destructuredProp }) => (destructuredProp ? "green" : "purple")};\n  background-color: ${({ primary }) => (primary ? "white" : "gray")};\n`;';
    const destructuredProps = matchDestructuredProps(code);
    const match = ["destructuredProp", "primary"];

    assert.deepStrictEqual(destructuredProps, match);
  });
});

suite("Tests for Extension Utils Regex matchCssSelector", function () {
  test("matchCssSelector should match single classname", function () {
    const css = ".name {";
    const match = ".name ";
    const result = matchCssSelector(css);

    assert.strictEqual(match, result);
  });

  test("matchCssSelector should match multiple classnames", function () {
    const css = ".firstName, .lastName {";
    const match = ".firstName, .lastName ";
    const result = matchCssSelector(css);

    assert.strictEqual(match, result);
  });

  test("matchCssSelector should match multiple htmlTags", function () {
    const css = "article a {";
    const match = "article a ";
    const result = matchCssSelector(css);

    assert.strictEqual(match, result);
  });

  test("matchCssSelector should match pseudo-selector", function () {
    const css = "::before {";
    const match = "::before ";
    const result = matchCssSelector(css);

    assert.strictEqual(match, result);
  });

  test("matchCssSelector should match child-selector", function () {
    const css = "> a {";
    const match = "> a ";
    const result = matchCssSelector(css);

    assert.strictEqual(match, result);
  });
});

suite("Tests for Extension Utils Regex matchSingleHtmlTag", function () {
  test("matchSingleHtmlTag should match single html tag", function () {
    const css = "article {";
    const match = "article ";
    const result = matchSingleHtmlTag(css);

    assert.strictEqual(match, result);
  });

  test("matchSingleHtmlTag should not match multiple html tags", function () {
    const css = "article a {";
    const match = undefined;
    const result = matchSingleHtmlTag(css);

    assert.strictEqual(match, result);
  });

  test("matchSingleHtmlTag should not match classname", function () {
    const css = ".firstname {";
    const match = undefined;
    const result = matchSingleHtmlTag(css);

    assert.strictEqual(match, result);
  });

  test("matchSingleHtmlTag should not match pseudo-selector", function () {
    const css = "&::placeholder {";
    const match = undefined;
    const result = matchSingleHtmlTag(css);

    assert.strictEqual(match, result);
  });

  test("matchSingleHtmlTag should not match child-selector", function () {
    const css = "> span {";
    const match = undefined;
    const result = matchSingleHtmlTag(css);

    assert.strictEqual(match, result);
  });

  test("matchSingleHtmlTag should not match htmlTag + classname", function () {
    const css = "article .title {";
    const match = undefined;
    const result = matchSingleHtmlTag(css);

    assert.strictEqual(match, result);
  });
});

suite("Tests for Extension Utils Regex matchClosingTag", function () {
  test("matchClosingTag should match css closing tag in css", function () {
    const css = "  }";
    const result = matchClosingTag(css);
    const match = "  }";

    assert.strictEqual(match, result);
  });
});

suite("Tests for Extension Utils Regex cssValueWithInterpolation", function () {
  test("cssValueWithInterpolation should match for css value containing interpolation with variable", function () {
    const css = "border: ${border};";
    const result = matchCssValueWithInterpolation(css);
    const match = "${border}";

    assert.strictEqual(match, result);
  });

  test("cssValueWithInterpolation should match for css value containing interpolation with destructured props", function () {
    const css = "  border: ${({ borderColor }) => `1px solid ${borderColor}`};";
    const result = matchCssValueWithInterpolation(css);
    const match = "${({ borderColor }) => `1px solid ${borderColor}`}";

    assert.strictEqual(match, result);
  });

  test("cssValueWithInterpolation should match for css value containing interpolation with variable + part css (1px solid ${borderColor})", function () {
    const css = "  border: 1px solid ${borderColor};";
    const result = matchCssValueWithInterpolation(css);
    const match = "1px solid ${borderColor}";

    assert.strictEqual(match, result);
  });

  test("cssValueWithInterpolation should match for css value containing interpolation with destructured props and ternary", function () {
    const css =
      'color: ${({ destructeredProp }) => (destructeredProp ? "green" : "purple")};';
    const result = matchCssValueWithInterpolation(css);
    const match =
      '${({ destructeredProp }) => (destructeredProp ? "green" : "purple")}';

    assert.strictEqual(match, result);
  });

  test("cssValueWithInterpolation should match for css value containing interpolation with props and ternary", function () {
    const css =
      '  background-color: ${(props) => (props.primary ? "white" : "gray")};';
    const result = matchCssValueWithInterpolation(css);
    const match = '${(props) => (props.primary ? "white" : "gray")}';

    assert.strictEqual(match, result);
  });
});
