import express, { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../database/connection';

const router: Router = express.Router();

// Create new post in thread
router.post('/:threadId', (req: Request, res: Response) => {
  const { threadId } = req.params;
  const { name = 'Anonymous', subject, body, email } = req.body;

  if (!body) {
    res.status(400).json({ error: 'Body is required' });
    return;
  }

  const postId = uuidv4();
  const db = getDB();

  // Check if thread exists
  db.get('SELECT id FROM threads WHERE id = ?', [threadId], (err, thread) => {
    if (err) {
      res.status(500).json({ error: 'Failed to check thread' });
      return;
    }
    if (!thread) {
      res.status(404).json({ error: 'Thread not found' });
      return;
    }

    // Create post
    db.run(
      `INSERT INTO posts (id, thread_id, name, email, subject, body, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [postId, threadId, name, email || null, subject || null, body, new Date().toISOString()],
      (err) => {
        if (err) {
          res.status(500).json({ error: 'Failed to create post' });
          return;
        }

        // Update thread bump time
        db.run(
          'UPDATE threads SET bump_at = ?, updated_at = ? WHERE id = ?',
          [new Date().toISOString(), new Date().toISOString(), threadId],
          () => {
            res.status(201).json({
              id: postId,
              thread_id: threadId,
              name,
              subject,
              body,
              created_at: new Date().toISOString()
            });
          }
        );
      }
    );
  });
});

// Delete post (optional - for moderation)
router.delete('/:postId', (req: Request, res: Response) => {
  const { postId } = req.params;
  const db = getDB();

  db.run('DELETE FROM posts WHERE id = ?', [postId], (err) => {
    if (err) {
      res.status(500).json({ error: 'Failed to delete post' });
      return;
    }
    res.json({ message: 'Post deleted' });
  });
});

export default router;
