const { app } = require('@azure/functions');
const { sql, poolPromise } = require('./db');
const auth = require('../utils/auth');

app.http("deleteEvent", {
  methods: ["DELETE", "OPTIONS"],
  authLevel: "anonymous",
  route: "deleteEvent",
  handler: async (req, context) => {
    context.log("[deleteEvent] Request received:", req.method);

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
      "Access-Control-Allow-Methods": "DELETE, OPTIONS",
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

    const { eventId } = body || {};

    if (!eventId) {
      return {
        status: 400,
        headers: corsHeaders,
        jsonBody: { error: "eventId is required." }
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
          jsonBody: { error: "Only the organizer can delete this event." }
        };
      }

      // -------------------------------------------------------------------
      // Delete the event (Attendees will cascade automatically)
      // -------------------------------------------------------------------
      await pool
        .request()
        .input("EventID", sql.UniqueIdentifier, eventId)
        .query(`
          DELETE FROM Events
          WHERE EventID = @EventID
        `);

      return {
        status: 200,
        headers: corsHeaders,
        jsonBody: { message: "Event deleted successfully.", eventId }
      };

    } catch (err) {
      context.log("DeleteEvent ERROR:", err);
      return {
        status: 500,
        headers: corsHeaders,
        jsonBody: { error: "Database error deleting event." }
      };
    }
  }
});
