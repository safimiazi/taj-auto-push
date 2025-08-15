"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHandler = void 0;
const vscode = require("vscode");
const cp = require("child_process");
const commitMessage_1 = require("./commitMessage");
class GitHandler {
    constructor(context) {
        this.timer = null;
        this.interval = 10 * 60 * 1000; // default 10 min
        this.enabled = false;
        this.context = context;
    }
    startTimer(intervalMinutes) {
        this.stopTimer();
        this.interval = intervalMinutes * 60 * 1000;
        if (!this.enabled)
            return;
        this.timer = setInterval(() => this.autoCommit(), this.interval);
        vscode.window.showInformationMessage(`Auto Git commit started: every ${intervalMinutes} minutes`);
    }
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
    toggle(enabled) {
        this.enabled = enabled;
        if (enabled) {
            vscode.window.showInformationMessage('Auto Git is ON');
        }
        else {
            this.stopTimer();
            vscode.window.showInformationMessage('Auto Git is OFF');
        }
    }
    async autoCommit() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders)
            return;
        const repoPath = workspaceFolders[0].uri.fsPath;
        try {
            // git add .
            cp.execSync('git add .', { cwd: repoPath });
            // //git diff --cached --name-only
            // const changedFiles = cp.execSync('git diff --cached --name-only', { cwd: repoPath }).toString().trim();
            // if (!changedFiles) return;
            // // Generate simple commit message
            // // const commitMessage = `Auto commit: ${changedFiles.split('\n').join(', ')}`;
            // const commitMessage = generateCommitMessageAI(repoPath, changedFiles)
            // Get changed files as string
            const changedFilesStr = cp.execSync('git diff --cached --name-only', { cwd: repoPath }).toString().trim();
            if (!changedFilesStr)
                return;
            // Convert string to array of files
            const changedFilesArray = changedFilesStr.split('\n');
            // Pass array to AI function
            const commitMessage = await (0, commitMessage_1.generateCommitMessageAI)(repoPath, changedFilesArray);
            // git commit -m "message"
            cp.execSync(`git commit -m "${commitMessage}"`, { cwd: repoPath });
            // git push
            cp.execSync('git push', { cwd: repoPath });
            vscode.window.showInformationMessage('Auto Git commit & push done');
        }
        catch (error) {
            vscode.window.showErrorMessage('Git auto commit failed: ' + error);
        }
    }
}
exports.GitHandler = GitHandler;
//# sourceMappingURL=gitHandler.js.map