# FeelAware App

**FeelAware** is a mood tracking and reflection app that allows users to log their daily moods, write reflections, and view their mood history. The app features real-time updates, image uploads, and integrates with OpenAI to help determine users' moods based on daily prompts. The app uses **Angular** for the frontend and **MongoDB** for storage, with a backend powered by **Node.js**.

## Key Features:
- Mood tracking with date, mood, and reflections.
- Image uploads with optional captions.
- Integration with OpenAI to determine mood based on a user prompt.
- Offline support through local storage for mood logs.

## Technologies Used:
- **Frontend**: Angular, Ionic Framework
- **Backend**: Node.js, Express, MongoDB
- **OpenAI API**: For mood determination

## Getting Started

Follow these steps to run the app locally:

### 1. Clone the Repository

```bash
git clone https://github.com/nathanbuyr/FeelAware
cd feelaware-app
```

### 2. Install Dependencies

#### Backend (Server)
Navigate to the backend folder and install the necessary dependencies:

```bash
cd backend
npm install
```

#### Frontend (App)
Navigate to the frontend folder and install the necessary dependencies:

```bash
cd frontend
npm install
```

### 3. Start the Server (Backend)

In the **backend** folder, start the server by running:

```bash
node server.js
```

The server should now be running on [http://localhost:4000](http://localhost:4000).

### 4. Start the Frontend (App)

In the **frontend** folder, run the following to start the Angular app:

```bash
ng serve
```

The frontend will be available at [http://localhost:4200](http://localhost:4200).

## Endpoints:
- **POST /api/moods**: Create a new mood entry.
- **GET /api/moods**: Fetch all mood entries.
- **POST /api/decide-mood**: Use OpenAI to determine mood from a prompt.
- **POST /api/upload**: Upload an image.

## Notes:
- Ensure you have a `.env` file in the **backend** folder with your OpenAI API key and MongoDB connection string.
- I used my own OpenAI key for this project but I cannot provide it here as it will automatically be found and turned off. Please contact me if you want to use my OpenAI key
- The app is designed for both desktop and mobile usage, but mobile testing may require additional configuration (e.g., running on a real device for some features).
---
