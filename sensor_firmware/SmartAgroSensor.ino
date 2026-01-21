/**
 * Smart Agriculture Sensor Node Firmware
 * For: ESP32 or ESP8266
 * 
 * Dependencies (install via Library Manager):
 * 1. Firebase ESP Client (by Mobizt)
 * 2. ArduinoJson
 */

#include <Arduino.h>
#if defined(ESP32)
  #include <WiFi.h>
#elif defined(ESP8266)
  #include <ESP8266WiFi.h>
#endif
#include <Firebase_ESP_Client.h>
// Provide the token generation process info.
#include <addons/TokenHelper.h>
// Provide the RTDB payload printing info and other helper functions.
#include <addons/RTDBHelper.h>

/* 1. WIFI CONFIGURATION */
#define WIFI_SSID "YOUR_WIFI_NAME"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

/* 2. FIREBASE CONFIGURATION */
#define API_KEY "YOUR_FIREBASE_API_KEY"
#define DATABASE_URL "YOUR_FIREBASE_DATABASE_URL" // e.g. https://your-project.firebaseio.com/

/* 3. DEVICE CONFIGURATION */
// This MUST match the "Device Hardware ID" you used when registering the device in the Web App
#define DEVICE_ID "SN-2024-TEST-001" 

/* Firebase Objects */
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
unsigned long sendDataPrevMillis = 0;
bool signupOK = false;

void setup() {
  Serial.begin(115200);
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());

  /* Assign the api key (required) */
  config.api_key = API_KEY;
  /* Assign the RTDB URL (required) */
  config.database_url = DATABASE_URL;

  /* Sign up */
  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("ok");
    signupOK = true;
  } else {
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; // see addons/TokenHelper.h
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 5000 || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis();

    // 1. Read Sensors (Replace with actual sensor logic)
    // float h = dht.readHumidity();
    // float t = dht.readTemperature();
    
    // Dummy Data Simulation
    float nitrogen = random(20, 100);
    float phosphorus = random(10, 80);
    float potassium = random(20, 80);
    float temperature = 25.0 + random(-5, 5); 
    float humidity = 60.0 + random(-10, 10);
    float pH = random(55, 75) / 10.0;
    float rain = random(0, 100);
    int moisture = random(30, 90);
    
    // 2. Create timestamp
    // Note: It's better to get real time from NTP, but for now we rely on server timestamp or simple local millis offset if specific time not needed strictly
    // Or simpler: Let backend handle timestamp or use Firebase 'sv': 'timestamp' placeholder
    
    // 3. Construct JSON Path: devices/{DEVICE_ID}/readings/{Generate-ID}
    String basePath = "/devices/" + String(DEVICE_ID) + "/readings";
    
    // We use pushJSON to generate a unique key (like "r1", "r2") automatically
    FirebaseJson json;
    json.set("nitrogen", nitrogen);
    json.set("phosphorus", phosphorus);
    json.set("potassium", potassium);
    json.set("temperature", temperature);
    json.set("humidity", humidity);
    json.set("pH", pH);
    json.set("rainfall", rain);
    json.set("soilMoisture", moisture);
    json.set("timestamp", "server_timestamp"); // Special placeholder that Firebase replaces with server time
    // For "server_timestamp" to work with the library, we often need to set it a specific way or just pass a number if we have NTP.
    // Simpler specific way for this library:
    json.set("timestamp", successfullyGetNTPTime()); 

    Serial.printf("Pushing data to %s... ", basePath.c_str());
    
    if (Firebase.RTDB.pushJSON(&fbdo, basePath, &json)) {
      Serial.println("Success");
    } else {
      Serial.printf("Failed: %s\n", fbdo.errorReason().c_str());
    }
  }
}

unsigned long successfullyGetNTPTime() {
    // Ideally use NTP source here
    // For prototype, we can assume hardcoded recent timestamp or use 0 and let frontend handle it
    // But better:
    return millis(); // Placeholder! Replace with time(nullptr) after configTime()
}
