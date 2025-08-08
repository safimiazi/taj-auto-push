import * as vscode from 'vscode';
import * as path from 'path';

export class WebviewPanel {
  public static show(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
      'simpleWebview',
      'Simple UI',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
      }
    );

    const stylePath = vscode.Uri.file(path.join(context.extensionPath, 'media', 'main.css'));
    const scriptPath = vscode.Uri.file(path.join(context.extensionPath, 'media', 'script.js'));

    const styleUri = panel.webview.asWebviewUri(stylePath);
    const scriptUri = panel.webview.asWebviewUri(scriptPath);

    panel.webview.html = WebviewPanel.getHtml(styleUri, scriptUri);
  }

  private static getHtml(styleUri: vscode.Uri, scriptUri: vscode.Uri): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${styleUri}" rel="stylesheet">
        <title>My Webview UI</title>
      </head>
      <body>
        <h1>Hello from VS Code Extension!</h1>
        <button id="myButton">Click me</button>

        <script src="${scriptUri}"></script>
      </body>
      </html>
    `;
  }
}
