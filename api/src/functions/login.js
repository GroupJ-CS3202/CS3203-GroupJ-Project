const { app } = require('@azure/functions');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');

app.http('login', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'login',
  handler: async (req, context) => {
    const body = await req.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return {
        status: 400,
        jsonBody: { error: 'Email and password are required' },
      };
    }

    try {
      const result = await pool.query(
        'SELECT UserID, Email, Password FROM Users WHERE Email = $1', //SELECT id, email, password_hash FROM users WHERE email = $1
        [email]
      );

      const user = result.rows[0];

      if (!user) {
        return {
          status: 401,
          jsonBody: { error: 'Invalid credentials' },
        };
      }

      const match = await bcrypt.compare(password, user.password_hash); //if this is returned then credentials were incorrect
      if (!match) {
        return {
          status: 401,
          jsonBody: { error: 'Invalid credentials' },
        };
      }

      const token = jwt.sign( //returns the auth token to the user, that is valid for 1h
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return {
        status: 200,
        jsonBody: {
          token,
          user: { id: user.id, email: user.email },
        },
      };
    } catch (err) {
      context.log('Login error:', err);

      return {
        status: 500,
        jsonBody: { error: 'Login failed' },
      };
    }
  },
});
