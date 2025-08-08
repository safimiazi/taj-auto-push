"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFileWatcher = void 0;
const vscode = require("vscode");
const path = require("path");
const gitService_1 = require("../services/git/gitService");
let timeout;
function createFileWatcher(context, repoPath, branchName, debounceTime, isEnabled) {
    function handleFileChange(uri) {
        if (!isEnabled) {
            console.log('Auto-commit disabled in configuration');
            return;
        }
        if (!uri ||
            !uri.fsPath ||
            path.normalize(uri.fsPath).includes(`${path.sep}.git${path.sep}`)) {
            return;
        }
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(async () => {
            const success = await (0, gitService_1.runGitCommands)([
                'git add .',
                'git commit -m "Auto commit from VS Code"',
                `git push origin ${branchName}`
            ], repoPath);
            if (success) {
                vscode.window.showInformationMessage('Changes auto-committed and pushed successfully');
            }
        }, debounceTime);
    }
    const watcher = vscode.workspace.createFileSystemWatcher('**/*.{ts,js,tsx,jsx,json,md}');
    watcher.onDidChange(handleFileChange);
    watcher.onDidCreate(handleFileChange);
    watcher.onDidDelete(handleFileChange);
    context.subscriptions.push(watcher);
}
exports.createFileWatcher = createFileWatcher;
//# sourceMappingURL=fileWatcher.js.map