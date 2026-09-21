# 🌾 KisanFlow – Smart Mandi Procurement & Queue Management System

> Smart India Hackathon 2026 Project

KisanFlow is an AI-powered mandi procurement scheduling and queue management platform designed to reduce overcrowding, minimize farmer waiting times, improve procurement efficiency, and increase transparency across agricultural procurement operations.

The platform enables farmers to book procurement slots, track live queues, receive weather-based recommendations, monitor payments, and access services through multilingual voice assistance. Procurement officers can manage queues, verify farmers, record procurement details, and monitor center operations through a dedicated dashboard.

---

# 📌 Problem Statement

Farmers frequently face:

- Long waiting times at procurement centers
- Uncertain procurement schedules
- Overcrowded mandis
- Delayed payments
- Multiple unnecessary trips
- Lack of real-time information
- Poor coordination between farmers and procurement centers

These issues reduce efficiency and increase operational costs for both farmers and government agencies.

---

# 💡 Proposed Solution

KisanFlow introduces a digital procurement ecosystem that:

- Allocates dynamic procurement slots
- Manages live queues
- Generates QR-based procurement tokens
- Provides multilingual voice assistance
- Offers weather-based crop recommendations
- Supports SMS and IVR notifications
- Enables real-time payment tracking
- Assists officers with procurement management and verification

---

# 👥 User Roles

## 🚜 Farmer

Farmers can:

- Select preferred language
- Register/Login using OTP
- Verify identity
- Search nearby mandis
- Book procurement slots
- Generate QR-based tokens
- Track queue status
- Monitor payment status
- Receive weather-based recommendations
- Access booking history
- Use voice assistant

---

## 🏛 Procurement Officer

Procurement officers can:

- Verify official identity
- Monitor live queues
- Verify farmer QR tokens
- Record crop procurement
- Record moisture levels
- Approve procurement
- Initiate payment processing
- Monitor mandi analytics
- Track weather-related procurement risks

---

# ✨ Key Features

## 🌐 Multilingual Support

Supports:

- English
- हिन्दी
- ਪੰਜਾਬੀ

---

## 🎤 Voice Assistant

Supports voice commands such as:

- Book Slot
- Check Queue Status
- Check Payment Status
- Find Nearby Mandi

---

## 🏢 Smart Mandi Discovery

Farmers can:

- Select State
- Select District
- View nearby mandis
- Check queue length
- Check available slots

---

## 📅 Dynamic Slot Booking

Features:

- Crop selection
- Quantity declaration
- Preferred date selection
- AI-assisted slot recommendation

---

## 🎫 QR-Based Token System

- Unique Booking ID
- QR Code Generation
- QR Download
- Permanent QR Storage
- Re-access QR anytime from booking history

---

## ⏳ Live Queue Tracking

Displays:

- Current Token
- Farmer Token
- Farmers Ahead
- Estimated Waiting Time
- Queue Progress

---

## 💰 Payment Tracking

Provides:

- Procurement Details
- MSP Calculation
- Payment Timeline
- Payment Status

---

## 🌦 Weather Intelligence & Crop Advisory

Integrated Weather API provides:

- Current Temperature
- Humidity
- Rain Forecast
- Wind Speed
- Weather Alerts

AI-generated recommendations:

- Harvesting Suggestions
- Moisture Risk Alerts
- Procurement Timing Recommendations
- Queue Congestion Forecasts

Example:

> Heavy rainfall expected in next 48 hours. Delay harvesting to avoid increased crop moisture.

---

# 🛡 Verification & Anti-Hoarding System

## Farmer Verification

- OTP-based verification
- Aadhaar/Farmer ID verification
- Land Owner or Tenant selection

---

## Tenant Verification

Supports:

- Lease Agreement Upload
- Panchayat Certificate Upload
- Tenant Allocation Validation

---

## Yield Validation

System calculates procurement quota using:

```text
Maximum Quota = Land Area × Yield Benchmark
```

Example:

```text
4.5 Acres × 20 Quintals/Acre
= 90 Quintals Maximum Procurement Quota
```

---

# 📱 Farmer Application Flow

```text
Language Selection
↓
Login / OTP Verification
↓
Farmer Verification
↓
Select District
↓
Choose Mandi
↓
Weather Advisory
↓
Slot Booking
↓
QR Token Generation
↓
Queue Tracking
↓
Procurement
↓
Payment Tracking
```

---

# 🏛 Officer Workflow

```text
Official Login
↓
Identity Verification
↓
Queue Dashboard
↓
QR Verification
↓
Procurement Entry
↓
Moisture Recording
↓
Approval
↓
Payment Processing
```

---

# 🏗 System Architecture

```text
                Farmer App
                     │
                     ▼
           React + Tailwind Frontend
                     │
                     ▼
             Node.js + Express API
                     │
     ┌───────────────┼───────────────┐
     ▼               ▼               ▼
 PostgreSQL       Redis        Weather API
 Database         Cache
     │               │
     └───────────────┼───────────────┘
                     ▼
          Queue Management Engine
                     │
                     ▼
          Procurement Officer Portal
                     │
                     ▼
               Payment Module
```

---

# 🛠 Technology Stack

## Frontend

- React.js
- Tailwind CSS
- React Native (Future Scope)

