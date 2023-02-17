import React from "react";
import ChoiceList from "./ChoiceList";
import Choice from "./Choice";
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

export default function Question({ question, onChoiceClick }) {
  return (
    <Card sx={{margin: '10px'}} >
      <Typography variant="h5" sx={{padding: '10px'}} >{question.question}</Typography>
      <ChoiceList>
        {question.choices.map((choice, i) => (
          <Choice key={i} choice={choice} index={i} onChoiceClick={onChoiceClick} question={question}/>
        ))}
      </ChoiceList>
    </Card>
  );
}
