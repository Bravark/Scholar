
const parsedData = ` Question 1: What is one of the four fundamental views in materials science?
options: [{ id: 0 | text: "The principles governing the behaviour of materials are grounded in science and are understandable" | isCorrect: true },{ id: 1 | text: "The properties of a given material are determined by its structure" | isCorrect: false },{ id: 2 | text: "Properties of all materials change over time with use and exposure to environmental conditions" | isCorrect: false },{ id: 3 | text: "When selecting a material for a specific application, sufficient and appropriate testing must be performed to ensure that the material will remain suitable for its intended application throughout the intended life of the product" | isCorrect: false },]

Question 2: What is the primary purpose of testing when selecting a material for a specific application?
options: [{ id: 0 | text: "To ensure that the material will remain suitable for its intended application throughout the intended life of the product" | isCorrect: true },{ id: 1 | text: "To determine the properties of a given material" | isCorrect: false },{ id: 2 | text: "To understand the principles governing the behaviour of materials" | isCorrect: false },{ id: 3 | text: "To observe how properties of all materials change over time with use and exposure to environmental conditions" | isCorrect: false },]`


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