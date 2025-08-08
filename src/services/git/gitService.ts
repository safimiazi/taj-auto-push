import * as vscode from 'vscode';
import { exec } from 'child_process';

export async function runGitCommands(commands: string[], cwd: string): Promise<boolean> {
  for (const cmd of commands) {
    const result = await new Promise<boolean>((resolve) => {
      exec(cmd, { cwd }, (err, stdout, stderr) => {
        if (err) {
          vscode.window.showErrorMessage(`Git error: ${stderr || err.message}`);
          console.error(`Error running "${cmd}": ${stderr || err.message}`);
          resolve(false);
        } else {
          console.log(`Executed: ${cmd}`);
          console.log(stdout);
          resolve(true);
        }
      });
    });

    if (!result) return false;
  }
  return true;
}
