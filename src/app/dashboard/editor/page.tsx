'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { Save, Download, Upload, FileText, Code, Type } from 'lucide-react';

// 动态导入统一编辑器，避免 SSR 问题
const UnifiedEditor = dynamic(
  () => import('@/modules/editor/UnifiedEditor').then((mod) => mod.UnifiedEditor),
  { ssr: false }
);

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const docId = searchParams.get('id');

  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Untitled Document');
  const [editorMode, setEditorMode] = useState<'richtext' | 'code' | 'markdown'>('richtext');
  const [currentLanguage, setCurrentLanguage] = useState('javascript');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [documentId, setDocumentId] = useState(docId);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load document if ID is provided
  useEffect(() => {
    if (docId) {
      loadDocument(docId);
    }
  }, [docId]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled || !hasUnsavedChanges || isSaving) return;

    const timer = setTimeout(() => {
      handleSave();
    }, 3000); // Auto-save after 3 seconds of inactivity

    return () => clearTimeout(timer);
  }, [content, title, hasUnsavedChanges, autoSaveEnabled]);

  // Track changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [content, title]);

  const loadDocument = async (id: string) => {
    try {
      const result = await (window as any).electron.db.getDocument(id);
      if (result.success && result.data) {
        setTitle(result.data.title);
        setContent(result.data.content || '');
        setEditorMode(result.data.type || 'richtext');
        setCurrentLanguage(result.data.language || 'javascript');
        setDocumentId(id);
      }
    } catch (error) {
      console.error('Failed to load document:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (documentId) {
        // Update existing document
        const result = await (window as any).electron.db.updateDocument(documentId, {
          title,
          content,
          type: editorMode,
          language: currentLanguage,
        });
        if (result.success) {
          setLastSaved(new Date());
          setHasUnsavedChanges(false);
        }
      } else {
        // Create new document
        const newId = `doc_${Date.now()}`;
        const result = await (window as any).electron.db.createDocument({
          id: newId,
          title,
          content,
          type: editorMode,
          language: currentLanguage,
        });
        if (result.success) {
          setDocumentId(newId);
          setLastSaved(new Date());
          setHasUnsavedChanges(false);
          // Update URL to include the new document ID
          router.push(`/dashboard/editor?id=${newId}`);
        }
      }
    } catch (error) {
      console.error('Failed to save document:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <div className="glass border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold text-white bg-transparent border-b border-white/20 focus:border-purple-400 outline-none px-2 py-1"
              placeholder="Document Title"
            />
            {editorMode === 'code' && (
              <select
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value)}
                className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm border border-gray-700"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="rust">Rust</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="json">JSON</option>
                <option value="sql">SQL</option>
                <option value="markdown">Markdown</option>
              </select>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
              title="Upload"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button
              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 p-6 overflow-auto">
        <UnifiedEditor
          value={content}
          onChange={setContent}
          mode={editorMode}
          language={currentLanguage}
          theme="dark"
          height="calc(100% - 100px)"
          showToolbar={true}
        />
      </div>

      {/* Status Bar */}
      <div className="glass border-t border-white/10 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            <span>Mode: {editorMode}</span>
            <span>Words: {content.split(/\s+/).filter(Boolean).length}</span>
            <span>Characters: {content.length}</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
              className="text-xs hover:text-purple-400 transition-colors"
            >
              Auto-save: {autoSaveEnabled ? 'Enabled' : 'Disabled'}
            </button>
            <span className={hasUnsavedChanges ? 'text-yellow-400' : ''}>
              {hasUnsavedChanges ? '• Unsaved changes' : `Last saved: ${lastSaved ? lastSaved.toLocaleTimeString() : 'Never'}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}