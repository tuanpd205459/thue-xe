import React, { useState } from 'react';
import axios from 'axios';

const AddCar = () => {
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState(''); // Trường năm sản xuất
    const [pricePerDay, setPricePerDay] = useState('');
    const [available, setAvailable] = useState(true); // Trạng thái xe (có sẵn)
    const [latitude, setLat] = useState('');
    const [longitude, setLng] = useState('');
    const [locked, setLocked] = useState(true); // Trạng thái khóa
    const [carId, setCarId] = useState(null); // Trường id của xe vừa thêm
    const [borrowTime, setBorrowTime] = useState(null); // Trường id của xe vừa thêm

    const handleSubmit = (e) => {
        e.preventDefault();

        // Tạo đối tượng dữ liệu xe
        const newCar = {
            brand,
            model,
            year: parseInt(year), // Chuyển đổi năm thành kiểu số
            pricePerDay: parseFloat(pricePerDay), // Chuyển đổi giá mỗi ngày thành kiểu số
            available, // Đảm bảo đúng tên trường
            location: {
                latitude: parseFloat(lat), // Chuyển đổi vĩ độ thành kiểu số
                longitude: parseFloat(lng), // Chuyển đổi kinh độ thành kiểu số
            },
            locked,
            borrowTime,
        };

        // Gửi yêu cầu POST đến backend để thêm xe mới
        axios.post('http://localhost:5001/api/cars/cars', newCar)
            .then((response) => {
                console.log('Thêm xe thành công:', response.data);
                // Lưu _id của xe vừa thêm
                setCarId(response.data._id);

                // Reset form sau khi thêm thành công
                setBrand('');
                setModel('');
                setYear('');
                setPricePerDay('');
                setAvailable(true);
                setLat('');
                setLng('');
                setLocked(true);
                setBorrowTime('');
            })
            .catch((error) => {
                console.error('Lỗi khi thêm xe:', error);
            });
    };

    return (
        <div>
            <h1>Thêm Xe Mới</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Thương hiệu:</label>
                    <input
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                    />
                </div>
                <div>
                    <label>Model:</label>
                    <input
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                    />
                </div>
                <div>
                    <label>Năm sản xuất:</label>
                    <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    />
                </div>
                <div>
                    <label>Giá mỗi ngày (VND):</label>
                    <input
                        type="number"
                        value={pricePerDay}
                        onChange={(e) => setPricePerDay(e.target.value)}
                    />
                </div>
                <div>
                    <label>Trạng thái (Còn xe?):</label>
                    <input
                        type="checkbox"
                        checked={available}
                        onChange={(e) => setAvailable(e.target.checked)}
                    />
                </div>
                <div>
                    <label>Vĩ độ:</label>
                    <input
                        type="number"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                    />
                </div>
                <div>
                    <label>Kinh độ:</label>
                    <input
                        type="number"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                    />
                </div>
                <div>
                    <label>Khóa xe:</label>
                    <input
                        type="checkbox"
                        checked={locked}
                        onChange={(e) => setLocked(e.target.checked)}
                    />
                </div>
                <button type="submit">Thêm Xe</button>
            </form>

            {/* Hiển thị ID của xe vừa thêm */}
            {carId && <p>Xe đã thêm thành công với ID: {carId}</p>}
        </div>
    );
};

export default AddCar;
