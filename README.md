AUTHOR: ADITYA CHAUHAN
The Voice Command Shopping Assistant was designed to combine natural voice interaction with a simple shopping list manager. 
My approach started by structuring the project into three layers: frontend, backend, and machine learning. 
The **frontend** was built with HTML, CSS, and JavaScript, integrating the Web Speech API to allow users to add and search products through voice commands. 

The **backend** was implemented using Node.js, Express, and MongoDB to handle authentication, product management, and persistence of shopping lists. 
For authentication, I used JWT tokens so that users could securely log in and save their lists. I also created separate routes for `auth` and `products` to maintain clean modularity.  

The **ML component** focuses on generating product embeddings and providing personalized suggestions, enabling smarter shopping experiences. 
I also ensured the system is deployment-ready by adding Docker configuration and deploying both frontend and backend to Render. 
The architecture is modular, so additional features such as payment integration or recommendation engines can be plugged in later.  

Overall, the approach was to build a scalable, user-friendly assistant where speech recognition and AI-powered suggestions enhance the everyday task of managing shopping lists.  


# Voice Command Shopping Assistant 🛒🎙️

A voice-enabled shopping list manager that allows users to register, login, and manage their shopping lists using both **voice commands** and **manual text input**.  
The project integrates **frontend (HTML, CSS, JavaScript)**, **backend (Node.js + Express + MongoDB)**, and a simple **ML/AI suggestion service**.

---

## 🚀 Features
- User Registration & Login (with JWT authentication)
- Login via Email/Mobile number
- Shopping list creation, update, and save to backend
- Voice commands using Web Speech API
- Smart product suggestions using ML embeddings
- REST API backend with Express
- Secure authentication with JWT
- Deployed on **Render**

---

## 🗂️ Project Structure


---

## ⚙️ Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express, MongoDB
- **Authentication:** JWT
- **Voice Recognition:** Web Speech API
- **ML/AI:** Python (embeddings & recommender)
- **Deployment:** Render / Docker

---

## 📦 Setup Instructions
1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/voice-shopping-assistant.git

📌 Deployment

Deployed on Render:
Frontend: https://voice-asistant.onrender.com

Backend: https://voice-asistant-backend.onrender.com

