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
    </div>
  );
}

export default App;
