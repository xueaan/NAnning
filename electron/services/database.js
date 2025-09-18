const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');
const fs = require('fs');

class DatabaseService {
  constructor() {
    this.db = null;
    this.dbPath = null;
  }

  init() {
    // 确定数据库路径
    const userDataPath = app.getPath('userData');
    const dbDir = path.join(userDataPath, 'data');

    // 确保目录存在
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    this.dbPath = path.join(dbDir, 'nanning.db');

    // 创建或打开数据库
    this.db = new Database(this.dbPath);

    // 启用 WAL 模式以提高性能
    this.db.pragma('journal_mode = WAL');

    // 创建表
    this.createTables();

    console.log('Database initialized at:', this.dbPath);
  }

  createTables() {
    // 文档表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        type TEXT DEFAULT 'richtext',
        language TEXT DEFAULT 'plaintext',
        folder_id TEXT,
        tags TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0
      )
    `);

    // 文件夹表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS folders (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        parent_id TEXT,
        icon TEXT,
        color TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 标签表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        color TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 设置表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 知识库表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS knowledge_bases (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        color TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建索引
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_documents_folder ON documents(folder_id);
      CREATE INDEX IF NOT EXISTS idx_documents_created ON documents(created_at);
      CREATE INDEX IF NOT EXISTS idx_documents_updated ON documents(updated_at);
      CREATE INDEX IF NOT EXISTS idx_folders_parent ON folders(parent_id);
    `);
  }

  // 文档操作
  createDocument(doc) {
    const stmt = this.db.prepare(`
      INSERT INTO documents (id, title, content, type, language, folder_id, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    return stmt.run(
      doc.id,
      doc.title,
      doc.content || '',
      doc.type || 'richtext',
      doc.language || 'plaintext',
      doc.folder_id || null,
      doc.tags ? JSON.stringify(doc.tags) : null
    );
  }

  updateDocument(id, updates) {
    const fields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      if (key !== 'id') {
        fields.push(`${key} = ?`);
        values.push(key === 'tags' ? JSON.stringify(updates[key]) : updates[key]);
      }
    });

    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE documents
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    return stmt.run(...values);
  }

  getDocument(id) {
    const stmt = this.db.prepare('SELECT * FROM documents WHERE id = ? AND is_deleted = 0');
    const doc = stmt.get(id);
    if (doc && doc.tags) {
      doc.tags = JSON.parse(doc.tags);
    }
    return doc;
  }

  getAllDocuments() {
    const stmt = this.db.prepare('SELECT * FROM documents WHERE is_deleted = 0 ORDER BY updated_at DESC');
    const docs = stmt.all();
    return docs.map(doc => {
      if (doc.tags) {
        doc.tags = JSON.parse(doc.tags);
      }
      return doc;
    });
  }

  deleteDocument(id) {
    const stmt = this.db.prepare('UPDATE documents SET is_deleted = 1 WHERE id = ?');
    return stmt.run(id);
  }

  // 文件夹操作
  createFolder(folder) {
    const stmt = this.db.prepare(`
      INSERT INTO folders (id, name, parent_id, icon, color)
      VALUES (?, ?, ?, ?, ?)
    `);

    return stmt.run(
      folder.id,
      folder.name,
      folder.parent_id || null,
      folder.icon || null,
      folder.color || null
    );
  }

  getAllFolders() {
    const stmt = this.db.prepare('SELECT * FROM folders ORDER BY name');
    return stmt.all();
  }

  // 设置操作
  getSetting(key) {
    const stmt = this.db.prepare('SELECT value FROM settings WHERE key = ?');
    const result = stmt.get(key);
    return result ? result.value : null;
  }

  setSetting(key, value) {
    const stmt = this.db.prepare(`
      INSERT INTO settings (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP
    `);

    return stmt.run(key, value, value);
  }

  // 搜索功能
  searchDocuments(query) {
    const stmt = this.db.prepare(`
      SELECT * FROM documents
      WHERE is_deleted = 0
      AND (title LIKE ? OR content LIKE ?)
      ORDER BY updated_at DESC
    `);

    const searchTerm = `%${query}%`;
    const results = stmt.all(searchTerm, searchTerm);

    return results.map(doc => {
      if (doc.tags) {
        doc.tags = JSON.parse(doc.tags);
      }
      return doc;
    });
  }

  // 关闭数据库
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

module.exports = new DatabaseService();