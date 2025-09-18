'use client';

import { useEffect, useRef, useState } from 'react';
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine, scrollPastEnd } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { defaultKeymap, indentWithTab, history, historyKeymap } from '@codemirror/commands';
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldGutter, foldKeymap } from '@codemirror/language';
import { oneDark } from '@codemirror/theme-one-dark';
import { githubLight } from '@uiw/codemirror-theme-github';

// 语言支持
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { rust } from '@codemirror/lang-rust';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { php } from '@codemirror/lang-php';
import { markdown } from '@codemirror/lang-markdown';
import { sql } from '@codemirror/lang-sql';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { xml } from '@codemirror/lang-xml';

// 扩展功能
import { autocompletion } from '@codemirror/autocomplete';
import { searchKeymap } from '@codemirror/search';
import { lintKeymap } from '@codemirror/lint';

interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  language?: string;
  theme?: 'light' | 'dark';
  readOnly?: boolean;
  height?: string;
}

// 语言映射
const languageMap: Record<string, any> = {
  javascript: javascript(),
  typescript: javascript({ typescript: true }),
  jsx: javascript({ jsx: true }),
  tsx: javascript({ jsx: true, typescript: true }),
  python: python(),
  rust: rust(),
  cpp: cpp(),
  c: cpp(),
  java: java(),
  php: php(),
  markdown: markdown(),
  sql: sql(),
  html: html(),
  css: css(),
  json: json(),
  xml: xml(),
};

export function CodeEditor({
  value = '',
  onChange,
  language = 'javascript',
  theme = 'dark',
  readOnly = false,
  height = '400px',
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!editorRef.current) return;

    // 获取语言支持
    const lang = languageMap[language] || javascript();

    // 创建编辑器状态
    const startState = EditorState.create({
      doc: value,
      extensions: [
        // 基础功能
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        foldGutter(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        bracketMatching(),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        scrollPastEnd(),

        // 快捷键
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          ...foldKeymap,
          ...searchKeymap,
          ...lintKeymap,
          indentWithTab,
        ]),

        // 语言和主题
        lang,
        theme === 'dark' ? oneDark : githubLight,
        autocompletion(),

        // 只读模式
        EditorView.editable.of(!readOnly),

        // 变更监听
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange?.(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          '&': {
            height: height,
            fontSize: '14px',
          },
          '.cm-content': {
            padding: '12px',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
          },
          '.cm-focused .cm-cursor': {
            borderLeftColor: theme === 'dark' ? '#fff' : '#000',
          },
          '&.cm-focused': {
            outline: 'none',
          },
          '.cm-scroller': {
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
          },
        }),
      ],
    });

    // 创建编辑器视图
    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;
    setIsReady(true);

    // 清理函数
    return () => {
      view.destroy();
      viewRef.current = null;
      setIsReady(false);
    };
  }, [language, theme, readOnly, height]);

  // 更新内容
  useEffect(() => {
    if (viewRef.current && isReady) {
      const currentValue = viewRef.current.state.doc.toString();
      if (currentValue !== value) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentValue.length,
            insert: value,
          },
        });
      }
    }
  }, [value, isReady]);

  return (
    <div
      ref={editorRef}
      className={`
        rounded-lg overflow-hidden border
        ${theme === 'dark'
          ? 'border-gray-700 bg-gray-900'
          : 'border-gray-300 bg-white'
        }
      `}
    />
  );
}