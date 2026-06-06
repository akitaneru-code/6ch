import sqlite3 from 'sqlite3';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/6ch.db');
let db: sqlite3.Database | null = null;

export const getDB = (): sqlite3.Database => {
  if (!db) {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Database connection error:', err);
      } else {
        console.log('📦 Connected to SQLite database');
      }
    });
  }
  return db;
};

export const closeDB = (): void => {
  if (db) {
    db.close();
    db = null;
  }
};
