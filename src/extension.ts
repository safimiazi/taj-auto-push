// import * as vscode from 'vscode';
// import * as path from 'path';
// import { exec } from 'child_process';

// let timeout: NodeJS.Timeout | undefined;

// export function activate(context: vscode.ExtensionContext) {
//   const config = vscode.workspace.getConfiguration('gitAutoCommit');
//   const isEnabled = config.get<boolean>('enable');
//   const branchName = config.get<string>('branch') || 'main';
//   const debounceTime = 3000;

//   const repoPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath || '';

//   async function runGitCommands(commands: string[], cwd: string): Promise<boolean> {
//     for (const cmd of commands) {
//       const result = await new Promise<boolean>((resolve) => {
//         exec(cmd, { cwd }, (err, stdout, stderr) => {
//           if (err) {
//             vscode.window.showErrorMessage(`Git error: ${stderr || err.message}`);
//             console.error(`Error running "${cmd}": ${stderr || err.message}`);
//             resolve(false);
//           } else {
//             console.log(`Executed: ${cmd}`);
//             console.log(stdout);
//             resolve(true);
//           }
//         });
//       });

//       if (!result) return false;
//     }
//     return true;
//   }

//   function handleFileChange(uri: vscode.Uri) {
//     if (!isEnabled) {
//       console.log('Auto-commit disabled in configuration');
//       return;
//     }

//     if (
//       !uri ||
//       !uri.fsPath ||
//       path.normalize(uri.fsPath).includes(`${path.sep}.git${path.sep}`)
//     ) {
//       return;
//     }

//     if (timeout) {
//       clearTimeout(timeout);
//     }

//     timeout = setTimeout(async () => {
//       const success = await runGitCommands(
//         [
//           'git add .',
//           'git commit -m "Auto commit from VS Code"',
//           `git push origin ${branchName}`
//         ],
//         repoPath
//       );

//       if (success) {
//         vscode.window.showInformationMessage('Changes auto-committed and pushed successfully');
//       }
//     }, debounceTime);
//   }

//   const watcher = vscode.workspace.createFileSystemWatcher('**/*.{ts,js,tsx,jsx,json,md}');
//   watcher.onDidChange(handleFileChange);
//   watcher.onDidCreate(handleFileChange);
//   watcher.onDidDelete(handleFileChange);
//   context.subscriptions.push(watcher);

//   vscode.window.showInformationMessage('Git Auto Commit Extension Activated');
// }

// export function deactivate() {}
import * as vscode from 'vscode';
import { createFileWatcher } from './watchers/fileWatcher';
import { getExtensionConfig } from './config';

export function activate(context: vscode.ExtensionContext) {
  const repoPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath || '';
  const { isEnabled, branchName, debounceTime } = getExtensionConfig();

  createFileWatcher(context, repoPath, branchName, debounceTime, isEnabled);

  vscode.window.showInformationMessage('Git Auto Commit Extension Activated');
}

export function deactivate() {}
