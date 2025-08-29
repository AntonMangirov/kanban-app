import { create } from 'zustand';
import type { Todo } from '../types/todo';

interface TodoStore {
  todoList: Todo[];
  editTodoId: number | null;
  addTodo: (todo: Omit<Todo, 'id' | 'checked'>) => void;
  deleteTodo: (id: number) => void;
  checkTodo: (id: number) => void;
  editTodo: (id: number) => void;
  saveEdit: (id: number, changes: Omit<Todo, 'id' | 'checked'>) => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todoList: [
    { id: 1, name: "task1", discription: "test", checked: false },
  ],
  editTodoId: null,
  
  addTodo: (todo) => set((state) => {
    const newId = state.todoList.length > 0 
      ? Math.max(...state.todoList.map((t) => t.id)) + 1 
      : 1;
    return {
      todoList: [...state.todoList, { id: newId, ...todo, checked: false }]
    };
  }),
  
  deleteTodo: (id) => set((state) => ({
    todoList: state.todoList.filter((todo) => todo.id !== id)
  })),
  
  checkTodo: (id) => set((state) => ({
    todoList: state.todoList.map((todo) =>
      todo.id === id ? { ...todo, checked: !todo.checked } : todo
    )
  })),
  
  editTodo: (id) => set({ editTodoId: id }),
  
  saveEdit: (id, changes) => set((state) => ({
    todoList: state.todoList.map((todo) =>
      todo.id === id ? { ...todo, ...changes } : todo
    ),
    editTodoId: null
  })),
}));
