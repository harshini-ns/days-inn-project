import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);

        const userData = {
            email: email,
            password: password,
            phone_number: phoneNumber,
            profile_picture: profilePicture
        };

        try {
            const response = await axios.post("https://886e5827-4483-41a5-85e3-0d1270999a8e-00-2ioif0yd5eyfy.pike.replit.dev/signup", userData);
            console.log('Response:', response.data);
            alert("Sign up is successful");
            navigate("/");
        } catch (error) {
            console.error('There was an error!', error);
            alert("Sign up failed");
        } finally {
            setLoading(false);
        }
    };

    const gotoLogin = () => {
        navigate("/");
    }

    const backgroundStyle = {
        backgroundImage: 'url("https://sc04.alicdn.com/kf/H68b20e649a7049b08d414129a763ab95G/229924461/H68b20e649a7049b08d414129a763ab95G.jpeg")',
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
                    <Col xs={12} md={6} lg={4}>
                        <h1 className="text-center mb-4">DaysInn</h1>
                        <h1 className="text-center mb-4"> Book your Inns now ! </h1>
                        <h2 className="text-center mb-4">Sign Up</h2>
                        <Form onSubmit={handleSignUp}>
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

                            <Form.Group className="mb-3" controlId="formPhoneNumber">
                                <Form.Control
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    type="tel"
                                    placeholder="Enter valid phone number"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formProfilePicture">
                                <Form.Control
                                    onChange={(e) => setProfilePicture(e.target.files)}
                                    type="file"
                                    placeholder="upload picture"
                                />
                            </Form.Group>


                            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                                {loading ? 'Signing Up...' : 'Sign Up'}
                            </Button>
                        </Form>

                        <p className="mt-4 text-center">
                            Already have an account? {""}
                            <Button variant="outline-primary" className="rounded-pill ml-2" onClick={gotoLogin}>
                                Log in
                            </Button>
                        </p>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
