import * as vscode from 'vscode';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "my-vscode-plugin" is now active!');

    // 注册 'start' 命令
    let startCommand = vscode.commands.registerCommand('extension.start', () => {
        vscode.window.showInformationMessage('Start command executed!');
        startBuildProcess();
    });

    // 注册 'showWebview' 命令，展示前端界面
    let showWebviewCommand = vscode.commands.registerCommand('extension.showWebview', () => {
        const panel = vscode.window.createWebviewPanel(
            'webviewExample',
            'My Webview Panel',
            vscode.ViewColumn.One,
            {}
        );

        panel.webview.html = getWebviewContent();
    });

    context.subscriptions.push(startCommand, showWebviewCommand);
}

// 启动构建进程（比如npm start）
function startBuildProcess() {
    exec('npm start', (error, stdout, stderr) => {
        if (error) {
            vscode.window.showErrorMessage(`exec error: ${error}`);
            return;
        }
        vscode.window.showInformationMessage(`Build started: ${stdout}`);
    });
}

// 返回一个简单的HTML内容，可以作为Webview的内容
function getWebviewContent() {
    return `
        <html>
        <body>
            <h1>Hello from your VS Code Webview!</h1>
            <p>This is an example of using Webview in a VS Code extension.</p>
        </body>
        </html>
    `;
}

export function deactivate() {}
