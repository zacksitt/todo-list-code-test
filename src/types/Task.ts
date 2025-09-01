export interface Task {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  completed?: boolean;
}

export interface UpdateTaskDto {
  title?: string;
  completed?: boolean;
}
