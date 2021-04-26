// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { convertCode } from "./convertCode";
import { convertToCss, convertToStyleObject } from "./utils/conversionHelpers";

export function activate(context: vscode.ExtensionContext) {
  const convertToStyleObjectDisposable = vscode.commands.registerCommand(
    "vscode-convert-css.convertToStyleObject",
    () => {
      convertCode(convertToStyleObject);
    }
  );
  context.subscriptions.push(convertToStyleObjectDisposable);

  const convertToCSSDisposable = vscode.commands.registerCommand(
    "vscode-convert-css.convertToCSS",
    () => {
      convertCode(convertToCss);
    }
  );
  context.subscriptions.push(convertToCSSDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
