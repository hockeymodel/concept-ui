# 🏒 HockeyModel UI Prototype

> A high-fidelity, interactive front-end prototype for **HockeyModel**—an AI-powered hockey prediction platform.

This application demonstrates the user experience for both **Free** and **Premium** users, featuring advanced data visualizations, confidence tracking, and market edge analysis.

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [How to Run](#-how-to-run)
- [Project Structure](#-project-structure)
- [Notes for Developers](#-notes-for-developers)

## ✨ Features

* **Dynamic Tier Toggling:** Instantly switch between "Free" (blurred/locked data) and "Premium" (fully unlocked) views to simulate the upsell experience.
* **Game Dashboard:** Visual probability bars, confidence badges, and comprehensive game schedules.
* **Explainability Engine:** Interactive "Waterfall Charts" showing exactly how the model arrived at a specific win probability.
* **Scenario Simulator:** Interactive toggles (e.g., "Star Player Out") that adjust win probabilities in real-time.
* **Market Edge Finder:** A dense data table comparing model probabilities against sportsbook odds to highlight **+EV bets**.
* **Performance Tracking:** SVG-based charts visualizing bankroll growth and ROI history.
* **Weekly Contests:** A gamified flow for users to submit their own predictions.

## 🛠 Tech Stack

* **Framework:** React 18 (via Vite)
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Runtime:** Node.js

## 🚀 Getting Started

### Prerequisites
Before running this project, ensure you have **Node.js** installed on your machine.

1.  Open your terminal (PowerShell, Command Prompt, or Terminal).
2.  Run the following command to check your version:
    ```bash
    node -v
    ```
3.  If you get an error, download Node from the [official Node.js website](https://nodejs.org/).

### Installation

1.  Navigate to the project directory:
    ```bash
    cd hockey-model-prototype
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

## 🎮 How to Run

1.  Start the development server:
    ```bash
    npm run dev
    ```

2.  Look for the "Local" URL in your terminal (usually `http://localhost:5173/`).
3.  **Ctrl + Click** the link or paste it into your browser to view the app.

## 📂 Project Structure

```text
hockey-model-prototype/
├── src/
│   ├── App.jsx           # Main application logic and all UI components
│   ├── index.css         # Tailwind CSS directives and global styles
│   └── main.jsx          # React entry point
├── index.html            # HTML shell
├── package.json          # Dependency list and scripts
├── tailwind.config.js    # Tailwind configuration
└── vite.config.js        # Build tool configuration
```

## ℹ️ Notes for Developers

> **CSS Warnings:** You may see a warning in VS Code saying *"Unknown at rule @tailwind"*. This is normal and can be ignored; the app will still compile correctly.

> **Mock Data:** This prototype uses static mock data arrays (`GAMES`, `PROPS`, `EDGE_FINDER`) defined at the top of `App.jsx`. No backend connection is required.