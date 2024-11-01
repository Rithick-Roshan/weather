import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    axios.defaults.withCredentials = true;
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Submitting login with values:", values);
        axios.post('http://localhost:5000/login', values)
            .then(result => {
                console.log("Login response:", result.data); 
                if (result.data.loginStatus) {
                    localStorage.setItem("valid", true);
                    navigate('/home');
                } else {
                    setError(result.data.Error);
                }
            })
            .catch(err => {
                console.error("Login error:", err);
            });
    };
    
    
    

  return (
    <>
       <div className='container'>
        <div>
            
        </div>
        <div className='sub-container'>
            <div className='logo-container'>
                {error && error}
                <h3>Weather App</h3>
            </div>
            <div className='title' >
                <h1>Login</h1>
                <p>please login your account</p>
            </div>
            <form>
                <input type='email' name='email' placeholder='Email address' onChange={(e)=> setValues({...values,email: e.target.value})} />
                <input type='password' name='password' placeholder='Password' onChange={(e)=>setValues({...values,password: e.target.value})}/>
                <button onClick={handleSubmit}>Login</button>
                <p onClick={() => navigate('/signin')} style={{ cursor: 'pointer', color: 'blue' }}>
                            Create a new account?
                </p>
            </form>
        </div>
       </div>
    </>
  )
}

export default Login