import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';

const Home = () => {
    const [search, setSearch] = useState("erode"); // Default city set to "Erode"
    const [city, setCity] = useState(null);
    const navigate = useNavigate();

    // Fetch weather data from OpenWeatherMap API
    const getWeatherData = async (cityName = search) => {
        try {
            console.log(`Fetching weather data for ${cityName}...`);
            let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=7db7f4dc24f41ff2956b0ddce4ddf5da&units=metric`);
            let result = await response.json();
            console.log("Weather data fetched:", result);
            setCity(result);
            return result;
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    };

    // Function to send weather email using Email.js
    const sendWeatherEmail = (weatherData) => {
        console.log("Attempting to send weather email with data:", {
            city: weatherData.name,
            temperature: weatherData.main.temp,
            humidity: weatherData.main.humidity,
            windSpeed: weatherData.wind.speed,
        });

        emailjs.send(
            'service_xpbq6lm', // Updated Service ID
            'template_wh02m1q', // Template ID
            {
                city: weatherData.name,
                temperature: weatherData.main.temp,
                humidity: weatherData.main.humidity,
                windSpeed: weatherData.wind.speed,
            }, 
            'Ge7jdi0K4D5DrFI_W' // Public Key
        )
        .then(response => {
            console.log('Email sent successfully:', response);
        })
        .catch(error => {
            console.error('Failed to send email:', error);
        });
    };

    // Check time every minute and send email for Erode at specific times
    useEffect(() => {
        const checkAndSendEmail = async () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            console.log(`Current time: ${hours}:${minutes}`);

            // Send email only at 6 a.m. or 7 p.m.
            if ((hours === 6  || hours===19)&& minutes === 0 ) {
                console.log("Triggering email send for Erode...");
                const erodeWeatherData = await getWeatherData("erode");
                if (erodeWeatherData && erodeWeatherData.main) {
                    sendWeatherEmail(erodeWeatherData);
                } else {
                    console.log("Failed to fetch Erode weather data or data is incomplete.");
                }
            } else {
                console.log("Not the right time to send email.");
            }
        };

        const intervalId = setInterval(checkAndSendEmail, 60000); // Check every minute

        return () => clearInterval(intervalId); // Clear interval on component unmount
    }, []);

    // Fetch initial weather data when component loads or search changes
    useEffect(() => {
        getWeatherData();
    }, [search]);

    const handleLogout = () => {
        localStorage.removeItem("valid"); // Clear authentication data
        navigate('/'); // Redirect to login page
    };

    return (
        <div className="App">
            <button onClick={handleLogout}>Logout</button>
            <div className="weather-card">
                <div className="search">
                    <input
                        type="search"
                        placeholder="Enter city name"
                        spellCheck="false"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="weather">
                    <img
                        className="weather-icon"
                        src="https://static.vecteezy.com/system/resources/previews/024/825/182/non_2x/3d-weather-icon-day-with-rain-free-png.png"
                        alt="..."
                    />
                    <h1 className="temp">{city?.main?.temp}°C</h1>
                    <h2 className="city">{city?.name}</h2>
                    <div className="details">
                        <div style={{ display: 'flex' }} className="col">
                            <img
                                className="humi"
                                src="https://static-00.iconduck.com/assets.00/humidity-icon-2048x1675-xxsge5os.png"
                                alt="Humidity"
                            />
                            <div className="info">
                                <p className="humidity">{city?.main?.humidity}%</p>
                                <p>Humidity</p>
                            </div>
                        </div>
                        <div className="col">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/136/136712.png"
                                alt="Wind Speed"
                            />
                            <div className="info">
                                <p className="wind">{city?.wind?.speed} km/h</p>
                                <p>Wind Speed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
