const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: TOKEN_EXPIRES_IN,
    });

    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
}

async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
      `INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3)
       RETURNING id, email, name`,
      [email, passwordHash, name]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const { rows } = await db.query('SELECT id, email, name FROM users WHERE id = $1', [req.user.sub]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = { login, register, me };
