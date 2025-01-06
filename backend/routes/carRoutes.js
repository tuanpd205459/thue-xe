const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

// Lấy danh sách xe
router.get('/cars', carController.getCars);

// Lấy danh sách xe
router.get('/getStations', carController.getStations);

// Thêm xe mới
router.post('/addcars', carController.addCar);

// Cập nhật tọa độ xe
router.put('/cars/location', carController.updateLocation);

// Mở/Khóa xe
router.put('/cars/lock', carController.toggleLock);

module.exports = router;
