import React from "react";
import Button from '@mui/material/Button';

export default function Choice({ index, choice, onChoiceClick, question }) {

  return (
    <Button
      variant="contained"
      onClick={() => onChoiceClick(choice, index, question)}
      color={choice.selected ? choice.correct ? "success" : "error" : "primary"}
      sx={{ margin: '10px' }}
    >
      {choice.text}
    </Button>
  );
}
