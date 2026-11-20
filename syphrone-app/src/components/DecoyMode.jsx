import { useState, useRef, useCallback } from 'react';

const INITIAL_TASKS = [
  { id: 1, text: 'Buy groceries', done: false },
  { id: 2, text: 'Call dentist appointment', done: true },
  { id: 3, text: 'Finish project report', done: false },
  { id: 4, text: 'Gym session at 6pm', done: false },
  { id: 5, text: 'Read chapter 12', done: false },
];

export default function DecoyMode({ onExit }) {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [input, setInput] = useState('');
  const clickCount = useRef(0);
  const clickTimer = useRef(null);

  const handleTitleClick = useCallback(() => {
    clickCount.current++;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    if (clickCount.current >= 3) {
      clickCount.current = 0;
      onExit();
      return;
    }
    clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 2000);
  }, [onExit]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks(t => [...t, { id: Date.now(), text: input, done: false }]);
    setInput('');
  };

  const toggleTask = (id) => setTasks(t => t.map(task => task.id === id ? { ...task, done: !task.done } : task));
  const deleteTask = (id) => setTasks(t => t.filter(task => task.id !== id));

  return (
    <div className="decoy-overlay" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <span className="text-sm text-gray-500">📱 My Tasks</span>
        <span className="text-sm text-gray-500">🔋 87% · 📶 · 9:41 AM</span>
      </div>

      {/* Header */}
      <div className="px-4 py-5 border-b border-gray-200">
        <h1
          onClick={handleTitleClick}
          className="text-2xl font-bold text-gray-900 select-none cursor-default"
          style={{ fontFamily: '-apple-system, sans-serif' }}
        >
          Today's Tasks
        </h1>
        <p className="text-sm text-gray-500 mt-1">{tasks.filter(t => !t.done).length} remaining</p>
      </div>

      {/* Task list */}
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
        {tasks.map(task => (
          <div key={task.id} className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 hover:bg-gray-50">
            <button onClick={() => toggleTask(task.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.done ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
              {task.done && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>}
            </button>
            <span className={`flex-1 text-base ${task.done ? 'line-through text-gray-400' : 'text-gray-900'}`}>
              {task.text}
            </span>
            <button onClick={() => deleteTask(task.id)} className="text-gray-300 hover:text-gray-500 text-lg leading-none">&times;</button>
          </div>
        ))}
      </div>

      {/* Add task */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="Add a task..."
          className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-base outline-none focus:border-blue-400"
          style={{ fontFamily: 'inherit' }}
        />
        <button onClick={addTask}
          className="px-5 py-2 bg-blue-500 text-white rounded-xl text-base font-medium hover:bg-blue-600 transition-colors">
          Add
        </button>
      </div>
    </div>
  );
}
