# NextPlayAI - NBA Performance Predictor

<div align="center">

A full-stack machine learning application that predicts NBA player performance using historical game statistics and a custom-trained Random Forest regression model.

[![Hugging Face Model](https://img.shields.io/badge/🤗%20Model-HuggingFace-yellow)](https://huggingface.co/JustinTran67/nbamodel)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![Django](https://img.shields.io/badge/Django-5.2-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB.svg)](https://reactjs.org/)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Machine Learning Pipeline](#machine-learning-pipeline)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Future Enhancements](#future-enhancements)
- [Disclaimer](#disclaimer)

---

## 🎯 Overview

NextPlayAI is an end-to-end data science and web development project that leverages machine learning to predict NBA player statistics for upcoming games. The application fetches real-time NBA data from Kaggle, trains a regression model on historical performance, and serves predictions through a modern web interface.

**Live Model:** [HuggingFace Repository](https://huggingface.co/JustinTran67/nbamodel)

### What Makes This Project Unique

- **Automated Data Pipeline**: Daily data fetching and model retraining from Kaggle datasets
- **Feature Engineering**: Rolling averages and player-specific performance metrics
- **RESTful API**: Django REST framework backend with JWT authentication
- **Modern UI**: React-based frontend with Tailwind CSS styling
- **Model Versioning**: Automated model uploads to Hugging Face Hub

---

## ✨ Key Features

### Core Functionality
- 🏀 **Player Performance Predictions**: Predict points, assists, rebounds, and other key stats
- 📊 **Historical Analysis**: View player performance trends over time
- 🔄 **Automated Updates**: Daily dataset refresh and model retraining pipeline
- 🎯 **Multi-Stat Prediction**: Simultaneous prediction of 10+ player statistics
- 🔐 **User Authentication**: JWT-based authentication system

### Technical Highlights
- **Data Pipeline Automation**: Scheduled data ingestion from Kaggle API
- **Feature Engineering**: Rolling window averages for recent player performance
- **Model Deployment**: Integration with Hugging Face Hub for model versioning
- **Database Management**: MySQL backend with Django ORM
- **Responsive Design**: Mobile-friendly interface built with React and Tailwind CSS

---

## 🛠 Tech Stack

### Backend
- **Framework**: Django 5.2, Django REST Framework 3.16
- **Database**: MySQL with MySQLClient
- **ML Libraries**: scikit-learn 1.7, pandas 2.3, NumPy 2.3
- **Model Storage**: Hugging Face Hub integration
- **Data Source**: Kaggle API
- **Authentication**: JWT (Simple JWT)
- **Deployment**: Gunicorn WSGI server

### Frontend
- **Framework**: React 19.2
- **Routing**: React Router DOM 7.9
- **HTTP Client**: Axios 1.12
- **Styling**: Tailwind CSS 3.4
- **Build Tool**: React Scripts 5.0

### Machine Learning
- **Algorithm**: Random Forest Regressor
- **Training Data**: Historical NBA player game statistics (15,000+ games)
- **Features**: Player stats, rolling averages, home/away indicators, opponent data
- **Evaluation Metrics**: MAE (Mean Absolute Error), R² Score

### DevOps & Tools
- **Version Control**: Git
- **Environment Management**: python-dotenv, python-decouple
- **Code Quality**: Black, isort, pylint
- **API Integration**: Kaggle API, Hugging Face Hub API

---

## 🏗 System Architecture

```
┌─────────────────┐
│   Kaggle API    │ ──> Daily NBA Statistics
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│           Backend (Django)              │
│  ┌───────────────────────────────────┐  │
│  │   Data Ingestion & Processing     │  │
│  │   - Download latest CSV data      │  │
│  │   - Parse and validate records    │  │
│  │   - Update MySQL database         │  │
│  └───────────────┬───────────────────┘  │
│                  │                       │
│  ┌───────────────▼───────────────────┐  │
│  │   ML Pipeline (train_model2.py)  │  │
│  │   - Feature engineering           │  │
│  │   - Random Forest training        │  │
│  │   - Model evaluation              │  │
│  └───────────────┬───────────────────┘  │
│                  │                       │
│  ┌───────────────▼───────────────────┐  │
│  │   REST API (DRF)                 │  │
│  │   - Player endpoints              │  │
│  │   - Prediction endpoints          │  │
│  │   - JWT authentication            │  │
│  └───────────────────────────────────┘  │
└────────────┬────────────────────────────┘
             │
             │ HTTP/JSON
             ▼
┌─────────────────────────────────────────┐
│       Frontend (React)                  │
│  - Player selection interface           │
│  - Prediction visualization             │
│  - Historical stats display             │
└─────────────────────────────────────────┘
             │
             │ Model Upload
             ▼
┌─────────────────────────────────────────┐
│       Hugging Face Hub                  │
│  - Model versioning                     │
│  - Model artifacts storage              │
└─────────────────────────────────────────┘
```

---

## 🤖 Machine Learning Pipeline

### Data Collection
1. **Source**: Kaggle's "Historical NBA Data and Player Box Scores" dataset
2. **Update Frequency**: Daily automated fetches
3. **Data Volume**: 15,000+ player game records

### Feature Engineering
- **Rolling Statistics**: 5-game and 10-game moving averages for key metrics
- **Contextual Features**: Home/away games, opponent strength
- **Player History**: Previous game performance, season trends

### Model Training
```python
# Core algorithm: Random Forest Regressor
- Handles non-linear relationships
- Robust to outliers
- Captures complex player performance patterns
- Ensemble method for improved accuracy
```

### Model Performance
The model predicts multiple player statistics including:
- Points
- Assists
- Rebounds (Total, Offensive, Defensive)
- Steals & Blocks
- Field Goal Percentage
- Three-Point Statistics
- Free Throw Statistics

### Automated Retraining
The `daily_update.py` script handles:
1. Downloading new game data from Kaggle
2. Updating the MySQL database
3. Retraining the model with expanded dataset
4. Uploading the new model to Hugging Face
5. Maintaining a maximum dataset size for optimal performance

---

## 🚀 Installation

### Prerequisites
- Python 3.9+
- Node.js 16+
- MySQL 8.0+
- Kaggle API credentials
- Hugging Face account and token

### Backend Setup

```bash
# Clone the repository
git clone <repository-url>
cd NBA-Performance-Predictor/backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials:
# - KAGGLE_USERNAME, KAGGLE_KEY
# - HUGGINGFACE_TOKEN
# - HF_MODEL_REPO
# - Database credentials

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.production
# Edit .env.production with your API URL

# Start development server
npm start
```

### Initial Data Load & Model Training

```bash
# From the backend directory
python daily_update.py
```

This script will:
1. Download the latest NBA dataset from Kaggle
2. Populate the database
3. Train the initial model
4. Upload the model to Hugging Face

---

## 💻 Usage

### Running the Application

1. **Start the backend server**:
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Start the frontend**:
   ```bash
   cd frontend
   npm start
   ```

3. **Access the application**:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000/api/`
   - Admin Panel: `http://localhost:8000/admin/`

### Scheduled Updates

To automate daily updates, set up a cron job (Linux/macOS) or Task Scheduler (Windows):

```bash
# Example cron job (runs daily at 2 AM)
0 2 * * * cd /path/to/NBA-Performance-Predictor/backend && /path/to/venv/bin/python daily_update.py >> /var/log/nba_update.log 2>&1
```

---

## 📡 API Documentation

### Authentication Endpoints

```http
POST /api/token/
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password"
}
```

### Player Endpoints

```http
GET /api/players/
Authorization: Bearer <your_jwt_token>

# Returns list of all players with recent stats
```

```http
GET /api/players/{id}/
Authorization: Bearer <your_jwt_token>

# Returns detailed player information and prediction
```

### Prediction Endpoint

```http
POST /api/predict/
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "player_id": 123,
  "opponent": "Los Angeles Lakers",
  "home": true
}

# Returns predicted stats for the player
```

---

## 📁 Project Structure

```
NBA-Performance-Predictor/
├── backend/
│   ├── backendApp/           # Main Django application
│   │   ├── models.py         # Database models (Player, PlayerGameStat)
│   │   ├── views.py          # API views
│   │   ├── serializers.py    # DRF serializers
│   │   └── urls.py           # URL routing
│   ├── ml_models/            # Machine learning modules
│   │   ├── train_model2.py   # Model training script
│   │   └── data_preperation.py  # Feature engineering
│   ├── project/              # Django project settings
│   ├── data/                 # Kaggle dataset storage
│   ├── daily_update.py       # Automated update script
│   ├── manage.py             # Django management script
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── App.js            # Main app component
│   │   └── index.js          # Entry point
│   ├── package.json          # Node dependencies
│   └── tailwind.config.js    # Tailwind configuration
└── README.md                 # This file
```

---

## 🔮 Future Enhancements

### Planned Features
- [ ] **Deep Learning Models**: Experiment with LSTM/GRU for time-series predictions
- [ ] **Injury Tracking**: Integrate injury reports into predictions
- [ ] **Matchup Analysis**: Opponent-specific performance predictions
- [ ] **Confidence Intervals**: Provide prediction uncertainty ranges
- [ ] **Real-time Updates**: WebSocket integration for live game stats
- [ ] **Advanced Visualizations**: Interactive charts for performance trends
- [ ] **Mobile App**: Native iOS/Android applications
- [ ] **Fantasy Basketball Integration**: DFS lineup optimization
- [ ] **A/B Testing Framework**: Compare different model architectures
- [ ] **Explainable AI**: SHAP values for prediction interpretability

### Technical Improvements
- [ ] Docker containerization for easier deployment
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Comprehensive unit and integration tests
- [ ] Redis caching for API responses
- [ ] GraphQL API option
- [ ] Elasticsearch for advanced player search

---

## 🤝 Contributing

This is a portfolio project, but suggestions and feedback are welcome! Feel free to open an issue or reach out directly.

---

## 📄 Disclaimer

This project was created solely for **educational and portfolio demonstration purposes**. It is not affiliated with, endorsed by, or associated with the National Basketball Association (NBA), its teams, players, or any of their partners.

### Data Usage
- All player data is based on **publicly available** information from Kaggle datasets
- No proprietary or commercial NBA content is included
- Player images (if any) are either:
  - Freely available under open licenses (e.g., Creative Commons)
  - AI-generated avatars for illustrative purposes
  - Generic placeholders not representing real individuals

### Legal Notice
- **No commercial use** of this application is intended or permitted
- **No redistribution or monetization** is allowed
- This project is for **demonstration and learning purposes only**

---

## 📧 Contact

For questions, opportunities, or collaboration:

- **GitHub**: @JustinTran67
- **LinkedIn**: linkedin.com/in/justin-tran-902938355/
- **Email**: justinttran06@gmail.com

---

<div align="center">

**Built with ❤️ using Django, React, and scikit-learn**

⭐ Star this repo if you find it interesting!

</div>
