const { app } = require('@azure/functions');
const bcrypt = require('bcrypt');
const { sql, poolPromise } = require('./db'); 

app.http('register', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'register',
  handler: async (req, context) => {
    const body = await req.json();
    const { name, password, email, UserTimeZoneName } = body || {};

    if (!email || !password) {
      return {
        status: 400,
        jsonBody: { error: 'Email and password are required' },
      };
    }

    try {
      const hash = await bcrypt.hash(password, 10);

      const pool = await poolPromise;

      const result = await pool
        .request()
        .input('Name', sql.NVarChar, name)
        .input('Password', sql.NVarChar, hash)
        .input('Email', sql.NVarChar, email)
        .input('UserTimeZoneName', sql.NVarChar, UserTimeZoneName)
        .query(`
          INSERT INTO Users (Name, Password, Email, UserTimeZoneName)
          OUTPUT INSERTED.UserID, INSERTED.Email
          VALUES (@Name, @Password, @Email, @UserTimeZoneName)
        `);

      const user = result.recordset[0];

      return {
        status: 201,
        jsonBody: {
          id: user.UserID,
          email: user.Email,
        },
      };
    } catch (err) {
      context.log('Register error:', err);

      return {
        status: 500,
        jsonBody: { error: 'Registration failed' },
      };
    }
  },
});
