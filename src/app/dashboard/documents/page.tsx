'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Code,
  Plus,
  Search,
  Trash2,
  Edit3,
  Calendar,
  FolderOpen,
  Tag
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  content: string;
  type: 'richtext' | 'code' | 'markdown';
  language?: string;
  folder_id?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const result = await (window as any).electron.db.getAllDocuments();
      if (result.success && result.data) {
        setDocuments(result.data);
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadDocuments();
      return;
    }

    setIsLoading(true);
    try {
      const result = await (window as any).electron.db.searchDocuments(searchQuery);
      if (result.success && result.data) {
        setDocuments(result.data);
      }
    } catch (error) {
      console.error('Failed to search documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this document?')) {
      try {
        await (window as any).electron.db.updateDocument(id, { is_deleted: 1 });
        loadDocuments();
      } catch (error) {
        console.error('Failed to delete document:', error);
      }
    }
  };

  const openDocument = (id: string) => {
    router.push(`/dashboard/editor?id=${id}`);
  };

  const createNewDocument = () => {
    router.push('/dashboard/editor');
  };

  const filteredDocuments = documents.filter(doc =>
    selectedType === 'all' || doc.type === selectedType
  );

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'code':
        return <Code className="w-5 h-5" />;
      case 'markdown':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="glass border-b border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Documents</h1>
          <button
            onClick={createNewDocument}
            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 transition-all flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Document</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-2 rounded-lg transition-all ${
                selectedType === 'all'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'hover:bg-white/10 text-gray-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType('richtext')}
              className={`px-3 py-2 rounded-lg transition-all ${
                selectedType === 'richtext'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'hover:bg-white/10 text-gray-400'
              }`}
            >
              Rich Text
            </button>
            <button
              onClick={() => setSelectedType('code')}
              className={`px-3 py-2 rounded-lg transition-all ${
                selectedType === 'code'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'hover:bg-white/10 text-gray-400'
              }`}
            >
              Code
            </button>
            <button
              onClick={() => setSelectedType('markdown')}
              className={`px-3 py-2 rounded-lg transition-all ${
                selectedType === 'markdown'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'hover:bg-white/10 text-gray-400'
              }`}
            >
              Markdown
            </button>
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 p-6 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">Loading documents...</div>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <FolderOpen className="w-16 h-16 text-gray-600 mb-4" />
            <p className="text-gray-400 mb-4">No documents found</p>
            <button
              onClick={createNewDocument}
              className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 transition-all"
            >
              Create your first document
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                onClick={() => openDocument(doc.id)}
                className="glass p-4 rounded-lg hover:bg-white/5 cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2 text-purple-400">
                    {getDocumentIcon(doc.type)}
                    <span className="text-xs uppercase">{doc.type}</span>
                  </div>
                  <button
                    onClick={(e) => handleDelete(doc.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded text-red-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-white font-semibold mb-2 truncate">
                  {doc.title}
                </h3>

                <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                  {doc.content || 'No content'}
                </p>

                {doc.tags && doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {doc.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(doc.updated_at)}</span>
                  </div>
                  {doc.language && (
                    <span className="text-purple-400">{doc.language}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="glass border-t border-white/10 px-6 py-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{filteredDocuments.length} documents</span>
          <span>Last updated: {documents[0] ? formatDate(documents[0].updated_at) : 'Never'}</span>
        </div>
      </div>
    </div>
  );
}