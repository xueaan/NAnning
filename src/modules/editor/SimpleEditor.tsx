'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { JSONContent } from '@tiptap/core';
import {
  Bold,
  Italic,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Minus,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react';

interface SimpleEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  onUpdate?: (payload: { html: string; json: JSONContent }) => void;
}

export function SimpleEditor({ content = '', onChange, onUpdate }: SimpleEditorProps) {
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
    ],
    []
  );

  const latestOnUpdate = useRef(onUpdate);
  useEffect(() => {
    latestOnUpdate.current = onUpdate;
  }, [onUpdate]);

  const editor = useEditor({
    extensions,
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const json = editor.getJSON();
      onChange?.(html);
      latestOnUpdate.current?.({ html, json });
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[320px] px-6 py-5 focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [editor, content]);

  useEffect(() => {
    if (editor) {
      const html = editor.getHTML();
      const json = editor.getJSON();
      onChange?.(html);
      latestOnUpdate.current?.({ html, json });
    }
  }, [editor, onChange]);

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({
    onClick,
    active,
    disabled,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        px-2.5 py-1.5 rounded-lg transition-all text-sm
        ${disabled
          ? 'opacity-40 cursor-not-allowed'
          : active
            ? 'bg-primary/20 text-foreground'
            : 'hover:bg-primary/10 text-foreground/70'}
      `}
    >
      {children}
    </button>
  );

  return (
    <div className='surface-strong border border-border/25 rounded-xl overflow-hidden theme-shadow'>
      <div className='surface-light border-b border-border/25 p-2 flex flex-wrap items-center gap-1'>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          title='加粗'
        >
          <Bold className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          title='斜体'
        >
          <Italic className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          title='行内代码'
        >
          <Code className='w-4 h-4' />
        </ToolbarButton>

        <div className='w-px h-6 bg-border/40' />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          disabled={!editor.can().chain().focus().toggleHeading({ level: 1 }).run()}
          title='标题 1'
        >
          <Heading1 className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          disabled={!editor.can().chain().focus().toggleHeading({ level: 2 }).run()}
          title='标题 2'
        >
          <Heading2 className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          disabled={!editor.can().chain().focus().toggleHeading({ level: 3 }).run()}
          title='标题 3'
        >
          <Heading3 className='w-4 h-4' />
        </ToolbarButton>

        <div className='w-px h-6 bg-border/40' />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          disabled={!editor.can().chain().focus().toggleBulletList().run()}
          title='无序列表'
        >
          <List className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          disabled={!editor.can().chain().focus().toggleOrderedList().run()}
          title='有序列表'
        >
          <ListOrdered className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          disabled={!editor.can().chain().focus().toggleBlockquote().run()}
          title='引用'
        >
          <Quote className='w-4 h-4' />
        </ToolbarButton>

        <div className='w-px h-6 bg-border/40' />

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          disabled={!editor.can().chain().focus().setHorizontalRule().run()}
          title='分割线'
        >
          <Minus className='w-4 h-4' />
        </ToolbarButton>

        <div className='w-px h-6 bg-border/40' />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title='撤销'
        >
          <Undo className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title='重做'
        >
          <Redo className='w-4 h-4' />
        </ToolbarButton>
      </div>

      <div className='p-0'>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
