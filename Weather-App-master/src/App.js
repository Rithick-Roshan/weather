// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./component/Home";
import Login from "./component/Login"; 
import Signin from "./component/Signin"; 
import ProtectedRoute from './component/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home"
         element={
         <ProtectedRoute>
            <Home />
         </ProtectedRoute>} 
         />
        <Route path="/" element={<Login />} />
        <Route path="/signin" element={<Signin />} /> 
      </Routes>
    </Router>
  );
}

export default App;
