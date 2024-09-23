import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Row, Col, Image, Navbar, Nav } from 'react-bootstrap';

export default function Profile() {
    const [userDetails, setUserDetails] = useState({
        user_id: '',
        email: '',
        phone_number: '',
        profile_picture: ''
    });

    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('No authentication token found. Please log in.');
                return;
            }

            try {
                const response = await axios.get('https://886e5827-4483-41a5-85e3-0d1270999a8e-00-2ioif0yd5eyfy.pike.replit.dev/user/profile', {
                    headers: {
                        Authorization: token,
                    },
                });
                setUserDetails(response.data);
            } catch (error) {
                console.error('Error fetching user details', error);
                setError('Failed to load user details.');
            }
        };

        fetchUserDetails();
    }, []);

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

            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Card>
                            <Card.Header> Your Profile Details </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={4} className="text-center">
                                        <Image
                                            src={userDetails.profile_picture || 'placeholder-image-url'}
                                            roundedCircle
                                            width="100"
                                            height="100"
                                            alt="Profile"
                                        />
                                    </Col>
                                    <Col md={8}>
                                        <Card.Text><strong> Email id :</strong>  {userDetails.email}</Card.Text>
                                        <Card.Text>
                                            <strong>User ID:</strong> {userDetails.user_id}
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>Phone Number:</strong> {userDetails.phone_number}
                                        </Card.Text>
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
