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
### React

### Express



