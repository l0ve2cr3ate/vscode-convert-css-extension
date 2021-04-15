import * as assert from "assert";
import {
  removeDuplicates,
  wrapWithQuotes,
} from "../../utils/conversionHelpers";

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
    const duplicates = ["someVar", "someVar", "anotherVar"];
    const withoutDuplicates = ['someVar', 'anotherVar'];
    const deduplicatedArr = removeDuplicates(duplicates);

    assert.deepStrictEqual(withoutDuplicates, deduplicatedArr);
  });
});
