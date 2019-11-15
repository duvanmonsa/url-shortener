import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [textValue, setTextValue] = useState();
  const [response, setResponse] = useState();
  const [error, setError] = useState();

  const sentData = async () => {
    const expression = /(?:(?:https?|ftp):\/\/|\b(?:[a-z\d]+\.))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()[\]{};:'".,<>?«»“”‘’]))?/ig;
    const regex = new RegExp(expression);
    const urls = textValue.match(regex);
    if (urls.length > 0) {
      setError(false);
      let textResult = textValue;
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/shortener`, { urls });
      data.forEach(urlData => {
        textResult = textResult.replace(urlData.original_url, urlData.short_url)
      })
      setResponse(textResult);
    } else {
      setError(true);
    }

  }
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Short urls in your text
        </p>
        {error && (
          <div>At least one url must be inside the text</div>)}
        <textarea value={textValue} onChange={(e) => setTextValue(e.target.value)} rows="10" cols="100" />
        <button onClick={sentData}>Send</button>
        {response && (
          <div>
            {response}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
