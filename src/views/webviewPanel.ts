
import * as vscode from 'vscode';
import * as path from 'path';
import { GitHandler } from '../git/gitHandler';

export class WebviewPanel {
    public static show(context: vscode.ExtensionContext, gitHandler: GitHandler) {
        const panel = vscode.window.createWebviewPanel(
            'autoGitWebview',
            'Taj Auto Push',
            vscode.ViewColumn.Beside,
            { enableScripts: true }
        );

        const stylePath = vscode.Uri.file(path.join(context.extensionPath, 'media', 'main.css'));
        const scriptPath = vscode.Uri.file(path.join(context.extensionPath, 'media', 'script.js'));
        const styleUri = panel.webview.asWebviewUri(stylePath);
        const scriptUri = panel.webview.asWebviewUri(scriptPath);

        panel.webview.html = WebviewPanel.getHtml(styleUri, scriptUri);

        panel.webview.onDidReceiveMessage(message => {
            if (message.type === 'toggle') gitHandler.toggle(message.enabled);
            if (message.type === 'setInterval') gitHandler.startTimer(message.minutes);
        }, undefined, context.subscriptions);
    }

    private static getHtml(styleUri: vscode.Uri, scriptUri: vscode.Uri) {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="${styleUri}" rel="stylesheet">
            <title>Taj Auto Push</title>
        </head>
        <body>
            <h1>Taj Auto Push Extension</h1>
        <div class="control">
            <label>
                <span>Enable Auto Git:</span>
                <input type="checkbox" id="toggle">
            </label>
            <label>
                <span>Interval (minutes):</span>
                <input type="number" id="interval" min="1" value="10">
            </label>
            <button id="apply">Apply</button>
        </div>

        <div class="note">
            <h2>How to Use</h2>
            <p>1. Toggle <b>Enable Auto Git</b> to start or stop automatic commits.</p>
            <p>2. Set your preferred commit interval in minutes.</p>
            <p>3. Click <b>Apply</b> to save settings. The extension will automatically stage, commit, and push changes.</p>
            <p>💡 This is an <b>open-source</b> project. More advanced features (AI commit messages, branch switching, selective file commit, etc.) are coming soon.</p>
        </div>

        <script src="${scriptUri}"></script>
        </body>
        </html>
        `;
    }
}
