const { app } = require("@azure/functions");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sql, poolPromise } = require("./db");

app.http("login", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "login",
  handler: async (req, context) => {
    const body = await req.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return {
        status: 400,
        jsonBody: { error: "Email and password are required" },
      };
    }

    try {
      const pool = await poolPromise;

      const result = await pool
        .request()
        .input("Email", sql.NVarChar, email)
        .query(`
          SELECT UserID, Name, Email, Password
          FROM Users
          WHERE Email = @Email
        `);

      const user = result.recordset[0];

      if (!user || !user.Password) {
        return {
          status: 401,
          jsonBody: { error: "Invalid credentials" },
        };
      }

      const matches = await bcrypt.compare(password, user.Password);
      if (!matches) {
        return {
          status: 401,
          jsonBody: { error: "Invalid credentials" },
        };
      }

      const token = jwt.sign(
        { userId: user.UserID },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return {
        status: 200,
        jsonBody: {
          token,
          user: {
            id: user.UserID,
            name: user.Name,
            email: user.Email,
          },
        },
      };
    } catch (err) {
      context.log("Login error:", err);
      return {
        status: 500,
        jsonBody: { error: "Login failed" },
      };
    }
  },
});
