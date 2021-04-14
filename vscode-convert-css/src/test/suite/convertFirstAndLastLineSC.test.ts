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
        false,
        null
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component first line when css props value is present ${props => props.primary}", function () {
      const styledComponentFirstLine = "const Button = styled.button`";
      const match = "const Button = styled.button(props => ({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        true,
        null
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component first line with typed props (and no css props value present)", function () {
      const styledComponentFirstLine =
        "const Button = styled.button<ButtonProps>`";
      const match = "const Button = styled.button<ButtonProps>({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        false,
        null
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component first line with typed props when css props value is present: ${props => ...}", function () {
      const styledComponentFirstLine =
        "const Button = styled.button<ButtonProps>`";
      const match = "const Button = styled.button<ButtonProps>(props => ({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        true,
        null
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component first line styling another component (when no css props value is present)", function () {
      const styledComponentFirstLine = "const Button = styled(Button)`";
      const match = "const Button = styled(Button)({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        false,
        null
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component first line styling another component when css props value is present: ${props => ...}", function () {
      const styledComponentFirstLine = "const Button = styled(Button)`";
      const match = "const Button = styled(Button)(props => ({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        true,
        null
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component first line styling another component + with typed props + without css props value", function () {
      const styledComponentFirstLine =
        "const Button = styled(Btn)<ButtonProps>`";
      const match = "const Button = styled(Btn)<ButtonProps>({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        false,
        null
      );

      assert.strictEqual(match, convertedCode);
    });

    test("Should correctly convert styled component first line styling another component + with typed props + with css props value: ${props => ...}", function () {
      const styledComponentFirstLine =
        "const Button = styled(Btn)<ButtonProps>`";
      const match = "const Button = styled(Btn)<ButtonProps>(props => ({";
      const convertedCode = convertStyledComponentFirstLine(
        styledComponentFirstLine,
        true,
        null
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
        false,
        destructuredProps
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
