
import React, { useState } from "react";

  function Form(props) {

    const [prompt, setpPompt] = useState();

        const handleSubmit= (e) => {
          e.preventDefault();
          // ???
          console.log("the form was submitted")

          const data= prompt
          console.log(data)

          const getans = async () =>{
            const response = await fetch('http://localhost:5000', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: data
                    //prompt: data.get('prompt')
                })
              }
            )
              if (response.ok) {
                const data = await response.json();
                const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 
                console.log(parsedData)

        
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
        <form onSubmit={e => {handleSubmit(e)}}>
            <label>Chore Description</label>
            <br />
            <input 
            name='prompt' 
            type='textarea'
            onChange={e => setpPompt(e.target.value)}
            //value={prompt}
            />
            <button type="submit">Submit</button>
        
        </form>
        )
    }

  export default Form;

 