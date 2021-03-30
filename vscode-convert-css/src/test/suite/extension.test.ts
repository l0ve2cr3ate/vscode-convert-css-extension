import * as assert from "assert";
// import * as vscode from "vscode";
import {
  convertStyledComponentFirstLine,
  convertStyledComponentLastLine,
  convertToStyleObject,
  matchStyledComponentFirstLine,
  matchStyledComponentLastLine,
  toCamelCase,
} from "../../utils";

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

suite("Tests for Extension Utils Convert to styleObject", function () {
  test("Should generate correct styleObject for css containing unitless values", function () {
    const code =
      "background-color: blue;\n    z-index: 2;\n    opacity: 0.1;\n    font-size: 16px;\n    font-weight: 600;";
    const styleObject =
      'backgroundColor: "blue",\n    zIndex: 2,\n    opacity: 0.1,\n    fontSize: "16px",\n    fontWeight: 600,';
    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for declarations containing props", function () {
    const code =
      'background-color: ${props => props.primary ? "blue" : "white"};\n    font-size: ${props => props.size};';
    const styleObject =
      'backgroundColor: props.primary ? "blue" : "white",\n    fontSize: props.size,';
    const convertedCode = convertToStyleObject(code);

    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for css containing htmlTag", function () {
    const code = "div {\n        margin: 1rem;\n    }";
    const styleObject = 'div: {\n        margin: "1rem",\n    }';
    const convertedCode = convertToStyleObject(code);

    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for css containing classname", function () {
    const code = ".firstname {\n        color: purple;\n    }";
    const styleObject = '".firstname": {\n        color: "purple",\n    }';
    const convertedCode = convertToStyleObject(code);

    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for css containing pseudo-element", function () {
    const code = "&:hover {\n        background-color: blue;\n    }";

    const styleObject = '"&:hover": {\n        backgroundColor: "blue",\n    }';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for css containing htmlTag and class", function () {
    const code = "article.name {\n    font-size: 16px;\n  }";
    const styleObject = '"article.name": {\n    fontSize: "16px",\n  }';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for css containing htmlTag and class", function () {
    const code = "article.name {\n    font-size: 16px;\n  }";
    const styleObject = '"article.name": {\n    fontSize: "16px",\n  }';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for css containing multiple htmlTags", function () {
    const code = " article, a {\n   color: #fff;\n }";
    const styleObject = '"article, a": {\n   color: "#fff",\n }';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for css containing multiple htmlTags separated by space", function () {
    const code =
      "article a {\n    box-shadow: 10px 5px 5px red;\n    border-radius: 50%;\n  }";
    const styleObject =
      '"article a": {\n    boxShadow: "10px 5px 5px red",\n    borderRadius: "50%",\n  }';
    __proto__: Object;
    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for css containing multiple classes", function () {
    const code = ".firstname.something {\n   color: #fff;\n }";
    const styleObject = '".firstname.something": {\n   color: "#fff",\n }';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for css containing child selector", function () {
    const code = "ul > li {\n   background-color: #eee;\n }";
    const styleObject = '"ul > li": {\n   backgroundColor: "#eee",\n }';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for css containing sibling selector", function () {
    const code = "div + span {\n  margin: 1rem;\n}";
    const styleObject = '"div + span": {\n  margin: "1rem",\n}';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for css property with multiple dashes", function () {
    const code = " grid-template-columns: 60px 60px;";
    const styleObject = ' gridTemplateColumns: "60px 60px",';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for css containing vendor prefixes", function () {
    const code = "-webkit-background-clip: text;";
    const styleObject = 'WebkitBackgroundClip: "text",';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for css selection containing empty line(s)", function () {
    const code =
      "p {\n    background-color: blue;\n    font-size: 1rem;\n    \n    \n  }";
    const styleObject =
      'p: {\n    backgroundColor: "blue",\n    fontSize: "1rem",\n\n\n  }';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for code containing first line of styled component", function () {
    const code = "const Button = styled.button`";
    const styleObject = "const Button = styled.button({";

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for code containing first line of styled component with typed props", function () {
    const code = "const Button = styled.button<ButtonProps>`";
    const styleObject = "const Button = styled.button<ButtonProps>({";

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for code containing first line of styled component styling another component", function () {
    const code = "const Button = styled(Btn)`";
    const styleObject = "const Button = styled(Btn)({";

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for code containing first line of styled component styling another component + with typed props", function () {
    const code = "const Button = styled(Btn)<ButtonProps>`";
    const styleObject = "const Button = styled(Btn)<ButtonProps>({";

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for code containing last line of styled component", function () {
    const code = "`;";
    const styleObject = "});";

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for styled component containing props", function () {
    const code =
      'const Button = styled.button`\n  color: ${(props) => props.primary};\n  flex-direction: ${(props) => props.color && "column"};\n  background-color: ${(props) => props.bg || "palevioletred"};\n`;';
    const styleObject =
      'const Button = styled.button(props => ({\n  color: props.primary,\n  flexDirection: props.color && "column",\n  backgroundColor: props.bg || "palevioletred",\n}));';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for styled component containing typed props + css props value", function () {
    const code =
      'const Button = styled.button<ButtonProps>`\n  color: ${(props) => props.primary};\n  flex-direction: ${(props) => props.color && "column"};\n  background-color: ${(props) => props.bg || "palevioletred"};\n`;';
    const styleObject =
      'const Button = styled.button<ButtonProps>(props => ({\n  color: props.primary,\n  flexDirection: props.color && "column",\n  backgroundColor: props.bg || "palevioletred",\n}));';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for styled component styling another component and containing props", function () {
    const code =
      'const Btn = styled(Button)`\n  color: ${(props) => props.primary};\n  flex-direction: ${(props) => props.color && "column"};\n  background-color: ${(props) => props.bg || "palevioletred"};\n`;';
    const styleObject =
      'const Btn = styled(Button)(props => ({\n  color: props.primary,\n  flexDirection: props.color && "column",\n  backgroundColor: props.bg || "palevioletred",\n}));';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for styled component styling another component + containing typed props + css props value", function () {
    const code =
      'const Btn = styled(Button)<BtnProps>`\n  color: ${(props) => props.primary};\n  flex-direction: ${(props) => props.color && "column"};\n  background-color: ${(props) => props.bg || "palevioletred"};\n`;';
    const styleObject =
      'const Btn = styled(Button)<BtnProps>(props => ({\n  color: props.primary,\n  flexDirection: props.color && "column",\n  backgroundColor: props.bg || "palevioletred",\n}));';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });
});

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
});

