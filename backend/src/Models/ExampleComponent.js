// ExampleComponent.js
import React, { useState } from 'react';
import axios from 'axios';

const ExampleComponent = () => {
    const [data, setData] = useState({
        // Initial state based on the expected structure
    });
    const [prediction, setPrediction] = useState(null);

    const handleSubmit = async () => {
        try {
            const response = await axios.post('https://your-flask-api-url.herokuapp.com/predict', data);
            setPrediction(response.data);
        } catch (error) {
            console.error("There was an error making the request", error);
        }
    };

    return (
        <div>
            {/* Form inputs to update the data state */}
            <button onClick={handleSubmit}>Get Prediction</button>
            {prediction && <div>Prediction: {prediction}</div>}
        </div>
    );
};

export default ExampleComponent;
