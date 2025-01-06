const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
 
// Đăng ký người dùng
router.post('/register', userController.registerUser);

// Đăng nhập người dùng
router.post('/login', userController.loginUser);

// Route hiển thị người dùng hiện tại
router.get('/me', userController.authenticateUser, userController.getCurrentUser);

<<<<<<< HEAD
//xác thực người dùng qua RFID
router.post('/rfid/:rfid', rfid.authenticateUserByRFID);

=======
>>>>>>> parent of 774a4b51 (Thêm chức năng mượn/trả xe bằng RFID)
module.exports = router;
