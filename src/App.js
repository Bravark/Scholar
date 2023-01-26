import React, { useState } from "react";
import "./App.css";
//import Form from './Form'
function App() {
  // Properties
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([
    {
      question: "Do you Think this tool is Going to Be usefull?",
      options: [
        { id: 0, text: "I Dont acutally know", isCorrect: false },
        { id: 1, text: "Hell Yea!!", isCorrect: false },
        { id: 2, text: "Let's see first Now", isCorrect: false },
        { id: 3, text: "Bleh Bleh Bleh", isCorrect: true },
      ],
    },
    {
      question: "Why do you think AI is Cool?",
      options: [
        { id: 0, text: "I Dont acutally know", isCorrect: false },
        { id: 1, text: "Maybe", isCorrect: false },
        { id: 2, text: "I Totally Love it", isCorrect: false },
        { id: 3, text: "Eh Eh Eh Eh", isCorrect: true },
      ],
    },
  ]);

  //const questions = `{$parsedData}`
  console.log(questions)
  console.log(questions.length)
  console.log(questions.type)
  //console.log("1st item on the list",questions[0])
  


  // Helper Functions

  /* A possible answer was clicked */
  const optionClicked = (isCorrect) => {
    // Increment the score
    if (isCorrect  === "true") {
      setScore(score + 1);
      console.log("option is ccorrect");
    }else{
      console.log("option is not correct");
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  /* Resets the game back to default */
  const restartGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowResults(false);
  };

  /*this is to handle submit*/
  const [prompt, setpPompt] = useState();

  const handleSubmit= (e) => {
    e.preventDefault();
    // ???
    console.log("the form was submitted")

    const data= prompt
    console.log(data)

    

    const getans = async () =>{
      const response = await fetch('https://scholar-fom8.onrender.com/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              prompt: data
          })
        }
      )
        if (response.ok) {
          const rdata = await response.json();
          const parsedData  = rdata.bot.trim() // trims any trailing spaces/'\n'
          console.log("parsedData",parsedData)
          // this function takes the text and extract it into an array of objects it took me awhile to get this code don't touch it
          // and also it depends on the server prompt engineering don't touch that too becasue if you do this function will not work anymore
          function extractQuestions(text) {
            let lines = text.split('\n');
            let questions = [];
            let question = {};
            let opRegex= /options/ig;
            let queRegex = /question/ig
            for (let i = 0; i < lines.length; i++) {
              if (queRegex.test(lines[i])) {
                if (Object.keys(question).length !== 0) {
                  questions.push(question);
                  question = {};
                }
                question.question = lines[i].trim();
                question.options = [];
                
              } else if (opRegex.test(lines[i])) {
                console.log("lines[i]", lines[i])
                let options = lines[i].substring(lines[i].indexOf(":") + 1).trim();
                console.log("options", options)
                options = options.substring(1, options.length - 1).split("},{");
                for (let option of options) {
                  let option_values = option.split("|");
                  let id = option_values[0].substring(option_values[0].indexOf(":") + 1).trim();
                  let text = option_values[1].substring(option_values[1].indexOf(":") + 1).trim();
                  let _isCorrect = option_values[2].substring(option_values[2].indexOf(":") + 1).trim();
                  let isCorrect = _isCorrect.replace(/[, }]/g, "");
                  question.options.push({ id: id, text: text, isCorrect: isCorrect });
                }
              }
            }
            if (Object.keys(question).length !== 0) {
              questions.push(question);
            }
            return questions;
          }
          //put the text gotten back from the server into this array that will continue into the MCQ button quizz
          let parsedDataArray = extractQuestions(parsedData)
          console.log(parsedDataArray) 
          //log the length of the array
          console.log("data lenght", parsedData.length)
          
          //log the type
          console.log(parsedDataArray.type)
          //set the value of the question that will go in to the MCQ
          setQuestions(parsedDataArray) 
          
  
          //typeText(messageDiv, parsedData)
      } else {
          const err = await response.text()

          console.log("Something went wrongg")
  
          //messageDiv.innerHTML = "Something went wrongg"
          alert(err)
      }
      e.target.reset();
      
    }
    getans();


  }

  return (
    <div className="App">
      {/* 0. set question */}
      <h1>Scholar Lee</h1>
      <form onSubmit={e => {handleSubmit(e)}}>
            <label>Paste Your Text Here</label>
            <br />
            <input 
            name='prompt' 
            type='textarea'
            onChange={e => setpPompt(e.target.value)}
            //value={prompt}
            />
            <br/>
            <button type="submit">Submit</button>
        
        </form>



      {/* 1. Header  */}
      <h1>Paste a paragraph of your text and let me ask you questions</h1>

      {/* 2. Current Score  */}
      <h2>Mark: {score}</h2>

      {/* 3. Show results or show the question game  */}
      {showResults ? (
        /* 4. Final Results */
        <div className="final-results">
          <h1>Final Results</h1>
          <h2>
            {score} out of {questions.length} correct - (
            {(score / questions.length) * 100}%)
          </h2>
          <button onClick={() => restartGame()}>Restart game</button>
        </div>
      ) : (
          
        //{questions ? ()}
        /* 5. Question Card  */
        <div className="question-card">
          {/* Current Question  */}
          <h2>
            Question: {currentQuestion + 1} out of {questions.length}
          </h2>
          <h3 className="question-text">{questions[currentQuestion].question}</h3>

          {/* List of possible answers  */}
          <ul>
            {questions[currentQuestion].options.map((option) => {
              return (
                <li
                  key={option.id}
                  onClick={() => optionClicked(option.isCorrect)}
                >
                  {option.text}
                </li>
              );
            })}
          </ul>
        </div>

        
      )}
    </div>
  );
}

export default App;
