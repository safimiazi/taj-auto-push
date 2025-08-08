"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExtensionConfig = void 0;
const vscode = require("vscode");
function getExtensionConfig() {
    const config = vscode.workspace.getConfiguration('gitAutoCommit');
    const isEnabled = config.get('enable', true);
    const branchName = config.get('branch') || 'main';
    const debounceTime = config.get('debounceTime', 3000);
    return { isEnabled, branchName, debounceTime };
}
exports.getExtensionConfig = getExtensionConfig;
//# sourceMappingURL=config.js.map