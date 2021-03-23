import * as assert from "assert";
// import * as vscode from "vscode";
import { convertToStyleObject, toCamelCase } from "../../utils";

suite("Extension Utils Tests", function () {
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
      'backgroundColor: props => props.primary ? "blue" : "white",\n    fontSize: props => props.size,';
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
});
