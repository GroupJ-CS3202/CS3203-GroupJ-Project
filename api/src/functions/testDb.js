const { app } = require("@azure/functions");
const sql = require("mssql");

app.http("testDb", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const connectionString = process.env.SQL_CONNECTION_STRING;

    if (!connectionString) {
      context.log("SQL_CONNECTION_STRING not set");
      return {
        status: 500,
        jsonBody: { error: "SQL_CONNECTION_STRING not configured" }
      };
    }

    try {
      // IMPORTANT: pass the string directly, not { connectionString }
      const pool = await sql.connect(connectionString);

      // Test query – this always exists in SQL Server
      const result = await pool
        .request()
        .query("SELECT TOP 1 * FROM sys.tables");

      await sql.close();

      return {
        status: 200,
        jsonBody: {
        message: "DB connection OK",
        rows: result.recordset
        }
      };
    } catch (err) {
      context.log("DB error:", err);
      return {
        status: 500,
        jsonBody: {
          error: "Database error",
          details: err.message
        }
      };
    }
  }
});
