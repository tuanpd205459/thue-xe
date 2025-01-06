import React, { useState } from "react";
import axios from "axios";

const LoginComponent = ({ setLoggedInUser, setMessage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5001/api/users/login", {
        username,
        password,
      });

      const { token, userId } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      setLoggedInUser({ username });
      setMessage("Đăng nhập thành công!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Đăng nhập thất bại.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setLoggedInUser(null);
    setMessage("Đã đăng xuất.");
  };

  return (
    <div>
      {localStorage.getItem("token") ? (
        <div>
          <p>Xin chào, {username}</p>
          <button onClick={handleLogout}>Đăng xuất</button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginBottom: "5px" }}
          />
          <br />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: "5px" }}
          />
          <br />
          <button onClick={handleLogin}>Đăng nhập</button>
        </div>
      )}
    </div>
  );
};

export default LoginComponent;
