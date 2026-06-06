import type { Thread } from '../types'
import './ThreadList.css'

interface ThreadListProps {
  threads: Thread[]
  onSelectThread: (thread: Thread) => void
}

export default function ThreadList({ threads, onSelectThread }: ThreadListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="thread-list">
      {threads.map(thread => (
        <div 
          key={thread.id} 
          className="thread-item"
          onClick={() => onSelectThread(thread)}
        >
          <div className="thread-header">
            <h3 className="thread-title">{thread.title}</h3>
            <span className="thread-count">[{thread.post_count}]</span>
          </div>
          <div className="thread-meta">
            <span className="created">{formatDate(thread.created_at)}</span>
            <span className="updated">Last: {formatDate(thread.bump_at)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
