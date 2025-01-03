import React, { useEffect, useState } from "react";
import "./CarList.css"; // Thêm CSS nếu cần

const CarList = () => {
    const [cars, setCars] = useState([]); // State để lưu danh sách xe
    const [loading, setLoading] = useState(true); // State để kiểm tra trạng thái tải dữ liệu
    const [error, setError] = useState(null); // State để lưu lỗi nếu có

    useEffect(() => {
        // Gọi API để lấy danh sách xe
        const fetchCars = async () => {
            try {
                const response = await fetch("http://localhost:5001/api/cars/cars"); // URL của backend
                if (!response.ok) {
                    throw new Error("Failed to fetch cars");
                }
                const data = await response.json();
                setCars(data); // Lưu dữ liệu vào state
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false); // Hoàn thành tải dữ liệu
            }
        };

        fetchCars();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="car-list">
            <h2>Danh sách xe</h2>
            {cars.length === 0 ? (
                <p>Không có xe nào!</p>
            ) : (
                <ul>
                    {cars.map((car) => (
                        <li key={car._id}>
                            <h3>{car.brand} - {car.model}</h3>
                            <p>Biển số: {car.licensePlate}</p>
                            <p>Giá thuê mỗi ngày: {car.pricePerDay} VND</p>
                            <p>{car.available ? "Còn sẵn" : "Đã thuê"}</p>
                            <p>Vị trí: Latitude: {car.location.latitude}, Longitude: {car.location.longitude}</p>
                            {/* Hiển thị _id của xe */}
                            <p>ID xe: {car._id}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CarList;
