import { useState, useRef } from 'react'
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
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !body.trim()) {
      setError(t.titleBodyRequired)
      return
    }

    try {
      setLoading(true)

      let image_path: string | null = null
      let image_name: string | null = null
      let image_size: number | null = null

      if (imageFile) {
        const formData = new FormData()
        formData.append('image', imageFile)
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        if (!uploadRes.ok) {
          throw new Error(t.failedUploadImage)
        }
        const uploaded = await uploadRes.json()
        image_path = uploaded.path
        image_name = uploaded.originalName
        image_size = uploaded.size
      }

      const response = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          name: name || 'Anonymous',
          body,
          image_path,
          image_name,
          image_size
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
      setImageFile(null)
      setImagePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
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

      <div className="form-group">
        <label>{t.imageLabel}</label>
        <div className="image-upload-area">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            disabled={loading}
            className="file-input-hidden"
            id="thread-image-input"
          />
          <label
            htmlFor="thread-image-input"
            className={`file-select-btn${loading ? ' disabled' : ''}`}
          >
            {t.imageSelectBtn}
          </label>
          {imageFile && (
            <span className="image-filename">{imageFile.name}</span>
          )}
          {imageFile && !loading && (
            <button
              type="button"
              className="image-remove-btn"
              onClick={handleRemoveImage}
            >
              {t.imageRemoveBtn}
            </button>
          )}
        </div>
        <div className="image-allowed-types">{t.imageAllowedTypes}</div>

        {imagePreview && (
          <div className="image-preview-wrap">
            <img src={imagePreview} alt="preview" className="image-preview" />
          </div>
        )}
      </div>

      <button type="submit" disabled={loading}>
        {loading
          ? (imageFile && !imagePreview ? t.imageUploading : t.creating)
          : t.createThread}
      </button>
    </form>
  )
}
