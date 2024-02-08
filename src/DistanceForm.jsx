import { useState } from 'react'

export default function DistanceForm() {
    const [formData, setFormData] = useState({ startInput: "", destinationInput: "", travelMode: "driving" });
    const [resultData, setResultData] = useState({ status: "OK", distanceResult: "", durationResult: "" });
    const updateFormData = (evt) => {
        setFormData(currData => {
            console.log(evt.target.name, evt.target.value)
            return { ...currData, [evt.target.name]: evt.target.value }
        })
    }

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

{/* <label htmlFor="travelMode">ENTER TRAVEL MODE: </label>
                <input type="text" id="travelMode" name="travelMode" placeholder="Travel Mode" value={formData.travelMode} onChange={updateFormData} />
                <br />*/}