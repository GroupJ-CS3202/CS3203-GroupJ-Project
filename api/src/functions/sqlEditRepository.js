const { app } = require('@azure/functions');
const { sql, poolPromise } = require('./db');
const auth = require('../utils/auth');

app.http("editEvent", {
  methods: ["PUT", "OPTIONS"],
  authLevel: "anonymous",
  route: "editEvent",
  handler: async (req, context) => {
    context.log("[editEvent] Request received:", req.method);

    // ---- CORS ----
    const origin = req.headers.get("origin") || "";
    const allowedOrigins = [
      "http://localhost:8081",
      "https://yellow-ocean-0e950841e.3.azurestaticapps.net"
    ];

    const corsOrigin = allowedOrigins.includes(origin)
      ? origin
      : "https://yellow-ocean-0e950841e.3.azurestaticapps.net";

    const corsHeaders = {
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Auth-Token",
    };

    if (req.method === "OPTIONS") {
      return { status: 204, headers: corsHeaders };
    }

    // ---- Parse Body ----
    let body;
    try {
      body = await req.json();
    } catch {
      return {
        status: 400,
        headers: corsHeaders,
        jsonBody: { error: "Invalid JSON in request body." }
      };
    }

    const { eventId, title, description, startTime, endTime } = body || {};

    if (!eventId || !title || !startTime || !endTime) {
      return {
        status: 400,
        headers: corsHeaders,
        jsonBody: { error: "eventId, title, startTime, and endTime are required." }
      };
    }

    // ---- Auth ----
    const token = auth.extractBearerToken(req);
    if (!token) {
      return { status: 401, headers: corsHeaders, jsonBody: { error: "Unauthorized" } };
    }

    let user;
    try {
      user = auth.getUserFromRequest(req);
    } catch {
      return { status: 401, headers: corsHeaders, jsonBody: { error: "Unauthorized" } };
    }

    const userId = user.userId;

    try {
      const pool = await poolPromise;

      // -------------------------------------------------------------------
      // Check if the user is the organizer of the event
      // -------------------------------------------------------------------
      const attendeeCheck = await pool
        .request()
        .input("UserID", sql.UniqueIdentifier, userId)
        .input("EventID", sql.UniqueIdentifier, eventId)
        .query(`
          SELECT IsOrganizer
          FROM Attendees
          WHERE UserID = @UserID AND EventID = @EventID
        `);

      if (attendeeCheck.recordset.length === 0 || attendeeCheck.recordset[0].IsOrganizer !== 1) {
        return {
          status: 403,
          headers: corsHeaders,
          jsonBody: { error: "Only the organizer can edit this event." }
        };
      }

      // -------------------------------------------------------------------
      // Update the event
      // -------------------------------------------------------------------
      await pool
        .request()
        .input("EventID", sql.UniqueIdentifier, eventId)
        .input("Title", sql.NVarChar(128), title)
        .input("Description", sql.NVarChar(250), description || "")
        .input("StartDateTimeUTC", sql.DateTimeOffset, startTime)
        .input("EndDateTimeUTC", sql.DateTimeOffset, endTime)
        .query(`
          UPDATE Events
          SET Title = @Title,
              Description = @Description,
              StartDateTimeUTC = @StartDateTimeUTC,
              EndDateTimeUTC = @EndDateTimeUTC
          WHERE EventID = @EventID
        `);

      return {
        status: 200,
        headers: corsHeaders,
        jsonBody: {
          message: "Event updated successfully",
          event: {
            id: eventId,
            title,
            description: description || "",
            startTime,
            endTime,
          },
        },
      };

    } catch (err) {
      context.log("EditEvent ERROR:", err);
      return {
        status: 500,
        headers: corsHeaders,
        jsonBody: { error: "Database error updating event." }
      };
    }
  }
});
