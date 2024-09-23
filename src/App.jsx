import React from "react";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Hotels from "./components/Hotels";
import YourBookings from "./components/YourBookings";
import Profile from "./components/Profile";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LogIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/hotels" element={<Hotels />} />
                <Route path="/yourbookings" element={<YourBookings />} />
                <Route path="/profile" element={<Profile />} />

            </Routes>
        </Router>
    )

}