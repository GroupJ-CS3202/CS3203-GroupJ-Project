const { app } = require("@azure/functions");
const { poolPromise, sql } = require("./db");

app.http("financeUpsertBudget", {
  methods: ["PUT", "OPTIONS"],
  authLevel: "anonymous",

  // IMPORTANT:
  // Use a unique route to avoid conflict with financeGetBudget (GET)
  route: "finance/budget/upsert",

  handler: async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return { status: 204, headers: cors() };
    }

    // Parse JSON body
    const body = await req.json().catch(() => null);
    if (!body) {
      return json(400, { error: "Invalid JSON body" });
    }

    const { userId, year, month, spendingMoney } = body;

    // Basic validation
    if (!userId) {
      return json(400, { error: "Missing userId" });
    }
    if (!year || !month) {
      return json(400, { error: "Missing year or month" });
    }
    if (
      spendingMoney === undefined ||
      spendingMoney === null ||
      Number.isNaN(Number(spendingMoney))
    ) {
      return json(400, { error: "Invalid spendingMoney" });
    }

    // Upsert MonthlyBudgets
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("userId", sql.NVarChar(128), userId)
      .input("year", sql.Int, Number(year))
      .input("month", sql.Int, Number(month))
      .input("spendingMoney", sql.Decimal(18, 2), Number(spendingMoney))
      .query(`
        MERGE dbo.MonthlyBudgets AS t
        USING (
          SELECT
            @userId AS UserID,
            @year AS Year,
            @month AS Month
        ) AS s
        ON (t.UserID = s.UserID AND t.Year = s.Year AND t.Month = s.Month)
        WHEN MATCHED THEN
          UPDATE SET
            SpendingMoney = @spendingMoney,
            UpdatedAt = SYSUTCDATETIME()
        WHEN NOT MATCHED THEN
          INSERT (UserID, Year, Month, SpendingMoney, CreatedAt, UpdatedAt)
          VALUES (
            @userId,
            @year,
            @month,
            @spendingMoney,
            SYSUTCDATETIME(),
            SYSUTCDATETIME()
          )
        OUTPUT
          inserted.BudgetID,
          inserted.UserID,
          inserted.Year,
          inserted.Month,
          inserted.SpendingMoney,
          inserted.CreatedAt,
          inserted.UpdatedAt;
      `);

    return json(200, result.recordset[0]);
  },
});

// ---------- helpers ----------

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function json(status, body) {
  return {
    status,
    headers: {
      "Content-Type": "application/json",
      ...cors(),
    },
    body: JSON.stringify(body),
  };
}
