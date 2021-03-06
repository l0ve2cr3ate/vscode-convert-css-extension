import * as assert from "assert";
import {
  convertStyledComponentFirstLine,
  convertStyledComponentLastLine,
} from "../../utils/conversionHelpers";
suite(
  "Tests for Extension Utils convert first and last line functions",
  function () {
    test("Should correctly convert styled component first line when no css props value is present", function () {
      const styledComponentFirstLine = "const Button = styled.button`";
      const match = "const Button = styled.button({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        { containsProps: false, destructuredProps: null }
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component first line when css props value is present ${props => props.primary}", function () {
      const styledComponentFirstLine = "const Button = styled.button`";
      const match = "const Button = styled.button(props => ({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        { containsProps: true, destructuredProps: null }
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component first line with typed props (and no css props value present)", function () {
      const styledComponentFirstLine =
        "const Button = styled.button<ButtonProps>`";
      const match = "const Button = styled.button<ButtonProps>({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        { containsProps: false, destructuredProps: null }
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component first line with typed props when css props value is present: ${props => ...}", function () {
      const styledComponentFirstLine =
        "const Button = styled.button<ButtonProps>`";
      const match = "const Button = styled.button<ButtonProps>(props => ({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        { containsProps: true, destructuredProps: null }
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component first line styling another component (when no css props value is present)", function () {
      const styledComponentFirstLine = "const Button = styled(Button)`";
      const match = "const Button = styled(Button)({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        { containsProps: false, destructuredProps: null }
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component first line styling another component when css props value is present: ${props => ...}", function () {
      const styledComponentFirstLine = "const Button = styled(Button)`";
      const match = "const Button = styled(Button)(props => ({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        { containsProps: true, destructuredProps: null }
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component first line styling another component + with typed props + without css props value", function () {
      const styledComponentFirstLine =
        "const Button = styled(Btn)<ButtonProps>`";
      const match = "const Button = styled(Btn)<ButtonProps>({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        { containsProps: false, destructuredProps: null }
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component first line styling another component + with typed props + with css props value: ${props => ...}", function () {
      const styledComponentFirstLine =
        "const Button = styled(Btn)<ButtonProps>`";
      const match = "const Button = styled(Btn)<ButtonProps>(props => ({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        { containsProps: true, destructuredProps: null }
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component first line when destructured props are present", function () {
      const destructuredProps: RegExpMatchArray = [
        "destructuredProp",
        "primary",
      ];
      const styledComponentFirstLine = "const DestructureTest = styled.div`";
      const match =
        "const DestructureTest = styled.div(({ destructuredProp, primary }) => ({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        { containsProps: false, destructuredProps }
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component first line when single destructured prop and not destructured props are present", function () {
      const destructuredProps: RegExpMatchArray = ["singleDestructuredProp"];
      const styledComponentFirstLine = "const DestructureTest = styled.div`";
      const match =
        "const DestructureTest = styled.div(({ singleDestructuredProp, ...props }) => ({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        { containsProps: true, destructuredProps }
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component first line when destructured props and not destructured props are present", function () {
      const destructuredProps: RegExpMatchArray = [
        "destructuredProp",
        "primary",
      ];
      const styledComponentFirstLine = "const DestructureTest = styled.div`";
      const match =
        "const DestructureTest = styled.div(({ destructuredProp, primary, ...props }) => ({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        { containsProps: true, destructuredProps }
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component last line when no css props values are present", function () {
      const styledComponentLastLine = "`;";
      const match = "});";
      const convertedCode = convertStyledComponentLastLine(
        styledComponentLastLine,
        { containsProps: false, destructuredProps: null }
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component last line when css props value is present: ${props => props.primary}, but destructured props are not", function () {
      const styledComponentLastLine = "`;";
      const match = "}));";
      const convertedCode = convertStyledComponentLastLine(
        styledComponentLastLine,
        { containsProps: true, destructuredProps: null }
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component last line when css props value and destructured props are present", function () {
      const styledComponentLastLine = "`;";
      const match = "}));";
      const convertedCode = convertStyledComponentLastLine(
        styledComponentLastLine,
        { containsProps: true, destructuredProps: ["destructuredProp"] }
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component last line when destructured props are present, and no other props are present", function () {
      const styledComponentLastLine = "`;";
      const match = "}));";
      const convertedCode = convertStyledComponentLastLine(
        styledComponentLastLine,
        { containsProps: false, destructuredProps: ["destructuredProp"] }
      );

      assert.strictEqual(match, convertedCode);
    });
  }
);
