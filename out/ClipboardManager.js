"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClipboardManager = void 0;
class ClipboardManager {
    static MAX_HISTORY = 10;
    items = [];
    context;
    constructor(context) {
        this.context = context;
        this.loadFromStorage();
    }
    // 加载持久化数据
    loadFromStorage() {
        const saved = this.context.globalState.get('clipboardHistory');
        this.items = saved || [];
    }
    // 添加剪贴板内容（带去重）
    async addItem(text) {
        if (!text || this.items.includes(text)) {
            return;
        }
        this.items.unshift(text);
        if (this.items.length > ClipboardManager.MAX_HISTORY) {
            this.items.pop();
        }
        await this.context.globalState.update('clipboardHistory', this.items);
    }
    getHistory() {
        return [...this.items];
    }
    clearHistory() {
        this.items = [];
        this.context.globalState.update('clipboardHistory', this.items);
    }
}
exports.ClipboardManager = ClipboardManager;
//# sourceMappingURL=ClipboardManager.js.map