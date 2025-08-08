"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const path = require("path");
const child_process_1 = require("child_process");
let timeout;
function activate(context) {
    const config = vscode.workspace.getConfiguration('gitAutoCommit');
    const isEnabled = config.get('enable');
    const branchName = config.get('branch') || 'main';
    const debounceTime = 3000;
    const repoPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath || '';
    async function runGitCommands(commands, cwd) {
        for (const cmd of commands) {
            const result = await new Promise((resolve) => {
                (0, child_process_1.exec)(cmd, { cwd }, (err, stdout, stderr) => {
                    if (err) {
                        vscode.window.showErrorMessage(`Git error: ${stderr || err.message}`);
                        console.error(`Error running "${cmd}": ${stderr || err.message}`);
                        resolve(false);
                    }
                    else {
                        console.log(`Executed: ${cmd}`);
                        console.log(stdout);
                        resolve(true);
                    }
                });
            });
            if (!result)
                return false;
        }
        return true;
    }
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
            const success = await runGitCommands([
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
    vscode.window.showInformationMessage('Git Auto Commit Extension Activated');
}
function deactivate() { }
//# sourceMappingURL=extension.js.map