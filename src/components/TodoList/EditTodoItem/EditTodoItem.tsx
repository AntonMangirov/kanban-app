import React from "react";
import { Paper, TextField, Button } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import type { Todo } from "../../../types/todo";

interface EditTodoItemProps {
  todo: Todo;
  onChangeTodo: ({ name, discription }: Omit<Todo, "id" | "checked">) => void;
}

export const EditTodoItem: React.FC<EditTodoItemProps> = ({
  todo,
  onChangeTodo,
}) => {
  const [editTodo, setEditTodo] = React.useState({
    name: todo.name,
    discription: todo.discription,
  });

  const onClick = () => {
    onChangeTodo(editTodo);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setEditTodo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Paper
      elevation={2}
      sx={{
        marginTop: "15px",
        width: "100%",
        padding: "20px 28px",
        borderRadius: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
      }}
    >
      <TextField
        value={editTodo.name}
        onChange={onChange}
        name="name"
        label="name"
      />
      <TextField
        value={editTodo.discription}
        onChange={onChange}
        name="discription"
        label="discription"
      />
      <Button startIcon={<EditIcon />} variant="outlined" onClick={onClick}>
        EDIT
      </Button>
    </Paper>
  );
};

