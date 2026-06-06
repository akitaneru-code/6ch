import { useState } from 'react'
import type { Thread } from '../types'
import './CreateThreadForm.css'

interface CreateThreadFormProps {
  onThreadCreated: (thread: Thread) => void
}

export default function CreateThreadForm({ onThreadCreated }: CreateThreadFormProps) {
  const [title, setTitle] = useState('')
  const [name, setName] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !body.trim()) {
      setError('Title and body are required')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          name: name || 'Anonymous',
          body
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create thread')
      }

      const thread = await response.json()
      onThreadCreated(thread)
      setTitle('')
      setName('')
      setBody('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="create-thread-form" onSubmit={handleSubmit}>
      <h2>Create New Thread</h2>
      
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Thread title"
          disabled={loading}
        />
      </div>

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
        <label>Message *</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Enter your message"
          rows={6}
          disabled={loading}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Thread'}
      </button>
    </form>
  )
}
