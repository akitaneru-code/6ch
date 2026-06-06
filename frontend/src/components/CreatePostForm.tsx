import { useState } from 'react'
import './CreatePostForm.css'

interface CreatePostFormProps {
  threadId: string
  onPostCreated: () => void
}

export default function CreatePostForm({ threadId, onPostCreated }: CreatePostFormProps) {
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!body.trim()) {
      setError('Message is required')
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/posts/${threadId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || 'Anonymous',
          subject: subject || null,
          body
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      onPostCreated()
      setName('')
      setSubject('')
      setBody('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <h3>Reply to Thread</h3>
      
      {error && <div className="error-message">{error}</div>}

      <div className="form-row">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Anonymous"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Optional"
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Message *</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Enter your reply"
          rows={4}
          disabled={loading}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Posting...' : 'Post Reply'}
      </button>
    </form>
  )
}
