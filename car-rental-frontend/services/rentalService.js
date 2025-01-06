import axios from "axios";

export const borrowCar = (carId, token) =>
  axios.post(
    "http://localhost:5001/api/rentals/rent",
    { carId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

export const returnCar = (carId, token) =>
  axios.post(
    "http://localhost:5001/api/rentals/return",
    { carId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
