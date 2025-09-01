import api from './api';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types/Task';

const taskService = {
  async getAllTasks(): Promise<Task[]> {
    const response = await api.get<{ status: number; message: string; data: Task[] }>('/tasks');
    return response.data.data; // Access the nested data array
  },

  async getTaskById(id: string): Promise<Task> {
    const response = await api.get<{ status: number; message: string; data: Task }>(`/tasks/${id}`);
    return response.data.data; // Access the nested data object
  },

  async createTask(taskData: CreateTaskDto): Promise<Task> {
    const response = await api.post<{ status: number; message: string; data: Task }>('/tasks', taskData);
    return response.data.data; // Access the nested data object
  },

  async updateTask(id: string, taskData: UpdateTaskDto): Promise<Task> {
    const response = await api.patch<{ status: number; message: string; data: Task }>(`/tasks/${id}`, taskData);
    return response.data.data; // Access the nested data object
  },

  async updateTaskTitle(id: string, title: string): Promise<Task> {
    const response = await api.patch<{ status: number; message: string; data: Task }>(`/tasks/${id}/title`, { title });
    return response.data.data; // Access the nested data object
  },

  async deleteTask(id: string): Promise<Task> {
    const response = await api.delete<{ status: number; message: string; data: Task }>(`/tasks/${id}`);
    return response.data.data; // Access the nested data object
  },
};

export default taskService;
