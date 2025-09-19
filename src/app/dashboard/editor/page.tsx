'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import StarterKit from '@tiptap/starter-kit';
import { generateJSON, JSONContent } from '@tiptap/core';
import { fadeInVariants } from '@/config/animation';
import { SimpleEditor } from '@/modules/editor/SimpleEditor';
import { Copy, RefreshCw } from 'lucide-react';

const initialContent = `
  <h1>编辑器调试面板</h1>
  <p>这是一个基于 <strong>Tiptap 3</strong> 的调试工作台，你可以在左侧编辑富文本，右侧实时查看 HTML 以及 JSON 文档结构。</p>
  <ul>
    <li>支持基础排版、标题、列表、引用等 StarterKit 能力。</li>
    <li>右边的 VSCode 风格卡片会自动同步 HTML 字符串与 JSON AST。</li>
    <li>点击右上角的按钮可以快速复制当前内容，或恢复默认样例。</li>
  </ul>
`;

const formatter = new Intl.DateTimeFormat('zh-CN', {
  hour12: false,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

export default function EditorDebugPage() {
  const extensions = useMemo(() => [StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } })], []);
  const [html, setHtml] = useState(initialContent.trim());
  const [json, setJson] = useState<JSONContent>(() => generateJSON(initialContent, extensions));
  const [lastUpdate, setLastUpdate] = useState(() => formatter.format(new Date()));
  const [panelTab, setPanelTab] = useState<'html' | 'json' | 'preview'>('html');

  const handleReset = () => {
    setHtml(initialContent.trim());
    setJson(generateJSON(initialContent, extensions));
    setLastUpdate(formatter.format(new Date()));
  };

  useEffect(() => {
    setLastUpdate(formatter.format(new Date()));
  }, [panelTab]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.warn('复制失败', error);
    }
  };

  return (
    <motion.div
      variants={fadeInVariants}
      initial="initial"
      animate="animate"
      className="h-full overflow-y-auto p-6"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="surface-base border border-border/20 rounded-2xl px-6 py-5 theme-shadow">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-foreground/60">模块 / 编辑器调试</p>
              <h1 className="text-3xl font-semibold text-foreground">富文本工作台</h1>
              <p className="text-sm text-foreground/60 mt-1">实时体验 Tiptap 3 编辑能力与生成结果</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="surface-light border border-border/30 px-3 py-2 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:border-primary/50 transition"
              >
                <RefreshCw className="w-4 h-4 inline mr-1" /> 恢复示例
              </button>
              <button
                onClick={() => handleCopy(json ? JSON.stringify(json, null, 2) : html)}
                className="surface-light border border-border/30 px-3 py-2 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:border-primary/50 transition"
              >
                <Copy className="w-4 h-4 inline mr-1" /> 复制当前
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6">
          <SimpleEditor
            content={html}
            onUpdate={({ html, json }) => {
              setHtml(html);
              setJson(json);
              setLastUpdate(formatter.format(new Date()));
            }}
          />

          <div className="surface-base border border-border/20 rounded-2xl theme-shadow flex flex-col">
            <div className="border-b border-border/20 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <span>同步监视器</span>
                <span className="text-foreground/40">最近更新 · {lastUpdate}</span>
              </div>
              <div className="flex gap-1">
                {[
                  { key: 'html', label: 'HTML' },
                  { key: 'json', label: 'JSON' },
                  { key: 'preview', label: '预览' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setPanelTab(tab.key as typeof panelTab)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                      panelTab === tab.key
                        ? 'bg-primary/20 text-foreground'
                        : 'hover:bg-primary/10 text-foreground/60'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              {panelTab === 'preview' && (
                <div className="prose prose-invert max-w-none px-6 py-5" dangerouslySetInnerHTML={{ __html: html }} />
              )}

              {panelTab === 'html' && (
                <pre className="whitespace-pre-wrap break-words px-6 py-5 text-xs font-mono text-foreground/80">
                  {html}
                </pre>
              )}

              {panelTab === 'json' && (
                <pre className="whitespace-pre px-6 py-5 text-xs font-mono text-foreground/80 overflow-x-auto">
                  {JSON.stringify(json, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
