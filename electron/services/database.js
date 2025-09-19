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
    if (this.db) {
      return this.db;
    }

    const userDataPath = app.getPath('userData');
    const dbDir = path.join(userDataPath, 'data');

    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    this.dbPath = path.join(dbDir, 'nanning.db');

    try {
      this.db = new Database(this.dbPath);
      this.db.pragma('journal_mode = WAL');
      this.createTables();
      try {
        this.ensureFTS();
      } catch (ftsError) {
        console.warn('FTS init failed:', ftsError?.message || ftsError);
      }
      console.log('Database initialized at:', this.dbPath);
      return this.db;
    } catch (error) {
      console.error('Failed to initialize database connection:', error);
      if (this.db) {
        try {
          this.db.close();
        } catch (_) {
          // ignore
        }
      }
      this.db = null;
      throw error;
    }
  }

  createTables() {
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
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        color TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
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
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS themes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        mode TEXT NOT NULL,
        gradient TEXT NOT NULL,
        colors TEXT NOT NULL,
        glass TEXT NOT NULL,
        is_preset INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_documents_folder ON documents(folder_id);
      CREATE INDEX IF NOT EXISTS idx_documents_created ON documents(created_at);
      CREATE INDEX IF NOT EXISTS idx_documents_updated ON documents(updated_at);
      CREATE INDEX IF NOT EXISTS idx_folders_parent ON folders(parent_id);
    `);
  }
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
  saveTheme(theme) {
    const stmt = this.db.prepare(`
      INSERT INTO themes (id, name, mode, gradient, colors, glass, is_preset)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = ?,
        mode = ?,
        gradient = ?,
        colors = ?,
        glass = ?,
        updated_at = CURRENT_TIMESTAMP
    `);

    return stmt.run(
      theme.id,
      theme.name,
      theme.mode,
      JSON.stringify(theme.gradient),
      JSON.stringify(theme.colors),
      JSON.stringify(theme.glass),
      theme.isPreset ? 1 : 0,
      theme.name,
      theme.mode,
      JSON.stringify(theme.gradient),
      JSON.stringify(theme.colors),
      JSON.stringify(theme.glass)
    );
  }

  getTheme(id) {
    const stmt = this.db.prepare('SELECT * FROM themes WHERE id = ?');
    const row = stmt.get(id);

    if (row) {
      return {
        ...row,
        gradient: JSON.parse(row.gradient),
        colors: JSON.parse(row.colors),
        glass: JSON.parse(row.glass),
        isPreset: row.is_preset === 1,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    }
    return null;
  }

  getAllThemes() {
    const stmt = this.db.prepare('SELECT * FROM themes ORDER BY updated_at DESC');
    const rows = stmt.all();

    return rows.map(row => ({
      ...row,
      gradient: JSON.parse(row.gradient),
      colors: JSON.parse(row.colors),
      glass: JSON.parse(row.glass),
      isPreset: row.is_preset === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }

  deleteTheme(id) {
    const stmt = this.db.prepare('DELETE FROM themes WHERE id = ? AND is_preset = 0');
    return stmt.run(id);
  }
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
    this.dbPath = null;
  }
  searchDocumentsFts(query) {
    try {
      const hasFts = this.db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='documents_fts'").get();
      if (hasFts) {
        const stmtFts = this.db.prepare(`
          SELECT d.* FROM documents d
          JOIN documents_fts f ON f.id = d.id
          WHERE d.is_deleted = 0 AND documents_fts MATCH ?
          ORDER BY d.updated_at DESC
        `);
        const rows = stmtFts.all(query);
        return rows.map(doc => {
          if (doc.tags) {
            try { doc.tags = JSON.parse(doc.tags); } catch {}
          }
          return doc;
        });
      }
    } catch (_) {
      // ignore and fallback
    }
    return this.searchDocuments(query);
  }

  // Initialize FTS5 tables and triggers for documents
  ensureFTS() {
    this.db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS documents_fts USING fts5(
        id UNINDEXED,
        title,
        content
      );

      CREATE TRIGGER IF NOT EXISTS documents_ai AFTER INSERT ON documents BEGIN
        INSERT INTO documents_fts(id, title, content) VALUES (new.id, new.title, new.content);
      END;
      CREATE TRIGGER IF NOT EXISTS documents_ad AFTER DELETE ON documents BEGIN
        DELETE FROM documents_fts WHERE id = old.id;
      END;
      CREATE TRIGGER IF NOT EXISTS documents_au AFTER UPDATE ON documents BEGIN
        DELETE FROM documents_fts WHERE id = old.id;
        INSERT INTO documents_fts(id, title, content) VALUES (new.id, new.title, new.content);
      END;
    `);
  }
}

module.exports = new DatabaseService();
