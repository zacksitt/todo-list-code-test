import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from './TaskList';

// Mock the services
jest.mock('../services/taskService', () => ({
  __esModule: true,
  default: {
    getAllTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
}));

jest.mock('../services/authService', () => ({
  __esModule: true,
  default: {
    getToken: jest.fn(() => 'mock-token'),
    isAuthenticated: jest.fn(() => true),
    setToken: jest.fn(),
  },
}));

const mockAuthService = require('../services/authService').default;

const mockTaskService = require('../services/taskService').default;

describe('TaskList Component', () => {
  const mockTasks = [
    {
      _id: '1',
      title: 'Test Task 1',
      completed: false,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      createdBy: {
        _id: 'user1',
        name: 'John Doe',
        email: 'john@example.com'
      }
    },
    {
      _id: '2',
      title: 'Test Task 2',
      completed: true,
      createdAt: '2023-01-02T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
      createdBy: {
        _id: 'user2',
        name: 'Jane Smith',
        email: 'jane@example.com'
      }
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Ensure authentication is mocked correctly
    mockAuthService.isAuthenticated.mockReturnValue(true);
  });

  test('renders task list with tasks', async () => {
    mockTaskService.getAllTasks.mockResolvedValue(mockTasks);

    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  test('creates a new task', async () => {
    mockTaskService.getAllTasks.mockResolvedValue([]);
    const newTask = {
      _id: '3',
      title: 'New Task',
      completed: false,
      createdAt: '2023-01-03T00:00:00.000Z',
      updatedAt: '2023-01-03T00:00:00.000Z',
      createdBy: {
        _id: 'user3',
        name: 'New User',
        email: 'newuser@example.com'
      }
    };
    mockTaskService.createTask.mockResolvedValue(newTask);

    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter a new task...')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Enter a new task...');
    const addButton = screen.getByText('Add Task');

    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockTaskService.createTask).toHaveBeenCalledWith({ title: 'New Task' });
    });
  });

  test('toggles task completion', async () => {
    mockTaskService.getAllTasks.mockResolvedValue(mockTasks);
    const updatedTask = { ...mockTasks[0], completed: true };
    mockTaskService.updateTask.mockResolvedValue(updatedTask);

    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getAllByRole('checkbox')).toHaveLength(2);
    });

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); // Click the first checkbox

    await waitFor(() => {
      expect(mockTaskService.updateTask).toHaveBeenCalledWith('1', { completed: true });
    });
  });

  test('deletes a task', async () => {
    mockTaskService.getAllTasks.mockResolvedValue(mockTasks);
    mockTaskService.deleteTask.mockResolvedValue(mockTasks[0]);

    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getAllByText('×')).toHaveLength(2);
    });

    const deleteButtons = screen.getAllByText('×');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockTaskService.deleteTask).toHaveBeenCalledWith('1');
    });
  });

  test('shows error message when API fails', async () => {
    mockTaskService.getAllTasks.mockRejectedValue(new Error('API Error'));

    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load tasks')).toBeInTheDocument();
    });
  });

  test('shows no tasks message when list is empty', async () => {
    mockTaskService.getAllTasks.mockResolvedValue([]);

    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText('No tasks yet. Create your first task above!')).toBeInTheDocument();
    });
  });
});
