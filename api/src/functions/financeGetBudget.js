const { app } = require("@azure/functions");
const { poolPromise, sql } = require("./db");

app.http("financeGetBudget", {
  methods: ["GET", "OPTIONS"],
  authLevel: "anonymous",
  route: "finance/budget",
  handler: async (req) => {
    if (req.method === "OPTIONS") return { status: 204, headers: cors() };

    const userId = req.query.get("userId");
    const year = Number(req.query.get("year"));
    const month = Number(req.query.get("month"));

    if (!userId) return json(400, { error: "Missing userId" });
    if (!year || !month) return json(400, { error: "Missing year/month" });

    const pool = await poolPromise;
    const result = await pool.request()
      .input("userId", sql.NVarChar(128), userId)
      .input("year", sql.Int, year)
      .input("month", sql.Int, month)
      .query(`
        SELECT TOP 1 BudgetID, UserID, Year, Month, SpendingMoney, CreatedAt, UpdatedAt
        FROM dbo.MonthlyBudgets
        WHERE UserID = @userId AND Year = @year AND Month = @month
      `);

    return json(200, result.recordset[0] ?? null);
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
