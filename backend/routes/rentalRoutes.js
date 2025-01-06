const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
const userController = require('../controllers/userController');


// Route cho mượn xe, sử dụng middleware authenticateUser để xác thực người dùng
router.post('/rent', userController.authenticateUser, rentalController.rentCar);


// Trả xe
router.post('/return', userController.authenticateUser, rentalController.returnCar);

// Lấy danh sách thuê xe của người dùng
router.get('/user/:userId', rentalController.getUserRentals);


module.exports = router;
