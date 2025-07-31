const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const db = require('./database.js');

const app = express();
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.redirect('/auth/login.html');
  res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public')); // Serve static files from the public directory

app.use(express.static('public'));

const SECRET_KEY = '93049JFDSKLmsnur@@NJKSNJK';

// Middleware to verify JWT
function authenticate(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).send('Access denied');

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send('Invalid token');
  }
}

// Auth: Register
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)')
      .run(username, hashedPassword);
    res.status(201).send('User registered');
  } catch (err) {
    res.status(400).send('Username already exists');
  }
});

// Auth: Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send('Invalid credentials');
  }

  const token = jwt.sign({ id: user.id }, SECRET_KEY);
  res.cookie('token', token);
  res.send('Logged in');
});

// API: Add expense (protected)
app.post('/api/expenses', authenticate, (req, res) => {
  const { amount, category, date, description } = req.body;
  db.prepare(`
    INSERT INTO expenses (user_id, amount, category, date, description)
    VALUES (?, ?, ?, ?, ?)
  `).run(req.user.id, amount, category, date, description);
  res.status(201).send('Expense added');
});

// API: Get user's expenses (protected)
app.get('/api/expenses', authenticate, (req, res) => {
  const expenses = db.prepare(`
    SELECT * FROM expenses WHERE user_id = ?
  `).all(req.user.id);
  res.json(expenses);
});

// API: Get spending summary (protected)
app.get('/api/summary', authenticate, (req, res) => {
  const summary = db.prepare(`
    SELECT category, SUM(amount) as total 
    FROM expenses 
    WHERE user_id = ?
    GROUP BY category
  `).all(req.user.id);
  res.json(summary);
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));