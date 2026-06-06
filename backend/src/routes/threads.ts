import express, { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../database/connection';
import { Thread } from '../types';

const router: Router = express.Router();

// Get all threads (with pagination)
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

      // Get post count for each thread
      const threadsWithCount = threads.map(thread => ({
        ...thread,
        post_count: 0
      }));

      res.json({
        data: threadsWithCount,
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

    // Get posts for this thread
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
          posts: posts || []
        });
      }
    );
  });
});

// Create new thread
router.post('/', (req: Request, res: Response) => {
  const { title, name = 'Anonymous', body, email, image_path, image_name, image_size } = req.body;

  if (!title || !body) {
    res.status(400).json({ error: 'Title and body are required' });
    return;
  }

  const threadId = uuidv4();
  const postId = uuidv4();
  const db = getDB();

  db.run('BEGIN TRANSACTION');

  try {
    db.run(
      `INSERT INTO threads (id, title, bump_at, updated_at) VALUES (?, ?, ?, ?)`,
      [threadId, title, new Date().toISOString(), new Date().toISOString()],
      (err) => {
        if (err) {
          db.run('ROLLBACK');
          res.status(500).json({ error: 'Failed to create thread' });
          return;
        }

        db.run(
          `INSERT INTO posts (id, thread_id, name, email, body, image_path, image_name, image_size, created_at, is_op)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [postId, threadId, name, email || null, body,
           image_path || null, image_name || null, image_size || null,
           new Date().toISOString()],
          (err) => {
            if (err) {
              db.run('ROLLBACK');
              res.status(500).json({ error: 'Failed to create post' });
              return;
            }

            db.run('COMMIT');
            res.status(201).json({
              id: threadId,
              title,
              created_at: new Date().toISOString(),
              post_count: 1
            });
          }
        );
      }
    );
  } catch (err) {
    db.run('ROLLBACK');
    res.status(500).json({ error: 'Failed to create thread' });
  }
});

export default router;
