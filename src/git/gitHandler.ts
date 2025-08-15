import * as vscode from 'vscode';
import * as cp from 'child_process';


export class GitHandler {
    private timer: NodeJS.Timer | null = null;
    private interval: number = 10 * 60 * 1000; // default 10 min
    private context: vscode.ExtensionContext;
    private enabled: boolean = false;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    startTimer(intervalMinutes: number) {
        this.stopTimer();
        this.interval = intervalMinutes * 60 * 1000;
        if (!this.enabled) return;

        this.timer = setInterval(() => this.autoCommit(), this.interval);
        vscode.window.showInformationMessage(`Auto Git commit started: every ${intervalMinutes} minutes`);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer)
        }
    }

    toggle(enabled: boolean) {
        this.enabled = enabled;
        if (enabled) {
            vscode.window.showInformationMessage('Auto Git is ON');

        } else {
            this.stopTimer();
            vscode.window.showInformationMessage('Auto Git is OFF');
        }
    }


    private async autoCommit() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) return;
        const repoPath = workspaceFolders[0].uri.fsPath;
        try {
            // git add .
            cp.execSync('git add .', { cwd: repoPath });

            //git diff --cached --name-only
            const changedFiles = cp.execSync('git diff --cached --name-only', { cwd: repoPath }).toString().trim();
            if (!changedFiles) return;

            // Generate simple commit message
            const commitMessage = `Auto commit: ${changedFiles.split('\n').join(', ')}`;


      
            // git commit -m "message"
            cp.execSync(`git commit -m "${commitMessage}"`, { cwd: repoPath });

            // git push
            cp.execSync('git push', { cwd: repoPath });

            vscode.window.showInformationMessage('Auto Git commit & push done');
        } catch (error) {
            vscode.window.showErrorMessage('Git auto commit failed: ' + error);
        }
    }

}


