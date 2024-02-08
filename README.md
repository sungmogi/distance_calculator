# distance_calculator

This is a toy project that utilizes the Google Maps Distance Matrix API. I used React.js for the front-end and express.js for the back-end. The big picture is: (1) React takes in a form of the starting point, destination, and the mode of travel; (2) When the submit button is clicked, React makes a POST request to the express server and sends the form data in JSON format; (3) The express server makes a GET request to the Distance Matrix API with the form data; (4) The express server receives the distance / duration data as a response and sends it back to React; (5) React displays the result. 

## Demo
<b>Let's run this application. This repo only contains the express and React files, so make sure you have the package.json files and dependencies set up. You also need your own Google Maps Distance Matrix API key to run it. </b>

Let's type in some valid addresses for the starting point and the destination and select the mode of travel: 
<p align="center">
<img width="600" alt="Screen Shot 2024-02-08 at 11 59 12 AM" src="https://github.com/sungmogi/distance_calculator/assets/131221622/b58628b6-ff5e-4ca7-9051-e8c71a338815">
</p>

When the "Calculate Distance" button is clicked, distance and duration data are retrieved and displayed on the rendered:
<p align="center">
<img width="600" alt="Screen Shot 2024-02-08 at 11 59 28 AM" src="https://github.com/sungmogi/distance_calculator/assets/131221622/91970250-b838-4255-a408-87c347000745">
</p>

Let's try to submit invalid addresses. Let's say someone wants to know how long it takes from Mars to Earth by walking:
<p align="center">
<img width="600" alt="Screen Shot 2024-02-08 at 12 00 11 PM" src="https://github.com/sungmogi/distance_calculator/assets/131221622/01c6ca44-ce3a-431f-9a33-ee999151e12c">
</p>

The retrieved data has a status that is not "OK", so this message is rendered instead:
<p align="center">
<img width="600" alt="Screen Shot 2024-02-08 at 12 00 19 PM" src="https://github.com/sungmogi/distance_calculator/assets/131221622/2e2552e5-cf7a-4228-868a-67d336f58101">
</p>

## Explanation
Here is how I implemented the express.js server and the React.js front-end. Note that the express.js server is run on PORT 5001 and the React front-end is run on PORT 3000. 
### Express (server.js)
```
const express = require('express');
const cors = require('cors');
const axios = require('axios');
```
Here, we import the required libraries: express (to set up a server), cors (to allow cross-origin requests), and axios (to make an API call to Google).
```
const app = express();
const PORT = 5001;

let corsOptions = {
    origin: ["http://localhost:3000"]
};

app.use(cors(corsOptions));
app.use(express.json());
```
Here, we create an instance of the express object and set up the middlewares for the instance (named "app"). Since I am running the front-end on PORT 3000, we pass in this option to the cors object so that we only allow requests to be made from PORT 3000. We then pass in cors and express.json() as the middleware for our server. We need express.json() in order to handle the data in JSON format. 

```
app.get('/', (req, res) => {
    res.send('Welcome! Enter a starting point, destination, and mode of travel. ');
});
```
We define a GET request here. Nothing special, but note that this will only appear on the front-end only when the GET request is successful. 

```
app.post('/', async (req, res) => {
    const {startInput, destinationInput, travelMode} = req.body;
    try {
        const response = await axios.get("https://maps.googleapis.com/maps/api/distancematrix/json", {
            params : {
                destinations : destinationInput,
                origins : startInput,
                mode : travelMode,
                //key : [YOUR_API_KEY],
            }
        })
        const resData = response.data.rows[0].elements[0];
        if (resData.status !== 'OK') {
            const result = {
                status: 'ERROR',
                distanceResult: "",
                durationResult: "",
            };            
            res.send(result);
        }
        else {
            const result = {
                status: 'OK',
                distanceResult: resData.distance,
                durationResult: resData.duration,
            };
            res.send(result);
        }
        
    } catch (e) {
        console.error('Error:', e);
        res.status(500).send("Internal Server Error");
    }
});
```
This is how we handle a POST request. Since we are making an API call, the callback function is asynchronous, allowing us to use <i>await</i>. The req.body contains the data sent from the React form. This data will be passed into the parameters for the API call along with the API Key. The response will contain the retrieved data from the API call. The "status" field will be 'OK' when the result is calculated successfully. We will send back the data to React. 

