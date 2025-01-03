import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BorrowCar = () => {
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState('');
    const [userId, setUserId] = useState('');
    const [borrowTime, setBorrowTime] = useState('');
    const [returnTime, setReturnTime] = useState('');
    const [bookingId, setBookingId] = useState('');
    const [message, setMessage] = useState('');

    // Lấy danh sách xe từ backend
    useEffect(() => {
        axios.get('/api/cars')
            .then(response => {
                setCars(response.data.cars);
            })
            .catch(error => {
                console.error('Error fetching cars:', error);
            });
    }, []);

    // Xử lý mượn xe
    const handleBorrowCar = () => {
        axios.post('/api/borrow/borrow', {
            userId,
            carId: selectedCar,
            startTime: borrowTime
        })
            .then(response => {
                setMessage(response.data.message);
                setBookingId(response.data.booking._id); // Lưu bookingId để trả xe
            })
            .catch(error => {
                console.error('Error borrowing car:', error);
                setMessage('Failed to borrow car.');
            });
    };

    // Xử lý trả xe
    const handleReturnCar = () => {
        axios.post('/api/borrow/return', {
            bookingId,
            endTime: returnTime
        })
            .then(response => {
                setMessage(response.data.message);
            })
            .catch(error => {
                console.error('Error returning car:', error);
                setMessage('Failed to return car.');
            });
    };

    return (
        <div>
            <h2>Borrow a Car</h2>
            <div>
                <label>User ID:</label>
                <input 
                    type="text" 
                    value={userId} 
                    onChange={(e) => setUserId(e.target.value)} 
                    placeholder="Enter your user ID" 
                />
            </div>
            <div>
                <label>Select Car:</label>
                <select value={selectedCar} onChange={(e) => setSelectedCar(e.target.value)}>
                    <option value="">-- Select a Car --</option>
                    {cars.map(car => (
                        <option key={car._id} value={car._id}>{car.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Borrow Time:</label>
                <input 
                    type="datetime-local" 
                    value={borrowTime} 
                    onChange={(e) => setBorrowTime(e.target.value)} 
                />
            </div>
            <button onClick={handleBorrowCar}>Borrow</button>

            <h2>Return a Car</h2>
            <div>
                <label>Booking ID:</label>
                <input 
                    type="text" 
                    value={bookingId} 
                    onChange={(e) => setBookingId(e.target.value)} 
                    placeholder="Enter booking ID" 
                />
            </div>
            <div>
                <label>Return Time:</label>
                <input 
                    type="datetime-local" 
                    value={returnTime} 
                    onChange={(e) => setReturnTime(e.target.value)} 
                />
            </div>
            <button onClick={handleReturnCar}>Return</button>

            {message && <p>{message}</p>}
        </div>
    );
};

export default BorrowCar;
