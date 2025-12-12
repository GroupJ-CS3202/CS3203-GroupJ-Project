//THIS ENDPOINT CHECKS THAT AN EXISTING AUTH TOKEN IS VALID
const { app } = require("@azure/functions");
const { sql, poolPromise } = require("./db");
const { getUserFromRequest, extractBearerToken } = require("../utils/auth");

app.http("authCheck", {
  methods: ["GET", "OPTIONS"],
  authLevel: "anonymous",
  route: "auth-check",
  handler: async (req, context) => {
    context.log("[authCheck] Request:", req.method);

    // --- CORS ---
    const origin = req.headers.get("origin") || "";

    const allowedOrigins = [
      "http://localhost:8081",                          
      "https://yellow-ocean-0e950841e.3.azurestaticapps.net",      
    ];

    const corsOrigin = allowedOrigins.includes(origin)
      ? origin
      : "https://yellow-ocean-0e950841e.3.azurestaticapps.net";

    const corsHeaders = {
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (req.method === "OPTIONS") {
      return {
        status: 204,
        headers: corsHeaders,
      };
    }

    let payload;
    try {
      payload = getUserFromRequest(req);
    } catch (err) {
      context.log("[authCheck] auth error:", err);

      if (err.code === "NO_TOKEN" || err.code === "INVALID_TOKEN") {
        return {
          status: 401,
          headers: corsHeaders,
          jsonBody: { error: "Invalid or missing token. Code: " +  err.code + " " + extractBearerToken(req)},
        };
      }

      

      return {
        status: 401,
        headers: corsHeaders,
        jsonBody: { error: "Unauthorized." },
      };
    }

    const userId = payload.userId;

    try {
      const pool = await poolPromise;

      const result = await pool
        .request()
        .input("UserID", sql.UniqueIdentifier, userId)
        .query(`
          SELECT UserID, Name, Email
          FROM Users
          WHERE UserID = @UserID
        `);

      const user = result.recordset[0];

      if (!user) {
        return {
          status: 401,
          headers: corsHeaders,
          jsonBody: { error: "User not found." },
        };
      }

      return {
        status: 200,
        headers: corsHeaders,
        jsonBody: {
          user: {
            id: user.UserID,
            name: user.Name,
            email: user.Email,
          },
        },
      };
    } catch (err) {
      context.log("[authCheck] DB error:", err);
      return {
        status: 500,
        headers: corsHeaders,
        jsonBody: { error: "Failed to verify session." },
      };
    }
  },
});
