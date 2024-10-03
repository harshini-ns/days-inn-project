import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Row, Col, Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ImageUpload from './ImageUpload';  // Import the ImageUpload component

export default function Profile() {
    const [userDetails, setUserDetails] = useState({
        user_id: '',
        email: '',
        phone_number: '',
        profile_picture: ''
    });

    const [error, setError] = useState('');
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('No authentication token found. Please log in.');
                return;
            }

            try {
                const response = await axios.get('https://daysinn-private.vercel.app/user/profile', {
                    headers: {
                        Authorization: token,
                    },
                });
                if (response.data && response.data.profile_picture) {
                    setUserDetails({
                        user_id: response.data.user_id,
                        email: response.data.email,
                        phone_number: response.data.phone_number,
                        profile_picture: response.data.profile_picture, // Set the profile picture here
                    });
                }

            } catch (error) {
                console.error('Error fetching user details', error);
                setError('Failed to load user details.');
            }
        };

        fetchUserDetails();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');  // Redirect to the login page
    };

    const handleImageUpload = (url) => {
        setUploadedImageUrl(url);
        setUserDetails((prevDetails) => ({
            ...prevDetails,
            profile_picture: url, // Update profile picture in userDetails
        }));
    };

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="/">DaysInn</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Link href="/hotels">Hotels</Nav.Link>
                            <Nav.Link href="/yourbookings">Your Bookings</Nav.Link>
                            <Nav.Link href="/profile">Profile</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="mt-9">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Card>
                            <Card.Header>Your Profile Details</Card.Header>
                            <Card.Body>
                                <Row className="align-items-start">

                                    <Col md={5} className="text-center">


                                        <ImageUpload
                                            onUpload={handleImageUpload}
                                            userDetails={userDetails}
                                        />
                                    </Col>


                                    <Col md={7}>
                                        <Card.Text><strong>Email:</strong> {userDetails.email}</Card.Text>
                                        <Card.Text><strong>User ID:</strong> {userDetails.user_id}</Card.Text>
                                        <Card.Text><strong>Phone Number:</strong> {userDetails.phone_number}</Card.Text>
                                        <Button variant="primary" onClick={handleLogout}>
                                            Logout
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

        </>
    );
}
