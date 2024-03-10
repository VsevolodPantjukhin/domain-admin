import './App.css';
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/Login/Login';
import Authorized from './components/Authorized/Authorized';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/authorized" element={localStorage.getItem("access") || localStorage.getItem("refresh") ? <Authorized /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
