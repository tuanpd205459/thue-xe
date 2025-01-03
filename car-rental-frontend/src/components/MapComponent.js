import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { model } from "mongoose";

function MapComponent({ cars, selectedCar, stations }) {
  const mapRef = useRef(null); // Khởi tạo ref để tham chiếu đến phần tử div chứa bản đồ
  const [map, setMap] = useState(null); // Lưu trữ đối tượng bản đồ khi đã khởi tạo
  const carMarkersRef = useRef([]); // Lưu trữ các marker của xe
  const stationMarkersRef = useRef([]); // Lưu trữ các marker của trạm

  useEffect(() => {
    // Tạo bản đồ nếu chưa được khởi tạo
    const newMap = L.map(mapRef.current).setView([21.0285, 105.8542], 13); // Vị trí Hà Nội

    // Thêm lớp bản đồ OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(newMap);

    // Lưu đối tượng bản đồ vào state
    setMap(newMap);

    // Cleanup function để loại bỏ bản đồ khi component bị hủy
    return () => {
      newMap.remove();
    };
  }, []); // Chạy 1 lần khi component mount

  // Cập nhật các marker của xe
  useEffect(() => {
    if (map && cars) {
      // Xóa các marker cũ trước khi thêm mới
      carMarkersRef.current.forEach((marker) => marker.remove());
      carMarkersRef.current = []; // Reset lại mảng markers

      // Thêm tất cả các marker cho các xe trên bản đồ
      cars.forEach((car) => {
        const { location, brand, model, available } = car;
        const { latitude, longitude } = location;

        // Kiểm tra nếu latitude và longitude hợp lệ
        if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
          const popupContent = `
            <b>${brand} ${model}</b><br />
            Latitude: ${latitude}<br />
            Longitude: ${longitude}<br />
            Trạng thái: ${available ? 'Còn sẵn' : 'Đã thuê'}
          `;

          const marker = L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup(popupContent);

          carMarkersRef.current.push(marker); // Lưu trữ marker
        }
      });
    }
  }, [map, cars]); // Cập nhật khi bản đồ hoặc danh sách xe thay đổi

  // Cập nhật các marker của trạm
  useEffect(() => {
    if (map && stations) {
      // Xóa các marker cũ trước khi thêm mới
      stationMarkersRef.current.forEach((marker) => marker.remove());
      stationMarkersRef.current = []; // Reset lại mảng markers

      // Thêm tất cả các marker cho các trạm trên bản đồ
      stations.forEach((station) => {
        const { model, location } = station;
        const { latitude, longitude } = location;

        // Kiểm tra nếu latitude và longitude hợp lệ
        if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
          const popupContent = `
            <b>Station: ${model}</b>
          `;

          const marker = L.marker([latitude, longitude], { icon: L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // URL đến icon của station
            iconSize: [25, 25], // Kích thước icon
          })})
            .addTo(map)
            .bindPopup(popupContent);

          stationMarkersRef.current.push(marker); // Lưu trữ marker
        }
      });
    }
  }, [map, stations]); // Cập nhật khi bản đồ hoặc danh sách trạm thay đổi

  // Cập nhật khi xe được chọn
  useEffect(() => {
    if (map && selectedCar) {
      const { location, brand, model, available } = selectedCar;
      const { latitude, longitude } = location;

      // Kiểm tra nếu latitude và longitude hợp lệ
      if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
        const popupContent = `
          <b>${brand} ${model}</b><br />
          Latitude: ${latitude}<br />
          Longitude: ${longitude}<br />
          Trạng thái: ${available ? 'Còn sẵn' : 'Đã thuê'}
        `;

        // Tạo marker cho xe được chọn và di chuyển bản đồ đến vị trí của xe
        const selectedMarker = L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup(popupContent)
          .openPopup();

        // Di chuyển bản đồ đến vị trí của xe
        map.setView([latitude, longitude], 13);
      }
    }
  }, [map, selectedCar]); // Cập nhật khi xe được chọn

  return <div id="map" ref={mapRef} style={{ width: "100%", height: "100%" }}></div>;
}

export default MapComponent;
