const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Đăng ký người dùng
exports.registerUser = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Kiểm tra nếu người dùng đã tồn tại
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};


// Đăng nhập người dùng
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Tìm người dùng
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Tạo token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1000h' });
    res.json({ message: 'Login successful', token, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};


exports.authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Lấy token từ header

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // Giải mã token
    req.userId = decoded.userId; // Gán thông tin userId vào request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
// Hiển thị thông tin người dùng hiện tại
exports.getCurrentUser = async (req, res) => {
    try {
      // Tìm người dùng theo userId từ token
      const user = await User.findById(req.userId).select('-password'); // Không trả về mật khẩu
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Tạo token mới (nếu cần thiết) và trả về cùng với thông tin người dùng
     // const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1000h' });
  
      // Trả về thông tin người dùng và token
      res.json({
        username: user.username,
        email: user.email,
        token: req.headers.authorization?.split(' ')[1] // Trả về token gốc từ header
      });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching user', error: err.message });
    }
  };
  
  
  