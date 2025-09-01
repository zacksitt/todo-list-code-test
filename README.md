# Task Management System - Frontend

A React TypeScript frontend for managing tasks with a beautiful, modern UI.

## User Stories

### 1. User Authentication
**As a user, I want to register and login so that I can access my personal task list.**
- **Acceptance Criteria:**
  - User can register with name, email, and password
  - User can login with email and password
  - Authentication token is stored securely
  - User is redirected to task list after successful authentication
  - Error messages are shown for invalid credentials

### 2. Task Creation
**As a user, I want to create a new task so that I can track my work items.**
- **Acceptance Criteria:**
  - User can enter a task title in an input field
  - User can submit the form to create a task
  - New task appears in the list immediately
  - Input field is cleared after successful creation
  - Empty tasks are not allowed

### 3. Task Listing
**As a user, I want to view all my tasks so that I can see what needs to be done.**
- **Acceptance Criteria:**
  - All tasks are displayed in a clean, organized list
  - Each task shows title, completion status, and timestamps
  - Tasks are visually distinct and easy to read
  - Empty state is shown when no tasks exist

### 4. Task Title Editing
**As a user, I want to edit task titles so that I can correct mistakes or update task descriptions.**
- **Acceptance Criteria:**
  - User can double-click on a task title to start editing
  - User can modify the title using an inline input field
  - User can save changes by pressing Enter or clicking the save button
  - User can cancel editing by pressing Escape or clicking the cancel button
  - Empty titles are not allowed
  - Visual feedback indicates when a title is being edited

### 5. Task Completion
**As a user, I want to mark tasks as complete so that I can track my progress.**
- **Acceptance Criteria:**
  - User can click a checkbox to toggle completion status
  - Completed tasks are visually distinguished (strikethrough, different color)
  - Status changes are saved immediately
  - Visual feedback confirms the action

### 6. Task Deletion
**As a user, I want to delete tasks so that I can remove completed or unnecessary items.**
- **Acceptance Criteria:**
  - User can click a delete button to remove a task
  - Task is removed from the list immediately
  - Confirmation is provided through visual feedback

### 7. Error Handling
**As a user, I want to see clear error messages when something goes wrong.**
- **Acceptance Criteria:**
  - Error messages are displayed prominently
  - User understands what went wrong
  - Application remains functional despite errors

## Features

- ✅ User registration and login
- ✅ JWT token-based authentication
- ✅ Secure token storage in localStorage
- ✅ Protected task management
- ✅ Create new tasks
- ✅ View all tasks in a beautiful list
- ✅ **Edit task titles with inline editing**
- ✅ **Keyboard shortcuts for title editing (Enter to save, Escape to cancel)**
- ✅ **Visual feedback for editable titles**
- ✅ Mark tasks as complete/incomplete
- ✅ Delete tasks
- ✅ Real-time updates
- ✅ Error handling and user feedback
- ✅ Responsive design for mobile devices
- ✅ Modern, clean UI with smooth animations

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running on localhost:3000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3001`

### Testing

Run unit tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm test -- --watch
```

## Project Structure

```
src/
├── components/
│   ├── TaskList.tsx          # Main task management component
│   ├── TaskList.css          # Styles for TaskList
│   ├── TaskList.test.tsx     # Unit tests for TaskList
│   ├── LoginForm.tsx         # User login component
│   ├── RegisterForm.tsx      # User registration component
│   ├── LoginForm.test.tsx    # Unit tests for LoginForm
│   └── AuthForms.css         # Styles for authentication forms
├── services/
│   ├── taskService.ts        # API service for task operations
│   └── authService.ts        # API service for authentication
├── types/
│   ├── Task.ts               # TypeScript interfaces for tasks
│   └── Auth.ts               # TypeScript interfaces for authentication
├── App.tsx                   # Main app component
├── App.css                   # Global styles
└── index.tsx                 # Application entry point
```

## API Integration

The frontend communicates with the NestJS backend through the following endpoints:

### Authentication Endpoints
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Task Endpoints (Protected)
- `GET /tasks` - Fetch all tasks
- `POST /tasks` - Create a new task
- `PATCH /tasks/:id` - Update a task (title, completion status, or both)
- `PATCH /tasks/:id/title` - Update only the task title
- `DELETE /tasks/:id` - Delete a task

All task endpoints require JWT authentication via Authorization header.

## Task Title Editing Guide

### How to Edit Task Titles

1. **Start Editing**: Double-click on any task title
2. **Make Changes**: Type your new title in the input field
3. **Save Changes**: 
   - Press `Enter` key, OR
   - Click the green ✓ button
4. **Cancel Editing**:
   - Press `Escape` key, OR
   - Click the red ✕ button

### Visual Indicators

- **Hover Effect**: Task titles show a subtle background color when you hover over them
- **Edit Mode**: When editing, the title becomes an input field with save/cancel buttons
- **Tooltip**: Hover over task titles to see "Double-click to edit" tooltip

### Validation

- Empty titles are not allowed
- Error messages are displayed if title update fails
- Original title is restored if editing is cancelled

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Axios** - HTTP client with interceptors
- **JWT** - JSON Web Tokens for authentication
- **localStorage** - Secure token storage
- **CSS3** - Styling with modern features
- **Jest & React Testing Library** - Testing framework

## Authentication Flow

1. **Registration**: Users can create a new account with name, email, and password
2. **Login**: Users authenticate with email and password
3. **Token Storage**: JWT token is stored securely in localStorage
4. **Protected Routes**: All task operations require valid authentication
5. **Auto-logout**: Token expiration or 401 errors trigger automatic logout
6. **Persistent Session**: Users remain logged in across browser sessions

## Design Features

- **Modern UI**: Clean, minimalist design with smooth animations
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Visual Feedback**: Hover effects, loading states, and error messages
- **Gradient Background**: Beautiful gradient background for visual appeal
- **Authentication Forms**: Beautiful, user-friendly login and registration forms
- **Inline Editing**: Smooth, intuitive task title editing experience

## Development

### Available Scripts

- `npm start` - Start development server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App

### Code Style

- TypeScript for type safety
- Functional components with hooks
- Clean, readable code structure
- Comprehensive error handling
- Responsive design principles
