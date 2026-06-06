import sqlite3 from 'sqlite3';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/6ch.db');
const db = new sqlite3.Database(dbPath);

const initDatabase = () => {
  db.serialize(() => {
    // Threads table
    db.run(`
      CREATE TABLE IF NOT EXISTS threads (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        post_count INTEGER DEFAULT 1,
        bump_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_archived BOOLEAN DEFAULT 0,
        is_locked BOOLEAN DEFAULT 0
      )
    `);

    // Posts table
    db.run(`
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        thread_id TEXT NOT NULL,
        name TEXT DEFAULT 'Anonymous',
        email TEXT,
        subject TEXT,
        body TEXT NOT NULL,
        image_path TEXT,
        image_name TEXT,
        image_size INTEGER,
        image_width INTEGER,
        image_height INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        ip_hash TEXT,
        user_agent TEXT,
        is_op BOOLEAN DEFAULT 0,
        FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE
      )
    `);

    // Create indexes for better query performance
    db.run(`CREATE INDEX IF NOT EXISTS idx_posts_thread_id ON posts(thread_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_threads_bump_at ON threads(bump_at)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_threads_is_archived ON threads(is_archived)`);

    console.log('✅ Database initialized successfully');
  });

  db.close();
};

initDatabase();
