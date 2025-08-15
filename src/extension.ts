import * as vscode from 'vscode';
import { getExtensionConfig } from './config';
import { WebviewPanel } from './views/webviewPanel';
import { GitHandler } from './git/gitHandler';

let gitHandler: GitHandler;

export function activate(context: vscode.ExtensionContext) {
    const repoPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath || '';
    const { isEnabled, branchName, debounceTime } = getExtensionConfig();

    // GitHandler instance create
    gitHandler = new GitHandler(context);


    vscode.window.showInformationMessage('Git Auto Commit Extension Activated');

    // Webview open command
    context.subscriptions.push(
        vscode.commands.registerCommand('yourExtension.openUI', () => {
            WebviewPanel.show(context, gitHandler); // Pass GitHandler to Webview
        })
    );
}

export function deactivate() {
    gitHandler?.stopTimer(); // Stop auto commit when extension deactivated
}
