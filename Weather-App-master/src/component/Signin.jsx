// Signin.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (values.password !== values.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        axios.post('http://localhost:5000/signin', values)
            .then(result => {
                console.log("Signin response:", result.data);
                if (result.data.signupStatus) {
                    navigate('/'); // Redirect to login page after successful signup
                } else {
                    setError(result.data.Error);
                }
            })
            .catch(err => {
                console.error("Signin error:", err);
                setError("An error occurred. Please try again.");
            });
    };

    return (
        <div className='container'>
            <div className='sub-container'>
                <div className='logo-container'>
                    {error && <p>{error}</p>}
                    <h3>Weather App</h3>
                </div>
                <div className='title'>
                    <h1>Sign In</h1>
                    <p>Please create your account</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <input type='email' name='email' placeholder='Email address' onChange={(e) => setValues({ ...values, email: e.target.value })} required />
                    <input type='password' name='password' placeholder='Password' onChange={(e) => setValues({ ...values, password: e.target.value })} required />
                    <input type='password' name='confirmPassword' placeholder='Confirm Password' onChange={(e) => setValues({ ...values, confirmPassword: e.target.value })} required />
                    <button type='submit'>Sign In</button>
                    <p onClick={() => navigate('/')} style={{ cursor: 'pointer', color: 'blue' }}>
                        Already have an account?
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Signin;
