import * as vscode from 'vscode';
import * as cp from 'child_process';
import { promisify } from 'util';
import * as fs from "fs";
import * as path from "path";
const exec = promisify(cp.exec);

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
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder found. Please open a valid Git repository.');
            return;
        }

        const repoPath = workspaceFolders[0].uri.fsPath;

        try {
            // ✅ Check if inside Git repo
            await exec("git rev-parse --is-inside-work-tree", { cwd: repoPath });

            // ✅ Stage all changes
            await exec("git add .", { cwd: repoPath });

            // // ✅ Check staged changes
            // const { stdout: changedFiles } = await exec("git diff --cached --name-only", { cwd: repoPath });
            // if (!changedFiles.trim()) {
            //     vscode.window.showInformationMessage("No changes to commit");
            //     return;
            // }// ✅ Check staged changes (with status)


            // // ✅ Commit with changed files
            // const commitMessage = `Auto commit: ${changedFiles.split("\n").filter(Boolean).join(", ")}`;
            // await exec(`git commit -m "${commitMessage}"`, { cwd: repoPath });
            // ✅ Build meaningful commit message


            // ✅ Get changes with status (M=Modified, A=Added, D=Deleted, R=Renamed)
            const { stdout: changedFiles } = await exec("git diff --cached --name-status", { cwd: repoPath });
            if (!changedFiles.trim()) {
                vscode.window.showInformationMessage("No changes to commit");
                return;
            }

            // ✅ Build one-line commit message
            const changes = changedFiles
                .split("\n")
                .filter(Boolean)
                .map(line => {
                    const [status, file] = line.trim().split(/\s+/);
                    switch (status) {
                        case "M": return `Modified ${file}`;
                        case "A": return `Added ${file}`;
                        case "D": return `Deleted ${file}`;
                        case "R": return `Renamed ${file}`;
                        default: return `${status} ${file}`;
                    }
                });

            // ✅ Join changes in a single line with comma
            const commitMessage = `Auto commit: ${changes.join(", ")}`;

            // ✅ Commit directly with message
            await exec(`git commit -m "${commitMessage}"`, { cwd: repoPath });

            // ✅ Get current branch
            const { stdout: branchName } = await exec("git rev-parse --abbrev-ref HEAD", { cwd: repoPath });
            const branch = branchName.trim();
            if (!branch) {
                vscode.window.showInformationMessage(`❌ Could not determine current branch`);
                throw new Error("Could not determine current branch");
            }

            // ✅ Check if branch already exists in remote
            const { stdout: remoteBranches } = await exec("git ls-remote --heads origin", { cwd: repoPath });
            const branchExistsRemote = remoteBranches.includes(`refs/heads/${branch}`);

            if (branchExistsRemote) {
                // Push normally
                await exec(`git push origin ${branch}`, { cwd: repoPath });
            } else {

                // First time push with upstream
                await exec(`git push --set-upstream origin ${branch}`, { cwd: repoPath });
            }

            vscode.window.showInformationMessage(`✅ Auto Git commit & push done on branch ${branch}`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            vscode.window.showErrorMessage(`❌ Git auto commit failed: ${errorMessage}`);
        }

    }




}


