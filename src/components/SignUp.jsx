import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BEDomain } from "../constants"

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;


            let photoURL = null;
            if (profilePicture) {
                const file = profilePicture[0];
                const storageRef = ref(storage, `profile_pictures/${firebaseUser.uid}`);
                await uploadBytes(storageRef, file);
                photoURL = await getDownloadURL(storageRef);
                await updateProfile(firebaseUser, { photoURL });
            }


            const userData = {
                user_id: firebaseUser.uid,
                phone_number: phoneNumber,
                profile_picture: photoURL, // Save the download URL in the DB
            };

            await axios.post(BEDomain + "/signup", userData);

            alert("Sign up is successful!");
            navigate("/login");
        } catch (error) {
            console.error("Error during sign-up:", error.message);
            alert("Sign up failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const gotoLogin = () => {
        navigate("/login");
    };

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
                        <h1 className="text-center mb-4">Book your Inns now!</h1>
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
                                    accept="image/*"
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                                {loading ? "Signing Up..." : "Sign Up"}
                            </Button>
                        </Form>

                        <p className="mt-4 text-center">
                            Already have an account?{" "}
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
