"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const webviewPanel_1 = require("./views/webviewPanel");
const gitHandler_1 = require("./git/gitHandler");
let gitHandler;
function activate(context) {
    // GitHandler instance create
    gitHandler = new gitHandler_1.GitHandler(context);
    // Webview open command
    context.subscriptions.push(vscode.commands.registerCommand('yourExtension.openUI', () => {
        webviewPanel_1.WebviewPanel.show(context, gitHandler); // Pass GitHandler to Webview
    }));
    vscode.window.showInformationMessage('Git Auto Commit Extension Activated');
    // Automatically open UI on activation
    vscode.commands.executeCommand('yourExtension.openUI');
}
exports.activate = activate;
function deactivate() {
    gitHandler?.stopTimer(); // Stop auto commit when extension deactivated
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map