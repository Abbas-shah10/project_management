import { useState } from 'react';
import { Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Note } from '../../lib/types';
import { useAppStore } from '../../stores/app-store';

interface CommentTimelineProps {
  taskId: string;
  notes: Note[];
}

export default function CommentTimeline({ taskId, notes }: CommentTimelineProps) {
  const [content, setContent] = useState('');
  const addComment = useAppStore((s) => s.addComment);

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const newNote: Note = {
      _id: `n-${Date.now()}`,
      project: notes[0]?.project || '',
      createdBy: notes[0]?.createdBy || { _id: '', username: '', email: '', fullName: '', isEmailVerified: false, createdAt: '', updatedAt: '' },
      content: trimmed,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addComment(newNote);
    setContent('');
  };

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const colors = [
    'bg-blue-500', 'bg-emerald-500', 'bg-violet-500',
    'bg-amber-500', 'bg-rose-500', 'bg-cyan-500',
  ];

  const getColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="flex flex-col gap-3">
      {notes.length === 0 && (
        <p className="text-sm text-[var(--text-tertiary)] py-2">No comments yet.</p>
      )}

      {notes.map((note) => {
        const initials = getInitials(note.createdBy.fullName || note.createdBy.username);
        const color = getColor(note.createdBy.fullName || note.createdBy.username);

        return (
          <div key={note._id} className="flex gap-3">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-xs font-medium`}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {note.createdBy.fullName || note.createdBy.username}
                </span>
                <span className="text-xs text-[var(--text-tertiary)]">
                  {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5 whitespace-pre-wrap">
                {note.content}
              </p>
            </div>
          </div>
        );
      })}

      <div className="flex gap-2 mt-2 pt-3 border-t border-[var(--border-primary)]">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Write a comment..."
          rows={2}
          className="flex-1 text-sm px-3 py-2 bg-transparent border border-[var(--border-primary)] rounded-md focus:outline-none focus:border-[var(--accent-primary)] placeholder:text-[var(--text-tertiary)] resize-none transition-colors"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="self-end p-2 text-[var(--accent-primary)] hover:bg-[var(--bg-hover)] rounded-md transition-colors disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
