// src/index.js

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";  // Import file CSS chung cho toàn bộ ứng dụng
import App from "./App"; // Import App.js
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
