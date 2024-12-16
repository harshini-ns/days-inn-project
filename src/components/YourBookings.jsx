import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UpdateBookingModal from './UpdateBookingModal';
import { BEDomain } from '../constants';

export default function YourBookings() {
    const [bookings, setBookings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            const token = localStorage.getItem('token');


            if (!token) {
                alert('No authentication token found. Please log in.');
                return;
            }

            try {
                const response = await axios.get(
                    BEDomain + '/bookings',
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );
                setBookings(response.data.bookings);
            } catch (error) {
                console.error('There was an error fetching the bookings!', error);
                alert('Failed to fetch bookings.');
            }
        };

        fetchBookings();
    }, []);

    const deleteBooking = async (booking_id) => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('No authentication token found. Please log in.');
            return;
        }

        try {
            await axios.delete(
                BEDomain + `/bookings/${booking_id}`,
                {
                    headers: {
                        Authorization: token,

                    },
                }
            );

            setBookings((prevBookings) =>
                prevBookings.filter((booking) => booking.booking_id !== booking_id)
            );

            alert('Booking deleted successfully.');
        } catch (error) {
            console.error('There was an error deleting the booking!', error);
            alert('Failed to delete booking.');
        }
    };

    const updateBooking = (updatedBooking) => {
        setBookings((prevBookings) =>
            prevBookings.map((booking) =>
                booking.booking_id === updatedBooking.booking_id ? updatedBooking : booking
            )
        );
    };

    const isUserLoggedIn = !!localStorage.getItem('token');

    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="/">DaysInn</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Link href="/hotels">Hotels</Nav.Link>
                            <Nav.Link href="/yourbookings">Your Bookings</Nav.Link>
                            {isUserLoggedIn ? (
                                <Nav.Link href="/profile">Profile</Nav.Link>
                            ) : (
                                <Button
                                    variant="outline-light"
                                    onClick={() => navigate('/login')}
                                >
                                    Login
                                </Button>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="mt-4">
                {bookings.length === 0 ? (
                    <div className="text-center mt-4">
                        <h4>No bookings done yet.</h4>
                    </div>
                ) : (
                    <Row>
                        {bookings.map((booking) => (
                            <Col xs={12} md={6} lg={4} className="mb-4" key={booking.booking_id}>
                                <Card className="h-100">
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title><strong>Booking ID:</strong> {booking.booking_id}</Card.Title>
                                        <Card.Text>
                                            <strong>Start Date:</strong> {booking.start_date}
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>End Date:</strong> {booking.end_date}
                                        </Card.Text>
                                        <div className="d-flex gap-2 mt-auto">
                                            <Button
                                                variant="primary"
                                                onClick={() => {
                                                    setSelectedBooking(booking);
                                                    setShowModal(true);
                                                }}
                                            >
                                                Update Booking
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={() => deleteBooking(booking.booking_id)}
                                            >
                                                Delete Booking
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>

            {selectedBooking && (
                <UpdateBookingModal
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    booking={selectedBooking}
                    updateBooking={updateBooking}
                />
            )}
        </div>
    );
}
