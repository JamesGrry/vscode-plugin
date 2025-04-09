"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    // 创建状态栏项
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'codeStats.showDetails'; // 绑定点击命令
    context.subscriptions.push(statusBarItem);
    // 注册命令：刷新统计
    const refreshCommand = vscode.commands.registerCommand('codeStats.refresh', () => {
        updateStatusBar();
    });
    // 注册命令：显示详细信息
    const showDetailsCommand = vscode.commands.registerCommand('codeStats.showDetails', () => {
        const stats = calculateStats();
        vscode.window.showInformationMessage(`📊 代码统计：
            行数: ${stats.lines}
            字符数: ${stats.characters}
            单词数: ${stats.words}`);
    });
    // 监听文件内容变化
    vscode.workspace.onDidChangeTextDocument(() => updateStatusBar());
    vscode.window.onDidChangeActiveTextEditor(() => updateStatusBar());
    // 初始化
    updateStatusBar();
    statusBarItem.show();
    // 将命令添加到订阅
    context.subscriptions.push(refreshCommand, showDetailsCommand);
}
// 计算统计信息
function calculateStats() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return { lines: 0, characters: 0, words: 0 };
    }
    const document = editor.document;
    const text = document.getText();
    return {
        lines: document.lineCount,
        characters: text.length,
        words: text.split(/\s+/).filter(word => word.length > 0).length
    };
}
// 更新状态栏
function updateStatusBar() {
    const stats = calculateStats();
    const statusText = `📄 ${stats.lines} 行 | ${stats.characters} 字符 | ${stats.words} 词`;
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = statusText;
    statusBarItem.show();
}
function deactivate() { }
//# sourceMappingURL=extension.js.map