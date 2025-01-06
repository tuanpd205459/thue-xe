import React from "react";

const StationListComponent = ({ stations }) => {
  return (
    <div>
      <h2>Danh sách trạm</h2>
      {stations.map((station) => (
        <div
          key={station.id}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            marginBottom: "10px",
            backgroundColor: "#f0f8ff",
          }}
        >
          <h3>{station.model}</h3>
          <p>Địa chỉ: {station.address}</p>
          <p>
            Vĩ độ: {station.location.latitude}, Kinh độ: {station.location.longitude}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StationListComponent;
