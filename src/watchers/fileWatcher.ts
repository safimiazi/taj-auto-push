import * as vscode from 'vscode';
import * as path from 'path';
import { runGitCommands } from '../services/git/gitService';

let timeout: NodeJS.Timeout | undefined;

export function createFileWatcher(context: vscode.ExtensionContext, repoPath: string, branchName: string, debounceTime: number, isEnabled: boolean) {
  function handleFileChange(uri: vscode.Uri) {
    if (!isEnabled) {
      console.log('Auto-commit disabled in configuration');
      return;
    }

    if (
      !uri ||
      !uri.fsPath ||
      path.normalize(uri.fsPath).includes(`${path.sep}.git${path.sep}`)
    ) {
      return;
    }

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(async () => {
      const success = await runGitCommands(
        [
          'git add .',
          'git commit -m "Auto commit from VS Code"',
          `git push origin ${branchName}`
        ],
        repoPath
      );

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
