import * as assert from "assert";
// import * as vscode from "vscode";
import { convertToStyleObject } from "../../utils/conversionHelpers";

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
    const styleObject = 'div: {\n        margin: "1rem",\n    },';
    const convertedCode = convertToStyleObject(code);

    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for css containing classname", function () {
    const code = ".firstname {\n        color: purple;\n    }";
    const styleObject = '".firstname": {\n        color: "purple",\n    },';
    const convertedCode = convertToStyleObject(code);

    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for css containing pseudo-element", function () {
    const code = "&:hover {\n        background-color: blue;\n    }";

    const styleObject =
      '"&:hover": {\n        backgroundColor: "blue",\n    },';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for css containing htmlTag and class", function () {
    const code = "article.name {\n    font-size: 16px;\n  }";
    const styleObject = '"article.name": {\n    fontSize: "16px",\n  },';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for css containing htmlTag and class", function () {
    const code = "article.name {\n    font-size: 16px;\n  }";
    const styleObject = '"article.name": {\n    fontSize: "16px",\n  },';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for css containing multiple htmlTags", function () {
    const code = " article, a {\n   color: #fff;\n }";
    const styleObject = '"article, a": {\n   color: "#fff",\n },';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for css containing multiple htmlTags separated by space", function () {
    const code =
      "article a {\n    box-shadow: 10px 5px 5px red;\n    border-radius: 50%;\n  }";
    const styleObject =
      '"article a": {\n    boxShadow: "10px 5px 5px red",\n    borderRadius: "50%",\n  },';
    __proto__: Object;
    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for css containing multiple classes", function () {
    const code = ".firstname.something {\n   color: #fff;\n }";
    const styleObject = '".firstname.something": {\n   color: "#fff",\n },';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for css containing child selector", function () {
    const code = "ul > li {\n   background-color: #eee;\n }";
    const styleObject = '"ul > li": {\n   backgroundColor: "#eee",\n },';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for css containing sibling selector", function () {
    const code = "div + span {\n  margin: 1rem;\n}";
    const styleObject = '"div + span": {\n  margin: "1rem",\n},';

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
      'p: {\n    backgroundColor: "blue",\n    fontSize: "1rem",\n\n\n  },';

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

  test("Should generate correct styleObject for styled component containing destructured props", function () {
    const code =
      'const DestructureTest = styled.div`\n  color: ${({ destructuredProp }) => (destructuredProp ? "green" : "purple")};\n  background-color: ${({ primary }) => (primary ? "white" : "gray")};\n`;';
    const styleObject =
      'const DestructureTest = styled.div(({ destructuredProp, primary }) => ({\n  color: destructuredProp ? "green" : "purple",\n  backgroundColor: primary ? "white" : "gray",\n}));';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for styled component destructured and non destructured props", function () {
    const code =
      'const Comp = styled.div`\n  color: ${({ destructeredProp }) => (destructeredProp ? "green" : "purple")};\n  background-color: ${(props) => (props.primary ? "white" : "gray")};\n  border-radius: ${({ destructeredProp }) => (destructeredProp ? 1 : 0)};\n`;';
    const styleObject =
      'const Comp = styled.div(({ destructeredProp, ...props }) => ({\n  color: destructeredProp ? "green" : "purple",\n  backgroundColor: props.primary ? "white" : "gray",\n  borderRadius: destructeredProp ? 1 : 0,\n}));';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for styled component containing variables", function () {
    const code =
      'const VariableExample = styled.div`\n  background-color: ${someVar};\n  ${someVar && "flex-direction: column;"};\n  ${anotherVar ? "margin-top" : "margin-left"}: 1rem;\n`;';
    const styleObject =
      'const VariableExample = styled.div({\n  backgroundColor: someVar,\n[`${someVar && "flex-direction"}`]: "column",\n[`${anotherVar ? "margin-top" : "margin-left"}`]: "1rem",\n});';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for styled component containing variables, destructured and non desctructured props", function () {
    const code =
      'const Comp = styled.div`\n  color: ${({ destructeredProp }) => (destructeredProp ? "green" : "purple")};\n  background-color: ${(props) => (props.primary ? "white" : "gray")};\n  border: ${border};\n`;';
    const styleObject =
      'const Comp = styled.div(({ destructeredProp, ...props }) => ({\n  color: destructeredProp ? "green" : "purple",\n  backgroundColor: props.primary ? "white" : "gray",\n  border: border,\n}));';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for styled component containing css interpolation with backticks", function () {
    const code =
      "const Comp = styled.div`\n  border: ${({ borderColor }) => `1px solid ${borderColor}`};\n`;";
    const styleObject =
      "const Comp = styled.div(({ borderColor }) => ({\n  border: `1px solid ${borderColor}`,\n}));";

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for styled component containing partial css interpolation and partial css", function () {
    const code =
      "const Comp = styled.div`\n  border: 1px solid ${borderColor};\n`;";
    const styleObject =
      "const Comp = styled.div({\n  border: `1px solid ${borderColor}`,\n});";

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for styled component containing interpolation with a function as desctructured prop", function () {
    const code =
      'const Comp1 = styled.div`\n  color: ${({ getColor }) => getColor("blue")};\n`;';
    const styleObject =
      'const Comp1 = styled.div(({ getColor }) => ({\n  color: getColor("blue"),\n}));';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });

  test("Should generate correct styleObject for styled component containing interpolation with a function", function () {
    const code = 'const Comp1 = styled.div`\n  color: ${getColor("blue")};\n`;';
    const styleObject =
      'const Comp1 = styled.div({\n  color: getColor("blue"),\n});';

    const convertedCode = convertToStyleObject(code);
    assert.strictEqual(styleObject, convertedCode);
  });
});
