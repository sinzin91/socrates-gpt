import "./App.css";
import React, { useState } from "react";
import Question from "./Components/Question";
import QuestionList from "./Components/QuestionList";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

const OPENAI_API_KEY = "";

const DEFAULT_PARAMS = {
  model: "text-davinci-003",
  temperature: 0.3,
  max_tokens: 800,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};

function Loading() {
  return (
    <Box sx={{ width: '100%', marginTop: "10px" }}>
      <LinearProgress />
    </Box>
  );
}

function App() {
  const [apiKey, setApiKey] = useState(OPENAI_API_KEY);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    counter: 0,
    prompt: "",
    questions: [
      {
        choices: [{}],
      },
    ],
  });

  const clearState = () => {
    setState({
      counter: 0,
      prompt: "",
      questions: [
        {
          choices: [{}],
        },
      ],
    });
  };

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const handleChoiceClick = (choice, index, question) => {
    console.log("choice", choice);
    console.log("index", index);
    const questions = [...state.questions];
    console.log("questions", questions);
    console.log("question", question);
    console.log("state.counter", state.counter);
    const choices = [...question.choices];

    choices[index].selected = true;

    question.choices = choices;

    setState({ ...state, questions: questions }, () => {
      console.log(state);
    });
  };

  const queryPrompt = (prompt) => {
    fetch("prompts/data.prompt")
      .then((response) => response.text())
      .then((text) => text.replace("$prompt", prompt))
      .then((text) => text.replace("$state", JSON.stringify(state)))
      .then((prompt) => {
        console.log(prompt);
        setLoading(true);

        const params = { ...DEFAULT_PARAMS, prompt: prompt };

        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(apiKey || OPENAI_API_KEY),
          },
          body: JSON.stringify(params),
        };
        fetch("https://api.openai.com/v1/completions", requestOptions)
          .then((response) => response.json())
          .then((data) => {
            console.log("data", data);
            const text = data.choices[0].text;
            console.log(text);
            const new_state = JSON.parse(text);
            console.log(new_state);
            setState(new_state, () => {
              console.log(state);
            });
            document.body.style.cursor = "default";
            document.getElementsByClassName(
              "generateButton"
            )[0].disabled = false;
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            document.body.style.cursor = "default";
            alert("Error, likely your OpenAI API key is invalid: \n" + error);
            document.getElementsByClassName(
              "generateButton"
            )[0].disabled = false;
          });
      });
  };

  const createQuestion = () => {
    if (apiKey === "") {
      alert("Please enter your OpenAI API Key");
      return;
    }

    document.getElementsByClassName("generateButton")[0].disabled = true;
    const prompt = document.getElementsByClassName(
      "MuiInputBase-inputMultiline"
    )[0].value;

    queryPrompt(prompt);
  };

  return (
    <div className="container">
      <h1 className="headerText">SocratesGPT 🧠</h1>
      <p className="subheaderText">GPT generated questions on your topic.</p>

      <center>
        <div className="inputContainer">
          <TextField
            id="outlined-basic"
            variant="outlined"
            className="apiKeyBar"
            type="password"
            label="OpenAI API Key"
            placeholder="Paste in your OpenAI API Key..."
            onChange={handleApiKeyChange}
          ></TextField>
          <Typography variant="caption" display="block" gutterBottom>
            Get your OpenAI API key{" "}
            <a href="https://beta.openai.com/account/api-keys">here</a>.
          </Typography>
        </div>
        <div className="inputContainer">
          <TextField
            id="outlined-multiline-static"
            variant="outlined"
            maxRows={10}
            multiline={true}
            className="searchBar"
            label="Topic to learn"
            placeholder="Paste in something you want to be questioned about..."
          ></TextField>
          <button className="generateButton" onClick={createQuestion}>
            Generate
          </button>
          <button className="clearButton" onClick={clearState}>
            Clear
          </button>
          {loading && <Loading />}
        </div>
      </center>
      <div className="questionContainer">
        {state.questions[0].choices[0].text !== undefined && (
          <QuestionList>
            {state.questions.map((question, i) => (
              <Question
                key={i}
                question={question}
                onChoiceClick={handleChoiceClick}
              />
            ))}
          </QuestionList>
        )}
      </div>
    </div>
  );
}

export default App;
