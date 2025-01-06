import React, { useEffect, useState } from "react";
import axios from "axios";
import MapComponent from "./components/MapComponent";

function App() {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [borrowedCar, setBorrowedCar] = useState(null);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState(""); // Thêm state cho đăng nhập
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null); // Thông tin người dùng đã đăng nhập
  const [stations, setStations] = useState([]);

  // Fetch cars and borrowed car on mount
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/cars/cars")
      .then((response) => setCars(response.data))
      .catch((error) => console.error("Error fetching cars:", error));

    axios
      .get("http://localhost:5001/api/rentals/rent")
      .then((response) => setBorrowedCar(response.data))
      .catch((error) => console.error("Error fetching borrowed car:", error));
    axios
      .get("http://localhost:5001/api/cars/getStations")
      .then((response) => setStations(response.data))
      .catch((error) => console.error("Error fetching cars:", error));
  }, []);

  // Handle login
  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5001/api/users/login", {
        username,
        password,
      });

      const { token, userId } = response.data;

      // Lưu token vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      setLoggedInUser({ username }); // Lưu thông tin người dùng
      setMessage("Đăng nhập thành công!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Đăng nhập thất bại.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setLoggedInUser(null);
    setMessage("Đã đăng xuất.");
  };

  // Handle borrowing a car
  const handleBorrowCar = async () => {
    try {
      // Kiểm tra xem đã chọn xe chưa
      if (!selectedCar) {
        setMessage("Bạn chưa chọn xe.");
        console.log("Selected Car:", selectedCar._id);  // Kiểm tra giá trị của selectedCar
        return;
      }
      if (!selectedCar._id) {
        setMessage("ID của xe không hợp lệ.");
        console.log("Selected Car ID:", selectedCar._id);
        return;
      }
  
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Bạn cần đăng nhập để mượn xe.");
        return;
      }
  
      const currentTime = new Date().toISOString(); // Lấy thời gian hiện tại
      const response = await axios.post(
        "http://localhost:5001/api/rentals/rent",
        {
          carId: selectedCar._id, 
          rentalStart: currentTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        }
      );
  
      setMessage(response.data.message);
      setBorrowedCar({
        selectedCar,
        rentalStart: currentTime, // Gán thời gian mượn xe
      });
  
      // Cập nhật trạng thái của xe trong danh sách
      setCars((prevCars) =>
        prevCars.map((car) =>
          car._id === selectedCar._id
            ? { ...car, available: false, borrowTime: currentTime } // Cập nhật thông tin xe đã mượn
            : car
        )
      );
    } catch (error) {
      setMessage(error.response?.data?.message || "Lỗi khi mượn xe.");
    }
  };
  
  // Xử lý sự kiện khi chọn xe
  const handleCarSelect = (car) => {
    setSelectedCar(car); // Cập nhật selectedCar khi chọn
    console.log("Car selected:", car); // Kiểm tra toàn bộ object xe
    console.log("Selected Car ID:", car._id); // Hiển thị ID của xe
    console.log("thoi gian muon:", car.borrowTime);
  };

  //trả xe

  const handleReturnCar = async () => {
    try {
      const rentalEnd = new Date().toISOString(); // Lấy thời gian hiện tại theo ISO 8601
      const carId = selectedCar._id; // Lấy carId từ borrowedCar
  
      console.log("Returning car with Car ID:", carId);
      console.log("Rental End Time:", rentalEnd); // Thời gian trả xe
  
      const response = await axios.post(
        "http://localhost:5001/api/rentals/return",
        { 
          carId: carId, // Gửi carId 
          rentalEnd: rentalEnd, // Gửi thêm thời gian trả
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Lấy token từ localStorage
          },
        }
      );
    // Lấy dữ liệu từ response
    const { rental } = response.data; // Truy cập rental object
    const { totalPrice, rentalEnd: returnedTime } = rental;
   console.log("Response from return car API:", response.data);
  // Hiển thị thông báo
  setMessage(
    `Xe đã trả thành công vào lúc: ${new Date(returnedTime).toLocaleString()}. Tiền mượn: ${totalPrice.toLocaleString()} VND`
  );
      setBorrowedCar(null); // Cập nhật lại trạng thái của borrowedCar
      setCars((prevCars) =>
    prevCars.map((car) =>
    car._id === selectedCar._id
      ? { ...car, available: true, borrowTime: null }
      : car
  )
);

    } catch (error) {
      console.error("Error while returning car:", error);
      setMessage(error.response?.data?.message || "Lỗi khi trả xe.");
    }
  };
  
  
  return (
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
                      : "---"}
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
    </div>
  );
  
}

export default App;
