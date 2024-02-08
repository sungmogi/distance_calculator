const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5001;

let corsOptions = {
    origin: ["http://localhost:3000"]
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome! Enter a starting point, destination, and mode of travel. ');
});

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

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});