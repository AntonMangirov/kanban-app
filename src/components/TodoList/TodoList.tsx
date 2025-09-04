import React from "react";
import { Box } from "@mui/material";
import type { Todo } from "../../types/todo";
import { TodoItem } from "./TodoItem/TodoItem";
import { EditTodoItem } from "./EditTodoItem/EditTodoItem";

interface TodoListProps {
  editTodoId: Todo["id"] | null;
  todoList: Todo[];
  onDeleteTodo: (id: Todo["id"]) => void;
  onCheckTodo: (id: Todo["id"]) => void;
  onEdit: (id: Todo["id"]) => void;
  onChangeTodo: (id: Todo["id"], changes: Omit<Todo, "id" | "checked">) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todoList,
  onDeleteTodo,
  onCheckTodo,
  onEdit,
  editTodoId,
  onChangeTodo,
}) => {
  return (
    <Box>
      {todoList.map((todo) =>
        todo.id === editTodoId ? (
          <EditTodoItem
            key={todo.id}
            todo={todo}
            onChangeTodo={(changes) => onChangeTodo(todo.id, changes)}
          />
        ) : (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDeleteTodo={onDeleteTodo}
            onCheckTodo={onCheckTodo}
            onEdit={onEdit}
          />
        )
      )}
    </Box>
  );
};




