import { useState, useEffect } from 'react'
import type { Thread, Post } from '../types'
import CreatePostForm from './CreatePostForm'
import './ThreadDetail.css'

interface ThreadDetailProps {
  thread: Thread
  onPostCreated: () => void
}

export default function ThreadDetail({ thread, onPostCreated }: ThreadDetailProps) {
  const [posts, setPosts] = useState<Post[]>(thread.posts || [])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchThread()
  }, [thread.id])

  const fetchThread = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/threads/${thread.id}`)
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Failed to fetch thread:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePostCreated = () => {
    fetchThread()
    onPostCreated()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="thread-detail">
      <div className="thread-info">
        <h1>{thread.title}</h1>
      </div>

      {loading ? (
        <div className="loading">Loading posts...</div>
      ) : (
        <div className="posts-container">
          {posts.map((post, index) => (
            <div key={post.id} className={`post ${post.is_op ? 'op' : ''}`}>
              <div className="post-header">
                <span className="post-number">No.{index + 1}</span>
                <span className="post-name">{post.name}</span>
                {post.email && <span className="post-email">{post.email}</span>}
                <span className="post-date">{formatDate(post.created_at)}</span>
              </div>
              {post.subject && <div className="post-subject">{post.subject}</div>}
              <div className="post-body">{post.body}</div>
              {post.image_path && (
                <img src={post.image_path} alt="post image" className="post-image" />
              )}
            </div>
          ))}
        </div>
      )}

      <CreatePostForm threadId={thread.id} onPostCreated={handlePostCreated} />
    </div>
  )
}
