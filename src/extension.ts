import * as vscode from 'vscode';
import { ClipboardManager } from './ClipboardManager';
import { ClipboardTree } from './ClipboardTree';

export function activate(context: vscode.ExtensionContext) {
  // 初始化核心组件
  const manager = new ClipboardManager(context);
  const tree = new ClipboardTree(manager);

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
  context.subscriptions.push(
    vscode.commands.registerCommand('clipboardHistory.insert', (text: string) => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        editor.edit(editBuilder => {
          editBuilder.replace(editor.selection, text);
        });
      }
    }),
    vscode.commands.registerCommand('clipboardHistory.clear', () => {
      manager.clearHistory();
      tree.refresh();
      vscode.window.showInformationMessage('Clipboard history cleared!');
    })
  );
}
