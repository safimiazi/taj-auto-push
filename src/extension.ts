import * as vscode from 'vscode';
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

        // ------------------------------
    // Sidebar (Activity Bar) integration
    // ------------------------------
    const provider = new class implements vscode.WebviewViewProvider {
        resolveWebviewView(webviewView: vscode.WebviewView) {
            WebviewPanel.showInWebviewView(webviewView, context, gitHandler);
        }
    };

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            'tajAutoPushView', // এই ID package.json এর সাথে match করবে
            provider
        )
    );
    // ------------------------------


    vscode.window.showInformationMessage('Git Auto Commit Extension Activated');
    // Automatically open UI on activation
    vscode.commands.executeCommand('yourExtension.openUI');

}

export function deactivate() {
    gitHandler?.stopTimer(); // Stop auto commit when extension deactivated
}
