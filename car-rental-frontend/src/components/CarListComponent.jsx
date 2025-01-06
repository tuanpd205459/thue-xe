import React from "react";

const CarListComponent = ({
  cars,
  selectedCar,
  loggedInUser,
  handleCarSelect,
  handleBorrowCar,
  handleReturnCar,
  message,
}) => {
  return (
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
          onClick={() => handleCarSelect(car)}
        >
          <h3>
            {car.brand} {car.model}
          </h3>
          <p>{car.licensePlate}</p>
          <p style={{ fontWeight: "bold", color: car.available ? "green" : "red" }}>
            {car.available ? "Có sẵn" : "Không có sẵn"}
          </p>
          {car.available ? (
            <button onClick={handleBorrowCar}>Mượn Xe</button>
          ) : (
            <>
              <p>
                Đã mượn lúc:{" "}
                {car.borrowTime ? new Date(car.borrowTime).toLocaleString() : "---"}
              </p>
              {car.borrowedBy === loggedInUser?.id && (
                <button onClick={handleReturnCar}>Trả Xe</button>
              )}
            </>
          )}
        </div>
      ))}
      {message && <p>{message}</p>}
    </div>
  );
};

export default CarListComponent;
