import React, { useEffect, useState } from 'react';
import DistanceForm from './DistanceForm';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5001/') //server is run on PORT 5001 
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => console.log(err));
  }, []); //run on first render 

  return (
    <div>
      <h1>Distance Calculator!</h1>
      <p>{message}</p>
      <DistanceForm/>
    </div>
  );
}
export default App;