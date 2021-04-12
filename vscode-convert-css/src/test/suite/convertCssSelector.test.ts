import * as assert from "assert";
import { convertCssSelector } from "../../utils";

suite("Extension Utils Tests for converting css selector", function () {
  test("Should generate correct css for single html tag", function () {
    const cssSelector = "article";
    const result = `article: {`;
    const convertedCss = convertCssSelector(cssSelector, true);
    assert.strictEqual(result, convertedCss);
  });

  test("Should generate correct css for multiple html tags", function () {
    const cssSelector = "article a ";
    const result = `"article a": {`;
    const convertedCss = convertCssSelector(cssSelector);
    assert.strictEqual(result, convertedCss);
  });

  test("Should generate correct css for html tags and classnames", function () {
    const cssSelector = "article .title";
    const result = `"article .title": {`;
    const convertedCss = convertCssSelector(cssSelector);
    assert.strictEqual(result, convertedCss);
  });

  test("Should generate correct css for pseudo-selectors", function () {
    const cssSelector = "::before, ::after";
    const result = `"::before, ::after": {`;
    const convertedCss = convertCssSelector(cssSelector);
    assert.strictEqual(result, convertedCss);
  });
});
