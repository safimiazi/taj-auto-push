import * as cp from 'child_process';
import fetch from 'node-fetch';

export async function generateCommitMessageAI(repoPath: string, changedFiles: string[]): Promise<string> {
    try {
        if (!changedFiles.length) return "Auto commit: no changes detected";

        let diffs: string[] = [];
        for (const file of changedFiles) {
            const diff = cp.execSync(`git diff --cached ${file}`, { cwd: repoPath }).toString().trim();
            diffs.push(`File: ${file}\n${diff}`);
        }

        const inputPrompt = `Generate a meaningful git commit message based on these changes:\n${diffs.join('\n---\n')}`;

        // Call Hugging Face Inference API
        const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
            method: "POST",
            headers: { 
                "Authorization": "Bearer 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",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: inputPrompt })
        });

        const result : any = await response.json();

        // Hugging Face response format may vary, adjust if needed
        const commitMessage = (result[0]?.generated_text) 
        return commitMessage;

    } catch (err) {
        console.error('AI commit message generation failed:', err);
        return `Auto commit: ${changedFiles.join(', ')}`;
    }
}
