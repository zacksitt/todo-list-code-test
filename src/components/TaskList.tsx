import React, { useState, useEffect } from 'react';
import { Task } from '../types/Task';
import taskService from '../services/taskService';
import authService from '../services/authService';
import './TaskList.css';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  useEffect(() => {
    // Only load tasks if user is authenticated
    if (authService.isAuthenticated()) {
      console.log('🔍 User is authenticated, loading tasks...');
      loadTasks();
    } else {
      console.log('⚠️ User is not authenticated, skipping task load');
      setLoading(false);
    }
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await taskService.getAllTasks();
      setTasks(fetchedTasks);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Please log in to view tasks');
      } else {
        setError('Failed to load tasks');
      }
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const newTask = await taskService.createTask({ title: newTaskTitle.trim() });
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Please log in to create tasks');
      } else {
        setError('Failed to create task');
      }
      console.error('Error creating task:', err);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const updatedTask = await taskService.updateTask(task._id, {
        completed: !task.completed,
      });
      setTasks(tasks.map(t => t._id === task._id ? updatedTask : t));
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Please log in to update tasks');
      } else {
        setError('Failed to update task');
      }
      console.error('Error updating task:', err);
    }
  };

  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task._id);
    setEditingTitle(task.title);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingTitle('');
  };

  const handleSaveEdit = async (taskId: string) => {
    if (!editingTitle.trim()) {
      setError('Task title cannot be empty');
      return;
    }

    try {
      const updatedTask = await taskService.updateTaskTitle(taskId, editingTitle.trim());
      setTasks(tasks.map(t => t._id === taskId ? updatedTask : t));
      setEditingTaskId(null);
      setEditingTitle('');
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Please log in to update tasks');
      } else {
        setError('Failed to update task title');
      }
      console.error('Error updating task title:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, taskId: string) => {
    if (e.key === 'Enter') {
      handleSaveEdit(taskId);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(t => t._id !== taskId));
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Please log in to delete tasks');
      } else {
        setError('Failed to delete task');
      }
      console.error('Error deleting task:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="task-list-container">
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleCreateTask} className="task-form">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter a new task..."
          className="task-input"
        />
        <button type="submit" className="add-button">
          Add Task
        </button>
      </form>

      <div className="tasks-container">
        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks yet. Create your first task above!</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-content">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task)}
                  className="task-checkbox"
                />
                {editingTaskId === task._id ? (
                  <div className="edit-container">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, task._id)}
                      className="edit-input"
                      autoFocus
                    />
                    <div className="edit-buttons">
                      <button
                        onClick={() => handleSaveEdit(task._id)}
                        className="save-button"
                        title="Save changes"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="cancel-button"
                        title="Cancel editing"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <span 
                    className="task-title"
                    onDoubleClick={() => handleStartEdit(task)}
                    title="Double-click to edit"
                  >
                    {task.title}
                  </span>
                )}
                <div className="task-meta">
                  <span className="task-date">
                    Created: {formatDate(task.createdAt)}
                  </span>
                  {task.updatedAt !== task.createdAt && (
                    <span className="task-date">
                      Updated: {formatDate(task.updatedAt)}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDeleteTask(task._id)}
                className="delete-button"
                title="Delete task"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
