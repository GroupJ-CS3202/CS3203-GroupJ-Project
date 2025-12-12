const { app } = require('@azure/functions');
const { sql, poolPromise } = require('./db');
const auth = require('../utils/auth');

app.http("insertEvent", {
  methods: ["POST", "OPTIONS"],
  authLevel: "anonymous",
  route: "insertEvent",
  handler: async (req, context) => {
    context.log("[insertEvent] Request received:", req.method);

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
      "Access-Control-Allow-Methods": "POST, OPTIONS",
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

    const { title, description, startTime, endTime } = body || {};

    if (!title || !startTime || !endTime) {
      return {
        status: 400,
        headers: corsHeaders,
        jsonBody: { error: "title, startTime, and endTime are required." }
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
      return { status: 401, headers: corsHeaders, body: "Unauthorized" };
    }

    const userId = user.userId;

    try {
      const pool = await poolPromise;

      // -------------------------------------------------------------------
      //  Fetch the calendar that belongs to this user
      // -------------------------------------------------------------------
      const calendarQuery = await pool
        .request()
        .input("UserID", sql.UniqueIdentifier, userId)
        .query(`
          SELECT CalendarID
          FROM Calendars
          WHERE UserID = @UserID
        `);

      if (calendarQuery.recordset.length === 0) {
        return {
          status: 404,
          headers: corsHeaders,
          jsonBody: { error: "User has no calendar." }
        };
      }

      if(title.length > 128 || description.length > 255 || CalendarID.length != 36)
      {
        return {
          status: 400, 
          headers: corsHeaders, 
          jsonBody: {error: "Invalid body" }
        };
      }

      const calendarId = calendarQuery.recordset[0].CalendarID;

      // -------------------------------------------------------------------
      //  Insert event into Events table
      // -------------------------------------------------------------------
      const eventInsert = await pool
        .request()
        .input("CalendarID", sql.UniqueIdentifier, calendarId)
        .input("Title", sql.NVarChar(128), title)
        .input("Description", sql.NVarChar(250), description || "")
        .input("StartDateTimeUTC", sql.DateTimeOffset, startTime)
        .input("EndDateTimeUTC", sql.DateTimeOffset, endTime)
        .query(`
          INSERT INTO Events (CalendarID, Title, Description, StartDateTimeUTC, EndDateTimeUTC)
          OUTPUT inserted.EventID
          VALUES (@CalendarID, @Title, @Description, @StartDateTimeUTC, @EndDateTimeUTC)
        `);

      const eventId = eventInsert.recordset[0].EventID;

      // -------------------------------------------------------------------
      // Insert into Attendees
      // -------------------------------------------------------------------
      await pool
        .request()
        .input("UserID", sql.UniqueIdentifier, userId)
        .input("EventID", sql.UniqueIdentifier, eventId)
        .input("IsOrganizer", sql.TinyInt, 1)
        .input("Status", sql.VarChar(10), "accepted")
        .query(`
          INSERT INTO Attendees (UserID, EventID, Status, IsOrganizer)
          VALUES (@UserID, @EventID, @Status, @IsOrganizer)
        `);

      // -------------------------------------------------------------------
      //  Return Backend Event object
      // -------------------------------------------------------------------
      return {
        status: 201,
        headers: corsHeaders,
        jsonBody: {
          event: {
            id: eventId,
            title,
            description: description || "",
            startTime,
            endTime,
            isUserOrganizer: 1
          }
        }
      };

    } catch (err) {
      context.log("InsertEvent ERROR:", err);
      return {
        status: 500,
        headers: corsHeaders,
        jsonBody: { error: "Database error inserting event." }
      };
    }
  }
});
