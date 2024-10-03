import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Correct Firebase auth import
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Use named imports for Google Auth

export default function LogIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Regular email/password login handler
    const handleLogIn = async (e) => {
        e.preventDefault();
        setLoading(true);

        const loginData = { email, password };

        try {
            const response = await axios.post("https://daysinn-private.vercel.app/login", loginData);
            const token = response.data.token;

            if (token) {
                localStorage.setItem('token', token);
                alert("Log In is successful");
                navigate("/hotels");
            } else {
                alert("Failed to store token.");
            }
        } catch (error) {
            console.error('There was an error', error);
            alert("Log in failed");
        } finally {
            setLoading(false);
        }
    };

    // Google login handler
    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider); // Sign in with Google
            const idToken = await result.user.getIdToken(); // Get the ID token

            // Send the token to the backend for verification
            const response = await axios.post("https://daysinn-private.vercel.app/loginWithGoogle", { idToken });

            const data = response.data;
            if (data.token) {
                localStorage.setItem("token", data.token); // Store the JWT token from the backend
                alert("Google Login successful");
                navigate("/hotels"); // Redirect to the hotels page
            }
        } catch (error) {
            console.error("Error logging in with Google:", error);
            alert("Google Login failed");
        }
    };

    const gotoSignUp = () => {
        navigate("/signup");
    };

    const backgroundStyle = {
        backgroundImage: "url('https://www.cvent.com/sites/default/files/image/2021-10/hotel%20room%20with%20beachfront%20view.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
    };

    return (
        <div style={backgroundStyle}>
            <Container fluid className="d-flex justify-content-center align-items-center vh-100">
                <Row className="justify-content-center w-100">
                    <Col xs={12} md={8} lg={6} xl={4}>
                        <h1 className="text-center mb-4">DaysInn</h1>
                        <h2 className="text-center mb-4">Log In</h2>

                        {/* Form for email and password login */}
                        <Form onSubmit={handleLogIn}>
                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Control
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    placeholder="Enter email"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formPassword">
                                <Form.Control
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    placeholder="Password"
                                    required
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                                {loading ? 'Logging in...' : 'Log In'}
                            </Button>
                        </Form>

                        {/* Google Login Button */}
                        <Button variant="outline-primary" className="w-100 mt-3" onClick={handleGoogleLogin}>
                            Log In with Google
                        </Button>

                        <p className="mt-4 text-center">
                            Don't have an account?{" "}
                            <Button variant="outline-primary" className="rounded-pill ml-2" onClick={gotoSignUp}>
                                Sign Up
                            </Button>
                        </p>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
