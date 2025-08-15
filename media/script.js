const vscode = acquireVsCodeApi();

const toggle = document.getElementById('toggle');
const interval = document.getElementById('interval');
const apply = document.getElementById('apply');

apply.addEventListener('click', () => {
    vscode.postMessage({ type: 'toggle', enabled: toggle.checked });
    vscode.postMessage({ type: 'setInterval', minutes: parseInt(interval.value) });
});
