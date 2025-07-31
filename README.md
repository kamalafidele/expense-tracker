# Expense Tracker

*A simple expense tracker with user authentication and spending analytics.*

## Features

* ✅ **User Authentication** (Login/Signup)
* 💸 **Track Expenses** (Amount, Category, Date)
* 📊 **Visual Analytics** (Pie/Bar Charts)
* 🐳 **Docker Support**

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/kamalafidele/expense-tracker.git
cd expense-tracker
npm install
```

### 2. Configure

Create `.env` file:

```env
SECRET_KEY=your_random_secret_here
```

### 3. Run

```bash
node server.js
```

Visit: `http://localhost:8080`

## Docker Deployment

```bash
docker build -t expense-tracker .
docker run -p 8080:8080 expense-tracker
```

## Project Structure

```
public/           # Frontend (HTML/CSS/JS)
├── auth/         # Login/Signup pages
├── index.html    # Dashboard
server.js         # Backend API
database.js       # SQLite setup
```