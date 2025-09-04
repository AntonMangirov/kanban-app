import React from "react";
import Add from "@mui/icons-material/Add";
import { TextField, Paper, Button } from "@mui/material";
import type { Todo } from "../../types/todo";

const DEFAULT_TODO = { name: "", discription: "" };

interface PanelProps {
  onAddTodo: ({ name, discription }: Omit<Todo, "id" | "checked">) => void;
}

export const Panel: React.FC<PanelProps> = ({ onAddTodo }) => {
  const [todo, setTodo] = React.useState(DEFAULT_TODO);

  const onClick = () => {
    onAddTodo(todo);
    setTodo(DEFAULT_TODO);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setTodo({ ...todo, [name]: value });
  };
  
  return (
    <Paper
      elevation={2}
      sx={{
        width: "100%",
        padding: "25px 30px",
        borderRadius: 2,
        display: "flex",
        justifyContent: "space-between",
        alignContent: "center",
        gap: 2,
      }}
    >
      <TextField
        value={todo.name}
        onChange={onChange}
        name="name"
        label="name"
      />
      <TextField
        value={todo.discription}
        onChange={onChange}
        name="discription"
        label="discription"
      />

      <Button startIcon={<Add />} variant="outlined" onClick={onClick}>
        ADD
      </Button>
    </Paper>
  );
};