suite(
  "Tests for Extension Utils convert first and last line functions",
  function () {
    test("Should correctly convert styled component first line when no css props value is present", function () {
      const styledComponentFirstLine = "const Button = styled.button`";
      const match = "const Button = styled.button({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        false
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component first line when css props value is present ${props => props.primary}", function () {
      const styledComponentFirstLine = "const Button = styled.button`";
      const match = "const Button = styled.button(props => ({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        true
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component first line with typed props (and no css props value present)", function () {
      const styledComponentFirstLine =
        "const Button = styled.button<ButtonProps>`";
      const match = "const Button = styled.button<ButtonProps>({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        false
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component first line with typed props when css props value is present: ${props => ...}", function () {
      const styledComponentFirstLine =
        "const Button = styled.button<ButtonProps>`";
      const match = "const Button = styled.button<ButtonProps>(props => ({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        true
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component first line styling another component (when no css props value is present)", function () {
      const styledComponentFirstLine = "const Button = styled(Button)`";
      const match = "const Button = styled(Button)({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        false
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component first line styling another component when css props value is present: ${props => ...}", function () {
      const styledComponentFirstLine = "const Button = styled(Button)`";
      const match = "const Button = styled(Button)(props => ({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        true
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component first line styling another component + with typed props + without css props value", function () {
      const styledComponentFirstLine =
        "const Button = styled(Btn)<ButtonProps>`";
      const match = "const Button = styled(Btn)<ButtonProps>({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        false
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component first line styling another component + with typed props + with css props value: ${props => ...}", function () {
      const styledComponentFirstLine =
        "const Button = styled(Btn)<ButtonProps>`";
      const match = "const Button = styled(Btn)<ButtonProps>(props => ({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        true
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component last line when no css props value is present", function () {
      const styledComponentLastLine = "`;";
      const match = "});";
      const convertedCode = convertStyledComponentLastLine(
        styledComponentLastLine,
        false
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component last line when css props value is present: ${props => props.primary}", function () {
      const styledComponentLastLine = "`;";
      const match = "}));";
      const convertedCode = convertStyledComponentLastLine(
        styledComponentLastLine,
        true
      );

      assert.strictEqual(match, convertedCode);
    });
  }
);
