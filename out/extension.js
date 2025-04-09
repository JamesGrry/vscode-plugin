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
const vscode = __importStar(require("vscode"));
const ClipboardManager_1 = require("./ClipboardManager");
const ClipboardTree_1 = require("./ClipboardTree");
function activate(context) {
    // 初始化核心组件
    const manager = new ClipboardManager_1.ClipboardManager(context);
    const tree = new ClipboardTree_1.ClipboardTree(manager);
    // 注册侧边栏视图
    vscode.window.registerTreeDataProvider('clipboardHistoryView', tree);
    // 监听剪贴板变化
    let lastClipboardText = '';
    setInterval(async () => {
        const text = await vscode.env.clipboard.readText();
        if (text && text !== lastClipboardText) {
            lastClipboardText = text;
            manager.addItem(text);
            tree.refresh();
        }
    }, 500); // 每0.5秒检查一次剪贴板
    // 注册命令
    context.subscriptions.push(vscode.commands.registerCommand('clipboardHistory.insert', (text) => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            editor.edit(editBuilder => {
                editBuilder.replace(editor.selection, text);
            });
        }
    }), vscode.commands.registerCommand('clipboardHistory.clear', () => {
        manager.clearHistory();
        tree.refresh();
        vscode.window.showInformationMessage('Clipboard history cleared!');
    }));
}
//# sourceMappingURL=extension.js.map