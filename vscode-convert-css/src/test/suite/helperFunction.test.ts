import * as assert from "assert";
import { wrapWithQuotes } from "../../utils";

suite("Extension Utils Tests for helper functions", function () {
  test("Should wrap css within quotes", function () {
    const css = `.firstName, .lastName`;
    const result = `".firstName, .lastName"`;
    const convertedCss = wrapWithQuotes(css);

    assert.strictEqual(result, convertedCss);
  });
});
