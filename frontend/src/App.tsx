import { useEffect, useState } from 'react'
import ThreadList from './components/ThreadList'
import ThreadDetail from './components/ThreadDetail'
import CreateThreadForm from './components/CreateThreadForm'
import type { Thread } from './types'
import './App.css'

function App() {
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
          <h1>6ch - Anonymous Imageboard</h1>
          <button 
            className="back-btn"
            onClick={() => setSelectedThread(null)}
          >
            ← Back to Threads
          </button>
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
        <h1>6ch - Anonymous Imageboard</h1>
        <button 
          className="create-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? '✕ Close' : '+ New Thread'}
        </button>
      </header>

      {showCreateForm && (
        <CreateThreadForm onThreadCreated={handleThreadCreated} />
      )}

      {loading ? (
        <div className="loading">Loading threads...</div>
      ) : threads.length === 0 ? (
        <div className="no-threads">No threads yet. Create one!</div>
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
