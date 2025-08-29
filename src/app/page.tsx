'use client';

import React from "react";
import { Box } from "@mui/material";
import { Header, Panel, TodoList } from "../components";
import { useTodoStore } from "../store/todoStore";

export default function HomePage() {
  const { 
    todoList, 
    editTodoId, 
    addTodo, 
    deleteTodo, 
    checkTodo, 
    editTodo, 
    saveEdit 
  } = useTodoStore();

  return (
    <div className="App">
      <Box 
        display="flex" 
        flexDirection="column" 
        width="500px" 
        margin="0 auto"
        padding="20px"
      >
        <Header />
        <Panel onAddTodo={addTodo} />
        <TodoList
          editTodoId={editTodoId}
          todoList={todoList}
          onDeleteTodo={deleteTodo}
          onCheckTodo={checkTodo}
          onEdit={editTodo}
          onChangeTodo={saveEdit}
        />
      </Box>
    </div>
  );
}
