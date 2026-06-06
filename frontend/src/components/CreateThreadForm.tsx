import { useState } from 'react'
import type { Thread } from '../types'
import { useLang } from '../i18n/LangContext'
import './CreateThreadForm.css'

interface CreateThreadFormProps {
  onThreadCreated: (thread: Thread) => void
}

export default function CreateThreadForm({ onThreadCreated }: CreateThreadFormProps) {
  const { t } = useLang()
  const [title, setTitle] = useState('')
  const [name, setName] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !body.trim()) {
      setError(t.titleBodyRequired)
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
        throw new Error(t.failedCreateThread)
      }

      const thread = await response.json()
      onThreadCreated(thread)
      setTitle('')
      setName('')
      setBody('')
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorOccurred)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="create-thread-form" onSubmit={handleSubmit}>
      <h2>{t.createNewThread}</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>{t.titleLabel}</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t.titlePlaceholder}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>{t.nameLabel}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.anonymousPlaceholder}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>{t.messageLabel}</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={t.messagePlaceholder}
          rows={6}
          disabled={loading}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? t.creating : t.createThread}
      </button>
    </form>
  )
}