## Backend

- Node.js
- Express.js

## Database

- PostgreSQL

## Real-Time Communication

- Socket.io

## Caching

- Redis

## Authentication

- OTP Verification
- Aadhaar Verification (Prototype Simulation)

## APIs & Integrations

- Weather API
- SMS Gateway
- IVR System
- Push Notifications

---

# 📊 Officer Dashboard Features

## Queue Management

- Live Queue Monitoring
- Call Next Farmer
- Mark Arrival
- Complete Procurement

---

## QR Verification

- Scan QR Code
- Upload QR Image
- Verify Booking

---

## Procurement Entry

Fields:

- Crop Type
- Actual Quantity
- Moisture Level
- Quality Grade
- Storage Location
- Remarks

---

## Analytics Dashboard

Displays:

- Procurement Volume
- Queue Congestion
- Farmer Arrivals
- Capacity Utilization
- Crop Distribution
- Weather Impact Analysis

---

# 📈 Benefits

## For Farmers

- Reduced waiting time
- Fewer mandi visits
- Transparent procurement process
- Faster payments
- Weather-based guidance

---

## For Procurement Centers

- Better queue management
- Reduced overcrowding
- Efficient resource utilization
- Improved planning

---

## For Government Authorities

- Real-time monitoring
- Data-driven decision making
- Improved transparency
- Better procurement planning

---

# 🚀 Future Scope

- AgriStack Integration
- Bhulekh Integration
- AI Yield Prediction
- Satellite Crop Monitoring
- Weather-Based Demand Forecasting
- State-Wide Deployment
- National Procurement Integration

---

# 📸 Screenshots

## Language Selection

<img width="2208" height="1056" alt="image" src="https://github.com/user-attachments/assets/cd10db9b-d08e-45f1-9c13-0a584b640ab9" />


## Farmer Dashboard

<img width="1600" height="760" alt="FarmerDashboard" src="https://github.com/user-attachments/assets/335a92a5-dad7-4b39-830b-df4e89a52de8" />


## Farmer Verification

<img width="2096" height="992" alt="image" src="https://github.com/user-attachments/assets/edac3814-2bf2-4c02-95af-e7b040f85e81" />


## Mandi Selection

<img width="2352" height="1088" alt="image" src="https://github.com/user-attachments/assets/d9d8b439-3d69-4bc1-82fa-430196b03094" />


## Weather Advisory

<img width="2352" height="1088" alt="image" src="https://github.com/user-attachments/assets/9526b74c-7921-4501-bfab-e1e7db24774c" />


## Slot Booking

<img width="2352" height="1088" alt="image" src="https://github.com/user-attachments/assets/57ebbae4-0c95-4b33-a8df-f69c671d3a32" />

<img width="2096" height="992" alt="image" src="https://github.com/user-attachments/assets/6cf73f54-2379-47eb-be7a-054d9613ca24" />



## QR Token Generation

<img width="2096" height="992" alt="image" src="https://github.com/user-attachments/assets/78ff2721-8f95-454a-8c92-1817a75bcfdd" />


## Queue Tracking

<img width="2096" height="992" alt="image" src="https://github.com/user-attachments/assets/02d9985c-2f98-452d-824a-eebdc5890aa6" />


## Payment Tracking

<img width="2352" height="1088" alt="image" src="https://github.com/user-attachments/assets/ebdf88a8-3c95-4d35-a998-1ad3eeefc5d0" />


## Officer Dashboard

<img width="1600" height="769" alt="OfficerDashboard" src="https://github.com/user-attachments/assets/bda7dc32-4d0f-4d7e-bf90-cd51031f71c0" />


## QR Verification

**Saksham add screenshot here**

## Procurement Entry

**Saksham add screenshot here**

## Analytics Dashboard

**Saksham add screenshot here**

# ⚠️ Prototype Limitations

As this project is currently a Smart India Hackathon prototype, certain integrations and features are simulated for demonstration purposes.

## Simulated Components

- Aadhaar Verification (Mock OTP Flow)
- AgriStack Integration
- Bhulekh / Land Record Verification
- Government Payment Gateway Integration
- SMS Gateway Integration
- IVR Integration
- Real-Time Procurement Database Access

## Limited Data Availability

- Mandi information currently uses sample/demo data.
- Weather recommendations are based on public weather APIs.
- Yield benchmarks are based on predefined values for demonstration.

## Scalability Constraints

- Prototype is tested on limited datasets.
- Multi-state deployment and high-volume traffic handling have not yet been tested.
- Advanced AI prediction models are currently rule-based demonstrations.

## Future Production Enhancements

- Direct AgriStack integration
- Real land record verification
- State procurement database connectivity
- AI-powered yield forecasting
- Satellite-based crop monitoring
- Full-scale payment automation

## Hackathon Note

This prototype focuses on validating the workflow, user experience, queue management logic, procurement verification process, and weather-assisted decision support. Government APIs and production-scale infrastructure would be integrated during full-scale deployment.
# 👨‍💻 Team

**Team Name:** Sinister Six

**Project:** KisanFlow – Smart Mandi Procurement & Queue Management System

**Smart India Hackathon 2026**
🌾 Empowering Farmers Through Smart Procurement
