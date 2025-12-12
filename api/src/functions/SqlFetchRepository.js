const { app } = require('@azure/functions');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {sql, poolPromise} = require('./db');
const auth = require('../utils/auth');

app.http('getEventsForRange', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'getEventsForRange',
  handler: async (req, context) => {
    const body = await req.json();
    const { rangeStart,  rangeEnd} = body || {};

    const token = auth.extractBearerToken(req);

    if(!token) {
        return { status: 401, body: 'Unauthorized' };
    }

    let user;
    try{
        user = auth.getUserFromRequest(req);
    } catch (err) {
        return { status: 401, body: 'Unauthorized' };
    }
    
    if(!user) {
        return { status: 401, body: 'Unauthorized' }
    }
    

    const userId = user.userId;


    if(!userId) {
        return {
        status: 400,
        jsonBody: { error: 'Need user to access events' },
      };
    }
    if (!rangeStart || !rangeEnd) {
      return {
        status: 400,
        jsonBody: { error: 'A start date and end date are required for the range' },
      };
    }

    try {

      const pool = await poolPromise;

      const eventsQueryResult = await pool
        .request()
        .input('StartDateTime', sql.DateTimeOffset, rangeStart)
        .input('EndDateTime', sql.DateTimeOffset, rangeEnd)
        .input('UID', sql.UniqueIdentifier, userId)
        .query(`
          SELECT 
            e.EventID AS id,
            e.Title AS title, 
            e.StartDateTimeUTC AS startTime,
            e.EndDateTimeUTC AS endTime,
            e.Description AS description,
            atn.IsOrganizer AS isUserOrganizer
          FROM 
            Events AS e
          INNER JOIN Attendees AS atn on atn.EventID = e.EventID
          WHERE atn.UserID = @UID 
          AND e.StartDateTimeUTC >= @StartDateTime 
          AND e.StartDateTimeUTC < @EndDateTime
          AND e.EndDateTimeUTC > @StartDateTime
          AND e.EndDateTimeUTC <= @EndDateTime
        `);

      const events = eventsQueryResult.recordset;

      if (!events) {
        context.log(userId);
        context.log(user);
        context.log(rangeStart);
        context.log(rangeEnd);
        return {
        status: 404,
        jsonBody: { error: 'Events not found' },
      };
      }

      return {
        status: 201,
        jsonBody: {
          userEvents: events
        },
      };
    } catch (err) {
      context.log('Event fetching error:', err);

      return {
        status: 500,
        jsonBody: { error: 'Events fetching failed' },
      };
    }
  },
});