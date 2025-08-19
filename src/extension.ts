import * as vscode from 'vscode';
import { getExtensionConfig } from './config';
import { WebviewPanel } from './views/webviewPanel';
import { GitHandler } from './git/gitHandler';

let gitHandler: GitHandler;

export function activate(context: vscode.ExtensionContext) {

    // GitHandler instance create
    gitHandler = new GitHandler(context);



    // Webview open command
    context.subscriptions.push(
        vscode.commands.registerCommand('yourExtension.openUI', () => {
            WebviewPanel.show(context, gitHandler); // Pass GitHandler to Webview
        })
    );

    vscode.window.showInformationMessage('Git Auto Commit Extension Activated');
    // Automatically open UI on activation
    vscode.commands.executeCommand('yourExtension.openUI');

}

export function deactivate() {
    gitHandler?.stopTimer(); // Stop auto commit when extension deactivated
}
