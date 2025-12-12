const { app } = require("@azure/functions");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sql, poolPromise } = require("./db");

app.http("login", {
  methods: ["POST", "OPTIONS"],       // 👈 include OPTIONS
  authLevel: "anonymous",
  route: "login",
  handler: async (req, context) => {
    context.log("[login] Request:", req.method);

    // CORS only for localhost:8081
    const corsHeaders = {
      "Access-Control-Allow-Origin": "http://localhost:8081",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // Handle preflight
    if (req.method === "OPTIONS") {
      return {
        status: 204,
        headers: corsHeaders,
      };
    }

    // Parse body
    let body;
    try {
      body = await req.json();
    } catch {
      return {
        status: 400,
        headers: corsHeaders,
        jsonBody: { error: "Request body must be JSON." },
      };
    }

    const { email, password } = body || {};
    if (!email || !password) {
      return {
        status: 400,
        headers: corsHeaders,
        jsonBody: { error: "Email and password are required." },
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

      if (!user) {
        return {
          status: 401,
          headers: corsHeaders,
          jsonBody: { error: "Invalid credentials." },
        };
      }

      const matches = await bcrypt.compare(password, user.Password);
      if (!matches) {
        return {
          status: 401,
          headers: corsHeaders,
          jsonBody: { error: "Invalid credentials." },
        };
      }

      const token = jwt.sign(
        { userId: user.UserID },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return {
        status: 200,
        headers: corsHeaders,
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
      context.log("[login] error:", err);
      return {
        status: 500,
        headers: corsHeaders,
        jsonBody: { error: "Login failed." },
      };
    }
  },
});
