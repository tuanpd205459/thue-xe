import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Form, Card, Alert } from "react-bootstrap";
import MapComponent from "./components/MapComponent";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [borrowedCar, setBorrowedCar] = useState(null);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/cars/cars")
      .then(response => setCars(response.data))
      .catch(error => console.error("Error fetching cars:", error));

    axios.get("http://localhost:5001/api/rentals/rent")
      .then(response => setBorrowedCar(response.data))
      .catch(error => console.error("Error fetching borrowed car:", error));

    axios.get("http://localhost:5001/api/cars/getStations")
      .then(response => setStations(response.data))
      .catch(error => console.error("Error fetching stations:", error));
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5001/api/users/login", { username, password });
      const { token, userId } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      setLoggedInUser({ username });
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

  const handleBorrowCar = async () => {
    if (!selectedCar) {
      setMessage("Bạn chưa chọn xe.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Bạn cần đăng nhập để mượn xe.");
      return;
    }

    try {
      const currentTime = new Date().toISOString();
      const response = await axios.post(
        "http://localhost:5001/api/rentals/rent",
        { carId: selectedCar._id, rentalStart: currentTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessage(response.data.message);
      setBorrowedCar({ selectedCar, rentalStart: currentTime });
      setCars(cars.map(car => car._id === selectedCar._id ? { ...car, available: false, borrowTime: currentTime } : car));
      setMessage(`Đã mượn xe thành công vào lúc: ${new Date(currentTime).toLocaleString()}`);
    } catch (error) {
      setMessage(error.response?.data?.message || "Lỗi khi mượn xe.");
    }
  };

  const handleReturnCar = async () => {
    if (!selectedCar) return;

    try {
      const rentalEnd = new Date().toISOString();
      const response = await axios.post(
        "http://localhost:5001/api/rentals/return",
        { carId: selectedCar._id, rentalEnd },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const { totalPrice, rentalEnd: returnedTime } = response.data.rental;
      setMessage(`Xe đã trả thành công vào lúc: ${new Date(returnedTime).toLocaleString()}. Tiền mượn: ${totalPrice.toLocaleString()} VND`);
      setBorrowedCar(null);
      setCars(cars.map(car => car._id === selectedCar._id ? { ...car, available: true, borrowTime: null } : car));
    } catch (error) {
      setMessage(error.response?.data?.message || "Lỗi khi trả xe.");
    }
  };

  const handleCarSelect = (car) => setSelectedCar(car);

  return (
    <Container fluid style={{ fontSize: "14px" }}>
      <Row sm={6}>
        <Col sm={5}>
          <div style={{ height: "600px", backgroundColor: "#d3d3d3", border: "2px solid #000", borderRadius: "8px" }}> {/* Tăng chiều cao bản đồ */}
            <h4>Bản đồ</h4>
            <MapComponent cars={cars} selectedCar={selectedCar} stations={stations} />
          </div>
        </Col>
        <Col sm={7}> {/* Giảm kích thước phần đăng nhập xuống 8/12 */}
            <h1 style={{ fontSize: "26px" }} className="my-4">Bike Rental Dashboard</h1>
          <div style={{ marginBottom: "5px", fontSize: "18px", fontWeight: "bold", color:"#9966ff" }}>
            
             Phan Đình Tuấn - 20242239M - Project IOT
          </div>
          {!loggedInUser ? (
            <Form className="mb-4" style={{  width: "250px", margin: "0 auto", border: "2px solid #000", borderRadius: "8px", padding: "20px"  }}> {/* Giảm kích thước ô đăng nhập */}
              <Form.Group controlId="username" className="mb-3">
                <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
              </Form.Group>
              <Form.Group controlId="password" className="mb-3">
                <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
              </Form.Group>
              <Button onClick={handleLogin} variant="primary">Login</Button>
            </Form>
          ) : (
            <div className="mb-4">
              <h2 style={{ fontSize: "16px" }}>Welcome, {loggedInUser.username}</h2>
              <Button onClick={handleLogout} variant="secondary">Logout</Button>
            </div>
          )}
  
          {message && <Alert variant="info">{message}</Alert>}
  
          <Row className="gy-3">
            {cars.map(car => (
                          <Col sm={12} md={4} lg={3} key={car._id}> {/* Thay đổi kích thước Col để thu nhỏ các ô hiển thị xe */}
                          <Card
                            style={{
                              cursor: "pointer", 
                              borderColor: car.available ? "#198754" : "#dc3545", 
                              border: "2px solid #000", /* Thêm viền cho Card */
                              borderRadius: "8px", /* Thêm bo tròn cho Card */
                              height: "150px", /* Giảm chiều cao của Card */
                              overflow: "hidden", /* Giới hạn nội dung không vượt quá Card */
                            }}
                            className={`h-100 ${car.available ? "bg-light" : "bg-danger-subtle"}`}
                            onClick={() => handleCarSelect(car)}
                          >
                            <Card.Body>
                              <Card.Title style={{ fontSize: "14px" }}>{car.brand} {car.model}</Card.Title>
                          {/*    <Card.Text><strong>Biển số:</strong> {car.licensePlate}</Card.Text> */ }
                              <Card.Text style={{ fontSize: "12px" }} className={car.available ? "text-success fw-bold" : "text-danger fw-bold"}>
                                {car.available ? "Có sẵn" : "Không có sẵn"}
                              </Card.Text>
                              {car.available ? (
                                <Button variant="success" onClick={handleBorrowCar} className="mt-2">Mượn Xe</Button>
                              ) : car.borrowedBy === loggedInUser?.id ? (
                                <Button variant="danger" onClick={handleReturnCar} className="mt-2">Trả Xe</Button>
                              ) : null}
                            </Card.Body>
                          </Card>
                        </Col>
            ))}
          </Row>
{/* {\*
          {borrowedCar && (
            <Alert variant="info" className="mt-4">
              <h4>Xe bạn đã mượn:</h4>
              <p><strong>Xe:</strong> {borrowedCar.selectedCar.brand} {borrowedCar.selectedCar.model}</p>
              <p><strong>Bắt đầu mượn lúc:</strong> {new Date(borrowedCar.rentalStart).toLocaleString()}</p>
              <Button variant="primary" onClick={handleReturnCar}>Trả Xe</Button>
            </Alert>
          )}
          */}  
          {/* Danh sách trạm */}
      <div className="mt-4">
        <h2 style={{ fontSize: "18px" }}>Danh sách trạm</h2>
        {stations.map((station) => (
          <div
            key={station.id}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              marginBottom: "02px",
              cursor: "pointer",
              backgroundColor: "#f0f8ff",
            }}
          >
            <h3 style={{ fontSize: "16px" }}>{station.model}</h3>
            {/* <p>Địa chỉ: {station.address}</p> */}
            <p>
              Vĩ độ: {station.location.latitude}, Kinh độ:{" "}
              {station.location.longitude}
            </p>
          </div>
        ))}
      </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
