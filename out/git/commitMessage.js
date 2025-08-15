"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCommitMessageAI = void 0;
const cp = require("child_process");
const node_fetch_1 = require("node-fetch");
async function generateCommitMessageAI(repoPath, changedFiles) {
    try {
        if (!changedFiles.length)
            return "Auto commit: no changes detected";
        let diffs = [];
        for (const file of changedFiles) {
            const diff = cp.execSync(`git diff --cached ${file}`, { cwd: repoPath }).toString().trim();
            diffs.push(`File: ${file}\n${diff}`);
        }
        const inputPrompt = `Generate a meaningful git commit message based on these changes:\n${diffs.join('\n---\n')}`;
        // Call Hugging Face Inference API
        const response = await (0, node_fetch_1.default)("https://api-inference.huggingface.co/models/gpt2", {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: inputPrompt })
        });
        const result = await response.json();
        // Hugging Face response format may vary, adjust if needed
        const commitMessage = (result[0]?.generated_text);
        return commitMessage;
    }
    catch (err) {
        console.error('AI commit message generation failed:', err);
        return `Auto commit: ${changedFiles.join(', ')}`;
    }
}
exports.generateCommitMessageAI = generateCommitMessageAI;
//# sourceMappingURL=commitMessage.js.map