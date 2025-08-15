"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const config_1 = require("./config");
const webviewPanel_1 = require("./views/webviewPanel");
const gitHandler_1 = require("./git/gitHandler");
let gitHandler;
function activate(context) {
    const repoPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath || '';
    const { isEnabled, branchName, debounceTime } = (0, config_1.getExtensionConfig)();
    // GitHandler instance create
    gitHandler = new gitHandler_1.GitHandler(context);
    vscode.window.showInformationMessage('Git Auto Commit Extension Activated');
    // Webview open command
    context.subscriptions.push(vscode.commands.registerCommand('yourExtension.openUI', () => {
        webviewPanel_1.WebviewPanel.show(context, gitHandler); // Pass GitHandler to Webview
    }));
}
exports.activate = activate;
function deactivate() {
    gitHandler?.stopTimer(); // Stop auto commit when extension deactivated
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map