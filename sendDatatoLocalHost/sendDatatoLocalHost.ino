#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

// Thông tin WiFi
const char* ssid = "Thu - VNPT";        // Thay bằng SSID của mạng WiFi
const char* password = "123456789"; // Thay bằng mật khẩu WiFi

// Định nghĩa URL của server
String baseServer = "http://192.168.1.7:5001"; // Cập nhật URL với server của bạn

// Hàm khởi tạo WiFi
void setupWiFi() {
  Serial.print("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

// Hàm setup: chạy một lần khi thiết bị khởi động
void setup() {
  Serial.begin(115200); // Khởi tạo Serial
  setupWiFi();          // Kết nối WiFi
}

// Hàm loop: chạy lặp lại liên tục
void loop() {
  // Ví dụ gửi dữ liệu RFID và carId lên server
  String rfid = "2";    // Thay bằng giá trị thực tế của RFID
  String carId = "6777a953f8d96295d988c519";      // Thay bằng ID xe thực tế

  sendRFIDData(rfid, carId);    // Gửi dữ liệu
  delay(5000);                 // Lặp lại mỗi 10 giây
}

// Hàm gửi yêu cầu POST chứa thông tin RFID và carId lên server
void sendRFIDData(String rfid, String carId) {
  WiFiClient client;
  HTTPClient http;

  // Định nghĩa URL cho yêu cầu POST
  String fullUrl = String(baseServer) + "/api/users/rfid";

  Serial.println("Sending POST request to: " + fullUrl);

  if (http.begin(client, fullUrl)) {
    http.addHeader("Content-Type", "application/json"); // Header JSON

    // Tạo JSON chứa carId và RFID
    String jsonData = "{\"rfid\": \"" + rfid + "\", \"carId\": \"" + carId + "\"}";

    // Gửi yêu cầu POST
    int httpCode = http.POST(jsonData);

    if (httpCode > 0) {
      Serial.printf("POST Response Code: %d\n", httpCode);
      if (httpCode == HTTP_CODE_OK) {
        String payload = http.getString();
        Serial.println("POST Response:");
        Serial.println(payload);

        // Xử lý phản hồi JSON
        handleServerResponse(payload);
      }
    } else {
      Serial.printf("POST failed: %s\n", http.errorToString(httpCode).c_str());
    }
    http.end();
  } else {
    Serial.println("Unable to connect to server for POST");
  }
}

// Hàm xử lý phản hồi từ server
void handleServerResponse(String payload) {
  DynamicJsonDocument doc(1024);

  // Parse payload JSON
  DeserializationError error = deserializeJson(doc, payload);
  if (error) {
    Serial.println("Failed to parse JSON");
    return;
  }

  // Lấy thông tin từ JSON
  String userId = doc["userId"];
  String carId = doc["carId"];
  String timestamp = doc["timestamp"];
 // String authToken = doc["token"]; // Lưu token

  Serial.println("User ID: " + userId);
  Serial.println("Car ID: " + carId);
  Serial.println("Timestamp: " + timestamp);
  //Serial.println("Token user: " + authToken);

  rentCarRFID(carId, userId, timestamp);
}

// Hàm xử lý thuê xe
void rentCarRFID(String carId, String userId, String timeRent) {
  Serial.println("Renting car with ID: " + carId);
  Serial.println("User ID: " + userId);
  Serial.println("Rental Start Time: " + timeRent);

  sendRentCarData(carId, userId, timeRent);
}

// Hàm gửi yêu cầu thuê xe
void sendRentCarData(String carId, String userId, String timeRent) {
  WiFiClient client;
  HTTPClient http;

  String fullUrl = String(baseServer) + "/api/rentals/rentRFID";

  Serial.println("Sending Rent Car POST request to: " + fullUrl);

  if (http.begin(client, fullUrl)) {

    String jsonData = "{\"carId\": \"" + carId + "\", \"userId\": \"" + userId + "\", \"rentalStart\": \"" + timeRent + "\"}";

    int httpCode = http.POST(jsonData);

    if (httpCode > 0) {
      Serial.printf("POST Response Code: %d\n", httpCode);
      if (httpCode == HTTP_CODE_OK) {
        String payload = http.getString();
        Serial.println("POST Response:");
        Serial.println(payload);
      }
    } else {
      Serial.printf("POST failed: %s\n", http.errorToString(httpCode).c_str());
    }
    http.end();
  } else {
    Serial.println("Unable to connect to server for POST");
  }
}

// Hàm sinh tọa độ GPS ngẫu nhiên
void simulateGPS(float &latitude, float &longitude) {
  latitude = randomFloat(21.015, 21.030);   // Sinh vĩ độ (latitude)
  longitude = randomFloat(105.840, 105.850); // Sinh kinh độ (longitude)
}

// Hàm sinh số thực ngẫu nhiên trong khoảng [min, max]
float randomFloat(float min, float max) {
  return min + (float)random(0, 10000) / 10000.0 * (max - min);
}

// Hàm di chuyển tọa độ GPS theo hướng ngẫu nhiên trong nội thành
void moveGPS(float &latitude, float &longitude) {
  // Bước dịch chuyển mỗi lần lặp (đơn vị: độ)
  float stepLat = randomFloat(-0.0005, 0.0005); // Bước vĩ độ nhỏ
  float stepLon = randomFloat(-0.0005, 0.0005); // Bước kinh độ nhỏ

  // Cập nhật tọa độ GPS
  latitude += stepLat;
  longitude += stepLon;

  // Giới hạn tọa độ trong phạm vi nội thành Hà Nội
  if (latitude < 21.000) latitude = 21.000;
  if (latitude > 21.050) latitude = 21.050;
  if (longitude < 105.800) longitude = 105.800;
  if (longitude > 105.860) longitude = 105.860;
}


