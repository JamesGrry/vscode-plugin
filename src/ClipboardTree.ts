import * as vscode from 'vscode';
import { ClipboardManager } from './ClipboardManager';

class ClipboardItem extends vscode.TreeItem {
  constructor(public readonly text: string) {
    super(text, vscode.TreeItemCollapsibleState.None);
    this.tooltip = text;
    this.command = {
      command: 'clipboardHistory.insert',
      title: 'Insert Clipboard Text',
      arguments: [text]
    };
  }
}

export class ClipboardTree implements vscode.TreeDataProvider<ClipboardItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private manager: ClipboardManager) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ClipboardItem): vscode.TreeItem {
    return element;
  }

  getChildren(): Thenable<ClipboardItem[]> {
    return Promise.resolve(
      this.manager.getHistory().map(text => new ClipboardItem(text))
    );
  }
}