```
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
```
We have declared PORT to be 5001 above, so the server is running on PORT 5001. 

### React (src/App.jsx)
```
function App() {
  const [message, setMessage] = useState('');
```
We use useState to set message as an empty string. 

```
  useEffect(() => {
    fetch('http://localhost:5001/') //server is run on PORT 5001 
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => console.log(err));
  }, []); //run on first render 
```
We use useEffect to fetch data from the server. The second argument, the empty list, specifies that this side effect is only run on the first render. That is, on the first render, we make a GET request to the server, the response from the GET request goes through the promise chain, and we call the setMessage function, which changes the State of "message". This response doesn't contain anything important, but we know that the State of "message" will change only when the GET request to the server is successful. If not, we will get an error message on the console.

Note that this will have the same effect as 
```
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5001/');
        const data = await res.text();
        setMessage(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
```

```
  return (
    <div>
      <h1>Distance Calculator!</h1>
      <p>{message}</p>
      <DistanceForm/>
    </div>
  );
}
export default App;
```
We call the "DistanceForm" component here, which will be explained next.

### React (src/DistanceForm.jsx)

```
export default function DistanceForm() {
    const [formData, setFormData] = useState({ startInput: "", destinationInput: "", travelMode: "driving" });
    const [resultData, setResultData] = useState({ status: "OK", distanceResult: "", durationResult: "" });
```
We first declare the useStates of formData and resultData.

```
    const updateFormData = (evt) => {
        setFormData(currData => {
            console.log(evt.target.name, evt.target.value)
            return { ...currData, [evt.target.name]: evt.target.value }
        })
    }
```
We define the function "updateFormData". This will be called when the inputs in our form are changed, updating the State of "formData". We are using this one function to update all three fields of our formData, so we use evt.target.name to identify which input in the form has changed, and update the corresponding field. 

```
    const postToServer = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5001/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Network error');
            }
            console.log(response);
            const data = await response.json();
            setResultData({ status: data.status, distanceResult: data.distanceResult.text, durationResult: data.durationResult.text });
        } catch (error) {
            console.error('Error: ', error)
        }
        setFormData({ startInput: "", destinationInput: "", travelMode: "" });
    }
```
Then, we define the function postToServer which will be called when the form is submitted. This function is asynchronous, as we are making a POST request to the server. e.preventDefault() prevents the page from being reloading when the form is sumbitted, which is the default behavior of submit. We make a POST request with the body containing the formData in JSON format and retrieve the result from the server. The retrieved result is then used to change the State of our resultData. We then set the input fields to be empty. 

```
    return (
        <>
            <form onSubmit={postToServer}>
                <label htmlFor="startInput">ENTER STARTING POINT: </label>
                <input type="text" id="startInput" name="startInput" placeholder="Starting Point" value={formData.startInput} onChange={updateFormData} />
                <br />
                <label htmlFor="destinationInput">ENTER DESTINATION: </label>
                <input type="text" id="destinationInput" name="destinationInput" placeholder="Destination" value={formData.destinationInput} onChange={updateFormData} />
                <br />
                <span>SELECT MODE OF TRAVEL:</span> <br />
                <label for="bicycling">BICYCLING</label>
                <input type="radio" id="bicycling" name="travelMode" value="bicycling" onChange={updateFormData}/> <br />
                <label for="driving">DRIVING</label>
                <input type="radio" id="driving" name="travelMode" value="driving" onChange={updateFormData}/> <br />
                <label for="transit">TRANSIT</label>
                <input type="radio" id="transit" name="travelMode" value="transit" onChange={updateFormData}/> <br />
                <label for="walking">WALKING</label>
                <input type="radio" id="walking" name="travelMode" value="walking" onChange={updateFormData}/> <br />

                <button>Calculate Distance</button>
            </form>
            {resultData.status === 'OK' && resultData.distanceResult && resultData.durationResult &&
                <div>
                    <h3>Distance: {resultData.distanceResult}</h3>
                    <h3>Duration: {resultData.durationResult}</h3>
                </div>
            }
            {resultData.status === 'ERROR' &&
                <div>
                    <h3>Couldn't find result... </h3>
                </div>
            }
        </>
    )
}
```
Here, we have the form in which the input fields call the updateFormData function on change. 
