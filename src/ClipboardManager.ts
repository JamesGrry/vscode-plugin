import * as vscode from 'vscode';

export class ClipboardManager {
  private static MAX_HISTORY = 10;
  private items: string[] = [];
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.loadFromStorage();
  }

  // 加载持久化数据
  private loadFromStorage() {
    const saved = this.context.globalState.get<string[]>('clipboardHistory');
    this.items = saved || [];
  }

  // 添加剪贴板内容（带去重）
  public async addItem(text: string) {
    if (!text || this.items.includes(text)) {return;}

    this.items.unshift(text);
    if (this.items.length > ClipboardManager.MAX_HISTORY) {
      this.items.pop();
    }

    await this.context.globalState.update('clipboardHistory', this.items);
  }

  public getHistory(): string[] {
    return [...this.items];
  }

  public clearHistory() {
    this.items = [];
    this.context.globalState.update('clipboardHistory', this.items);
  }
}
