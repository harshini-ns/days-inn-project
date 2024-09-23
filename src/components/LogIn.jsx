import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function LogIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogIn = async (e) => {
        e.preventDefault();
        setLoading(true);

        const loginData = {
            email: email,
            password: password
        }
        try {
            const response = await axios.post("https://886e5827-4483-41a5-85e3-0d1270999a8e-00-2ioif0yd5eyfy.pike.replit.dev/login", loginData);
            console.log('Response:', response.data);
            const token = response.data.token;
            console.log('Token stored:', token)
            if (token) {
                localStorage.setItem('token', token);
                alert("Log In is successfull");
                navigate("/hotels")
            }
            else {
                alert("failed in storing token");
            }

        }
        catch (error) {
            console.error('there is an error', error);
            alert("Log in failed");
        } finally {
            setLoading(false);
        }
    };

    const gotoSignUp = () => {
        navigate("/signup");
    }


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

