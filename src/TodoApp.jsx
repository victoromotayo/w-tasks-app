import { useState, useEffect } from 'react';

const TodoApp = () => {
  // --- State Management ---
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('w-tasks-kanban');
    return saved ? JSON.parse(saved) : [];
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('w-theme') === 'dark';
  });

  // Form States
  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState('Medium');
  
  // Drag State
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('w-tasks-kanban', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('w-theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  // --- Handlers ---
  const handleAddTask = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    
    const newTask = {
      id: Date.now(),
      text: inputValue,
      status: 'todo', // New status property instead of boolean
      priority: priority,
    };
    
    setTasks([newTask, ...tasks]);
    setInputValue('');
    setPriority('Medium');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // --- DRAG AND DROP LOGIC ---
  const handleDragStart = (e, id) => {
    setDraggedTaskId(id);
    // Makes the dragged item slightly transparent
    setTimeout(() => {
      e.target.classList.add('dragging');
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setDraggedTaskId(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // This is required to allow dropping
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (!draggedTaskId) return;

    setTasks(tasks.map(task => 
      task.id === draggedTaskId ? { ...task, status: newStatus } : task
    ));
    setDraggedTaskId(null);
  };

  // --- Columns Setup ---
  const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'inProgress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
  ];

  return (
    <div className="app-container">
      <div className="dashboard-card">
        
        {/* Header */}
        <header className="header">
          <div>
            <div className="brand-badge">W.</div>
            <h1>Workspace Kanban</h1>
            <p className="subtitle">Drag and drop to manage workflow.</p>
          </div>
          <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </header>

        {/* Input Form */}
        <form onSubmit={handleAddTask} className="task-form">
          <div className="main-input-wrapper">
            <input 
              type="text" 
              placeholder="What needs to be done?" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="task-input"
            />
          </div>
          <div className="meta-inputs">
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="meta-select">
              <option value="Low">Low Priority</option>
              <option value="Medium">Med Priority</option>
              <option value="High">High Priority</option>
            </select>
            <button type="submit" className="btn-add">Add Task</button>
          </div>
        </form>

        {/* Kanban Board */}
        <div className="kanban-board">
          {columns.map(column => (
            <div 
              key={column.id} 
              className="kanban-column"
              onDragEnter={handleDragOver}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="column-header">
                <h2>{column.title}</h2>
                <span className="task-count">
                  {tasks.filter(t => t.status === column.id).length}
                </span>
              </div>
              
              <div className="column-content">
                {tasks.filter(t => t.status === column.id).map(task => (
                  <div 
                    key={task.id} 
                    className="task-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="task-card-header">
                      <span className={`badge badge-${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                      <button className="btn-delete" onClick={() => deleteTask(task.id)}>✕</button>
                    </div>
                    <p className="task-text">{task.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default TodoApp;