import * as vscode from 'vscode';

export function getExtensionConfig() {
  const config = vscode.workspace.getConfiguration('gitAutoCommit');
  const isEnabled = config.get<boolean>('enable', true);
  const branchName = config.get<string>('branch') || 'main';
  const debounceTime = config.get<number>('debounceTime', 3000);

  return { isEnabled, branchName, debounceTime };
}
