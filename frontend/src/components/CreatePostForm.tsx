import { useState } from 'react'
import { useLang } from '../i18n/LangContext'
import './CreatePostForm.css'

interface CreatePostFormProps {
  threadId: string
  onPostCreated: () => void
}

export default function CreatePostForm({ threadId, onPostCreated }: CreatePostFormProps) {
  const { t } = useLang()
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!body.trim()) {
      setError(t.messageRequired)
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
        throw new Error(t.failedCreatePost)
      }

      onPostCreated()
      setName('')
      setSubject('')
      setBody('')
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorOccurred)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <h3>{t.replyToThread}</h3>

      {error && <div className="error-message">{error}</div>}

      <div className="form-row">
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
          <label>{t.subjectLabel}</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={t.subjectPlaceholder}
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-group">
        <label>{t.messageLabel}</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={t.replyPlaceholder}
          rows={4}
          disabled={loading}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? t.posting : t.postReply}
      </button>
    </form>
  )
}
