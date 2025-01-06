import React, { useEffect, useState } from "react";
import { fetchCars, fetchStations } from "./services/carService";
import LoginComponent from "./components/LoginComponent";
import CarListComponent from "./components/CarListComponent";
import StationListComponent from "./components/StationListComponent";
import MapComponent from "./components/MapComponent";

function App() {
  const [cars, setCars] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCars()
      .then((response) => setCars(response.data))
      .catch(console.error);

    fetchStations()
      .then((response) => setStations(response.data))
      .catch(console.error);
  }, []);

  const handleCarSelect = (car) => setSelectedCar(car);

  return (
<<<<<<< HEAD
    <div>
      <LoginComponent setLoggedInUser={setLoggedInUser} setMessage={setMessage} />
      <MapComponent cars={cars} selectedCar={selectedCar} stations={stations} />
      <CarListComponent
        cars={cars}
        selectedCar={selectedCar}
        loggedInUser={loggedInUser}
        handleCarSelect={handleCarSelect}
        message={message}
      />
      <StationListComponent stations={stations} />
=======
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* Góc trên bên phải: Đăng nhập hoặc thông tin người dùng */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "10px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        {loggedInUser ? (
          <div>
            <p>Xin chào, {loggedInUser.username}</p>
            <button onClick={handleLogout}>Đăng xuất</button>
          </div>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ marginBottom: "5px" }}
            />
            <br />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginBottom: "5px" }}
            />
            <br />
            <button onClick={handleLogin}>Đăng nhập</button>
          </div>
        )}
      </div>
  
      {/* Phần bản đồ */}
      <div style={{ flex: 1, height: "100%" }}>
        <MapComponent cars={cars} selectedCar={selectedCar} stations={stations} />
      </div>
  
      {/* Phần danh sách */}
      <div
        style={{
          flex: 1,
          height: "100%",
          overflowY: "scroll",
          padding: "20px",
          borderLeft: "2px solid #ccc",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Danh sách xe */}
        <div>
          <h2>Danh sách xe</h2>
          {cars.map((car) => (
            <div
              key={car._id}
              style={{
                padding: "10px",
                border: "1px solid #ccc",
                marginBottom: "10px",
                cursor: "pointer",
                backgroundColor: car.available ? "#e0f7e0" : "#ffebee",
              }}
              onClick={() => {
                handleCarSelect(car);
                console.log("Car ID đã chọn:", car._id);
              }}
            >
              <h3>
                {car.brand} {car.model}
              </h3>
              <p>{car.licensePlate}</p>
              <p
                style={{
                  fontWeight: "bold",
                  color: car.available ? "green" : "red",
                }}
              >
                {car.available ? "Có sẵn" : "Không có sẵn"}
              </p>
              {car.available ? (
                <button onClick={handleBorrowCar}>Mượn Xe</button>
              ) : (
                <>
                  <p>
                    Đã mượn lúc:{" "}
                    {car.borrowTime
                      ? new Date(car.borrowTime).toLocaleString()
                      : "Không rõ thời gian"}
                  </p>
                  {car.borrowedBy === loggedInUser?.id && (
                    <button onClick={handleReturnCar}>Trả Xe</button>
                  )}
                </>
              )}
            </div>
          ))}
          {borrowedCar && (
            <div>
              <h3>Xe bạn đã mượn:</h3>
              <p>
                {borrowedCar.selectedCar.brand}{" "}
                {borrowedCar.selectedCar.model}
              </p>
              <p>
                Bắt đầu mượn lúc:{" "}
                {new Date(borrowedCar.rentalStart).toLocaleString()}
              </p>
              <button onClick={() => handleReturnCar()}>Trả Xe</button>
            </div>
          )}
          {message && <p>{message}</p>}
        </div>
  
        {/* Danh sách trạm */}
        <div>
          <h2>Danh sách trạm</h2>
          {stations.map((station) => (
            <div
              key={station.id}
              style={{
                padding: "10px",
                border: "1px solid #ccc",
                marginBottom: "10px",
                cursor: "pointer",
                backgroundColor: "#f0f8ff",
              }}
            >
              <h3>{station.model}</h3>
              <p>Địa chỉ: {station.address}</p>
              <p>
                Vĩ độ: {station.location.latitude}, Kinh độ:{" "}
                {station.location.longitude}
              </p>
            </div>
          ))}
        </div>
      </div>
>>>>>>> parent of 774a4b51 (Thêm chức năng mượn/trả xe bằng RFID)
    </div>
  );
}

export default App;
