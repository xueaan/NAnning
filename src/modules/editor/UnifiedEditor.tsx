'use client';

import { useState, useEffect, useMemo } from 'react';
import DOMPurify from 'dompurify';
import { CodeEditor } from './CodeEditor';
import { SimpleEditor } from './SimpleEditor';
import { Code, FileText, Eye, EyeOff, Maximize2, Minimize2 } from 'lucide-react';

export type EditorMode = 'code' | 'richtext' | 'markdown' | 'preview';

interface UnifiedEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  mode?: EditorMode;
  language?: string;
  theme?: 'light' | 'dark';
  height?: string;
  showToolbar?: boolean;
}

export function UnifiedEditor({
  value = '',
  onChange,
  mode: initialMode = 'richtext',
  language = 'javascript',
  theme = 'dark',
  height = '500px',
  showToolbar = true,
}: UnifiedEditorProps) {
  const [mode, setMode] = useState<EditorMode>(initialMode);
  const [showPreview, setShowPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [content, setContent] = useState(value);
  const safePreviewHtml = useMemo(() => DOMPurify.sanitize(content), [content]);

  useEffect(() => {
    setContent(value);
  }, [value]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onChange?.(newContent);
  };

  // 自动检测内容类型
  const detectMode = (text: string): EditorMode => {
    // 检测代码块
    if (text.includes('```') || text.includes('function') || text.includes('class')) {
      return 'code';
    }
    // 检测 Markdown
    if (text.includes('#') || text.includes('**') || text.includes('- ')) {
      return 'markdown';
    }
    return 'richtext';
  };

  const renderEditor = () => {
    switch (mode) {
      case 'code':
      case 'markdown':
        return (
          <CodeEditor
            value={content}
            onChange={handleContentChange}
            language={mode === 'markdown' ? 'markdown' : language}
            theme={theme}
            height={isFullscreen ? 'calc(100vh - 120px)' : height}
          />
        );
      case 'richtext':
        return (
          <SimpleEditor
            content={content}
            onChange={handleContentChange}
          />
        );
      case 'preview':
        return (
          <div
            className="prose prose-invert max-w-none p-4"
            dangerouslySetInnerHTML={{ __html: safePreviewHtml }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`unified-editor ${isFullscreen ? 'fixed inset-0 z-50 bg-gray-900' : ''}`}>
      {showToolbar && (
        <div className="glass border-b border-white/10 p-2 flex items-center justify-between">
          {/* 模式切换 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMode('richtext')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-2 ${
                mode === 'richtext'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'hover:bg-white/10 text-gray-400'
              }`}
              title="Rich Text"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm">Rich Text</span>
            </button>
            <button
              onClick={() => setMode('code')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-2 ${
                mode === 'code'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'hover:bg-white/10 text-gray-400'
              }`}
              title="Code"
            >
              <Code className="w-4 h-4" />
              <span className="text-sm">Code</span>
            </button>
            <button
              onClick={() => setMode('markdown')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-2 ${
                mode === 'markdown'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'hover:bg-white/10 text-gray-400'
              }`}
              title="Markdown"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm">Markdown</span>
            </button>
          </div>

          {/* 工具按钮 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
              title={showPreview ? 'Hide Preview' : 'Show Preview'}
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* 编辑器主体 */}
      <div className={`editor-content ${showPreview ? 'grid grid-cols-2 gap-4' : ''}`}>
        <div className="editor-pane">
          {renderEditor()}
        </div>
        {showPreview && (
          <div className="preview-pane glass rounded-lg overflow-auto" style={{ height: isFullscreen ? 'calc(100vh - 120px)' : height }}>
            <div
              className="prose prose-invert max-w-none p-4"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        )}
      </div>

      {/* 状态栏 */}
      <div className="glass border-t border-white/10 px-4 py-2 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Mode: {mode}</span>
          <span>Words: {content.split(/\s+/).filter(Boolean).length}</span>
          <span>Characters: {content.length}</span>
        </div>
        <div className="flex items-center space-x-4">
          {mode === 'code' && <span>Language: {language}</span>}
          <span>Theme: {theme}</span>
        </div>
      </div>
    </div>
  );
}
