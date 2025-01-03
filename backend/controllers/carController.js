const Car = require('../models/car');


exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find({ station: false });  
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving cars' });
  }
};

// API: Lấy danh sách station
exports.getStations = async (req, res) => {
  try {
    const stations = await Car.find({ station: true });
    res.json(stations);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách station:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Thêm xe mới
exports.addCar = async (req, res) => {
  const { model, brand, year, pricePerDay, latitude, longitude } = req.body;
  try {
    const newCar = new Car({ model, brand, year, pricePerDay, location: { latitude, longitude } });
    await newCar.save();
    res.status(201).json(newCar);
  } catch (err) {
    res.status(500).json({ message: 'Error adding car' });
  }
};

// Cập nhật tọa độ xe
exports.updateLocation = async (req, res) => {
  const { carId, latitude, longitude } = req.body;
  try {
    const car = await Car.findByIdAndUpdate(
      carId,
      { location: { latitude, longitude } },
      { new: true }
    );
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: 'Error updating car location' });
  }
};

// Mở/Khóa xe
exports.toggleLock = async (req, res) => {
  const { carId } = req.body;
  try {
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    car.available = !car.available; // Đổi trạng thái available
    await car.save();
    res.json({ message: car.available ? 'Car is available' : 'Car is unavailable', car });
  } catch (err) {
    res.status(500).json({ message: 'Error toggling car lock' });
  }
};
