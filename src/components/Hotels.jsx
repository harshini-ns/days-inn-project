import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Navbar, Nav, Button } from 'react-bootstrap';
import axios from 'axios';
import BookNowModal from './BookNowModal';

export default function Hotels() {
    const [hotels, setHotels] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [token, setToken] = useState('');

    const fetchWeather = async (address) => {
        if (!address) return null; // Return null if no valid address

        try {
            const weatherUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${address}/today?key=HKS9JY98PPEHB6ZTAAMBXJJYZ`;
            const response = await axios.get(weatherUrl);
            return response.data.currentConditions || null;
        } catch (error) {
            console.error("Error fetching weather data:", error);
            return null; // Return null on error
        }
    };

    useEffect(() => {
        axios.get('https://886e5827-4483-41a5-85e3-0d1270999a8e-00-2ioif0yd5eyfy.pike.replit.dev/hotels')
            .then(async (response) => {
                const fetchedHotels = response.data.hotels || [];
                const hotelsWithWeather = await Promise.all(
                    fetchedHotels.map(async (hotel) => {
                        if (hotel.address) {
                            const weather = await fetchWeather(hotel.address);
                            return { ...hotel, weather };
                        }
                        return { ...hotel, weather: null }; // No weather for invalid addresses
                    })
                );
                setHotels(hotelsWithWeather);
            })
            .catch(error => {
                console.error("There was an error fetching the hotel data!", error);
            });
    }, []);

    const handleShowModal = (hotel) => {
        setSelectedHotel(hotel);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedHotel(null);
    };

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

            <Container className="mt-4">
                <Row>
                    {hotels.map((hotel) => (
                        <Col xs={12} md={6} lg={4} className="mb-4" key={hotel.hotel_id}>
                            <Card className="h-100">
                                <Card.Img
                                    variant="top"
                                    src={hotel.picture}
                                    alt={hotel.name}
                                    className="img-fluid"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>{hotel.name}</Card.Title>
                                    <Card.Text>{hotel.address}</Card.Text>
                                    <Card.Text>
                                        {/* Display weather information */}
                                        {hotel.weather ? (
                                            <>
                                                <strong>Current Temperature:</strong> {hotel.weather.temp}°C<br />
                                                <strong>Conditions:</strong> {hotel.weather.conditions}
                                            </>
                                        ) : (
                                            "Weather information not available"
                                        )}
                                    </Card.Text>
                                    <Button
                                        variant="primary"
                                        className="mt-auto"
                                        onClick={() => handleShowModal(hotel)}
                                    >
                                        Book Now
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            {selectedHotel && (
                <BookNowModal
                    show={showModal}
                    handleClose={handleCloseModal}
                    hotelId={selectedHotel.hotel_id}
                    token={token}
                    hotelName={selectedHotel.name}
                />
            )}
        </>
    );
}
