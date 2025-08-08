"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runGitCommands = void 0;
const vscode = require("vscode");
const child_process_1 = require("child_process");
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
exports.runGitCommands = runGitCommands;
//# sourceMappingURL=gitService.js.map