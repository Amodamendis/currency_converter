# React Currency Converter with AWS CI/CD Pipeline

A modern, responsive Currency Converter application built with React and Vite. This project features real-time exchange rates, an offline mode with data caching, conversion history, and accessibility features. It is deployed automatically to Amazon S3 using a full AWS CI/CD pipeline.

## 🌟 Key Features

* **Real-Time Exchange Rates:** Fetches up-to-date currency pairs using the ExchangeRate-API.
* **Offline Mode & Caching:** Uses a custom `CacheManager` to store rates in LocalStorage for 24 hours, allowing the app to work seamlessly without an internet connection.
* **Conversion History:** Automatically saves your past conversions to the browser's local storage so you don't lose your data.
* **Accessibility (Text-to-Speech):** Utilizes the browser's built-in `SpeechSynthesis` API to read conversion results aloud.
* **Live Clock:** Displays accurate local time and timezone by syncing with WorldTimeAPI.

## 🏗️ Architecture & Deployment

This project implements a continuous integration and continuous deployment (CI/CD) pipeline on AWS:

1.  **Source:** Code is hosted on GitHub.
2.  **Pipeline Trigger:** AWS CodePipeline listens for pushes to the repository.
3.  **Build Phase:** AWS CodeBuild spins up a Node 20 environment, installs dependencies using `npm ci --legacy-peer-deps`, and compiles the React app into static assets using `npm run build`.
4.  **Deploy Phase:** The compiled static files (`dist` folder) are automatically synced to an Amazon S3 Bucket configured for static website hosting.

## 💻 Local Setup Instructions

To run this project on your local machine:

**1. Clone the repository**
```bash
git clone [https://github.com/amodamendis/currency_converter.git](https://github.com/amodamendis/currency_converter.git)
cd currency_converter