// api/src/getEventsForRange.js
const { app } = require("@azure/functions");
const { sql, poolPromise } = require("./db");
const auth = require("../utils/auth");

app.http("getEventsForRange", {
  methods: ["POST", "OPTIONS"],
  authLevel: "anonymous",
  route: "getEventsForRange",
  handler: async (req, context) => {
    context.log("[getEventsForRange] Request:", req.method);

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
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Auth-Token",
    };

    // Preflight
    if (req.method === "OPTIONS") {
      return {
        status: 204,
        headers: corsHeaders,
      };
    }

    // --- BODY ---
    let body;
    try {
      body = await req.json();
    } catch {
      return {
        status: 400,
        headers: corsHeaders,
        jsonBody: { error: "Request body must be valid JSON." },
      };
    }

    const { rangeStart, rangeEnd } = body || {};

    if (!rangeStart || !rangeEnd) {
      return {
        status: 400,
        headers: corsHeaders,
        jsonBody: {
          error: "A start date and end date are required for the range",
        },
      };
    }

    // --- AUTH ---
    let user;
    try {
      // Make sure getUserFromRequest reads X-Auth-Token (or Authorization) consistently
      user = auth.getUserFromRequest(req, context);
    } catch (err) {
      context.log("[getEventsForRange] auth error:", err);
      return {
        status: 401,
        headers: corsHeaders,
        jsonBody: { error: "Unauthorized" },
      };
    }

    if (!user || !user.userId) {
      return {
        status: 400,
        headers: corsHeaders,
        jsonBody: { error: "Need user to access events" },
      };
    }

    const userId = user.userId;

    // --- DB QUERY ---
    try {
      const pool = await poolPromise;

      const eventsQueryResult = await pool
        .request()
        .input("StartDateTime", sql.DateTimeOffset, rangeStart)
        .input("EndDateTime", sql.DateTimeOffset, rangeEnd)
        .input("UID", sql.UniqueIdentifier, userId)
        .query(`
          SELECT 
            e.EventID AS id,
            e.Title    AS title, 
            e.StartDateTimeUTC AS startTime,
            e.EndDateTimeUTC   AS endTime,
            e.Description      AS description,
            atn.IsOrganizer    AS isUserOrganizer
          FROM 
            Events AS e
          INNER JOIN Attendees AS atn ON atn.EventID = e.EventID
          WHERE atn.UserID = @UID 
            AND e.StartDateTimeUTC >= @StartDateTime 
            AND e.StartDateTimeUTC <  @EndDateTime
            AND e.EndDateTimeUTC   >  @StartDateTime
            AND e.EndDateTimeUTC   <= @EndDateTime
        `);

      const events = eventsQueryResult.recordset || [];

      return {
        status: 200,
        headers: corsHeaders,
        jsonBody: {
          userEvents: events,
        },
      };
    } catch (err) {
      context.log("[getEventsForRange] DB error:", err);

      return {
        status: 500,
        headers: corsHeaders,
        jsonBody: { error: "Events fetching failed" },
      };
    }
  },
});
