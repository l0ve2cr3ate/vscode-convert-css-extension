import * as vscode from "vscode";

export function convertCode(convertFn: (code: string) => string) {
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

    const convertedCode = convertFn(code);

    editor.edit((editBuilder) => {
      editBuilder.replace(selection, convertedCode);
    });
  }
}
