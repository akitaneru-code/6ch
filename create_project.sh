#!/usr/bin/env bash
set -euo pipefail

# Simple scaffold script for 6ch anonymous imageboard
# Save as create_project.sh, then run: bash create_project.sh
# After that: npm install && cd backend && npm install && cd ../frontend && npm install
# Run DB init: npm run db:init (from repository root)
# Start dev: npm run dev

ROOT_DIR="$(pwd)/6ch"
if [ -d "$ROOT_DIR" ]; then
  echo "Directory $ROOT_DIR already exists. Remove or choose another location." >&2
  exit 1
fi

mkdir -p "$ROOT_DIR"
cd "$ROOT_DIR"

# Root files
cat > README.md <<'EOF'
# 6ch - Anonymous Imageboard

2ch 스타일의 익명 이미지보드 스레드 웹사이트입니다.

## 기능

- 🧵 익명 스레드 작성 및 댓글 기능
- 🖼️ 이미지 업로드 지원
- ⚡ 실시간 업데이트 (추후 WebSocket 추가 가능)
- 📱 반응형 디자인
- 🔗 2ch 스타일 UI

## 기술 스택

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Database: SQLite (개발용) / PostgreSQL (배포용)
- Image Storage: Local filesystem (uploads/)

## 시작하기

1. 의존성 설치
   - 루트: `npm install`
   - 백엔드: `cd backend && npm install`
   - 프론트엔드: `cd frontend && npm install`

2. 데이터베이스 초기화
   - `npm run db:init` (루트에서 실행하면 backend의 스크립트가 호출됩니다)

3. 개발 서버 실행
   - `npm run dev`

## 주의사항
완전히 익명의 플랫폼이므로, 배포 시 법률·정책 및 악용 방지를 고려해 주세요.
EOF

cat > .env.example <<'EOF'
# Backend Configuration
NODE_ENV=development
PORT=3001
API_URL=http://localhost:3001

# Frontend Configuration
REACT_APP_API_URL=http://localhost:3001
REACT_APP_API_TIMEOUT=30000

# Database Configuration
DB_TYPE=sqlite
DB_PATH=./data/6ch.db

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_EXTENSIONS=jpg,jpeg,png,gif,webp

# CORS
CORS_ORIGIN=http://localhost:3000
EOF

cat > .gitignore <<'EOF'
node_modules/
.env
dist/
build/
*.db
data/
uploads/
.vscode/
.idea/
.DS_Store
logs/
*.log
EOF

cat > package.json <<'EOF'
{
  "name": "6ch",
  "version": "1.0.0",
  "description": "Anonymous imageboard similar to 2ch",
  "main": "backend/src/index.js",
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "build": "concurrently \"npm run build:backend\" \"npm run build:frontend\"",
    "build:backend": "cd backend && npm run build",
    "build:frontend": "cd frontend && npm run build",
    "start": "node backend/dist/index.js",
    "db:init": "cd backend && npm run db:init"
  },
  "dependencies": {
    "concurrently": "^8.0.0"
  },
  "license": "MIT"
}
EOF

# Backend
mkdir -p backend/src/database backend/src/routes backend/src
cat > backend/package.json <<'EOF'
{
  "name": "6ch-backend",
  "version": "1.0.0",
  "description": "6ch imageboard backend",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node-dev --respawn src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:init": "ts-node src/database/init.ts",
    "lint": "eslint src --ext .ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "sqlite3": "^5.1.6",
    "multer": "^1.4.5-lts.1",
    "uuid": "^9.0.0",
    "express-validator": "^7.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.0.0",
    "@types/multer": "^1.4.7",
    "@types/uuid": "^9.0.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0",
    "ts-node-dev": "^2.0.0",
    "eslint": "^8.0.0",
    "@typescript-eslint/eslint-plugin": "^5.0.0",
    "@typescript-eslint/parser": "^5.0.0"
  }
}
EOF

cat > backend/tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

cat > backend/src/index.ts <<'EOF'
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import threadRoutes from './routes/threads';
import postRoutes from './routes/posts';
import uploadRoutes from './routes/upload';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/threads', threadRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}`);
});

export default app;
EOF

cat > backend/src/database/init.ts <<'EOF'
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

    // Indexes
    db.run(`CREATE INDEX IF NOT EXISTS idx_posts_thread_id ON posts(thread_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_threads_bump_at ON threads(bump_at)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_threads_is_archived ON threads(is_archived)`);

    console.log('✅ Database initialized successfully');
  });

  db.close();
};

initDatabase();
EOF

cat > backend/src/database/connection.ts <<'EOF'
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
EOF

cat > backend/src/types/index.ts <<'EOF'
export interface Thread {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  post_count: number;
  bump_at: string;
  is_archived: boolean;
  is_locked: boolean;
  posts?: Post[];
}

export interface Post {
  id: string;
  thread_id: string;
  name: string;
  email?: string;
  subject?: string;
  body: string;
  image_path?: string;
  image_name?: string;
  image_size?: number;
  image_width?: number;
  image_height?: number;
  created_at: string;
  ip_hash?: string;
  user_agent?: string;
  is_op: boolean;
}
EOF

cat > backend/src/routes/threads.ts <<'EOF'
import express, { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../database/connection';
import { Thread } from '../types';

const router: Router = express.Router();

// Get all threads (simple)
router.get('/', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const offset = (page - 1) * limit;

  const db = getDB();

  db.all(
    `SELECT * FROM threads WHERE is_archived = 0 ORDER BY bump_at DESC LIMIT ? OFFSET ?`,
    [limit, offset],
    (err, threads: Thread[]) => {
      if (err) {
        res.status(500).json({ error: 'Failed to fetch threads' });
        return;
      }

      res.json({
        data: threads || [],
        page,
        limit
      });
    }
  );
});

// Get single thread with posts
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDB();

  db.get('SELECT * FROM threads WHERE id = ?', [id], (err, thread: Thread) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch thread' });
      return;
    }
    if (!thread) {
      res.status(404).json({ error: 'Thread not found' });
      return;
    }

    db.all(
      'SELECT * FROM posts WHERE thread_id = ? ORDER BY created_at ASC',
      [id],
      (err, posts) => {
        if (err) {
          res.status(500).json({ error: 'Failed to fetch posts' });
          return;
        }

        res.json({
          ...thread,
          posts:
