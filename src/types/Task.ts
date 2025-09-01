export interface Task {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface CreateTaskDto {
  title: string;
  completed?: boolean;
}

export interface UpdateTaskDto {
  title?: string;
  completed?: boolean;
}
