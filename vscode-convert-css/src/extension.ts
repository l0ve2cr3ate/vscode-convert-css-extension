// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { convertToCss, convertToStyleObject } from "./utils/conversionHelpers";

export function activate(context: vscode.ExtensionContext) {
  const convertToStyleObjectDisposable = vscode.commands.registerCommand(
    "vscode-convert-css.convertToStyleObject",
    function () {
      // Get the active text editor
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showWarningMessage("No active text editor");
        return;
      }

      if (editor) {
        const document = editor.document;
        const selection = editor.selection;

        // Get the code within the selection
        const code = document.getText(selection);
        if (!code) {
          vscode.window.showInformationMessage("You didn't select any code");
          return;
        }

        const convertedCode = convertToStyleObject(code);

        editor.edit((editBuilder) => {
          editBuilder.replace(selection, convertedCode);
        });
      }
    }
  );

  context.subscriptions.push(convertToStyleObjectDisposable);

  const convertToCSSDisposable = vscode.commands.registerCommand(
    "vscode-convert-css.convertToCSS",
    function () {
      // Get the active text editor
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showWarningMessage("No active text editor");
        return;
      }

      if (editor) {
        const document = editor.document;
        const selection = editor.selection;

        // Get the code within the selection
        const code = document.getText(selection);
        if (!code) {
          vscode.window.showInformationMessage("You didn't select any code");
          return;
        }

        const convertedCode = convertToCss(code);

        editor.edit((editBuilder) => {
          editBuilder.replace(selection, convertedCode);
        });
      }
    }
  );
  context.subscriptions.push(convertToCSSDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
