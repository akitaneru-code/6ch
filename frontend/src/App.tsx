import { useEffect, useState } from 'react'
import ThreadList from './components/ThreadList'
import ThreadDetail from './components/ThreadDetail'
import CreateThreadForm from './components/CreateThreadForm'
import LangSelector from './components/LangSelector'
import { useLang } from './i18n/LangContext'
import type { Thread } from './types'
import './App.css'

function App() {
  const { t } = useLang()
  const [threads, setThreads] = useState<Thread[]>([])
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchThreads()
  }, [])

  const fetchThreads = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/threads')
      const data = await response.json()
      setThreads(data.data || [])
    } catch (error) {
      console.error('Failed to fetch threads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleThreadCreated = (newThread: Thread) => {
    setThreads([newThread, ...threads])
    setShowCreateForm(false)
    setSelectedThread(newThread)
  }

  if (selectedThread) {
    return (
      <div className="6ch-container">
        <header className="6ch-header">
          <h1>{t.siteTitle}</h1>
          <div className="header-right">
            <LangSelector />
            <button
              className="back-btn"
              onClick={() => setSelectedThread(null)}
            >
              {t.backToThreads}
            </button>
          </div>
        </header>
        <ThreadDetail
          thread={selectedThread}
          onPostCreated={() => {
            fetchThreads()
          }}
        />
      </div>
    )
  }

  return (
    <div className="6ch-container">
      <header className="6ch-header">
        <h1>{t.siteTitle}</h1>
        <div className="header-right">
          <LangSelector />
          <button
            className="create-btn"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? t.close : t.newThread}
          </button>
        </div>
      </header>

      {showCreateForm && (
        <CreateThreadForm onThreadCreated={handleThreadCreated} />
      )}

      {loading ? (
        <div className="loading">{t.loadingThreads}</div>
      ) : threads.length === 0 ? (
        <div className="no-threads">{t.noThreads}</div>
      ) : (
        <ThreadList
          threads={threads}
          onSelectThread={setSelectedThread}
        />
      )}
    </div>
  )
}

export default App
