const { app } = require("@azure/functions");
const { poolPromise, sql } = require("./db");

app.http("financeGetEntries", {
  methods: ["GET", "OPTIONS"],
  authLevel: "anonymous",
  route: "finance/entries",
  handler: async (req) => {
    if (req.method === "OPTIONS") return { status: 204, headers: cors() };

    const userId = req.query.get("userId");
    const year = Number(req.query.get("year"));
    const month = Number(req.query.get("month"));

    if (!userId) return json(400, { error: "Missing userId" });
    if (!year || !month) return json(400, { error: "Missing year/month" });

    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));

    const pool = await poolPromise;
    const result = await pool.request()
      .input("userId", sql.NVarChar(128), userId)
      .input("start", sql.DateTime2, start)
      .input("end", sql.DateTime2, end)
      .query(`
        SELECT EntryID, UserID, EntryType, Category, Amount, EntryDate, Note, CreatedAt
        FROM dbo.FinancialEntries
        WHERE UserID = @userId AND EntryDate >= @start AND EntryDate < @end
        ORDER BY EntryDate DESC, CreatedAt DESC
      `);

    return json(200, result.recordset);
  }
});

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}
function json(status, body) {
  return { status, headers: { "Content-Type": "application/json", ...cors() }, body: JSON.stringify(body) };
}
